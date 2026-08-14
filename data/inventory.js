/**
 * Mock inventory dataset for Northstar Retail Co. Support Deflection MVP.
 */

const inventory = {
  "northstar classic hoodie": {
    name: "Northstar Classic Hoodie",
    sizes: {
      "S": true,
      "M": true,
      "L": false,
      "XL": false
    }
  },
  "trail runner shoes": {
    name: "Trail Runner Shoes",
    sizes: {
      "7": true,
      "8": false,
      "9": true,
      "10": true
    }
  },
  "everyday crewneck": {
    name: "Everyday Crewneck",
    sizes: {
      "S": false,
      "M": true,
      "L": true,
      "XL": false
    }
  }
};

/**
 * Look up stock availability for a given product and size.
 * @param {string} productName - Name of the product
 * @param {string} sizeName - Size of the product
 * @returns {object} Stock result object or error object
 */
function checkStock(productName, sizeName) {
  if (!productName || !sizeName) {
    return { error: "Both 'product' and 'size' parameters are required.", statusCode: 400 };
  }

  const cleanProduct = productName.trim().toLowerCase();
  const cleanSize = sizeName.trim().toUpperCase();

  const productData = inventory[cleanProduct];
  if (!productData) {
    return { error: `Product '${productName}' was not found in inventory.`, statusCode: 404 };
  }

  const isAvailable = productData.sizes[cleanSize];
  if (isAvailable === undefined) {
    return { error: `Size '${sizeName}' is invalid for product '${productData.name}'.`, statusCode: 400 };
  }

  return {
    product: productData.name,
    size: cleanSize,
    status: isAvailable ? "In stock" : "Out of stock",
    available: isAvailable
  };
}

module.exports = {
  inventory,
  checkStock
};
