import { supabasePool } from "../db";
import { Response } from "express";
import { AuthedRequest } from "../middleware/authMw";

export async function getProfile(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user?.sub;

    const result = await supabasePool.query(
      `
      SELECT *
      FROM users
      WHERE id = $1
      `,
      [userId],
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function updateProfile(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user?.sub;

    const { name, permLevel } = req.body;

    const result = await supabasePool.query(
      `
      UPDATE users
      
      SET 
        name = $1,
        perm_level = $2,
        updated_at = NOW()

      WHERE id = $3

      RETURNING *
      `,
      [name, permLevel, userId],
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "There was an error updating your profile",
    });
  }
}
