/**
 * Northstar Retail - Data API Service Abstraction (Shoe E-Commerce MVP)
 * 
 * ARCHITECTURE NOTE FOR BACKEND INTEGRATION:
 * This file encapsulates all data fetching logic. Order tracking now connects to the FastAPI.backend.
 * Stock checking still uses temporary mock data until backend integration.
 * 
 * Backend integration is being completed incrementally.
 * Order tracking uses the FastAPI backend.
 * Stock checking currently uses mock data.
 * The frontend UI (app.js) depends strictly on the return structure defined here.
 */

// Inventory data is now fetched from the FastAPI backend.

// Simulated API Latency in milliseconds
const SIMULATED_LATENCY_MS = 250;

export const OrderAPI = {
  localOrders: [],

  registerOrder(order) {
    const existingIndex = this.localOrders.findIndex(item => item.orderNumber === order.orderNumber);
    if (existingIndex >= 0) {
      this.localOrders[existingIndex] = order;
    } else {
      this.localOrders.push(order);
    }
    return order;
  },

  /**
   * Fetches order tracking information by Order Number.
   * 
   * @param {string} orderNumber - e.g. "ORD-1002"
   * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
   */
  async trackOrder(orderNumber) {
    const cleanedQuery = (orderNumber || '').trim().toUpperCase();

    if (!cleanedQuery) {
      return {
        success: false,
        error: 'Please enter a valid order number (e.g., ORD-1002).'
      };
    }

    const localMatch = this.localOrders.find(order => order.orderNumber === cleanedQuery);
    if (localMatch) {
      return {
        success: true,
        data: localMatch
      };
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/orders/${encodeURIComponent(cleanedQuery)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: `No order found matching "${cleanedQuery}". Please check your order number or confirmation email.`
          };
        }

        throw new Error(`Backend returned ${response.status}`);
      }

      const order = await response.json();
      return {
        success: true,
        data: order
      };
    } catch (error) {
      console.error('Order tracking error:', error);

      return {
        success: false,
        error: 'Unable to connect to the order tracking service. Please try again.'
      };
    }
  },
};

export const StockAPI = {
  /**
   * Searches shoe catalog by text query, brand filter, and shoe size filter.
   * 
   * @param {Object|string} filterOptions - { query?: string, brand?: string, size?: string } or string query
   * @returns {Promise<{ success: boolean, data?: Array, count?: number, error?: string }>}
   */
  async checkStock(filterOptions = {}) {
    let query = '';
    let brandFilter = 'all';
    let sizeFilter = 'all';

    if (typeof filterOptions === 'string') {
      query = filterOptions;
    } else if (typeof filterOptions === 'object') {
      query = filterOptions.query || '';
      brandFilter = filterOptions.brand || 'all';
      sizeFilter = filterOptions.size || 'all';
    }

    const cleanedQuery = query.trim().toLowerCase();
    const cleanedBrand = brandFilter.trim().toLowerCase();
    const cleanedSize = sizeFilter.trim().toLowerCase();

    try {
      const response = await fetch('http://127.0.0.1:8000/inventory');

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const inventory = await response.json();
      const matches = inventory.filter((shoe) => {
        const matchQuery = !cleanedQuery ||
          shoe.name.toLowerCase().includes(cleanedQuery) ||
          shoe.brand.toLowerCase().includes(cleanedQuery) ||
          shoe.sku.toLowerCase().includes(cleanedQuery) ||
          shoe.color.toLowerCase().includes(cleanedQuery);

        const matchBrand = cleanedBrand === 'all' || shoe.brand.toLowerCase() === cleanedBrand;

        let matchSize = true;
        if (cleanedSize !== 'all') {
          const sizeObj = shoe.sizes.find(s => s.size.toLowerCase() === cleanedSize);
          matchSize = sizeObj ? sizeObj.quantity > 0 : false;
        }

        return matchQuery && matchBrand && matchSize;
      });

      return {
        success: true,
        data: matches,
        count: matches.length,
        allData: inventory,
        appliedFilters: { query: cleanedQuery, brand: cleanedBrand, size: cleanedSize }
      };
    } catch (error) {
      console.error('Inventory fetch error:', error);

      return {
        success: false,
        error: 'Unable to connect to the inventory service. Please try again.'
      };
    }
  }
};
