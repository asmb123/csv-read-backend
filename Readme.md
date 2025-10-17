# CSV Upload and Products API (Streamoid assignment)

## Express backend, allows uploading CSV files containing product data, validates the rows, stores valid entries in PostgreSQL, and provides a route to fetch all products and also filters.

## Features :

-   Upload CSV files with product information.
-   Validate CSV rows before inserting:

    -   price ≤ mrp.

    -   quantity ≥ 0.

    -   Required fields: sku, name, brand, mrp, price

-   Valid rows are stored in PostgreSQL.
-   Fetch all products with a simple GET route.
-   Search products with custom filters.

## Setup :

-   Setup the database table using the sql inside the <code>db</code> folder
-   Configure the db config in <code>db/db.ts</code> (if using custom postgres credentials)
-   Use docker(recommended)
    -   <code>docker compose up --build</code>
-   Or Locally (using node.js)
    -   <code>npm i</code> and then <code>npm run dev</code>
