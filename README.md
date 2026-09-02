# ✂️ Ambattur Classic Tailors — Full-Stack Web Application

A complete, production-ready full-stack web application designed and built for **Ambattur Classic Tailors** (located on MTH Road, Opp. Rakki Cinemas, Ambattur OT, Chennai - 600053).

Built with a clean two-folder architecture:
- **`/backend`**: Node.js, Express, and persistent SQLite / JSON database with RESTful API routes & CORS.
- **`/frontend`**: HTML5, CSS3, Vanilla JavaScript with responsive bespoke styling, real-time INR (₹) price calculator, appointment booking, live order tracker, and an Admin Management Dashboard.

---

## 📁 Project Structure

```
├── backend/
│   ├── data/
│   │   ├── bookings.json       # Persistent data storage (auto-initialized with seed orders)
│   │   └── tailors.db          # SQLite database storage
│   ├── routes/
│   │   └── bookings.js         # RESTful API route controllers
│   ├── database.js             # SQLite / JSON storage engine with seed data
│   ├── package.json            # Backend dependencies (Express, CORS, SQLite3)
│   ├── seed.js                 # Seed database script with realistic Ambattur orders
│   └── server.js               # Express API server & static frontend host
├── frontend/
│   ├── css/
│   │   ├── style.css           # Storefront design system (Deep Navy, Emerald, Gold, Cream)
│   │   └── admin.css           # Admin dashboard & printable workshop cutting slips
│   ├── js/
│   │   ├── app.js              # Storefront logic (Price calculator, Bookings, Tracker)
│   │   └── admin.js            # Admin dashboard logic (KPIs, Status updater, Table filters)
│   ├── admin.html              # Dedicated Tailor Workshop Admin Dashboard
│   └── index.html              # Customer storefront & Live Order Tracker
├── package.json                # Root project orchestrator
├── start_fullstack.bat         # 1-Click Windows execution launcher
└── README.md                   # Complete documentation
```

---

## 🌟 Key Features

### 1. Customer Storefront (`/frontend/index.html` or `http://localhost:5000/`)
- **Brand Palette & Heritage**: Deep Navy Blue (`#0F172A`), Rich Emerald Green (`#047857`), Warm Gold accents (`#D97706`), Soft Cream (`#FDFBF7`). Realistic Ambattur landmarks (MTH Road, Rakki Cinemas, Ambattur OT Bus Terminus, TI Cycles, Mogappair, Ambattur Industrial Estate).
- **Dynamic Service & Cost Estimator (in INR ₹)**:
  - Gents Suit Stitching (₹4,500 – ₹8,500 for 2-Piece, 3-Piece, Royal Tuxedo, Blazer)
  - Formal Shirt & Trouser Combo (₹1,200)
  - Designer Blouse & Aari Work (₹1,500 – ₹4,000 for Princess Cut, Boat Neck, Heavy Bridal Zardosi)
  - Express 24-Hour Stitching option (+₹500 flat)
  - Fabric Supply Toggle (Customer Provided vs. Shop Sourced Raymonds / Italian Blend / Raw Silk)
  - Real-time reactive total calculation in ₹ with 1-click transfer to booking form.
- **Interactive Appointment Booking Form**:
  - Customer Name, 10-digit Phone, Measurement Preference (In-Shop, Sample Garment, Doorstep Master Tailor Visit, Standard Sizes), Date, and Styling Notes.
  - Submits asynchronously to `POST /api/bookings`.
  - Immediate Booking Success Modal with **Order Tracking ID** (e.g. `ACT-2026-1048`), 1-click clipboard copy, and **Direct WhatsApp Confirmation Link**.
- **Live 5-Step Order Status Tracker Modal**:
  - Enter Order ID (`ACT-xxxx`) or Phone Number to fetch real-time workshop status from backend.
  - Interactive 5-stage milestone tracker:
    1. *Order Booked & Confirmed*
    2. *Fabric Inspected & Cut*
    3. *Master Tailor In-Stitching*
    4. *Quality Check & Steam Ironing*
    5. *Ready for Pickup / Delivered*
  - Demo order chips included for instant 1-click previewing.

---

### 2. Workshop Admin Dashboard (`/frontend/admin.html` or `http://localhost:5000/admin.html`)
- **Live KPI Overview Cards**: Total Bookings, In-Cutting / Stitching, Ready for Pickup, and Projected Revenue (₹).
- **Search & Status Filtering**: Instant filter tabs (*All*, *Received*, *In-Stitching*, *Ready for Pickup*, *Completed*) + debounced customer/order search.
- **In-Place Status Updates**: Changing the dropdown updates the database via `PATCH /api/bookings/:id` instantly.
- **Direct WhatsApp Messaging**: 1-click button to message the customer with their order details pre-filled.
- **Master Tailor Workshop Job Sheet / Cutting Slip**: Printable voucher modal with measurements, notes, balance amounts, and signatures (`@media print` supported).
- **Counter Walk-in Order Entry**: Fast counter booking modal for customers visiting the Ambattur OT shop.

---

## 🚀 How to Run in VS Code

### Method 1: Double-Click Launcher (Windows)
Double-click `start_fullstack.bat` in the project root. It will start the Express server and launch the website in your browser.

### Method 2: Command Line (Node.js)

1. Open the project folder in VS Code.
2. Open a terminal (`Ctrl + \``) and install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
4. Access the web app:
   - **Storefront**: [http://localhost:5000](http://localhost:5000)
   - **Admin Portal**: [http://localhost:5000/admin.html](http://localhost:5000/admin.html)
   - **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Method 3: Running with VS Code "Live Server" Extension
If you prefer serving the frontend through VS Code Live Server (`http://127.0.0.1:5500`):
1. Start the backend in the terminal: `node backend/server.js`
2. Right-click `frontend/index.html` in VS Code ➔ **"Open with Live Server"**.
3. The frontend is pre-configured with full CORS support to seamlessly connect to `http://localhost:5000/api`.

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/stats` | Returns KPI metrics (total orders, in stitching, ready, revenue) |
| `GET` | `/bookings` | Returns all tailoring bookings (supports `?status=` & `?search=`) |
| `GET` | `/bookings/:id` | Returns single booking by Order ID (`ACT-xxxx`), DB ID, or Phone |
| `POST` | `/bookings` | Creates a new tailoring booking (returns tracking ID) |
| `PATCH` | `/bookings/:id` | Updates order stitching status, notes, or advance paid |
| `DELETE` | `/bookings/:id` | Deletes/cancels an order |
| `GET` | `/health` | Server healthcheck |

### Sample `POST /api/bookings` Request Body
```json
{
  "customer_name": "Karthik Subramanian",
  "phone": "9840123456",
  "email": "karthik.subbu@gmail.com",
  "service_name": "Gents Suit Stitching",
  "package_type": "3-Piece Wedding Suit (Navy Blue)",
  "fabric_option": "Customer Provided",
  "measurement_preference": "In-Shop Measurement (Ambattur OT)",
  "express_delivery": false,
  "estimated_price": 7500,
  "advance_paid": 3000,
  "appointment_date": "2026-09-04",
  "notes": "Peak lapel with satin lining for reception."
}
```

---

## 🧵 Seed Data Included
The application is pre-populated with realistic Chennai / Ambattur tailoring orders:
- **`ACT-2026-1042`**: 3-Piece Wedding Suit for Karthik Subramanian (*In-Stitching*)
- **`ACT-2026-1043`**: Bridal Antique Aari Work Blouse for Deepa Rajagopalan (*Ready for Pickup*)
- **`ACT-2026-1044`**: Executive Formal Shirt & Trouser (Express 24h) for Vijay Kumar (*Received*)
- **`ACT-2026-1045`**: Princess Cut Silk Blouse for Meenakshi Sundaram (*In-Stitching*)
- **`ACT-2026-1046`**: Classic Black Tuxedo for Saravanan Anand (*Ready for Pickup*)
- **`ACT-2026-1047`**: Pure Linen Shirts for Ramesh Chandran (*Completed*)

To reset seed data at any time:
```bash
node backend/seed.js
```
