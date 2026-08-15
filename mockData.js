/**
 * Northstar Retail - Temporary Mock Dataset for Shoe E-Commerce MVP
 *
 * NOTE: Real product images from the project folder are used here.
 * imagePlaceholder now holds the relative path to the actual image file.
 */

export const MOCK_ORDERS = {
  'ORD-1001': {
    orderNumber: 'ORD-1001',
    orderDate: 'August 06, 2026',
    status: 'Delivered',
    statusStep: 4,
    estimatedDelivery: 'August 10, 2026',
    actualDelivery: 'August 09, 2026 at 2:15 PM',
    carrier: 'FedEx Express',
    trackingNumber: 'FX-9847120394',
    shippingAddress: '742 Evergreen Terrace, Nairobi, Kenya',
    currency: 'KES',
    items: [
      {
        id: 'shoe-1',
        brand: 'adidas',
        name: 'adidas Samba Indoor',
        sku: 'AD-SAMBA',
        size: 'US 9',
        price: 9000,
        quantity: 1,
        imageIcon: '👟'
      },
      {
        id: 'shoe-3',
        brand: 'adidas',
        name: 'adidas Campus 00s',
        sku: 'AD-CAMP00S',
        size: 'US 9',
        price: 8500,
        quantity: 1,
        imageIcon: '👟'
      }
    ],
    totalAmount: 17500
  },

  'ORD-1002': {
    orderNumber: 'ORD-1002',
    orderDate: 'August 11, 2026',
    status: 'Shipped',
    statusStep: 3,
    estimatedDelivery: 'August 15, 2026',
    actualDelivery: null,
    carrier: 'Wells Fargo Courier',
    trackingNumber: 'WF-9948271039',
    shippingAddress: '123 Kimathi Street, Nairobi, Kenya',
    currency: 'KES',
    items: [
      {
        id: 'shoe-2',
        brand: 'New Balance',
        name: 'New Balance 327',
        sku: 'NB-327',
        size: 'US 10',
        price: 8000,
        quantity: 1,
        imageIcon: '👟'
      }
    ],
    totalAmount: 8000
  },

  'ORD-1003': {
    orderNumber: 'ORD-1003',
    orderDate: 'August 13, 2026',
    status: 'Processing',
    statusStep: 2,
    estimatedDelivery: 'August 18, 2026',
    actualDelivery: null,
    carrier: 'Fulfillment Center Assignment Pending',
    trackingNumber: 'Pending Dispatch',
    shippingAddress: '456 Oginga Odinga Road, Kisumu, Kenya',
    currency: 'KES',
    items: [
      {
        id: 'shoe-4',
        brand: 'Puma',
        name: 'Puma Smash V2 Low-Top',
        sku: 'PM-SMASHV2',
        size: 'US 11',
        price: 7500,
        quantity: 1,
        imageIcon: '👟'
      }
    ],
    totalAmount: 7500
  },

  'ORD-1004': {
    orderNumber: 'ORD-1004',
    orderDate: 'August 13, 2026 (15 mins ago)',
    status: 'Ordered',
    statusStep: 1,
    estimatedDelivery: 'August 20, 2026',
    actualDelivery: null,
    carrier: 'Standard Ground Delivery',
    trackingNumber: 'Generating...',
    shippingAddress: '890 Nyerere Avenue, Mombasa, Kenya',
    currency: 'KES',
    items: [
      {
        id: 'shoe-6',
        brand: 'Santoni',
        name: 'Casual Suede Santoni',
        sku: 'ST-CASUAL',
        size: 'US 8',
        price: 3500,
        quantity: 1,
        imageIcon: '👟'
      }
    ],
    totalAmount: 3500
  }
};

export const MOCK_SHOES_CATALOG = [
  {
    id: 'shoe-1',
    brand: 'adidas',
    name: 'adidas Samba Indoor',
    sku: 'AD-SAMBA',
    price: 9000,
    currency: 'KES',
    color: 'White / Black / Gum Brown',
    stockStatus: 'in_stock',
    totalStock: 24,
    originalStock: 24,
    sizes: [
      { size: 'US 7', quantity: 3 },
      { size: 'US 8', quantity: 6 },
      { size: 'US 9', quantity: 8 },
      { size: 'US 10', quantity: 5 },
      { size: 'US 11', quantity: 2 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: 'images/Adidas Unisex Adult Samba Indoor Shoe (1).jpg'
  },
  {
    id: 'shoe-2',
    brand: 'New Balance',
    name: 'New Balance 327',
    sku: 'NB-327',
    price: 8000,
    currency: 'KES',
    color: 'White / Navy Blue',
    stockStatus: 'in_stock',
    totalStock: 18,
    originalStock: 18,
    sizes: [
      { size: 'US 7', quantity: 2 },
      { size: 'US 8', quantity: 4 },
      { size: 'US 9', quantity: 5 },
      { size: 'US 10', quantity: 4 },
      { size: 'US 11', quantity: 3 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: 'images/New Balance 327 Shoes.jpg'
  },
  {
    id: 'shoe-3',
    brand: 'adidas',
    name: 'adidas Campus 00s',
    sku: 'AD-CAMP00S',
    price: 8500,
    currency: 'KES',
    color: 'Beige / White Stripes',
    stockStatus: 'low_stock',
    totalStock: 5,
    originalStock: 20,
    sizes: [
      { size: 'US 7', quantity: 0 },
      { size: 'US 8', quantity: 2 },
      { size: 'US 9', quantity: 2 },
      { size: 'US 10', quantity: 1 },
      { size: 'US 11', quantity: 0 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: 'images/adidas campus 00s.jpg'
  },
  {
    id: 'shoe-4',
    brand: 'Puma',
    name: 'Puma Smash V2 Low-Top',
    sku: 'PM-SMASHV2',
    price: 7500,
    currency: 'KES',
    color: 'Black / White',
    stockStatus: 'in_stock',
    totalStock: 15,
    originalStock: 15,
    sizes: [
      { size: 'US 7', quantity: 2 },
      { size: 'US 8', quantity: 4 },
      { size: 'US 9', quantity: 5 },
      { size: 'US 10', quantity: 3 },
      { size: 'US 11', quantity: 1 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: 'images/Puma Unisex Adults Smash V2 Low-Top Sneakers.jpg'
  },
  {
    id: 'shoe-5',
    brand: 'Nike',
    name: 'Air Jordan 4 Retro',
    sku: 'NK-AJ4',
    price: 15000,
    currency: 'KES',
    color: 'White / Cement Grey / Black',
    stockStatus: 'low_stock',
    totalStock: 4,
    originalStock: 20,
    sizes: [
      { size: 'US 7', quantity: 0 },
      { size: 'US 8', quantity: 1 },
      { size: 'US 9', quantity: 2 },
      { size: 'US 10', quantity: 1 },
      { size: 'US 11', quantity: 0 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: 'images/download (18).jpg'
  },
  {
    id: 'shoe-6',
    brand: 'Santoni',
    name: 'Casual Suede Santoni',
    sku: 'ST-CASUAL',
    price: 3500,
    currency: 'KES',
    color: 'Navy Blue / Orange Script',
    stockStatus: 'in_stock',
    totalStock: 12,
    originalStock: 12,
    sizes: [
      { size: 'US 40', quantity: 2 },
      { size: 'US 41', quantity: 3 },
      { size: 'US 42', quantity: 4 },
      { size: 'US 43', quantity: 2 },
      { size: 'US 44', quantity: 1 },
      { size: 'US 45', quantity: 0 }
    ],
    imagePlaceholder: 'images/_Casual Sued Santoni_🔥🔥🔥__Available Now_ ✅__Sizes Available____40 41 42 43 44 45____Quality_💯📌__@3500___DELIVERY ALSO AVAILABLE_👟📦🛵.jpg'
  },
  {
    id: 'shoe-7',
    brand: 'Puma',
    name: 'Puma Urban Leather Sneaker',
    sku: 'PM-URBAN',
    price: 6500,
    currency: 'KES',
    color: 'Navy Blue / Grey',
    stockStatus: 'in_stock',
    totalStock: 10,
    originalStock: 10,
    sizes: [
      { size: 'US 7', quantity: 1 },
      { size: 'US 8', quantity: 3 },
      { size: 'US 9', quantity: 4 },
      { size: 'US 10', quantity: 2 },
      { size: 'US 11', quantity: 0 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: 'images/download (19).jpg'
  },
  {
    id: 'shoe-8',
    brand: 'Puma',
    name: 'Puma Clyde Classic Grey',
    sku: 'PM-CLYDE',
    price: 5500,
    currency: 'KES',
    color: 'Light Grey / White Sole',
    stockStatus: 'in_stock',
    totalStock: 8,
    originalStock: 8,
    sizes: [
      { size: 'US 7', quantity: 1 },
      { size: 'US 8', quantity: 2 },
      { size: 'US 9', quantity: 3 },
      { size: 'US 10', quantity: 2 },
      { size: 'US 11', quantity: 0 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: 'images/download (20).jpg'
  }
];
