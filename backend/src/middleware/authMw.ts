import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";
import { supabasePool } from "../db";

const JWKS_URL = `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export interface AuthedRequest extends Request {
  user?: JWTPayload;
}

export const requireAuth = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  // check if it exists and if it starts with "Bearer"
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Missing bearer token in Authorization header",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    // not havign this check would mean that token could possible be null and screw up the verification
    return res.status(401).json({
      error: "Invalid Authorization header format. Expected 'Bearer <token>'",
    });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${process.env.SUPABASE_URL}/auth/v1`,
      audience: "authenticated",
    });

    const { rows } = await supabasePool.query(
      `select perm_level from public.users where id = $1`,
      [payload.sub],
    );
    req.user = { ...payload, appRole: rows[0]?.perm_level };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
