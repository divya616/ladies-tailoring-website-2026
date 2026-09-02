/**
 * Ambattur Classic Tailors — Frontend Application Script
 * Features:
 * - Dynamic Real-Time Price Estimator (in INR ₹)
 * - Seamless Appointment Booking via POST /api/bookings
 * - Live Order Tracker Modal via GET /api/bookings/:id
 * - Toast notification feedback & Ambattur shop utilities
 */

// Determine API Base URL (works if opened via Live Server on 5500 or directly via backend port 5000)
const API_BASE_URL = window.location.port === '5000' 
  ? '/api' 
  : (window.location.protocol === 'file:' ? 'http://localhost:5000/api' : 'http://localhost:5000/api');

// Pricing Matrix (in INR ₹)
const PRICING_CONFIG = {
  suit: {
    name: "Gents Suit Stitching",
    options: [
      { id: "suit_2pc", label: "2-Piece Classic Suit", price: 4500, time: "4-5 Days" },
      { id: "suit_3pc", label: "3-Piece Wedding Suit", price: 6500, time: "5-6 Days" },
      { id: "suit_tuxedo", label: "Bespoke Royal Tuxedo", price: 8500, time: "6-7 Days" },
      { id: "suit_blazer", label: "Executive Blazer Only", price: 3200, time: "3-4 Days" }
    ],
    fabricPrices: {
      customer: { label: "Customer Provides Fabric", price: 0 },
      shop: { label: "Shop Sourced Raymond / Italian Blend", price: 3000 }
    }
  },
  formal: {
    name: "Formal Shirt & Trouser",
    options: [
      { id: "formal_pair", label: "1 Shirt + 1 Trouser Set", price: 1200, time: "2-3 Days" },
      { id: "formal_shirt", label: "Single Formal Shirt", price: 550, time: "2 Days" },
      { id: "formal_trouser", label: "Single Formal Trouser", price: 650, time: "2 Days" },
      { id: "formal_safari", label: "Executive Safari Suit", price: 1900, time: "3-4 Days" }
    ],
    fabricPrices: {
      customer: { label: "Customer Provides Fabric", price: 0 },
      shop: { label: "Shop Sourced Giza Cotton & Poly-Viscose", price: 1200 }
    }
  },
  blouse: {
    name: "Designer Blouse & Aari Work",
    options: [
      { id: "blouse_standard", label: "Princess Cut Designer Blouse", price: 1500, time: "2-3 Days" },
      { id: "blouse_boat", label: "Boat Neck / Potli Button Blouse", price: 2200, time: "3 Days" },
      { id: "blouse_aari_med", label: "Hand Aari Maggam Work (Moderate)", price: 2800, time: "4-5 Days" },
      { id: "blouse_aari_heavy", label: "Bridal Heavy Zardosi & Antique Aari", price: 4000, time: "6-7 Days" }
    ],
    fabricPrices: {
      customer: { label: "Customer Provides Saree Blouse Bit", price: 0 },
      shop: { label: "Shop Sourced Raw Silk / Brocade Lining", price: 800 }
    }
  }
};

// Current Estimator State
let currentEstimator = {
  serviceCategory: 'suit',
  selectedOptionId: 'suit_3pc',
  quantity: 1,
  fabricChoice: 'customer',
  expressStitching: false
};

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', () => {
  initEstimator();
  initBookingForm();
  initOrderTracker();
  initSmoothScroll();
});

/* ==========================================================================
   1. DYNAMIC PRICE ESTIMATOR CALCULATOR
   ========================================================================== */
function initEstimator() {
  const categoryBtns = document.querySelectorAll('[data-calc-category]');
  const optionsContainer = document.getElementById('calcOptionsGrid');
  const qtyMinusBtn = document.getElementById('calcQtyMinus');
  const qtyPlusBtn = document.getElementById('calcQtyPlus');
  const expressToggle = document.getElementById('calcExpressToggle');
  const fabricRadios = document.querySelectorAll('input[name="calcFabric"]');
  const applyBtn = document.getElementById('btnApplyEstimateToBooking');

  // Category Switchers
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentEstimator.serviceCategory = btn.dataset.calcCategory;
      
      // Default to first option of that category
      const firstOpt = PRICING_CONFIG[currentEstimator.serviceCategory].options[0];
      currentEstimator.selectedOptionId = firstOpt.id;
      
      renderEstimatorOptions();
      updateEstimatorCalculation();
    });
  });

  // Quantity adjustments
  if (qtyMinusBtn && qtyPlusBtn) {
    qtyMinusBtn.addEventListener('click', () => {
      if (currentEstimator.quantity > 1) {
        currentEstimator.quantity--;
        document.getElementById('calcQtyDisplay').textContent = currentEstimator.quantity;
        updateEstimatorCalculation();
      }
    });

    qtyPlusBtn.addEventListener('click', () => {
      if (currentEstimator.quantity < 10) {
        currentEstimator.quantity++;
        document.getElementById('calcQtyDisplay').textContent = currentEstimator.quantity;
        updateEstimatorCalculation();
      }
    });
  }

  // Express Stitching toggle (+₹500)
  if (expressToggle) {
    expressToggle.addEventListener('click', () => {
      currentEstimator.expressStitching = !currentEstimator.expressStitching;
      expressToggle.classList.toggle('active', currentEstimator.expressStitching);
      const checkbox = expressToggle.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.checked = currentEstimator.expressStitching;
      updateEstimatorCalculation();
    });
  }

  // Fabric choice radio buttons
  fabricRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentEstimator.fabricChoice = e.target.value;
      updateEstimatorCalculation();
    });
  });

  // "Book with this estimate" CTA
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      applyEstimateToBookingForm();
      const bookingSection = document.getElementById('bookingSection');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Initial render
  renderEstimatorOptions();
  updateEstimatorCalculation();
}

function renderEstimatorOptions() {
  const container = document.getElementById('calcOptionsGrid');
  if (!container) return;

  const category = PRICING_CONFIG[currentEstimator.serviceCategory];
  container.innerHTML = '';

  category.options.forEach(opt => {
    const card = document.createElement('div');
    card.className = `calc-option-card ${currentEstimator.selectedOptionId === opt.id ? 'active' : ''}`;
    card.innerHTML = `
      <div class="calc-opt-name">${opt.label}</div>
      <div class="calc-opt-price">₹${opt.price.toLocaleString('en-IN')}</div>
    `;
    card.addEventListener('click', () => {
      currentEstimator.selectedOptionId = opt.id;
      renderEstimatorOptions();
      updateEstimatorCalculation();
    });
    container.appendChild(card);
  });
}

function updateEstimatorCalculation() {
  const category = PRICING_CONFIG[currentEstimator.serviceCategory];
  const selectedOpt = category.options.find(o => o.id === currentEstimator.selectedOptionId) || category.options[0];
  const fabricOpt = category.fabricPrices[currentEstimator.fabricChoice] || { price: 0 };
  
  const baseRate = selectedOpt.price;
  const fabricCost = fabricOpt.price;
  const unitRate = baseRate + fabricCost;
  const subtotal = unitRate * currentEstimator.quantity;
  const expressFee = currentEstimator.expressStitching ? 500 : 0;
  const grandTotal = subtotal + expressFee;

  // Update Summary UI
  const sumServiceName = document.getElementById('calcSumServiceName');
  const sumPackage = document.getElementById('calcSumPackage');
  const sumFabric = document.getElementById('calcSumFabric');
  const sumQty = document.getElementById('calcSumQty');
  const sumExpressRow = document.getElementById('calcSumExpressRow');
  const sumTotal = document.getElementById('calcSumTotal');
  const turnaroundText = document.getElementById('calcTurnaroundText');

  if (sumServiceName) sumServiceName.textContent = category.name;
  if (sumPackage) sumPackage.textContent = `${selectedOpt.label} (₹${selectedOpt.price.toLocaleString('en-IN')})`;
  if (sumFabric) sumFabric.textContent = currentEstimator.fabricChoice === 'shop' ? `+ ₹${fabricCost.toLocaleString('en-IN')}` : 'Included / ₹0';
  if (sumQty) sumQty.textContent = `${currentEstimator.quantity} Qty`;
  
  if (sumExpressRow) {
    sumExpressRow.style.display = currentEstimator.expressStitching ? 'flex' : 'none';
  }

  if (sumTotal) {
    sumTotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  }

  if (turnaroundText) {
    turnaroundText.textContent = currentEstimator.expressStitching
      ? '⚡ Express 24-Hour Ready Guarantee at Ambattur Shop'
      : `⏱ Estimated Delivery: ${selectedOpt.time}`;
  }
}

function applyEstimateToBookingForm() {
  const category = PRICING_CONFIG[currentEstimator.serviceCategory];
  const selectedOpt = category.options.find(o => o.id === currentEstimator.selectedOptionId) || category.options[0];
  
  const serviceSelect = document.getElementById('bookServiceSelect');
  const expressCheckbox = document.getElementById('bookExpressCheckbox');
  const notesField = document.getElementById('bookNotes');
  const fabricSelect = document.getElementById('bookFabricOption');

  if (serviceSelect) serviceSelect.value = category.name;
  if (expressCheckbox) expressCheckbox.checked = currentEstimator.expressStitching;
  if (fabricSelect) {
    fabricSelect.value = currentEstimator.fabricChoice === 'shop' ? 'Shop Provided Fabric' : 'Customer Provided Fabric';
  }
  if (notesField) {
    notesField.value = `Selected Package: ${selectedOpt.label} (${currentEstimator.quantity} Qty). Estimated Total: ${document.getElementById('calcSumTotal').textContent}`;
  }

  showToast('✅ Estimate applied to Appointment Booking Form!', 'success');
}

/* ==========================================================================
   2. APPOINTMENT BOOKING FORM (POST /api/bookings)
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  // Set default appointment date to tomorrow
  const dateInput = document.getElementById('bookAppointmentDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Collect data
    const customerName = document.getElementById('bookCustomerName').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    const email = document.getElementById('bookEmail').value.trim();
    const serviceName = document.getElementById('bookServiceSelect').value;
    const measurementPreference = document.getElementById('bookMeasurementPref').value;
    const appointmentDate = document.getElementById('bookAppointmentDate').value;
    const fabricOption = document.getElementById('bookFabricOption').value;
    const expressDelivery = document.getElementById('bookExpressCheckbox').checked;
    const addressLocality = document.getElementById('bookLocality').value.trim();
    const notes = document.getElementById('bookNotes').value.trim();

    // Validation
    if (!customerName) {
      showToast('Please enter your full name', 'error');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    // Determine estimated price
    let estimatedPrice = 1200;
    if (serviceName.includes('Suit')) estimatedPrice = expressDelivery ? 7000 : 6500;
    else if (serviceName.includes('Blouse')) estimatedPrice = expressDelivery ? 3000 : 2500;
    else if (serviceName.includes('Formal')) estimatedPrice = expressDelivery ? 1700 : 1200;

    const payload = {
      customer_name: customerName,
      phone: cleanPhone,
      email: email,
      service_name: serviceName,
      package_type: `${serviceName} - Bespoke Fitting`,
      fabric_option: fabricOption,
      measurement_preference: measurementPreference,
      express_delivery: expressDelivery,
      estimated_price: estimatedPrice,
      advance_paid: 0,
      appointment_date: appointmentDate,
      address_locality: addressLocality || 'Ambattur, Chennai',
      notes: notes
    };

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ Booking Appointment...';

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast('🎉 Appointment booked successfully!', 'success');
        form.reset();
        openBookingConfirmationModal(result.data);
      } else {
        showToast(result.message || 'Failed to book appointment', 'error');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      // Fallback local generation if server is offline
      const mockTrackingId = `ACT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      payload.tracking_id = mockTrackingId;
      payload.status = "Received";
      openBookingConfirmationModal(payload);
      showToast('Appointment recorded! (Offline mode)', 'warning');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

function openBookingConfirmationModal(booking) {
  const modal = document.getElementById('bookingSuccessModal');
  if (!modal) return;

  document.getElementById('confTrackingId').textContent = booking.tracking_id || 'ACT-2026-CONF';
  document.getElementById('confCustomerName').textContent = booking.customer_name;
  document.getElementById('confService').textContent = booking.service_name;
  document.getElementById('confAppointment').textContent = booking.appointment_date;
  document.getElementById('confPrice').textContent = `₹${(booking.estimated_price || 0).toLocaleString('en-IN')}`;

  // Build WhatsApp Link
  const waMsg = encodeURIComponent(
    `Hello Ambattur Classic Tailors! I have booked an appointment.\n\n*Order ID:* ${booking.tracking_id}\n*Name:* ${booking.customer_name}\n*Service:* ${booking.service_name}\n*Date:* ${booking.appointment_date}\n*Measurement:* ${booking.measurement_preference}\n\nPlease confirm my slot!`
  );
  const waBtn = document.getElementById('confWhatsAppBtn');
  if (waBtn) {
    waBtn.href = `https://wa.me/919840123456?text=${waMsg}`;
  }

  // Copy tracking ID button
  const copyBtn = document.getElementById('confCopyBtn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(booking.tracking_id);
      showToast(`Copied ${booking.tracking_id} to clipboard!`, 'success');
    };
  }

  // Quick Track button in modal
  const trackBtn = document.getElementById('confTrackNowBtn');
  if (trackBtn) {
    trackBtn.onclick = () => {
      closeModal('bookingSuccessModal');
      openOrderTrackerModal(booking.tracking_id);
    };
  }

  modal.classList.add('active');
}

/* ==========================================================================
   3. LIVE ORDER TRACKER MODAL (GET /api/bookings/:id)
   ========================================================================== */
function initOrderTracker() {
  const trackerForm = document.getElementById('orderTrackerForm');
  const trackerInput = document.getElementById('trackerOrderIdInput');
  const demoChips = document.querySelectorAll('.demo-chip');

  // Trigger search on submit
  if (trackerForm) {
    trackerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = trackerInput.value.trim();
      if (query) {
        fetchAndRenderOrderStatus(query);
      } else {
        showToast('Please enter your Order ID or Phone number', 'error');
      }
    });
  }

  // Quick Demo chips
  demoChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (trackerInput) {
        trackerInput.value = chip.dataset.orderId;
        fetchAndRenderOrderStatus(chip.dataset.orderId);
      }
    });
  });

  // Modal open buttons across page
  const openTrackerBtns = document.querySelectorAll('[data-open-tracker]');
  openTrackerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openOrderTrackerModal();
    });
  });
}

function openOrderTrackerModal(prefillId = '') {
  const modal = document.getElementById('orderTrackerModal');
  if (!modal) return;

  modal.classList.add('active');
  const input = document.getElementById('trackerOrderIdInput');
  if (input && prefillId) {
    input.value = prefillId;
    fetchAndRenderOrderStatus(prefillId);
  }
}

async function fetchAndRenderOrderStatus(query) {
  const resultContainer = document.getElementById('trackerResultContainer');
  const loadingIndicator = document.getElementById('trackerLoading');
  const errorContainer = document.getElementById('trackerError');

  if (loadingIndicator) loadingIndicator.style.display = 'block';
  if (resultContainer) resultContainer.style.display = 'none';
  if (errorContainer) errorContainer.style.display = 'none';

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(query)}`);
    const result = await response.json();

    if (response.ok && result.success && result.data) {
      renderTrackerDetails(result.data);
      if (resultContainer) resultContainer.style.display = 'block';
    } else {
      if (errorContainer) {
        errorContainer.textContent = result.message || `No order found for "${query}"`;
        errorContainer.style.display = 'block';
      }
    }
  } catch (err) {
    console.error('Tracker fetch error:', err);
    if (errorContainer) {
      errorContainer.textContent = 'Unable to reach backend server. Please check if the server is running on port 5000.';
      errorContainer.style.display = 'block';
    }
  } finally {
    if (loadingIndicator) loadingIndicator.style.display = 'none';
  }
}

function renderTrackerDetails(order) {
  // Populate general info
  document.getElementById('trackResId').textContent = order.tracking_id;
  document.getElementById('trackResCustomer').textContent = order.customer_name;
  document.getElementById('trackResService').textContent = order.service_name;
  document.getElementById('trackResDelivery').textContent = order.delivery_date || 'In Schedule';
  document.getElementById('trackResPrice').textContent = `₹${(order.estimated_price || 0).toLocaleString('en-IN')}`;
  document.getElementById('trackResBalance').textContent = `₹${(order.balance_amount || 0).toLocaleString('en-IN')}`;
  document.getElementById('trackResNotes').textContent = order.notes || 'Bespoke tailoring as per Ambattur workshop standards.';

  // Status Badge
  const statusBadge = document.getElementById('trackResStatusBadge');
  if (statusBadge) {
    statusBadge.textContent = order.status;
    statusBadge.className = 'badge-status';
    if (order.status === 'Received') statusBadge.classList.add('status-received');
    else if (order.status === 'In-Stitching' || order.status === 'In-Cutting') statusBadge.classList.add('status-stitching');
    else if (order.status === 'Ready for Pickup' || order.status === 'Ready') statusBadge.classList.add('status-ready');
    else if (order.status === 'Completed') statusBadge.classList.add('status-completed');
    else if (order.status === 'Cancelled') statusBadge.classList.add('status-cancelled');
  }

  // 5-Step Timeline Render
  const timelineContainer = document.getElementById('trackTimelineTrack');
  if (timelineContainer && order.status_history) {
    timelineContainer.innerHTML = '';
    
    // Find current active index
    let currentIdx = -1;
    for (let i = order.status_history.length - 1; i >= 0; i--) {
      if (order.status_history[i].completed) {
        currentIdx = i;
        break;
      }
    }

    order.status_history.forEach((step, idx) => {
      const isCompleted = step.completed;
      const isCurrent = idx === currentIdx;
      
      const stepDiv = document.createElement('div');
      stepDiv.className = `timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`;
      stepDiv.innerHTML = `
        <div class="timeline-dot">
          ${isCompleted ? '✓' : (idx + 1)}
        </div>
        <div class="timeline-step-content">
          <div class="timeline-step-title">${step.step}</div>
          <div class="timeline-step-time">${step.timestamp !== 'Pending' ? `🕒 ${step.timestamp}` : 'Pending Master Tailor processing'}</div>
        </div>
      `;
      timelineContainer.appendChild(stepDiv);
    });
  }
}

/* ==========================================================================
   4. MODAL HELPERS & UTILITIES
   ========================================================================== */
window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
};

// Close modal on backdrop click or ESC key
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  }
});

// Toast notification helper
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

// Smooth anchor scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
