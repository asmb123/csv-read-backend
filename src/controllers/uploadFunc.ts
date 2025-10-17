import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import { pool } from "../db/db";

export async function uploadFunc(req: Request, res: Response) {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const validRows: any[] = [];
    const invalidRows: any[] = [];

    try {
        const rows = await new Promise<any[]>((resolve, reject) => {
            const results: any[] = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (data) => results.push(data))
                .on("end", () => resolve(results))
                .on("error", reject);
        });

        for (const row of rows) {
            const { sku, name, brand, color, size, mrp, price, quantity } = row;

            if (!sku || !name || !brand || !color || !size || !mrp || !price) {
                invalidRows.push({ row, reason: "Missing required fields" });
                continue;
            }

            const mrpNum = Number(mrp);
            const priceNum = Number(price);
            const quantityNum = Number(quantity ?? 0);

            if (isNaN(mrpNum) || isNaN(priceNum)) {
                invalidRows.push({ row, reason: "MRP or Price is not a valid number" });
                continue;
            }

            if (priceNum > mrpNum) {
                invalidRows.push({ row, reason: "Price cannot be greater than MRP" });
                continue;
            }

            if (quantityNum < 0) {
                invalidRows.push({ row, reason: "Quantity cannot be negative" });
                continue;
            }

            validRows.push({
                sku,
                name,
                brand,
                color,
                size,
                mrp: mrpNum,
                price: priceNum,
                quantity: quantityNum,
            });
        }

        if (invalidRows.length > 0) {
            return res.status(400).json({
                message: "CSV contains invalid rows",
                invalidRows,
            });
        }

        const client = await pool.connect();
        try {
            for (const row of validRows) {
                await client.query(
                    `INSERT INTO products (sku, name, brand, color, size, mrp, price, quantity)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (sku) DO NOTHING`,
                    [
                        row.sku,
                        row.name,
                        row.brand,
                        row.color,
                        row.size,
                        row.mrp,
                        row.price,
                        row.quantity,
                    ]
                );
            }
        } finally {
            client.release();
        }

        res.json({
            message: "CSV uploaded successfully",
            inserted: validRows.length,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        fs.unlink(filePath, () => { });
    }
}
