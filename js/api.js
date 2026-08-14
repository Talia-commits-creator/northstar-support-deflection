/**
 * Northstar Retail - Data API Service Abstraction (Shoe E-Commerce MVP)
 * 
 * ARCHITECTURE NOTE FOR BACKEND INTEGRATION:
 * This file encapsulates all data fetching logic. Currently, it retrieves data
 * from the isolated temporary mockData.js module with simulated network delay.
 * 
 * To connect to the live backend API in the future:
 * Simply replace the internal Promise resolution inside trackOrder() and checkStock()
 * with standard fetch() calls (e.g. fetch(`/api/v1/shoes?brand=${brand}&size=${size}`)).
 * The frontend UI (app.js) depends strictly on the return structure defined here.
 */

import { MOCK_ORDERS, MOCK_SHOES_CATALOG } from './mockData.js';

// Simulated API Latency in milliseconds
const SIMULATED_LATENCY_MS = 250;

export const OrderAPI = {
  /**
   * Fetches order tracking information by Order Number.
   * 
   * @param {string} orderNumber - e.g. "ORD-1002"
   * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
   */
  async trackOrder(orderNumber) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanedQuery = (orderNumber || '').trim().toUpperCase();

        if (!cleanedQuery) {
          resolve({
            success: false,
            error: 'Please enter a valid order number (e.g., ORD-1002).'
          });
          return;
        }

        const foundOrder = MOCK_ORDERS[cleanedQuery];

        if (foundOrder) {
          resolve({
            success: true,
            data: foundOrder
          });
        } else {
          resolve({
            success: false,
            error: `No order found matching "${cleanedQuery}". Please check your order number or confirmation email.`
          });
        }
      }, SIMULATED_LATENCY_MS);
    });
  }
};

export const StockAPI = {
  /**
   * Searches shoe catalog by text query, brand filter, and shoe size filter.
   * 
   * @param {Object|string} filterOptions - { query?: string, brand?: string, size?: string } or string query
   * @returns {Promise<{ success: boolean, data?: Array, count?: number, error?: string }>}
   */
  async checkStock(filterOptions = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
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

        let matches = MOCK_SHOES_CATALOG.filter((shoe) => {
          // 1. Text Search Match (Name, Brand, SKU, Color)
          const matchQuery = !cleanedQuery || 
            shoe.name.toLowerCase().includes(cleanedQuery) ||
            shoe.brand.toLowerCase().includes(cleanedQuery) ||
            shoe.sku.toLowerCase().includes(cleanedQuery) ||
            shoe.color.toLowerCase().includes(cleanedQuery);

          // 2. Brand Filter Match
          const matchBrand = cleanedBrand === 'all' || shoe.brand.toLowerCase() === cleanedBrand;

          // 3. Size Availability Filter Match
          let matchSize = true;
          if (cleanedSize !== 'all') {
            const sizeObj = shoe.sizes.find(s => s.size.toLowerCase() === cleanedSize);
            // Must exist and have stock available > 0
            matchSize = sizeObj ? sizeObj.quantity > 0 : false;
          }

          return matchQuery && matchBrand && matchSize;
        });

        resolve({
          success: true,
          data: matches,
          count: matches.length,
          appliedFilters: { query: cleanedQuery, brand: brandFilter, size: sizeFilter }
        });
      }, SIMULATED_LATENCY_MS);
    });
  }
};
