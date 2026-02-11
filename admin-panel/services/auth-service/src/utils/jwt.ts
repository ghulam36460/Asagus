import jwt from "jsonwebtoken";
import crypto from "crypto";

// SECURITY: Do not use fallback secrets in production.
// If JWT secrets are missing, generate random ones (services will restart with different secrets, invalidating tokens).
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || (() => {
  console.warn("⚠️  WARNING: JWT_ACCESS_SECRET not set! Using random secret. Tokens will not persist across restarts.");
  return crypto.randomBytes(64).toString("hex");
})();
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (() => {
  console.warn("⚠️  WARNING: JWT_REFRESH_SECRET not set! Using random secret. Tokens will not persist across restarts.");
  return crypto.randomBytes(64).toString("hex");
})();
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
}

export function generateRefreshToken(payload: { sub: string }): string {
  return jwt.sign({ ...payload, type: "refresh" }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRY,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): { sub: string; type: string } {
  return jwt.verify(token, REFRESH_SECRET) as { sub: string; type: string };
}
