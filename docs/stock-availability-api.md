# Stock Availability API

## Purpose

This API allows the frontend application to check whether a specific product and size combination is currently in stock at Northstar Retail Co. It helps deflect customer support queries by providing instant stock status answers.

## Endpoint

* **HTTP Method**: `GET`
* **URL Path**: `/api/stock`
* **Query Parameters**:
  * `product` (string, required): The name of the product to check (e.g., `Northstar Classic Hoodie`).
  * `size` (string, required): The size of the product to check (e.g., `M`).

## Example Request

```text
GET http://localhost:3000/api/stock?product=Northstar%20Classic%20Hoodie&size=M
```

## Successful Response

When the item is in stock (`HTTP 200 OK`):

```json
{
  "product": "Northstar Classic Hoodie",
  "size": "M",
  "status": "In stock",
  "available": true
}
```

## Out-of-Stock Response

When the item exists but is out of stock (`HTTP 200 OK`):

```json
{
  "product": "Northstar Classic Hoodie",
  "size": "L",
  "status": "Out of stock",
  "available": false
}
```

## Error Cases

### 1. Missing Product or Size
* **HTTP Status**: `400 Bad Request`
* **Response**:
```json
{
  "error": "Both 'product' and 'size' parameters are required."
}
```

### 2. Invalid Product
* **HTTP Status**: `404 Not Found`
* **Response**:
```json
{
  "error": "Product 'Unknown Item' was not found in inventory."
}
```

### 3. Invalid Size for Product
* **HTTP Status**: `400 Bad Request`
* **Response**:
```json
{
  "error": "Size 'XXL' is invalid for product 'Northstar Classic Hoodie'."
}
```

## Frontend Integration Example

Here is a simple JavaScript `fetch()` example to call the API from a frontend application running locally:

```javascript
fetch('http://localhost:3000/api/stock?product=Northstar%20Classic%20Hoodie&size=M')
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error('Error:', data.error);
    } else {
      console.log('Product:', data.product);
      console.log('Size:', data.size);
      console.log('Status:', data.status); // "In stock"
      console.log('Available:', data.available); // true
    }
  })
  .catch(error => {
    console.error('Network Error:', error);
  });
```

## Important Notes

* **Mock Data**: This 1-week MVP uses mock inventory data stored in `data/inventory.js`. No real database or live Northstar system is connected.
* **CORS Enabled**: Cross-Origin Resource Sharing (CORS) is enabled on the server so frontend applications on any origin or port can call this API without browser restrictions.
