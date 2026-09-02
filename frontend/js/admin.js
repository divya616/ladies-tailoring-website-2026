/**
 * Ambattur Classic Tailors — Admin Management Dashboard Script
 * Fetches data from backend REST API:
 * - GET /api/stats (KPI overview)
 * - GET /api/bookings (Filterable order table)
 * - PATCH /api/bookings/:id (Instant status & note updates)
 * - POST /api/bookings (Walk-in counter booking)
 * - DELETE /api/bookings/:id (Cancel order)
 */

const API_BASE_URL = window.location.port === '5000' 
  ? '/api' 
  : (window.location.protocol === 'file:' ? 'http://localhost:5000/api' : 'http://localhost:5000/api');

let allBookingsData = [];
let currentFilterStatus = 'all';
let currentSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  loadAdminDashboard();
  initAdminEventListeners();
});

async function loadAdminDashboard() {
  await Promise.all([
    fetchKPIStats(),
    fetchBookings()
  ]);
}

/* ==========================================================================
   1. KPI STATS (GET /api/stats)
   ========================================================================== */
async function fetchKPIStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    const result = await response.json();

    if (response.ok && result.success && result.data) {
      const stats = result.data;
      document.getElementById('kpiTotalOrders').textContent = stats.totalOrders;
      document.getElementById('kpiInStitching').textContent = stats.inStitching;
      document.getElementById('kpiReadyForPickup').textContent = stats.readyForPickup;
      document.getElementById('kpiTotalRevenue').textContent = `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`;
    }
  } catch (err) {
    console.error('Failed to load KPI stats:', err);
  }
}

/* ==========================================================================
   2. BOOKINGS TABLE (GET /api/bookings)
   ========================================================================== */
async function fetchBookings() {
  const tableBody = document.getElementById('adminTableBody');
  const loadingIndicator = document.getElementById('adminTableLoading');
  const emptyState = document.getElementById('adminEmptyState');

  if (loadingIndicator) loadingIndicator.style.display = 'block';
  if (emptyState) emptyState.style.display = 'none';

  try {
    let url = `${API_BASE_URL}/bookings`;
    const params = new URLSearchParams();
    if (currentFilterStatus && currentFilterStatus !== 'all') {
      params.append('status', currentFilterStatus);
    }
    if (currentSearchQuery) {
      params.append('search', currentSearchQuery);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    const result = await response.json();

    if (response.ok && result.success && Array.isArray(result.data)) {
      allBookingsData = result.data;
      renderBookingsTable(allBookingsData);
    } else {
      showToast('Failed to fetch bookings list', 'error');
    }
  } catch (err) {
    console.error('Error fetching bookings:', err);
    showToast('Cannot connect to backend server on port 5000', 'error');
  } finally {
    if (loadingIndicator) loadingIndicator.style.display = 'none';
  }
}

function renderBookingsTable(bookings) {
  const tableBody = document.getElementById('adminTableBody');
  const emptyState = document.getElementById('adminEmptyState');
  if (!tableBody) return;

  tableBody.innerHTML = '';

  if (bookings.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  bookings.forEach(booking => {
    const tr = document.createElement('tr');
    tr.id = `row-${booking.id}`;

    // Compute status class for select
    const statusLower = (booking.status || 'Received').toLowerCase();
    let selClass = 'sel-received';
    if (statusLower.includes('stitch') || statusLower.includes('cut')) selClass = 'sel-stitching';
    else if (statusLower.includes('ready')) selClass = 'sel-ready';
    else if (statusLower.includes('complete')) selClass = 'sel-completed';
    else if (statusLower.includes('cancel')) selClass = 'sel-cancelled';

    // WhatsApp Message
    const waText = encodeURIComponent(
      `Hello ${booking.customer_name}, this is Ambattur Classic Tailors regarding your order #${booking.tracking_id} (${booking.service_name}). Current status: ${booking.status}.`
    );

    tr.innerHTML = `
      <td>
        <span class="tracking-pill">${booking.tracking_id}</span>
        ${booking.express_delivery ? '<span style="color:#d97706;font-size:0.75rem;display:block;font-weight:700;">⚡ 24h Express</span>' : ''}
      </td>
      <td>
        <div class="customer-cell">
          <span class="cust-name">${escapeHtml(booking.customer_name)}</span>
          <span class="cust-phone">📞 ${escapeHtml(booking.phone)}</span>
        </div>
      </td>
      <td>
        <strong>${escapeHtml(booking.service_name)}</strong>
        <div style="font-size:0.75rem;color:#64748b;">${escapeHtml(booking.package_type || '')}</div>
      </td>
      <td>
        <div style="font-size:0.8125rem;">${escapeHtml(booking.measurement_preference || 'In-Shop')}</div>
        <div style="font-size:0.75rem;color:#64748b;">Appt: ${booking.appointment_date}</div>
      </td>
      <td>
        <strong style="color:#047857;">₹${(booking.estimated_price || 0).toLocaleString('en-IN')}</strong>
        <div style="font-size:0.75rem;color:#64748b;">Adv: ₹${(booking.advance_paid || 0).toLocaleString('en-IN')}</div>
      </td>
      <td>
        <select class="status-select ${selClass}" onchange="updateOrderStatus('${booking.tracking_id}', this.value, this)">
          <option value="Received" ${booking.status === 'Received' ? 'selected' : ''}>Received</option>
          <option value="In-Cutting" ${booking.status === 'In-Cutting' ? 'selected' : ''}>In-Cutting</option>
          <option value="In-Stitching" ${booking.status === 'In-Stitching' ? 'selected' : ''}>In-Stitching</option>
          <option value="Ready for Pickup" ${booking.status === 'Ready for Pickup' ? 'selected' : ''}>Ready for Pickup</option>
          <option value="Completed" ${booking.status === 'Completed' ? 'selected' : ''}>Completed</option>
          <option value="Cancelled" ${booking.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <div class="action-btns-wrap">
          <a href="https://wa.me/91${booking.phone}?text=${waText}" target="_blank" class="btn-icon wa-btn" title="Send WhatsApp Update">
            💬
          </a>
          <button class="btn-icon" title="View & Print Job Sheet" onclick="openJobSheetModal('${booking.tracking_id}')">
            📄
          </button>
          <button class="btn-icon" style="color:#ef4444;" title="Delete Order" onclick="deleteBookingOrder('${booking.tracking_id}')">
            🗑
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

/* ==========================================================================
   3. STATUS UPDATE (PATCH /api/bookings/:id)
   ========================================================================== */
window.updateOrderStatus = async function(trackingId, newStatus, selectElem) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(trackingId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showToast(`✅ Order ${trackingId} updated to "${newStatus}"`, 'success');
      
      // Update select styling
      if (selectElem) {
        selectElem.className = 'status-select';
        const st = newStatus.toLowerCase();
        if (st.includes('stitch') || st.includes('cut')) selectElem.classList.add('sel-stitching');
        else if (st.includes('ready')) selectElem.classList.add('sel-ready');
        else if (st.includes('complete')) selectElem.classList.add('sel-completed');
        else if (st.includes('cancel')) selectElem.classList.add('sel-cancelled');
        else selectElem.classList.add('sel-received');
      }

      // Refresh KPI numbers
      fetchKPIStats();
    } else {
      showToast(result.message || 'Failed to update status', 'error');
    }
  } catch (err) {
    console.error('Update status error:', err);
    showToast('Failed to connect to backend server', 'error');
  }
};

/* ==========================================================================
   4. DELETE ORDER (DELETE /api/bookings/:id)
   ========================================================================== */
window.deleteBookingOrder = async function(trackingId) {
  if (!confirm(`Are you sure you want to delete order "${trackingId}"?`)) return;

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(trackingId)}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showToast(`🗑 Order ${trackingId} deleted`, 'success');
      fetchKPIStats();
      fetchBookings();
    } else {
      showToast(result.message || 'Failed to delete order', 'error');
    }
  } catch (err) {
    console.error('Delete order error:', err);
    showToast('Failed to connect to server', 'error');
  }
};

/* ==========================================================================
   5. JOB SHEET / CUTTING SLIP MODAL
   ========================================================================== */
window.openJobSheetModal = function(trackingId) {
  const booking = allBookingsData.find(b => b.tracking_id === trackingId);
  if (!booking) {
    showToast('Order details not found', 'error');
    return;
  }

  const container = document.getElementById('jobSheetContent');
  if (!container) return;

  container.innerHTML = `
    <div class="job-sheet-container">
      <div class="job-sheet-header">
        <div class="job-sheet-shop">
          <h3>AMBATTUR CLASSIC TAILORS</h3>
          <p>MTH Road, Ambattur OT, Chennai - 600053 | Tel: +91 98401 23456</p>
          <p style="color:#047857;font-weight:700;">MASTER TAILOR CUTTING SLIP & WORKSHOP JOB CARD</p>
        </div>
        <div class="job-sheet-voucher">
          <div style="font-size:1.25rem;font-weight:800;color:#0f172a;font-family:monospace;">${booking.tracking_id}</div>
          <div style="font-size:0.75rem;color:#64748b;">Booked: ${new Date(booking.created_at).toLocaleDateString('en-IN')}</div>
          ${booking.express_delivery ? '<div style="background:#fef3c7;color:#b45309;padding:2px 8px;border-radius:4px;font-weight:700;font-size:0.75rem;margin-top:4px;">⚡ 24-HOUR EXPRESS</div>' : ''}
        </div>
      </div>

      <div class="job-sheet-grid">
        <div class="job-sheet-box">
          <h4>Customer Details</h4>
          <p>${escapeHtml(booking.customer_name)}</p>
          <div style="font-size:0.8125rem;color:#475569;">📞 ${escapeHtml(booking.phone)}</div>
          <div style="font-size:0.75rem;color:#64748b;">📍 ${escapeHtml(booking.address_locality || 'Ambattur')}</div>
        </div>

        <div class="job-sheet-box">
          <h4>Garment & Package</h4>
          <p>${escapeHtml(booking.service_name)}</p>
          <div style="font-size:0.8125rem;color:#475569;">Type: ${escapeHtml(booking.package_type || 'Standard')}</div>
          <div style="font-size:0.75rem;color:#64748b;">Fabric: ${escapeHtml(booking.fabric_option || 'Customer')}</div>
        </div>

        <div class="job-sheet-box">
          <h4>Measurement Preference</h4>
          <p>${escapeHtml(booking.measurement_preference)}</p>
          <div style="font-size:0.8125rem;color:#047857;">Fitting Date: ${booking.appointment_date}</div>
          <div style="font-size:0.8125rem;color:#b45309;">Target Delivery: ${booking.delivery_date || 'Standard'}</div>
        </div>

        <div class="job-sheet-box">
          <h4>Billing Summary</h4>
          <p>Total: ₹${(booking.estimated_price || 0).toLocaleString('en-IN')}</p>
          <div style="font-size:0.8125rem;color:#15803d;">Advance: ₹${(booking.advance_paid || 0).toLocaleString('en-IN')}</div>
          <div style="font-size:0.8125rem;color:#b91c1c;font-weight:700;">Balance: ₹${(booking.balance_amount || 0).toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div class="job-sheet-notes">
        <h4 style="font-size:0.8125rem;color:#b45309;margin-bottom:0.25rem;text-transform:uppercase;">Workshop Notes & Stitching Instructions:</h4>
        <p style="font-size:0.875rem;color:#1e293b;font-weight:500;">${escapeHtml(booking.notes || 'Bespoke stitching as per Ambattur OT master cutting pattern.')}</p>
      </div>

      <div class="job-sheet-sign">
        <div>Master Cutter Signature: __________________</div>
        <div>Customer Fitting Signature: __________________</div>
      </div>
    </div>
    
    <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.25rem;" class="no-print">
      <button class="btn btn-outline" onclick="closeModal('jobSheetModal')">Close</button>
      <button class="btn btn-primary" onclick="window.print()">🖨 Print Cutting Slip</button>
    </div>
  `;

  document.getElementById('jobSheetModal').classList.add('active');
};

/* ==========================================================================
   6. EVENT LISTENERS & WALK-IN COUNTER MODAL
   ========================================================================== */
function initAdminEventListeners() {
  // Status filter pills
  const filterPills = document.querySelectorAll('[data-status-filter]');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilterStatus = pill.dataset.statusFilter;
      fetchBookings();
    });
  });

  // Search input debounce
  const searchInput = document.getElementById('adminSearchInput');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentSearchQuery = e.target.value.trim();
        fetchBookings();
      }, 300);
    });
  }

  // Refresh button
  const refreshBtn = document.getElementById('adminRefreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      showToast('Refreshing bookings...', 'info');
      loadAdminDashboard();
    });
  }

  // New Walk-in Counter Form
  const walkinForm = document.getElementById('walkinOrderForm');
  if (walkinForm) {
    walkinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = walkinForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const payload = {
        customer_name: document.getElementById('walkinName').value.trim(),
        phone: document.getElementById('walkinPhone').value.trim(),
        service_name: document.getElementById('walkinService').value,
        package_type: document.getElementById('walkinPackage').value.trim() || 'Counter Walk-in Order',
        measurement_preference: document.getElementById('walkinMeasurement').value,
        estimated_price: Number(document.getElementById('walkinPrice').value) || 1200,
        advance_paid: Number(document.getElementById('walkinAdvance').value) || 0,
        appointment_date: document.getElementById('walkinDate').value || new Date().toISOString().split('T')[0],
        notes: document.getElementById('walkinNotes').value.trim()
      };

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Saving...';

        const res = await fetch(`${API_BASE_URL}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.ok && result.success) {
          showToast(`✨ Walk-in order ${result.data.tracking_id} created!`, 'success');
          walkinForm.reset();
          closeModal('walkinModal');
          loadAdminDashboard();
        } else {
          showToast(result.message || 'Failed to create walk-in order', 'error');
        }
      } catch (err) {
        console.error('Walkin error:', err);
        showToast('Error creating order', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
};

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'error' ? '⚠️' : (type === 'success' ? '✨' : 'ℹ️')}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
