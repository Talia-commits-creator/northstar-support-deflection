/**
 * Northstar Retail - Shoe Support Deflection MVP
 * Main Controller & UI Renderer Module
 */

import { OrderAPI, StockAPI } from './api.js';

// DOM Element Selectors
const DOM = {
  // Tabs
  tabBtnOrder: document.getElementById('tab-btn-order'),
  tabBtnStock: document.getElementById('tab-btn-stock'),
  orderPanel: document.getElementById('order-panel'),
  stockPanel: document.getElementById('stock-panel'),

  // Order Tracking
  orderForm: document.getElementById('order-form'),
  orderInput: document.getElementById('order-input'),
  orderFeedback: document.getElementById('order-feedback'),
  orderResult: document.getElementById('order-result'),
  demoChips: document.querySelectorAll('.demo-chip'),

  // Shoe Stock Availability
  stockForm: document.getElementById('stock-form'),
  stockInput: document.getElementById('stock-input'),
  stockFeedback: document.getElementById('stock-feedback'),
  stockResult: document.getElementById('stock-result'),
  brandChips: document.querySelectorAll('.brand-chip'),
  sizeChips: document.querySelectorAll('.size-chip')
};

// Application State
const state = {
  activeTab: 'order',
  selectedBrand: 'all',
  selectedSize: 'all',
  searchQuery: ''
};

/* ==========================================================================
   1. Initialization & Event Binding
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initOrderTracking();
  initShoeStock();

  // Load initial shoe catalog
  fetchShoeStock();
});

/* ==========================================================================
   2. Tab Switcher Logic
   ========================================================================== */
function initTabs() {
  DOM.tabBtnOrder.addEventListener('click', () => switchTab('order'));
  DOM.tabBtnStock.addEventListener('click', () => switchTab('stock'));
}

function switchTab(tabName) {
  state.activeTab = tabName;

  if (tabName === 'order') {
    DOM.tabBtnOrder.classList.add('active');
    DOM.tabBtnOrder.setAttribute('aria-selected', 'true');
    DOM.tabBtnStock.classList.remove('active');
    DOM.tabBtnStock.setAttribute('aria-selected', 'false');

    DOM.orderPanel.classList.add('active');
    DOM.orderPanel.removeAttribute('hidden');
    DOM.stockPanel.classList.remove('active');
    DOM.stockPanel.setAttribute('hidden', '');

    DOM.orderInput.focus();
  } else {
    DOM.tabBtnStock.classList.add('active');
    DOM.tabBtnStock.setAttribute('aria-selected', 'true');
    DOM.tabBtnOrder.classList.remove('active');
    DOM.tabBtnOrder.setAttribute('aria-selected', 'false');

    DOM.stockPanel.classList.add('active');
    DOM.stockPanel.removeAttribute('hidden');
    DOM.orderPanel.classList.remove('active');
    DOM.orderPanel.setAttribute('hidden', '');

    DOM.stockInput.focus();
  }
}

/* ==========================================================================
   3. Order Tracking Feature Handler
   ========================================================================== */
function initOrderTracking() {
  DOM.orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const orderNum = DOM.orderInput.value;
    fetchOrder(orderNum);
  });

  DOM.demoChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const orderNum = chip.dataset.order;
      DOM.orderInput.value = orderNum;
      fetchOrder(orderNum);
    });
  });
}

async function fetchOrder(orderNum) {
  DOM.orderFeedback.innerHTML = renderLoading('Searching for shoe order details...');
  DOM.orderResult.innerHTML = '';

  const response = await OrderAPI.trackOrder(orderNum);

  DOM.orderFeedback.innerHTML = ''; // Clear loading

  if (!response.success) {
    DOM.orderFeedback.innerHTML = renderErrorAlert(response.error);
    return;
  }

  renderOrderCard(response.data);
}

function renderOrderCard(order) {
  const statusBadgeClass = getOrderStatusBadgeClass(order.statusStep);
  const progressPercentage = Math.round(((order.statusStep - 1) / 3) * 100);

  const html = `
    <article class="result-card">
      <div class="result-card-header">
        <div class="order-meta">
          <h3>Order ${escapeHTML(order.orderNumber)}</h3>
          <p>Placed on ${escapeHTML(order.orderDate)}</p>
        </div>
        <div>
          <span class="badge ${statusBadgeClass}">
            <span class="badge-dot"></span>
            ${escapeHTML(order.status)}
          </span>
        </div>
      </div>

      <!-- Visual Order Progress Timeline -->
      <div class="timeline-section">
        <div class="timeline-title">Visual Order Progress</div>
        <div class="timeline-track">
          <div class="timeline-progress-fill" style="width: ${progressPercentage}%;"></div>
          
          <div class="timeline-step ${order.statusStep >= 1 ? (order.statusStep === 1 ? 'active' : 'completed') : ''}">
            <div class="step-node">${order.statusStep > 1 ? '✓' : '1'}</div>
            <div class="step-label">Ordered</div>
          </div>
          
          <div class="timeline-step ${order.statusStep >= 2 ? (order.statusStep === 2 ? 'active' : 'completed') : ''}">
            <div class="step-node">${order.statusStep > 2 ? '✓' : '2'}</div>
            <div class="step-label">Processing</div>
          </div>
          
          <div class="timeline-step ${order.statusStep >= 3 ? (order.statusStep === 3 ? 'active' : 'completed') : ''}">
            <div class="step-node">${order.statusStep > 3 ? '✓' : '3'}</div>
            <div class="step-label">Shipped</div>
          </div>
          
          <div class="timeline-step ${order.statusStep >= 4 ? 'completed' : ''}">
            <div class="step-node">${order.statusStep >= 4 ? '✓' : '4'}</div>
            <div class="step-label">Delivered</div>
          </div>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="order-details-grid">
        <div class="info-block">
          <h4>Shipping Summary</h4>
          <div class="info-row">
            <span class="info-label">Estimated Delivery:</span>
            <span class="info-value">${escapeHTML(order.estimatedDelivery)}</span>
          </div>
          ${order.actualDelivery ? `
            <div class="info-row">
              <span class="info-label">Delivered On:</span>
              <span class="info-value">${escapeHTML(order.actualDelivery)}</span>
            </div>
          ` : ''}
          <div class="info-row">
            <span class="info-label">Carrier:</span>
            <span class="info-value">${escapeHTML(order.carrier)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tracking Number:</span>
            <span class="info-value">${escapeHTML(order.trackingNumber)}</span>
          </div>
          <div class="info-row" style="margin-top: 0.5rem; display: block;">
            <span class="info-label">Destination:</span>
            <div class="info-value" style="margin-top: 2px;">${escapeHTML(order.shippingAddress)}</div>
          </div>
        </div>

        <div class="info-block">
          <h4>Items In This Order (${order.items.length})</h4>
          <div class="item-list">
            ${order.items.map(item => `
              <div class="item-row">
                <div class="item-icon">${item.imageIcon || '👟'}</div>
                <div class="item-details">
                  <div class="item-name">${escapeHTML(item.brand ? `${item.brand} - ` : '')}${escapeHTML(item.name)}</div>
                  <div class="item-sku">SKU: ${escapeHTML(item.sku)} ${item.size ? `• Size: ${escapeHTML(item.size)}` : ''}</div>
                </div>
                <div class="item-price-qty">
                  <div class="item-price">KSh ${item.price.toLocaleString()}</div>
                  <div class="item-qty">Qty: ${item.quantity}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="info-row" style="margin-top: 1rem; border-top: 1px solid var(--color-border); padding-top: 0.75rem;">
            <span class="info-label" style="font-weight: 700;">Order Total:</span>
            <span class="info-value" style="font-size: 1.1rem; color: var(--color-primary-600);">KSh ${order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </article>
  `;

  DOM.orderResult.innerHTML = html;
}

function getOrderStatusBadgeClass(step) {
  switch (step) {
    case 4: return 'badge-delivered';
    case 3: return 'badge-shipped';
    case 2: return 'badge-processing';
    case 1: return 'badge-ordered';
    default: return 'badge-ordered';
  }
}

/* ==========================================================================
   4. Shoe Stock & Size Availability Feature Handler
   ========================================================================== */
function initShoeStock() {
  // Search Form submit
  DOM.stockForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.searchQuery = DOM.stockInput.value;
    fetchShoeStock();
  });

  // Brand Filter Chips
  DOM.brandChips.forEach(chip => {
    chip.addEventListener('click', () => {
      DOM.brandChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      state.selectedBrand = chip.dataset.brand;
      fetchShoeStock();
    });
  });

  // Size Filter Chips
  DOM.sizeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      DOM.sizeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      state.selectedSize = chip.dataset.size;
      fetchShoeStock();
    });
  });
}

async function fetchShoeStock() {
  DOM.stockFeedback.innerHTML = renderLoading('Checking shoe stock & size availability...');
  DOM.stockResult.innerHTML = '';

  const response = await StockAPI.checkStock({
    query: state.searchQuery,
    brand: state.selectedBrand,
    size: state.selectedSize
  });

  DOM.stockFeedback.innerHTML = ''; // Clear loading

  if (!response.success) {
    DOM.stockFeedback.innerHTML = renderErrorAlert(response.error);
    return;
  }

  if (!response.data || response.data.length === 0) {
    const sizeMsg = state.selectedSize !== 'all' ? ` in size ${state.selectedSize}` : '';
    const brandMsg = state.selectedBrand !== 'all' ? ` for brand ${state.selectedBrand}` : '';
    DOM.stockFeedback.innerHTML = renderEmptyAlert(
      `No shoes currently available${brandMsg}${sizeMsg}. Try selecting a different size or clearing your search.`
    );
    return;
  }

  renderShoeGrid(response.data);
}

function renderShoeGrid(shoes) {
  const html = `
    <div class="shoe-results-grid">
      ${shoes.map(shoe => {
        const stockBadge = getStockBadge(shoe.stockStatus, shoe.totalStock);
        
        return `
          <article class="shoe-card">
            <div class="shoe-img-container">
              <img src="${shoe.imagePlaceholder}" alt="${escapeHTML(shoe.name)}" class="shoe-img" loading="lazy">
            </div>
            
            <div class="shoe-card-body">
              <div class="shoe-card-header">
                <div>
                  <div class="shoe-brand-tag">${escapeHTML(shoe.brand)}</div>
                  <h3 class="shoe-title">${escapeHTML(shoe.name)}</h3>
                  <div class="shoe-sku">SKU: ${escapeHTML(shoe.sku)}</div>
                </div>
                <div>${stockBadge}</div>
              </div>

              <div class="shoe-colorway">🎨 ${escapeHTML(shoe.color)}</div>

              <!-- Size Breakdown Section -->
              <div class="size-availability-section">
                <div class="size-header-label">
                  <span>Available Sizes:</span>
                  <span style="font-weight: 400; font-size: 0.75rem; color: var(--color-text-muted);">
                    ${state.selectedSize !== 'all' ? `Filtered by ${state.selectedSize}` : 'Click sizes to check'}
                  </span>
                </div>
                
                <div class="size-pills-grid">
                  ${shoe.sizes.map(sizeObj => {
                    const isAvailable = sizeObj.quantity > 0;
                    const isFiltered = state.selectedSize.toLowerCase() === sizeObj.size.toLowerCase();
                    const pillClass = isAvailable ? 'available' : 'out-of-stock';
                    const highlightClass = isFiltered ? 'highlight' : '';

                    return `
                      <span class="size-pill ${pillClass} ${highlightClass}" title="${isAvailable ? `${sizeObj.quantity} pairs in stock` : 'Out of stock'}">
                        ${escapeHTML(sizeObj.size)} ${isAvailable ? `(${sizeObj.quantity})` : ''}
                      </span>
                    `;
                  }).join('')}
                </div>
              </div>

              <div class="shoe-card-footer">
                <div class="shoe-price">KSh ${shoe.price.toLocaleString()}</div>
                <div class="total-stock-label">
                  ${shoe.stockStatus === 'out_of_stock'
                    ? '<span style="color: var(--color-danger-text);">Out of Stock</span>'
                    : `<span>${shoe.totalStock} total pairs</span>`}
                </div>
              </div>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;

  DOM.stockResult.innerHTML = html;
}

function getStockBadge(status, totalStock) {
  if (status === 'in_stock') {
    return `<span class="badge badge-in-stock"><span class="badge-dot"></span> In Stock</span>`;
  } else if (status === 'low_stock') {
    return `<span class="badge badge-low-stock"><span class="badge-dot"></span> Low Stock (${totalStock} left)</span>`;
  } else {
    return `<span class="badge badge-out-of-stock"><span class="badge-dot"></span> Out of Stock</span>`;
  }
}

/* ==========================================================================
   5. Helper Utilities
   ========================================================================== */
function renderLoading(message) {
  return `
    <div class="loading-spinner-container">
      <div class="spinner"></div>
      <div class="loading-text">${escapeHTML(message)}</div>
    </div>
  `;
}

function renderErrorAlert(message) {
  return `
    <div class="alert-box alert-error" role="alert">
      <span class="alert-icon">⚠️</span>
      <div>${escapeHTML(message)}</div>
    </div>
  `;
}

function renderEmptyAlert(message) {
  return `
    <div class="alert-box alert-empty" role="alert">
      <span class="alert-icon">ℹ️</span>
      <div>${escapeHTML(message)}</div>
    </div>
  `;
}

function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
