/**
 * Northstar Retail - Temporary Mock Dataset for Shoe E-Commerce MVP
 * 
 * NOTE: This mock data is isolated and used solely for frontend UI/UX development.
 * It will be replaced by API calls in js/api.js when backend endpoints are ready.
 */

// Helper to generate clean, lightweight SVG placeholder images for shoe models
function createShoeSVGPlaceholder(brand, model, bgColor, accentColor) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
    <rect width="400" height="240" rx="12" fill="${bgColor}"/>
    <g transform="translate(60, 40)">
      <!-- Shoe Silhouette -->
      <path d="M40,110 C60,110 80,105 110,90 C140,75 180,40 210,40 C225,40 240,55 240,75 C240,95 230,110 200,115 C180,118 160,115 130,118 C100,121 70,130 50,130 C30,130 20,120 40,110 Z" fill="${accentColor}" opacity="0.9"/>
      <!-- Sole -->
      <path d="M35,130 L245,130 C255,130 260,140 250,145 C230,150 50,150 30,145 C20,140 25,130 35,130 Z" fill="#ffffff" opacity="0.95"/>
      <!-- Brand Accent Lines -->
      <path d="M120,85 Q150,95 180,70" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none"/>
    </g>
    <!-- Brand Tag Overlay -->
    <rect x="24" y="20" width="90" height="26" rx="6" fill="rgba(255,255,255,0.85)"/>
    <text x="69" y="37" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#0f172a" text-anchor="middle">${brand.toUpperCase()}</text>
    <text x="200" y="215" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#64748b" text-anchor="middle">${model}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const MOCK_ORDERS = {
  'ORD-1001': {
    orderNumber: 'ORD-1001',
    orderDate: 'August 06, 2026',
    status: 'Delivered',
    statusStep: 4, // 1: Ordered, 2: Processing, 3: Shipped, 4: Delivered
    estimatedDelivery: 'August 10, 2026',
    actualDelivery: 'August 09, 2026 at 2:15 PM',
    carrier: 'FedEx Express',
    trackingNumber: 'FX-9847120394',
    shippingAddress: '742 Evergreen Terrace, Nairobi, Kenya',
    currency: 'KES',
    items: [
      {
        id: 'shoe-1',
        brand: 'Nike',
        name: 'Nike Air Max 270',
        sku: 'NK-AM270',
        size: 'US 9',
        price: 8500,
        quantity: 1,
        imageIcon: '👟'
      },
      {
        id: 'shoe-3',
        brand: 'adidas',
        name: 'adidas Samba OG',
        sku: 'AD-SAMBA',
        size: 'US 9',
        price: 9000,
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
    statusStep: 3, // 1: Ordered, 2: Processing, 3: Shipped, 4: Delivered
    estimatedDelivery: 'August 15, 2026',
    actualDelivery: null,
    carrier: 'Wells Fargo Courier',
    trackingNumber: 'WF-9948271039',
    shippingAddress: '123 Kimathi Street, Nairobi, Kenya',
    currency: 'KES',
    items: [
      {
        id: 'shoe-9',
        brand: 'Converse',
        name: 'Converse Chuck Taylor All Star',
        sku: 'CV-CHUCK',
        size: 'US 10',
        price: 5500,
        quantity: 1,
        imageIcon: '👟'
      }
    ],
    totalAmount: 5500
  },

  'ORD-1003': {
    orderNumber: 'ORD-1003',
    orderDate: 'August 13, 2026',
    status: 'Processing',
    statusStep: 2, // 1: Ordered, 2: Processing, 3: Shipped, 4: Delivered
    estimatedDelivery: 'August 18, 2026',
    actualDelivery: null,
    carrier: 'Fulfillment Center Assignment Pending',
    trackingNumber: 'Pending Dispatch',
    shippingAddress: '456 Oginga Odinga Road, Kisumu, Kenya',
    currency: 'KES',
    items: [
      {
        id: 'shoe-11',
        brand: 'ASICS',
        name: 'ASICS GEL-Kayano',
        sku: 'AS-KAYANO',
        size: 'US 11',
        price: 10000,
        quantity: 1,
        imageIcon: '👟'
      }
    ],
    totalAmount: 10000
  },

  'ORD-1004': {
    orderNumber: 'ORD-1004',
    orderDate: 'August 13, 2026 (15 mins ago)',
    status: 'Ordered',
    statusStep: 1, // 1: Ordered, 2: Processing, 3: Shipped, 4: Delivered
    estimatedDelivery: 'August 20, 2026',
    actualDelivery: null,
    carrier: 'Standard Ground Delivery',
    trackingNumber: 'Generating...',
    shippingAddress: '890 Nyerere Avenue, Mombasa, Kenya',
    currency: 'KES',
    items: [
      {
        id: 'shoe-7',
        brand: 'Puma',
        name: 'Puma Suede Classic',
        sku: 'PM-SUEDE',
        size: 'US 8',
        price: 6500,
        quantity: 1,
        imageIcon: '👟'
      }
    ],
    totalAmount: 6500
  }
};

export const MOCK_SHOES_CATALOG = [
  // --- NIKE ---
  {
    id: 'shoe-1',
    brand: 'Nike',
    name: 'Nike Air Max 270',
    sku: 'NK-AM270',
    price: 8500,
    currency: 'KES',
    color: 'Black / White / Solar Red',
    stockStatus: 'in_stock', // in_stock, low_stock, out_of_stock
    totalStock: 24,
    sizes: [
      { size: 'US 7', quantity: 3 },
      { size: 'US 8', quantity: 6 },
      { size: 'US 9', quantity: 8 },
      { size: 'US 10', quantity: 5 },
      { size: 'US 11', quantity: 2 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: createShoeSVGPlaceholder('Nike', 'Air Max 270', '#f1f5f9', '#ef4444')
  },
  {
    id: 'shoe-2',
    brand: 'Nike',
    name: 'Nike Revolution 8',
    sku: 'NK-REV8',
    price: 6500,
    currency: 'KES',
    color: 'Wolf Grey / Electric Blue',
    stockStatus: 'in_stock',
    totalStock: 15,
    sizes: [
      { size: 'US 7', quantity: 0 },
      { size: 'US 8', quantity: 4 },
      { size: 'US 9', quantity: 5 },
      { size: 'US 10', quantity: 4 },
      { size: 'US 11', quantity: 2 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: createShoeSVGPlaceholder('Nike', 'Revolution 8', '#f8fafc', '#2563eb')
  },

  // --- ADIDAS ---
  {
    id: 'shoe-3',
    brand: 'adidas',
    name: 'adidas Samba OG',
    sku: 'AD-SAMBA',
    price: 9000,
    currency: 'KES',
    color: 'Cloud White / Core Black / Gum',
    stockStatus: 'low_stock',
    totalStock: 4,
    sizes: [
      { size: 'US 7', quantity: 0 },
      { size: 'US 8', quantity: 1 },
      { size: 'US 9', quantity: 2 },
      { size: 'US 10', quantity: 1 },
      { size: 'US 11', quantity: 0 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: createShoeSVGPlaceholder('adidas', 'Samba OG', '#f1f5f9', '#0f172a')
  },
  {
    id: 'shoe-4',
    brand: 'adidas',
    name: 'adidas Ultraboost',
    sku: 'AD-ULTRA',
    price: 10500,
    currency: 'KES',
    color: 'Core Black / Solar Yellow',
    stockStatus: 'in_stock',
    totalStock: 18,
    sizes: [
      { size: 'US 7', quantity: 2 },
      { size: 'US 8', quantity: 5 },
      { size: 'US 9', quantity: 6 },
      { size: 'US 10', quantity: 3 },
      { size: 'US 11', quantity: 2 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: createShoeSVGPlaceholder('adidas', 'Ultraboost', '#0f172a', '#eab308')
  },

  // --- NEW BALANCE ---
  {
    id: 'shoe-5',
    brand: 'New Balance',
    name: 'New Balance 574',
    sku: 'NB-574',
    price: 8000,
    currency: 'KES',
    color: 'Classic Grey / Navy Accent',
    stockStatus: 'in_stock',
    totalStock: 22,
    sizes: [
      { size: 'US 7', quantity: 4 },
      { size: 'US 8', quantity: 6 },
      { size: 'US 9', quantity: 7 },
      { size: 'US 10', quantity: 3 },
      { size: 'US 11', quantity: 2 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: createShoeSVGPlaceholder('New Balance', '574 Grey', '#e2e8f0', '#334155')
  },
  {
    id: 'shoe-6',
    brand: 'New Balance',
    name: 'New Balance Fresh Foam 1080',
    sku: 'NB-FF1080',
    price: 9500,
    currency: 'KES',
    color: 'Deep Ocean Blue / Lime',
    stockStatus: 'low_stock',
    totalStock: 3,
    sizes: [
      { size: 'US 7', quantity: 0 },
      { size: 'US 8', quantity: 0 },
      { size: 'US 9', quantity: 2 },
      { size: 'US 10', quantity: 1 },
      { size: 'US 11', quantity: 0 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: createShoeSVGPlaceholder('New Balance', 'Fresh Foam 1080', '#0284c7', '#84cc16')
  },

  // --- PUMA ---
  {
    id: 'shoe-7',
    brand: 'Puma',
    name: 'Puma Suede Classic',
    sku: 'PM-SUEDE',
    price: 6500,
    currency: 'KES',
    color: 'Puma Black / White Formstrip',
    stockStatus: 'in_stock',
    totalStock: 12,
    sizes: [
      { size: 'US 7', quantity: 2 },
      { size: 'US 8', quantity: 3 },
      { size: 'US 9', quantity: 4 },
      { size: 'US 10', quantity: 2 },
      { size: 'US 11', quantity: 1 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: createShoeSVGPlaceholder('Puma', 'Suede Classic', '#1e293b', '#ffffff')
  },
  {
    id: 'shoe-8',
    brand: 'Puma',
    name: 'Puma Velocity Nitro',
    sku: 'PM-VELOC',
    price: 8500,
    currency: 'KES',
    color: 'Nitro Orange / Fire Red',
    stockStatus: 'out_of_stock',
    totalStock: 0,
    sizes: [
      { size: 'US 7', quantity: 0 },
      { size: 'US 8', quantity: 0 },
      { size: 'US 9', quantity: 0 },
      { size: 'US 10', quantity: 0 },
      { size: 'US 11', quantity: 0 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: createShoeSVGPlaceholder('Puma', 'Velocity Nitro', '#fff7ed', '#f97316')
  },

  // --- CONVERSE ---
  {
    id: 'shoe-9',
    brand: 'Converse',
    name: 'Converse Chuck Taylor All Star',
    sku: 'CV-CHUCK',
    price: 5500,
    currency: 'KES',
    color: 'High Top Canvas Black / White',
    stockStatus: 'in_stock',
    totalStock: 30,
    sizes: [
      { size: 'US 7', quantity: 5 },
      { size: 'US 8', quantity: 8 },
      { size: 'US 9', quantity: 10 },
      { size: 'US 10', quantity: 5 },
      { size: 'US 11', quantity: 2 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: createShoeSVGPlaceholder('Converse', 'Chuck Taylor', '#0f172a', '#dc2626')
  },
  {
    id: 'shoe-10',
    brand: 'Converse',
    name: 'Converse Run Star Hike',
    sku: 'CV-RUNSTAR',
    price: 7500,
    currency: 'KES',
    color: 'Egret / White / Gum Tread',
    stockStatus: 'low_stock',
    totalStock: 2,
    sizes: [
      { size: 'US 7', quantity: 0 },
      { size: 'US 8', quantity: 0 },
      { size: 'US 9', quantity: 1 },
      { size: 'US 10', quantity: 1 },
      { size: 'US 11', quantity: 0 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: createShoeSVGPlaceholder('Converse', 'Run Star Hike', '#f8fafc', '#78350f')
  },

  // --- ASICS ---
  {
    id: 'shoe-11',
    brand: 'ASICS',
    name: 'ASICS GEL-Kayano',
    sku: 'AS-KAYANO',
    price: 10000,
    currency: 'KES',
    color: 'Piedmont Grey / Pure Silver',
    stockStatus: 'in_stock',
    totalStock: 16,
    sizes: [
      { size: 'US 7', quantity: 2 },
      { size: 'US 8', quantity: 4 },
      { size: 'US 9', quantity: 5 },
      { size: 'US 10', quantity: 3 },
      { size: 'US 11', quantity: 2 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: createShoeSVGPlaceholder('ASICS', 'GEL-Kayano', '#001b54', '#38bdf8')
  },
  {
    id: 'shoe-12',
    brand: 'ASICS',
    name: 'ASICS GEL-1130',
    sku: 'AS-GEL1130',
    price: 8500,
    currency: 'KES',
    color: 'White / Midnight Navy',
    stockStatus: 'in_stock',
    totalStock: 10,
    sizes: [
      { size: 'US 7', quantity: 1 },
      { size: 'US 8', quantity: 3 },
      { size: 'US 9', quantity: 3 },
      { size: 'US 10', quantity: 2 },
      { size: 'US 11', quantity: 1 },
      { size: 'US 12', quantity: 0 }
    ],
    imagePlaceholder: createShoeSVGPlaceholder('ASICS', 'GEL-1130', '#f1f5f9', '#1e3a8a')
  }
];
