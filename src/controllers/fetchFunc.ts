import { Request, Response } from "express";
import { pool } from "../db/db";

export async function fetchFunc(req: Request, res: Response) {
    try {
        const client = await pool.connect();
        try {
            const result = await client.query("SELECT * FROM products ORDER BY sku ASC");
            res.json({ products: result.rows });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
