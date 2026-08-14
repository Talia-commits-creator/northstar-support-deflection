# Stock Availability API

## Purpose

This API allows the frontend application to check whether a specific shoe model and size combination is currently in stock at Northstar Retail Co. It helps deflect customer support queries by providing instant stock status answers.

## Endpoint

* **HTTP Method**: `GET`
* **URL Path**: `/api/stock`
* **Query Parameters**:
  * `product` (string, required): The name, ID, or SKU of the product to check (e.g., `adidas Samba Indoor` or `AD-SAMBA` or `shoe-1`).
  * `size` (string, required): The size of the product to check (e.g., `US 9` or `9`).

## Example Request

```text
GET http://localhost:3000/api/stock?product=adidas%20Samba%20Indoor&size=US%209
```

## Successful Response

When the item is in stock (`HTTP 200 OK`):

```json
{
  "product": "adidas Samba Indoor",
  "size": "US 9",
  "status": "In stock",
  "available": true
}
```

## Out-of-Stock Response

When the item exists in the catalog but has 0 quantity (`HTTP 200 OK`):

```json
{
  "product": "adidas Samba Indoor",
  "size": "US 12",
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
  "error": "Size 'US 15' is invalid for product 'adidas Samba Indoor'."
}
```

## Frontend Integration Example

Here is a simple JavaScript `fetch()` example to call the API from a frontend application running locally:

```javascript
fetch('http://localhost:3000/api/stock?product=adidas%20Samba%20Indoor&size=US%209')
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

* **Mock Data**: Synchronized with the frontend `MOCK_SHOES_CATALOG` (`adidas Samba Indoor`, `New Balance 327`, `adidas Campus 00s`, `Puma Smash V2 Low-Top`, `Air Jordan 4 Retro`, `Casual Suede Santoni`, `Puma Urban Leather Sneaker`, `Puma Clyde Classic Grey`).
* **CORS Enabled**: Cross-Origin Resource Sharing (CORS) is enabled on the server so frontend applications on any origin or port can call this API without browser restrictions.
