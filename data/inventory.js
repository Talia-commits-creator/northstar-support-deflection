/**
 * Northstar Retail Co. - Stock Availability Inventory Data
 *
 * Source of truth: Synchronized with frontend MOCK_SHOES_CATALOG.
 */

const catalog = [
  {
    id: 'shoe-1',
    brand: 'adidas',
    name: 'adidas Samba Indoor',
    sku: 'AD-SAMBA',
    sizes: [
      { size: 'US 7', quantity: 3 },
      { size: 'US 8', quantity: 6 },
      { size: 'US 9', quantity: 8 },
      { size: 'US 10', quantity: 5 },
      { size: 'US 11', quantity: 2 },
      { size: 'US 12', quantity: 0 }
    ]
  },
  {
    id: 'shoe-2',
    brand: 'New Balance',
    name: 'New Balance 327',
    sku: 'NB-327',
    sizes: [
      { size: 'US 7', quantity: 2 },
      { size: 'US 8', quantity: 4 },
      { size: 'US 9', quantity: 5 },
      { size: 'US 10', quantity: 4 },
      { size: 'US 11', quantity: 3 },
      { size: 'US 12', quantity: 0 }
    ]
  },
  {
    id: 'shoe-3',
    brand: 'adidas',
    name: 'adidas Campus 00s',
    sku: 'AD-CAMP00S',
    sizes: [
      { size: 'US 7', quantity: 0 },
      { size: 'US 8', quantity: 2 },
      { size: 'US 9', quantity: 2 },
      { size: 'US 10', quantity: 1 },
      { size: 'US 11', quantity: 0 },
      { size: 'US 12', quantity: 0 }
    ]
  },
  {
    id: 'shoe-4',
    brand: 'Puma',
    name: 'Puma Smash V2 Low-Top',
    sku: 'PM-SMASHV2',
    sizes: [
      { size: 'US 7', quantity: 2 },
      { size: 'US 8', quantity: 4 },
      { size: 'US 9', quantity: 5 },
      { size: 'US 10', quantity: 3 },
      { size: 'US 11', quantity: 1 },
      { size: 'US 12', quantity: 0 }
    ]
  },
  {
    id: 'shoe-5',
    brand: 'Nike',
    name: 'Air Jordan 4 Retro',
    sku: 'NK-AJ4',
    sizes: [
      { size: 'US 7', quantity: 0 },
      { size: 'US 8', quantity: 1 },
      { size: 'US 9', quantity: 2 },
      { size: 'US 10', quantity: 1 },
      { size: 'US 11', quantity: 0 },
      { size: 'US 12', quantity: 0 }
    ]
  },
  {
    id: 'shoe-6',
    brand: 'Santoni',
    name: 'Casual Suede Santoni',
    sku: 'ST-CASUAL',
    sizes: [
      { size: 'US 40', quantity: 2 },
      { size: 'US 41', quantity: 3 },
      { size: 'US 42', quantity: 4 },
      { size: 'US 43', quantity: 2 },
      { size: 'US 44', quantity: 1 },
      { size: 'US 45', quantity: 0 }
    ]
  },
  {
    id: 'shoe-7',
    brand: 'Puma',
    name: 'Puma Urban Leather Sneaker',
    sku: 'PM-URBAN',
    sizes: [
      { size: 'US 7', quantity: 1 },
      { size: 'US 8', quantity: 3 },
      { size: 'US 9', quantity: 4 },
      { size: 'US 10', quantity: 2 },
      { size: 'US 11', quantity: 0 },
      { size: 'US 12', quantity: 0 }
    ]
  },
  {
    id: 'shoe-8',
    brand: 'Puma',
    name: 'Puma Clyde Classic Grey',
    sku: 'PM-CLYDE',
    sizes: [
      { size: 'US 7', quantity: 1 },
      { size: 'US 8', quantity: 2 },
      { size: 'US 9', quantity: 3 },
      { size: 'US 10', quantity: 2 },
      { size: 'US 11', quantity: 0 },
      { size: 'US 12', quantity: 0 }
    ]
  }
];

/**
 * Normalizes size string for robust matching.
 * e.g., "9" or "US 9" or "us 9" -> "US 9"
 */
function normalizeSize(inputSize) {
  const clean = inputSize.trim().toUpperCase();
  if (!clean.startsWith('US ')) {
    return `US ${clean}`;
  }
  return clean;
}

/**
 * Look up stock availability for a given product and size.
 * Matches product by name, ID, or SKU.
 *
 * @param {string} productName - Name, ID, or SKU of the product
 * @param {string} sizeName - Size string (e.g., 'US 9' or '9')
 * @returns {object} Stock result object or error object
 */
function checkStock(productName, sizeName) {
  if (!productName || !sizeName) {
    return { error: "Both 'product' and 'size' parameters are required.", statusCode: 400 };
  }

  const cleanProduct = productName.trim().toLowerCase();

  // Find product by name, id, or SKU
  const productData = catalog.find(item =>
    item.name.toLowerCase() === cleanProduct ||
    item.id.toLowerCase() === cleanProduct ||
    item.sku.toLowerCase() === cleanProduct
  );

  if (!productData) {
    return { error: `Product '${productName}' was not found in inventory.`, statusCode: 404 };
  }

  const requestedSize = normalizeSize(sizeName);

  // Find matching size entry
  const sizeEntry = productData.sizes.find(s =>
    s.size.toUpperCase() === requestedSize ||
    s.size.toUpperCase() === sizeName.trim().toUpperCase()
  );

  if (!sizeEntry) {
    return { error: `Size '${sizeName}' is invalid for product '${productData.name}'.`, statusCode: 400 };
  }

  const isAvailable = sizeEntry.quantity > 0;

  return {
    product: productData.name,
    size: sizeEntry.size,
    status: isAvailable ? "In stock" : "Out of stock",
    available: isAvailable,
    quantity: sizeEntry.quantity
  };
}

module.exports = {
  catalog,
  checkStock
};
