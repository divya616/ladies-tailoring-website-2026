const fs = require('fs');
const path = require('path');

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const JSON_FILE_PATH = path.join(DATA_DIR, 'bookings.json');
const SQLITE_DB_PATH = path.join(DATA_DIR, 'tailors.db');

// Realistic Ambattur Tailoring Initial Seed Data
const DEFAULT_SEED_BOOKINGS = [
  {
    id: 1,
    tracking_id: "ACT-2026-1042",
    customer_name: "Karthik Subramanian",
    phone: "9840123456",
    email: "karthik.subbu@gmail.com",
    service_name: "Gents Suit Stitching",
    package_type: "3-Piece Wedding Suit (Navy Blue)",
    fabric_option: "Customer Provided (Raymonds Italian Blend)",
    measurement_preference: "In-Shop Measurement (Ambattur OT)",
    express_delivery: false,
    estimated_price: 7500,
    advance_paid: 3000,
    balance_amount: 4500,
    status: "In-Stitching",
    status_history: [
      { step: "Order Booked & Confirmed", timestamp: "2026-08-28 10:30 AM", completed: true },
      { step: "Fabric Inspected & Cut", timestamp: "2026-08-29 02:15 PM", completed: true },
      { step: "Master Tailor In-Stitching", timestamp: "2026-08-30 11:00 AM", completed: true },
      { step: "Quality Check & Steam Ironing", timestamp: "Pending", completed: false },
      { step: "Ready for Pickup / Delivered", timestamp: "Pending", completed: false }
    ],
    appointment_date: "2026-09-04",
    delivery_date: "2026-09-06",
    address_locality: "Near Rakki Cinemas, Ambattur OT, Chennai",
    notes: "Peak lapel with hand pick-stitching, double vent, navy jacquard lining for reception.",
    created_at: "2026-08-28T05:00:00.000Z"
  },
  {
    id: 2,
    tracking_id: "ACT-2026-1043",
    customer_name: "Deepa Rajagopalan",
    phone: "9444098765",
    email: "deepa.raj@outlook.com",
    service_name: "Designer Blouse & Aari Work",
    package_type: "Bridal Antique Zardosi Peacock Motif",
    fabric_option: "Customer Provided (Kanchipuram Silk)",
    measurement_preference: "Sample Fitting Blouse Given",
    express_delivery: false,
    estimated_price: 3800,
    advance_paid: 2000,
    balance_amount: 1800,
    status: "Ready for Pickup",
    status_history: [
      { step: "Order Booked & Confirmed", timestamp: "2026-08-27 11:00 AM", completed: true },
      { step: "Fabric Inspected & Cut", timestamp: "2026-08-28 09:30 AM", completed: true },
      { step: "Master Tailor In-Stitching", timestamp: "2026-08-29 04:00 PM", completed: true },
      { step: "Quality Check & Steam Ironing", timestamp: "2026-08-31 03:30 PM", completed: true },
      { step: "Ready for Pickup / Delivered", timestamp: "2026-08-31 06:00 PM", completed: true }
    ],
    appointment_date: "2026-08-27",
    delivery_date: "2026-09-01",
    address_locality: "Varadarajapuram, Ambattur, Chennai",
    notes: "Heavy hand Aari embroidery with antique beads, matching Latkan tassels included.",
    created_at: "2026-08-27T05:30:00.000Z"
  },
  {
    id: 3,
    tracking_id: "ACT-2026-1044",
    customer_name: "Vijay Kumar",
    phone: "9884155678",
    email: "vijay.k@tcs.com",
    service_name: "Formal Shirt & Trouser",
    package_type: "Executive Slim Fit (2 Shirt + 2 Trouser)",
    fabric_option: "Shop Provided Premium Cotton & Poly-Viscose",
    measurement_preference: "Doorstep Master Tailor Visit (Mogappair West)",
    express_delivery: true,
    estimated_price: 2900,
    advance_paid: 1500,
    balance_amount: 1400,
    status: "Received",
    status_history: [
      { step: "Order Booked & Confirmed", timestamp: "2026-09-01 09:00 AM", completed: true },
      { step: "Fabric Inspected & Cut", timestamp: "Pending", completed: false },
      { step: "Master Tailor In-Stitching", timestamp: "Pending", completed: false },
      { step: "Quality Check & Steam Ironing", timestamp: "Pending", completed: false },
      { step: "Ready for Pickup / Delivered", timestamp: "Pending", completed: false }
    ],
    appointment_date: "2026-09-02",
    delivery_date: "2026-09-03",
    address_locality: "Near Dunlop Bridge, Ambattur, Chennai",
    notes: "Express 24-hour stitching (+₹500 applied) required for IT client presentation.",
    created_at: "2026-09-01T03:30:00.000Z"
  },
  {
    id: 4,
    tracking_id: "ACT-2026-1045",
    customer_name: "Meenakshi Sundaram",
    phone: "9791011223",
    email: "meena.sundar@yahoo.com",
    service_name: "Designer Blouse & Aari Work",
    package_type: "Princess Cut with Boat Neck & Potli Buttons",
    fabric_option: "Customer Provided (Raw Silk)",
    measurement_preference: "In-Shop Measurement (Ambattur OT)",
    express_delivery: false,
    estimated_price: 1800,
    advance_paid: 1000,
    balance_amount: 800,
    status: "In-Stitching",
    status_history: [
      { step: "Order Booked & Confirmed", timestamp: "2026-08-30 04:30 PM", completed: true },
      { step: "Fabric Inspected & Cut", timestamp: "2026-08-31 10:00 AM", completed: true },
      { step: "Master Tailor In-Stitching", timestamp: "2026-09-01 01:15 PM", completed: true },
      { step: "Quality Check & Steam Ironing", timestamp: "Pending", completed: false },
      { step: "Ready for Pickup / Delivered", timestamp: "Pending", completed: false }
    ],
    appointment_date: "2026-08-30",
    delivery_date: "2026-09-03",
    address_locality: "MTH Road, Ambattur OT, Chennai",
    notes: "Deep back neck with handcrafted fabric potli buttons and contrast gold piping.",
    created_at: "2026-08-30T11:00:00.000Z"
  },
  {
    id: 5,
    tracking_id: "ACT-2026-1046",
    customer_name: "Saravanan Anand",
    phone: "9841277890",
    email: "saravanan.a@gmail.com",
    service_name: "Gents Suit Stitching",
    package_type: "Classic Black Tuxedo & Satin Lapel",
    fabric_option: "Shop Provided Premium Suiting",
    measurement_preference: "In-Shop Measurement (Ambattur OT)",
    express_delivery: false,
    estimated_price: 8500,
    advance_paid: 4000,
    balance_amount: 4500,
    status: "Ready for Pickup",
    status_history: [
      { step: "Order Booked & Confirmed", timestamp: "2026-08-25 12:00 PM", completed: true },
      { step: "Fabric Inspected & Cut", timestamp: "2026-08-26 11:30 AM", completed: true },
      { step: "Master Tailor In-Stitching", timestamp: "2026-08-27 02:00 PM", completed: true },
      { step: "Quality Check & Steam Ironing", timestamp: "2026-08-29 05:00 PM", completed: true },
      { step: "Ready for Pickup / Delivered", timestamp: "2026-08-30 10:00 AM", completed: true }
    ],
    appointment_date: "2026-08-25",
    delivery_date: "2026-08-30",
    address_locality: "Ambattur Industrial Estate 3rd Main Road, Chennai",
    notes: "Black shawl collar in midnight black satin with pleated tuxedo trousers.",
    created_at: "2026-08-25T06:30:00.000Z"
  },
  {
    id: 6,
    tracking_id: "ACT-2026-1047",
    customer_name: "Ramesh Chandran",
    phone: "9840844321",
    email: "ramesh.c@gmail.com",
    service_name: "Formal Shirt & Trouser",
    package_type: "Pure Linen Shirts (3 Quantity)",
    fabric_option: "Customer Provided (Linen Club)",
    measurement_preference: "Standard Fit (Size 40)",
    express_delivery: false,
    estimated_price: 2250,
    advance_paid: 2250,
    balance_amount: 0,
    status: "Completed",
    status_history: [
      { step: "Order Booked & Confirmed", timestamp: "2026-08-20 10:00 AM", completed: true },
      { step: "Fabric Inspected & Cut", timestamp: "2026-08-21 11:00 AM", completed: true },
      { step: "Master Tailor In-Stitching", timestamp: "2026-08-22 03:00 PM", completed: true },
      { step: "Quality Check & Steam Ironing", timestamp: "2026-08-23 04:00 PM", completed: true },
      { step: "Ready for Pickup / Delivered", timestamp: "2026-08-24 11:00 AM", completed: true }
    ],
    appointment_date: "2026-08-20",
    delivery_date: "2026-08-24",
    address_locality: "TI Cycles Quarters, Ambattur, Chennai",
    notes: "Order delivered and paid in full via UPI. Customer very satisfied with fit.",
    created_at: "2026-08-20T04:30:00.000Z"
  }
];

// Helper to read data safely
function readJSON() {
  try {
    if (!fs.existsSync(JSON_FILE_PATH)) {
      fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(DEFAULT_SEED_BOOKINGS, null, 2), 'utf-8');
      return DEFAULT_SEED_BOOKINGS;
    }
    const data = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : DEFAULT_SEED_BOOKINGS;
  } catch (err) {
    console.error('Error reading JSON store:', err);
    return DEFAULT_SEED_BOOKINGS;
  }
}

// Helper to write data safely
function writeJSON(data) {
  try {
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing JSON store:', err);
    return false;
  }
}

// Initialize database on boot
function initDB() {
  if (!fs.existsSync(JSON_FILE_PATH)) {
    writeJSON(DEFAULT_SEED_BOOKINGS);
    console.log('✅ Ambattur Classic Tailors database initialized with realistic Chennai seed records.');
  } else {
    console.log('✅ Ambattur Classic Tailors database loaded.');
  }
}

// Generate sequential Tracking ID e.g. ACT-2026-1048
function generateTrackingId(existingList) {
  const year = new Date().getFullYear();
  const maxNumber = existingList.reduce((max, item) => {
    if (item.tracking_id && item.tracking_id.startsWith(`ACT-${year}-`)) {
      const num = parseInt(item.tracking_id.split('-')[2], 10);
      return !isNaN(num) && num > max ? num : max;
    }
    return max;
  }, 1047);
  return `ACT-${year}-${maxNumber + 1}`;
}

// Build 5-step status timeline based on status
function buildStatusTimeline(currentStatus) {
  const steps = [
    "Order Booked & Confirmed",
    "Fabric Inspected & Cut",
    "Master Tailor In-Stitching",
    "Quality Check & Steam Ironing",
    "Ready for Pickup / Delivered"
  ];

  let completedUpTo = 0;
  if (currentStatus === "Received" || currentStatus === "Pending") completedUpTo = 1;
  else if (currentStatus === "In-Cutting" || currentStatus === "Fabric Received") completedUpTo = 2;
  else if (currentStatus === "In-Stitching") completedUpTo = 3;
  else if (currentStatus === "Ready for Pickup" || currentStatus === "Ready") completedUpTo = 4;
  else if (currentStatus === "Completed" || currentStatus === "Delivered") completedUpTo = 5;
  else if (currentStatus === "Cancelled") completedUpTo = 0;

  const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' });

  return steps.map((stepName, idx) => ({
    step: stepName,
    completed: idx < completedUpTo,
    timestamp: idx < completedUpTo ? (idx === completedUpTo - 1 ? nowStr : "Completed") : "Pending"
  }));
}

// Database API Methods
const db = {
  getAllBookings({ status, search } = {}) {
    let bookings = readJSON();
    
    if (status && status !== 'all') {
      const lowerStatus = status.toLowerCase();
      bookings = bookings.filter(b => b.status.toLowerCase() === lowerStatus);
    }

    if (search) {
      const query = search.trim().toLowerCase();
      bookings = bookings.filter(b => 
        (b.customer_name && b.customer_name.toLowerCase().includes(query)) ||
        (b.phone && b.phone.includes(query)) ||
        (b.tracking_id && b.tracking_id.toLowerCase().includes(query)) ||
        (b.service_name && b.service_name.toLowerCase().includes(query))
      );
    }

    // Sort newest first
    return bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getBookingById(idOrTrackingOrPhone) {
    const bookings = readJSON();
    const query = String(idOrTrackingOrPhone).trim().toLowerCase();
    
    return bookings.find(b => 
      String(b.id) === query ||
      (b.tracking_id && b.tracking_id.toLowerCase() === query) ||
      (b.phone && b.phone.toLowerCase() === query)
    ) || null;
  },

  createBooking(bookingData) {
    const bookings = readJSON();
    const newId = bookings.length > 0 ? Math.max(...bookings.map(b => Number(b.id) || 0)) + 1 : 1;
    const tracking_id = generateTrackingId(bookings);

    const price = Number(bookingData.estimated_price) || 1200;
    const advance = Number(bookingData.advance_paid) || 0;
    const balance = Math.max(0, price - advance);

    const newBooking = {
      id: newId,
      tracking_id: tracking_id,
      customer_name: bookingData.customer_name ? bookingData.customer_name.trim() : 'Walk-in Customer',
      phone: bookingData.phone ? bookingData.phone.trim() : '',
      email: bookingData.email ? bookingData.email.trim() : '',
      service_name: bookingData.service_name || 'Gents Suit Stitching',
      package_type: bookingData.package_type || 'Standard Custom Stitching',
      fabric_option: bookingData.fabric_option || 'Customer Provided',
      measurement_preference: bookingData.measurement_preference || 'In-Shop Measurement (Ambattur OT)',
      express_delivery: Boolean(bookingData.express_delivery),
      estimated_price: price,
      advance_paid: advance,
      balance_amount: balance,
      status: bookingData.status || 'Received',
      status_history: buildStatusTimeline(bookingData.status || 'Received'),
      appointment_date: bookingData.appointment_date || new Date().toISOString().split('T')[0],
      delivery_date: bookingData.delivery_date || '',
      address_locality: bookingData.address_locality || 'Ambattur, Chennai',
      notes: bookingData.notes ? bookingData.notes.trim() : '',
      created_at: new Date().toISOString()
    };

    bookings.unshift(newBooking);
    writeJSON(bookings);
    return newBooking;
  },

  updateBooking(idOrTracking, updates) {
    const bookings = readJSON();
    const query = String(idOrTracking).trim().toLowerCase();
    const index = bookings.findIndex(b => 
      String(b.id) === query ||
      (b.tracking_id && b.tracking_id.toLowerCase() === query)
    );

    if (index === -1) return null;

    const existing = bookings[index];

    // If status is changed, update timeline
    let status_history = existing.status_history;
    if (updates.status && updates.status !== existing.status) {
      status_history = buildStatusTimeline(updates.status);
    }

    const updatedPrice = updates.estimated_price !== undefined ? Number(updates.estimated_price) : existing.estimated_price;
    const updatedAdvance = updates.advance_paid !== undefined ? Number(updates.advance_paid) : existing.advance_paid;
    const updatedBalance = Math.max(0, updatedPrice - updatedAdvance);

    const updatedBooking = {
      ...existing,
      ...updates,
      estimated_price: updatedPrice,
      advance_paid: updatedAdvance,
      balance_amount: updatedBalance,
      status_history: status_history,
      updated_at: new Date().toISOString()
    };

    bookings[index] = updatedBooking;
    writeJSON(bookings);
    return updatedBooking;
  },

  deleteBooking(idOrTracking) {
    const bookings = readJSON();
    const query = String(idOrTracking).trim().toLowerCase();
    const initialLength = bookings.length;
    const filtered = bookings.filter(b => 
      String(b.id) !== query &&
      !(b.tracking_id && b.tracking_id.toLowerCase() === query)
    );

    if (filtered.length === initialLength) return false;

    writeJSON(filtered);
    return true;
  },

  getStats() {
    const bookings = readJSON();
    const totalOrders = bookings.length;
    const inStitching = bookings.filter(b => b.status === 'In-Stitching' || b.status === 'In-Cutting').length;
    const readyForPickup = bookings.filter(b => b.status === 'Ready for Pickup' || b.status === 'Ready').length;
    const completed = bookings.filter(b => b.status === 'Completed').length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.estimated_price) || 0), 0);
    const totalAdvanceCollected = bookings.reduce((sum, b) => sum + (Number(b.advance_paid) || 0), 0);

    return {
      totalOrders,
      inStitching,
      readyForPickup,
      completed,
      totalRevenue,
      totalAdvanceCollected
    };
  },

  resetSeed() {
    writeJSON(DEFAULT_SEED_BOOKINGS);
    return DEFAULT_SEED_BOOKINGS;
  }
};

// Initialize on require
initDB();

module.exports = db;
