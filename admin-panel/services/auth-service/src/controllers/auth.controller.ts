import { Request, Response } from "express";
import { prisma } from "@asagus/database";
import { loginSchema, registerSchema, changePasswordSchema } from "@asagus/shared";
import { hashPassword, comparePassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { AuthRequest } from "../middleware/auth";
import crypto from "crypto";

export class AuthController {
  // ============================================
  // LOGIN
  // ============================================
  async login(req: Request, res: Response): Promise<void> {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      const { email, password } = parsed.data;

      // Find user with roles and permissions
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!user || !user.isActive) {
        // Log failed attempt
        await prisma.auditLog.create({
          data: {
            action: "login_failed",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            success: false,
            failureReason: user ? "Account inactive" : "User not found",
            metadata: { email },
          },
        });

        res.status(401).json({ success: false, error: "Invalid credentials" });
        return;
      }

      const isValidPassword = await comparePassword(password, user.passwordHash);
      if (!isValidPassword) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "login_failed",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            success: false,
            failureReason: "Invalid password",
          },
        });

        res.status(401).json({ success: false, error: "Invalid credentials" });
        return;
      }

      // Extract roles and permissions
      const roles = user.userRoles.map((ur) => ur.role.name);
      const permissions = [
        ...new Set(
          user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map(
              (rp) => `${rp.permission.resource}:${rp.permission.action}`
            )
          )
        ),
      ];

      // Generate tokens
      const accessToken = generateAccessToken({
        sub: user.id,
        email: user.email,
        roles,
        permissions,
      });

      const refreshTokenValue = generateRefreshToken({ sub: user.id });

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshTokenValue,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "login",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
          success: true,
        },
      });

      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken: refreshTokenValue,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            roles,
            permissions,
          },
        },
      });
    } catch (error) {
      console.error("[Auth] Login error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ============================================
  // REGISTER
  // ============================================
  async register(req: Request, res: Response): Promise<void> {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      const { email, password, name } = parsed.data;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(409).json({ success: false, error: "Email already registered" });
        return;
      }

      const passwordHash = await hashPassword(password);

      // Create user with viewer role by default
      const viewerRole = await prisma.role.findUnique({ where: { name: "viewer" } });

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          userRoles: viewerRole
            ? { create: { roleId: viewerRole.id } }
            : undefined,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "register",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
          success: true,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          message: "Registration successful",
          user: { id: user.id, email: user.email, name: user.name },
        },
      });
    } catch (error) {
      console.error("[Auth] Register error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ============================================
  // REFRESH TOKEN
  // ============================================
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ success: false, error: "Refresh token required" });
        return;
      }

      // Verify token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if token exists in DB
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        res.status(401).json({ success: false, error: "Invalid refresh token" });
        return;
      }

      // Get user with roles/permissions
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: { include: { permission: true } },
                },
              },
            },
          },
        },
      });

      if (!user || !user.isActive) {
        res.status(401).json({ success: false, error: "User not found or inactive" });
        return;
      }

      const roles = user.userRoles.map((ur) => ur.role.name);
      const permissions = [
        ...new Set(
          user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map(
              (rp) => `${rp.permission.resource}:${rp.permission.action}`
            )
          )
        ),
      ];

      // Delete old token & create new one
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });

      const newAccessToken = generateAccessToken({
        sub: user.id,
        email: user.email,
        roles,
        permissions,
      });

      const newRefreshToken = generateRefreshToken({ sub: user.id });

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });

      res.json({
        success: true,
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      });
    } catch {
      res.status(401).json({ success: false, error: "Invalid refresh token" });
    }
  }

  // ============================================
  // LOGOUT
  // ============================================
  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Delete all refresh tokens for the user
      await prisma.refreshToken.deleteMany({ where: { userId: req.user!.id } });

      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: "logout",
          ipAddress: req.ip,
          success: true,
        },
      });

      res.json({ success: true, data: { message: "Logged out successfully" } });
    } catch (error) {
      console.error("[Auth] Logout error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ============================================
  // GET ME
  // ============================================
  async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          emailVerified: true,
          lastLogin: true,
          createdAt: true,
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: { include: { permission: true } },
                },
              },
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }

      const roles = user.userRoles.map((ur) => ur.role.name);
      const permissions = [
        ...new Set(
          user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map(
              (rp) => `${rp.permission.resource}:${rp.permission.action}`
            )
          )
        ),
      ];

      res.json({
        success: true,
        data: { ...user, roles, permissions, userRoles: undefined },
      });
    } catch (error) {
      console.error("[Auth] GetMe error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ============================================
  // UPDATE PROFILE
  // ============================================
  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, avatarUrl } = req.body;
      const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: { name, avatarUrl },
        select: { id: true, email: true, name: true, avatarUrl: true },
      });

      res.json({ success: true, data: user });
    } catch (error) {
      console.error("[Auth] UpdateProfile error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ============================================
  // CHANGE PASSWORD
  // ============================================
  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      const { currentPassword, newPassword } = parsed.data;
      const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

      if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }

      const isValid = await comparePassword(currentPassword, user.passwordHash);
      if (!isValid) {
        res.status(400).json({ success: false, error: "Current password is incorrect" });
        return;
      }

      const passwordHash = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "password_change",
          ipAddress: req.ip,
          success: true,
        },
      });

      res.json({ success: true, data: { message: "Password changed successfully" } });
    } catch (error) {
      console.error("[Auth] ChangePassword error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ============================================
  // FORGOT PASSWORD
  // ============================================
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ success: false, error: "Email is required" });
        return;
      }

      // Always return success (don't reveal if email exists)
      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        const resetToken = crypto.randomBytes(32).toString("hex");
        // In production, store the token and send email
        console.log(`[Auth] Password reset token for ${email}: ${resetToken}`);

        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "forgot_password",
            ipAddress: req.ip,
            success: true,
          },
        });
      }

      res.json({
        success: true,
        data: { message: "If the email exists, a reset link has been sent" },
      });
    } catch (error) {
      console.error("[Auth] ForgotPassword error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ============================================
  // ADMIN: LIST USERS
  // ============================================
  async listUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {};

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            isActive: true,
            emailVerified: true,
            lastLogin: true,
            createdAt: true,
            userRoles: { include: { role: true } },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        success: true,
        data: users.map((u) => ({
          ...u,
          roles: u.userRoles.map((ur) => ur.role.name),
          userRoles: undefined,
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("[Auth] ListUsers error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ============================================
  // ADMIN: GET USER
  // ============================================
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          isActive: true,
          emailVerified: true,
          lastLogin: true,
          createdAt: true,
          userRoles: { include: { role: true } },
        },
      });

      if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }

      res.json({
        success: true,
        data: {
          ...user,
          roles: user.userRoles.map((ur) => ur.role.name),
          userRoles: undefined,
        },
      });
    } catch (error) {
      console.error("[Auth] GetUser error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ============================================
  // ADMIN: UPDATE USER
  // ============================================
  async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, isActive, emailVerified } = req.body;
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { name, isActive, emailVerified },
        select: { id: true, email: true, name: true, isActive: true },
      });

      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: "user_updated",
          resource: "user",
          resourceId: req.params.id,
          success: true,
          metadata: req.body,
        },
      });

      res.json({ success: true, data: user });
    } catch (error) {
      console.error("[Auth] UpdateUser error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ============================================
  // ADMIN: DELETE USER
  // ============================================
  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Prevent self-deletion
      if (req.params.id === req.user!.id) {
        res.status(400).json({ success: false, error: "Cannot delete yourself" });
        return;
      }

      await prisma.user.delete({ where: { id: req.params.id } });

      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: "user_deleted",
          resource: "user",
          resourceId: req.params.id,
          success: true,
        },
      });

      res.json({ success: true, data: { message: "User deleted" } });
    } catch (error) {
      console.error("[Auth] DeleteUser error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ============================================
  // ADMIN: ASSIGN ROLE
  // ============================================
  async assignRole(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { roleId } = req.body;
      await prisma.userRole.create({
        data: {
          userId: req.params.id,
          roleId: parseInt(roleId),
          assignedBy: req.user!.id,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: "role_assigned",
          resource: "user",
          resourceId: req.params.id,
          success: true,
          metadata: { roleId },
        },
      });

      res.json({ success: true, data: { message: "Role assigned" } });
    } catch (error) {
      console.error("[Auth] AssignRole error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ============================================
  // ADMIN: REMOVE ROLE
  // ============================================
  async removeRole(req: AuthRequest, res: Response): Promise<void> {
    try {
      await prisma.userRole.delete({
        where: {
          userId_roleId: {
            userId: req.params.id,
            roleId: parseInt(req.params.roleId),
          },
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: "role_removed",
          resource: "user",
          resourceId: req.params.id,
          success: true,
          metadata: { roleId: req.params.roleId },
        },
      });

      res.json({ success: true, data: { message: "Role removed" } });
    } catch (error) {
      console.error("[Auth] RemoveRole error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
}
