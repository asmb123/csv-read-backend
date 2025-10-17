# CSV Upload and Products API (Streamoid assignment)

## Express backend, allows uploading CSV files containing product data, validates the rows, stores valid entries in PostgreSQL, and provides a route to fetch all products and also filters.

## API Endpoints :

-   <code>/upload(POST)</code>

    -   Uploads a CSV file and inserts valid product entries into the database.
    -   Request : Content-Type: multipart/form-data and Field name: csvFile
    -   Response example:

    ```json
    {
    	"message": "CSV uploaded successfully",
    	"inserted": 2
    }
    ```

-   <code>/products(GET)</code>

    -   Fetches all products sorted by SKU (ascending).
    -   Response example :

    ```json
    {
    	"products": [
    		{
    			"sku": "101",
    			"name": "Classic Tee",
    			"brand": "StreamThreads",
    			"color": "Red",
    			"size": "M",
    			"mrp": 999,
    			"price": 799,
    			"quantity": 10
    		}
    	]
    }
    ```

-   <code>/products/search(GET)</code>

    -   Search and filter products by brand, color, or price range.
    -   Query parameters :

    | Filter     | Example                                | Description     |
    | ---------- | -------------------------------------- | --------------- |
    | `brand`    | `/products/search?brand=StreamThreads` | Filter by brand |
    | `color`    | `/products/search?color=Red`           | Filter by color |
    | `minPrice` | `/products/search?minPrice=500`        | Minimum price   |
    | `maxPrice` | `/products/search?maxPrice=2000`       | Maximum price   |

    -   Response example (/products/search?color=Blue):

    ```json
    {
    	"products": [
    		{
    			"sku": "102",
    			"name": "Summer Hoodie",
    			"brand": "UrbanEdge",
    			"color": "Blue",
    			"size": "L",
    			"mrp": 1499,
    			"price": 1199,
    			"quantity": 15
    		}
    	]
    }
    ```

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
