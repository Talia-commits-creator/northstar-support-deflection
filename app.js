/**
 * Northstar Retail — Shoe Support Portal
 * Main Application Controller
 */

import { OrderAPI, StockAPI } from './api.js';

/* ==========================================================================
   DOM References
   ========================================================================== */
const DOM = {
  // Nav
  contactBtn:    document.getElementById('contact-btn'),
  cartCount:     document.getElementById('cart-count'),
  navSearchBtn:  document.getElementById('nav-search-btn'),
  navToggle:     document.getElementById('nav-toggle-btn'),
  navLinks:      document.querySelectorAll('.nav-link'),

  // Contact Modal
  contactModal:  document.getElementById('contact-modal'),
  contactClose:  document.getElementById('contact-close'),

  // Collection
  stockInput:    document.getElementById('stock-input'),
  stockFeedback: document.getElementById('stock-feedback'),
  stockResult:   document.getElementById('stock-result'),
  brandChips:    document.querySelectorAll('.brand-chip'),
  sizeChips:     document.querySelectorAll('.size-chip'),

  // Order Tracking
  orderForm:     document.getElementById('order-form'),
  orderInput:    document.getElementById('order-input'),
  orderFeedback: document.getElementById('order-feedback'),
  orderResult:   document.getElementById('order-result'),
  demoChips:     document.querySelectorAll('.demo-chip'),

  // Inventory Dashboard
  invTableBody:      document.getElementById('inv-table-body'),
  invCountAvailable: document.getElementById('inv-count-available'),
  invCountLow:       document.getElementById('inv-count-low'),
  invCountOut:       document.getElementById('inv-count-out'),
  invCountTotal:     document.getElementById('inv-count-total'),
  heroStockTotal:    document.getElementById('hero-stock-total'),
};

/* ==========================================================================
   App State
   ========================================================================== */
const state = {
  selectedBrand:     'all',
  selectedSize:      'all',
  searchQuery:       '',
  cartItems:         0,
  liveStock:         {},   // { [shoeId]: number }
  catalog:           [],   // full shoe catalog reference
  stockTickerStarted: false,
};

/* ==========================================================================
   1. Boot
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initContact();
  initCollection();
  initOrderTracking();
  fetchShoeStock();   // loads catalog + renders grid + dashboard
});

/* ==========================================================================
   2. Navigation — active link + smooth scroll
   ========================================================================== */
function initNavigation() {
  // Highlight active section on scroll
  const sections = ['home', 'about-anchor', 'collection', 'track-order', 'inventory'];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id || 'home';
          DOM.navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            const isHomeActive = href === 'home' && (id === 'home' || id === 'top');
            const isAboutActive = href === 'about-anchor' && id === 'about-anchor';
            link.classList.toggle('active', href === id || isHomeActive || isAboutActive);
          });
        }
      });
    },
    { threshold: 0.3 }
  );
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  if (DOM.navToggle) {
    DOM.navToggle.addEventListener('click', () => {
      const isOpen = document.querySelector('.nav-links')?.classList.toggle('open');
      DOM.navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
    });
  }

  DOM.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navList = document.querySelector('.nav-links');
      navList?.classList.remove('open');
      if (DOM.navToggle) DOM.navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Cart button feedback
  if (DOM.navSearchBtn) {
    DOM.navSearchBtn.addEventListener('click', () => {
      if (DOM.stockInput) {
        document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => DOM.stockInput.focus(), 600);
      }
    });
  }
}

/* ==========================================================================
   3. Contact Modal
   ========================================================================== */
function initContact() {
  DOM.contactBtn?.addEventListener('click', openModal);
  DOM.contactClose?.addEventListener('click', closeModal);
  DOM.contactModal?.addEventListener('click', e => {
    if (e.target === DOM.contactModal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}
function openModal() {
  if (!DOM.contactModal) return;
  DOM.contactModal.removeAttribute('hidden');
  requestAnimationFrame(() => DOM.contactModal.classList.add('open'));
}
function closeModal() {
  if (!DOM.contactModal) return;
  DOM.contactModal.classList.remove('open');
  setTimeout(() => DOM.contactModal.setAttribute('hidden', ''), 200);
}

/* ==========================================================================
   4. Collection / Stock — filters + grid
   ========================================================================== */
function initCollection() {
  // Live search typing
  DOM.stockInput?.addEventListener('input', () => {
    state.searchQuery = DOM.stockInput.value;
    fetchShoeStock();
  });

  // Brand filter chips
  DOM.brandChips.forEach(chip => {
    chip.addEventListener('click', () => {
      DOM.brandChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.selectedBrand = chip.dataset.brand;
      fetchShoeStock();
    });
  });

  // Size filter chips
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
  DOM.stockFeedback.innerHTML = renderLoading('Loading shoe catalog…');
  DOM.stockResult.innerHTML = '';

  const response = await StockAPI.checkStock({
    query: state.searchQuery,
    brand: state.selectedBrand,
    size:  state.selectedSize,
  });

  DOM.stockFeedback.innerHTML = '';

  if (!response.success) {
    DOM.stockFeedback.innerHTML = renderError(response.error);
    return;
  }

  const catalogSource = (response.allData && response.allData.length > 0)
    ? response.allData
    : (response.data && response.data.length > 0 ? response.data : state.catalog);

  if (catalogSource && catalogSource.length > 0) {
    if (state.catalog.length === 0) {
      state.catalog = catalogSource;
    }

    catalogSource.forEach((shoe) => {
      if (state.liveStock[shoe.id] === undefined) {
        state.liveStock[shoe.id] = shoe.totalStock;
      }
    });

    renderInventoryDashboard(state.catalog.length ? state.catalog : catalogSource);
    if (!state.stockTickerStarted) {
      state.stockTickerStarted = true;
      startLiveStockTicker();
    }
  }

  if (!response.data || response.data.length === 0) {
    DOM.stockFeedback.innerHTML = renderEmpty(
      `No shoes found${state.selectedBrand !== 'all' ? ` for ${state.selectedBrand}` : ''}` +
      `${state.selectedSize !== 'all' ? ` in size ${state.selectedSize}` : ''}. Try clearing filters.`
    );
    return;
  }

  renderShoeGrid(response.data);
}

/* ==========================================================================
   5. Product Grid Rendering
   ========================================================================== */
function renderShoeGrid(shoes) {
  const html = `
    <div class="product-grid">
      ${shoes.map(shoe => renderProductCard(shoe)).join('')}
    </div>
  `;
  DOM.stockResult.innerHTML = html;

  // Wire up Add to Cart buttons
  DOM.stockResult.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => handleAddToCart(btn));
  });
}

function renderProductCard(shoe) {
  const liveTotal   = state.liveStock[shoe.id] !== undefined ? state.liveStock[shoe.id] : shoe.totalStock;
  const liveStatus  = getLiveStatus(liveTotal);
  const stockPct    = shoe.originalStock > 0 ? Math.round((liveTotal / shoe.originalStock) * 100) : 0;
  const barColor    = getBarColor(stockPct);
  const badgeHtml   = getInlineBadge(liveStatus, liveTotal);

  const isNew       = shoe.isNew;
  const isSale      = shoe.isSale;

  // Star rating
  const stars       = shoe.rating || 4.5;
  const reviewCount = shoe.reviews || Math.floor(Math.random() * 120) + 15;
  const starsHtml   = renderStars(stars);

  return `
    <article class="product-card" id="product-card-${shoe.id}" data-shoe-id="${shoe.id}">

      <!-- Badge area -->
      <div class="product-badge-area">
        ${isNew  ? '<span class="badge-new">NEW</span>'  : ''}
        ${isSale ? '<span class="badge-sale">SALE</span>' : ''}
        ${liveStatus === 'low_stock'    ? '<span class="badge-new" style="background:#FFB800;color:#111;">HOT</span>' : ''}
        ${liveStatus === 'out_of_stock' ? '<span class="badge-sale">SOLD OUT</span>' : ''}
      </div>

      <!-- Image -->
      <div class="product-img-area">
        <img
          src="${escapeAttr(shoe.imagePlaceholder)}"
          alt="${escapeHTML(shoe.brand)} ${escapeHTML(shoe.name)}"
          class="product-img"
          loading="lazy"
          onerror="this.style.opacity='0.4'"
        >
        <!-- Live stock overlay on image -->
        <div class="product-stock-overlay">
          <div class="product-stock-bar-track">
            <div
              class="product-stock-bar-fill"
              id="pbar-${shoe.id}"
              style="width:${stockPct}%; background:${barColor};"
            ></div>
          </div>
          <div class="product-stock-text" id="pstock-label-${shoe.id}">
            ${liveTotal > 0
              ? `<span class="num">${liveTotal}</span> pairs left`
              : '<span class="sold-out">Sold Out</span>'}
          </div>
        </div>
      </div>

      <!-- Card body -->
      <div class="product-card-body">
        <div class="product-brand-tag">${escapeHTML(shoe.brand)}</div>
        <h3 class="product-name">${escapeHTML(shoe.name)}</h3>

        <div class="product-stars">
          <span class="stars-filled">${starsHtml}</span>
          <span class="review-count">(${reviewCount})</span>
        </div>

        <div class="product-card-footer-row">
          <div class="product-price">KSh ${shoe.price.toLocaleString()}</div>
          <div id="pbadge-${shoe.id}" class="product-stock-badge-inline ${getInlineBadgeClass(liveStatus)}">
            ${badgeHtml}
          </div>
        </div>

        <button
          class="add-to-cart-btn"
          data-shoe-id="${shoe.id}"
          data-shoe-name="${escapeAttr(shoe.name)}"
          ${liveStatus === 'out_of_stock' ? 'disabled' : ''}
        >
          ${liveStatus === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </article>
  `;
}

function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function handleAddToCart(btn) {
  if (btn.disabled) return;
  state.cartItems++;
  if (DOM.cartCount) DOM.cartCount.textContent = state.cartItems;

  btn.textContent = '✓ Added!';
  btn.classList.add('added');
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Add to Cart';
    btn.classList.remove('added');
    btn.disabled = false;
  }, 1800);
}

/* ==========================================================================
   6. Inventory Dashboard
   ========================================================================== */
function renderInventoryDashboard(shoes) {
  if (!DOM.invTableBody) return;

  let countAvailable = 0, countLow = 0, countOut = 0, totalPairs = 0;

  const rows = shoes.map(shoe => {
    const liveTotal  = state.liveStock[shoe.id] !== undefined ? state.liveStock[shoe.id] : shoe.totalStock;
    const liveStatus = getLiveStatus(liveTotal);
    const stockPct   = shoe.originalStock > 0 ? Math.round((liveTotal / shoe.originalStock) * 100) : 0;
    const barClass   = liveStatus === 'in_stock' ? 'bar-available' : liveStatus === 'low_stock' ? 'bar-low' : 'bar-out';

    if (liveStatus === 'in_stock')    countAvailable += liveTotal;
    else if (liveStatus === 'low_stock') countLow += liveTotal;
    else                               countOut += liveTotal;
    totalPairs += liveTotal;

    return `
      <div class="inv-row" id="inv-row-${shoe.id}">
        <div class="inv-shoe-info">
          <img
            src="${escapeAttr(shoe.imagePlaceholder)}"
            alt="${escapeHTML(shoe.name)}"
            class="inv-shoe-thumb"
            loading="lazy"
            onerror="this.style.opacity='0.3'"
          >
          <div>
            <div class="inv-shoe-name">${escapeHTML(shoe.name)}</div>
            <div class="inv-shoe-sku">SKU: ${escapeHTML(shoe.sku)}</div>
          </div>
        </div>
        <div class="inv-brand-tag">${escapeHTML(shoe.brand)}</div>
        <div class="inv-bar-wrap">
          <div
            class="inv-bar-fill ${barClass}"
            id="inv-bar-${shoe.id}"
            style="width:${stockPct}%"
          ></div>
        </div>
        <div class="inv-count" id="inv-count-${shoe.id}" style="color:${getCountColor(liveStatus)}">${liveTotal}</div>
        <div id="inv-status-${shoe.id}">${renderInvStatusBadge(liveStatus)}</div>
      </div>
    `;
  }).join('');

  DOM.invTableBody.innerHTML = rows;
  updateInvSummary(countAvailable, countLow, countOut, totalPairs);
}

function renderInvStatusBadge(status) {
  if (status === 'in_stock') {
    return `<span class="inv-status-badge inv-status-available"><span class="inv-dot-badge a"></span>Available</span>`;
  } else if (status === 'low_stock') {
    return `<span class="inv-status-badge inv-status-low"><span class="inv-dot-badge l"></span>Low Stock</span>`;
  } else {
    return `<span class="inv-status-badge inv-status-out"><span class="inv-dot-badge o"></span>Out of Stock</span>`;
  }
}

function updateInvSummary(available, low, out, total) {
  if (DOM.invCountAvailable) DOM.invCountAvailable.textContent = available;
  if (DOM.invCountLow)       DOM.invCountLow.textContent       = low;
  if (DOM.invCountOut)       DOM.invCountOut.textContent       = out;
  if (DOM.invCountTotal)     DOM.invCountTotal.textContent     = total;
  if (DOM.heroStockTotal)    DOM.heroStockTotal.textContent    = total;
}

/* ==========================================================================
   7. Live Stock Ticker
   ========================================================================== */
function startLiveStockTicker() {
  if (!state.catalog || state.catalog.length === 0) return;

  // Random interval between 4s and 9s
  function scheduleNext() {
    const delay = 4000 + Math.random() * 5000;
    setTimeout(() => {
      tickStock();
      scheduleNext();
    }, delay);
  }
  scheduleNext();
}

function tickStock() {
  const ids = Object.keys(state.liveStock);
  if (ids.length === 0) return;

  // Update 1-2 random shoes
  const numToUpdate = Math.random() > 0.6 ? 2 : 1;
  for (let i = 0; i < numToUpdate; i++) {
    const id      = ids[Math.floor(Math.random() * ids.length)];
    const current = state.liveStock[id];
    const shoe    = state.catalog.find(s => s.id === id);
    if (!shoe) continue;

    let newTotal;
    if (Math.random() < 0.78 && current > 0) {
      // Sale: -1 pair
      newTotal = Math.max(0, current - 1);
    } else {
      // Restock: +1 to +4 pairs, capped at original
      newTotal = Math.min(shoe.originalStock, current + Math.floor(Math.random() * 4) + 1);
    }

    state.liveStock[id] = newTotal;
    updateCardStockDOM(id, newTotal, shoe);
    updateInvRowDOM(id, newTotal, shoe);
  }

  // Recalculate totals for summary cards
  let cAvail = 0, cLow = 0, cOut = 0, cTotal = 0;
  state.catalog.forEach(s => {
    const lt = state.liveStock[s.id] ?? s.totalStock;
    const st = getLiveStatus(lt);
    if (st === 'in_stock')    cAvail += lt;
    else if (st === 'low_stock') cLow += lt;
    else                      cOut += lt;
    cTotal += lt;
  });
  updateInvSummary(cAvail, cLow, cOut, cTotal);
}

function updateCardStockDOM(id, liveTotal, shoe) {
  const stockPct   = shoe.originalStock > 0 ? Math.round((liveTotal / shoe.originalStock) * 100) : 0;
  const liveStatus = getLiveStatus(liveTotal);
  const barColor   = getBarColor(stockPct);

  const bar   = document.getElementById(`pbar-${id}`);
  const label = document.getElementById(`pstock-label-${id}`);
  const badge = document.getElementById(`pbadge-${id}`);
  const addBtn = document.querySelector(`.add-to-cart-btn[data-shoe-id="${id}"]`);

  if (bar) {
    bar.style.width      = `${stockPct}%`;
    bar.style.background = barColor;
  }
  if (label) {
    label.innerHTML = liveTotal > 0
      ? `<span class="num">${liveTotal}</span> pairs left`
      : '<span class="sold-out">Sold Out</span>';
  }
  if (badge) {
    badge.className = `product-stock-badge-inline ${getInlineBadgeClass(liveStatus)}`;
    badge.innerHTML = getInlineBadge(liveStatus, liveTotal);
    badge.classList.add('stock-flash-anim');
    setTimeout(() => badge.classList.remove('stock-flash-anim'), 500);
  }
  if (addBtn) {
    addBtn.disabled     = liveStatus === 'out_of_stock';
    addBtn.textContent  = liveStatus === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart';
  }
}

function updateInvRowDOM(id, liveTotal, shoe) {
  const liveStatus = getLiveStatus(liveTotal);
  const stockPct   = shoe.originalStock > 0 ? Math.round((liveTotal / shoe.originalStock) * 100) : 0;
  const barClass   = liveStatus === 'in_stock' ? 'bar-available' : liveStatus === 'low_stock' ? 'bar-low' : 'bar-out';

  const bar    = document.getElementById(`inv-bar-${id}`);
  const count  = document.getElementById(`inv-count-${id}`);
  const status = document.getElementById(`inv-status-${id}`);

  if (bar) {
    bar.style.width = `${stockPct}%`;
    bar.className   = `inv-bar-fill ${barClass}`;
  }
  if (count) {
    count.textContent = liveTotal;
    count.style.color = getCountColor(liveStatus);
    count.classList.add('stock-flash-anim');
    setTimeout(() => count.classList.remove('stock-flash-anim'), 500);
  }
  if (status) status.innerHTML = renderInvStatusBadge(liveStatus);
}

/* ==========================================================================
   8. Order Tracking
   ========================================================================== */
function initOrderTracking() {
  DOM.orderForm?.addEventListener('submit', e => {
    e.preventDefault();
    fetchOrder(DOM.orderInput.value);
  });

  DOM.demoChips.forEach(chip => {
    chip.addEventListener('click', () => {
      DOM.orderInput.value = chip.dataset.order;
      fetchOrder(chip.dataset.order);
      document.getElementById('track-order')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function normalizeOrderPayload(order) {
  if (!order) return null;

  const statusStepMap = {
    Ordered: 1,
    Processing: 2,
    Shipped: 3,
    Delivered: 4,
    'Out for Delivery': 3,
  };

  return {
    ...order,
    orderNumber: order.orderNumber || order.order_id || 'N/A',
    productName: order.productName || order.product_name || 'Northstar Shoe',
    size: order.size || '—',
    status: order.status || 'Processing',
    statusStep: Number.isFinite(order.statusStep)
      ? order.statusStep
      : (statusStepMap[order.status] ?? 1),
    estimatedDelivery: order.estimatedDelivery || order.estimated_delivery || '—',
    carrier: order.carrier || '—',
    trackingNumber: order.trackingNumber || order.tracking_number || '—',
    shippingAddress: order.shippingAddress ?? null,
    totalAmount: order.totalAmount ?? order.total_amount ?? null,
  };
}

async function fetchOrder(orderNum) {
  DOM.orderFeedback.innerHTML = renderLoading('Looking up your order…');
  DOM.orderResult.innerHTML   = '';

  const response = await OrderAPI.trackOrder(orderNum);
  DOM.orderFeedback.innerHTML = '';

  if (!response.success) {
    DOM.orderFeedback.innerHTML = renderError(response.error);
    return;
  }

  DOM.orderResult.innerHTML = renderOrderCard(normalizeOrderPayload(response.data));
}

function renderOrderCard(order) {
  const safeOrder = order || {};
  const statusStep = Number.isFinite(safeOrder.statusStep) ? safeOrder.statusStep : 1;
  const statusClass = getStatusClass(statusStep);
  const statusLabel = safeOrder.status || 'Processing';
  const progressPct = Math.round(((statusStep - 1) / 3) * 100);
  const hasShippingAddress = Boolean(safeOrder.shippingAddress);
  const hasTotalAmount = Number.isFinite(Number(safeOrder.totalAmount)) && Number(safeOrder.totalAmount) > 0;

  return `
    <div class="order-result-card">
      <div class="order-result-top">
        <div>
          <div class="order-result-num">Order ${escapeHTML(safeOrder.orderNumber || 'N/A')}</div>
          <div class="order-result-date">${escapeHTML(safeOrder.productName || 'Northstar Shoe')}</div>
        </div>
        <span class="status-badge ${statusClass}">
          <span class="status-dot"></span> ${escapeHTML(statusLabel)}
        </span>
      </div>

      <div class="order-timeline">
        <div class="timeline-label">Order Progress</div>
        <div class="timeline-track">
          <div class="timeline-fill" style="width: ${progressPct}%;"></div>
          ${[
            { label: 'Ordered',    step: 1 },
            { label: 'Processing', step: 2 },
            { label: 'Shipped',    step: 3 },
            { label: 'Delivered',  step: 4 },
          ].map(({ label, step }) => {
            const cls = statusStep > step
              ? 'completed'
              : statusStep === step
                ? 'active'
                : '';
            const icon = statusStep > step ? '✓' : step;
            return `
              <div class="timeline-step ${cls}">
                <div class="step-circle">${icon}</div>
                <div class="step-text">${label}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="order-details-grid">
        <div class="order-info-block">
          <div class="order-info-title">Order Details</div>
          <div class="order-info-row">
            <span class="oir-label">Order ID</span>
            <span class="oir-value">${escapeHTML(safeOrder.orderNumber || 'N/A')}</span>
          </div>
          <div class="order-info-row">
            <span class="oir-label">Product</span>
            <span class="oir-value">${escapeHTML(safeOrder.productName || 'Northstar Shoe')}</span>
          </div>
          <div class="order-info-row">
            <span class="oir-label">Size</span>
            <span class="oir-value">${escapeHTML(safeOrder.size || '—')}</span>
          </div>
          <div class="order-info-row">
            <span class="oir-label">Status</span>
            <span class="oir-value">${escapeHTML(statusLabel)}</span>
          </div>
          <div class="order-info-row">
            <span class="oir-label">Carrier</span>
            <span class="oir-value">${escapeHTML(safeOrder.carrier || '—')}</span>
          </div>
          <div class="order-info-row">
            <span class="oir-label">Tracking #</span>
            <span class="oir-value">${escapeHTML(safeOrder.trackingNumber || '—')}</span>
          </div>
          <div class="order-info-row">
            <span class="oir-label">Est. Delivery</span>
            <span class="oir-value">${escapeHTML(safeOrder.estimatedDelivery || '—')}</span>
          </div>
          ${hasShippingAddress ? `
            <div class="order-info-row" style="align-items:flex-start; margin-top:0.25rem;">
              <span class="oir-label">Destination</span>
              <span class="oir-value">${escapeHTML(safeOrder.shippingAddress)}</span>
            </div>
          ` : ''}
        </div>
        ${hasTotalAmount ? `
          <div class="order-info-block">
            <div class="order-info-title">Payment</div>
            <div class="order-total-row">
              <span class="order-total-label">Order Total</span>
              <span class="order-total-amount">KSh ${Number(safeOrder.totalAmount).toLocaleString()}</span>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/* ==========================================================================
   9. Utility Helpers
   ========================================================================== */
function getLiveStatus(qty) {
  if (qty === 0)  return 'out_of_stock';
  if (qty <= 5)   return 'low_stock';
  return 'in_stock';
}

function getBarColor(pct) {
  if (pct > 50)  return 'linear-gradient(90deg,#C6FF00,#a8e000)';
  if (pct > 20)  return 'linear-gradient(90deg,#FFB800,#e0a000)';
  return 'linear-gradient(90deg,#FF4D4D,#e03030)';
}

function getCountColor(status) {
  if (status === 'in_stock')   return '#5a7a00';
  if (status === 'low_stock')  return '#8a5c00';
  return '#cc0000';
}

function getInlineBadge(status, qty) {
  if (status === 'in_stock')   return 'In Stock';
  if (status === 'low_stock')  return `${qty} left`;
  return 'Out of Stock';
}

function getInlineBadgeClass(status) {
  if (status === 'in_stock')   return 'psi-available';
  if (status === 'low_stock')  return 'psi-low';
  return 'psi-out';
}

function getStatusClass(step) {
  switch (step) {
    case 4:  return 'status-delivered';
    case 3:  return 'status-shipped';
    case 2:  return 'status-processing';
    default: return 'status-ordered';
  }
}

function renderLoading(msg) {
  return `
    <div class="loading-wrap">
      <div class="spinner"></div>
      <span>${escapeHTML(msg)}</span>
    </div>
  `;
}

function renderError(msg) {
  return `
    <div class="alert-box alert-error" role="alert">
      <span class="alert-icon">⚠️</span>
      <div>${escapeHTML(msg)}</div>
    </div>
  `;
}

function renderEmpty(msg) {
  return `
    <div class="alert-box alert-empty" role="alert">
      <span class="alert-icon">ℹ️</span>
      <div>${escapeHTML(msg)}</div>
    </div>
  `;
}

function escapeHTML(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
