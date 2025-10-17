import { Request, Response } from "express";
import { pool } from "../db/db";

export async function searchProducts(req: Request, res: Response) {
    try {
        const { brand, color, minPrice, maxPrice } = req.query;

        let query = "SELECT * FROM products WHERE 1=1";
        const params: any[] = [];
        let paramIndex = 1;

        if (brand) {
            query += ` AND brand = $${paramIndex++}`;
            params.push(brand);
        }

        if (color) {
            query += ` AND color = $${paramIndex++}`;
            params.push(color);
        }

        if (minPrice) {
            query += ` AND price >= $${paramIndex++}`;
            params.push(Number(minPrice));
        }

        if (maxPrice) {
            query += ` AND price <= $${paramIndex++}`;
            params.push(Number(maxPrice));
        }

        query += " ORDER BY sku ASC";

        const client = await pool.connect();
        try {
            const result = await client.query(query, params);
            res.json({ products: result.rows });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
