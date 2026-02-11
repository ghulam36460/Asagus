import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();
const controller = new AuthController();

// Public routes
router.post("/login", controller.login.bind(controller));
router.post("/register", controller.register.bind(controller));
router.post("/refresh-token", controller.refreshToken.bind(controller));
router.post("/forgot-password", controller.forgotPassword.bind(controller));

// Authenticated routes
router.get("/me", authenticate, controller.getMe.bind(controller));
router.put("/profile", authenticate, controller.updateProfile.bind(controller));
router.put("/password", authenticate, controller.changePassword.bind(controller));
router.post("/logout", authenticate, controller.logout.bind(controller));

// Admin routes - User management
router.get("/users", authenticate, authorize("users:read"), controller.listUsers.bind(controller));
router.get("/users/:id", authenticate, authorize("users:read"), controller.getUser.bind(controller));
router.put("/users/:id", authenticate, authorize("users:update"), controller.updateUser.bind(controller));
router.delete("/users/:id", authenticate, authorize("users:delete"), controller.deleteUser.bind(controller));
router.post("/users/:id/roles", authenticate, authorize("users:assign_roles"), controller.assignRole.bind(controller));
router.delete("/users/:id/roles/:roleId", authenticate, authorize("users:assign_roles"), controller.removeRole.bind(controller));

export { router as authRouter };
