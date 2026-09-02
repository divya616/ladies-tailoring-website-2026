const express = require('express');
const router = express.Router();
const db = require('../database');

/**
 * GET /api/stats
 * Return overall KPI metrics for Admin Dashboard
 */
router.get('/stats', (req, res) => {
  try {
    const stats = db.getStats();
    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute dashboard metrics',
      error: error.message
    });
  }
});

/**
 * GET /api/bookings
 * Fetch all booked appointments with optional status & search filtering
 */
router.get('/bookings', (req, res) => {
  try {
    const { status, search } = req.query;
    const bookings = db.getAllBookings({ status, search });
    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: error.message
    });
  }
});

/**
 * GET /api/bookings/:id
 * Track specific order status by Order ID (e.g. ACT-2026-1042), DB ID, or Phone Number
 */
router.get('/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID or phone number is required'
      });
    }

    const booking = db.getBookingById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No appointment or tailoring order found for "${id}". Please check your Order ID or contact Ambattur Classic Tailors.`
      });
    }

    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching single booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
  }
});

/**
 * POST /api/bookings
 * Create a new tailoring appointment booking
 */
router.post('/bookings', (req, res) => {
  try {
    const {
      customer_name,
      phone,
      email,
      service_name,
      package_type,
      fabric_option,
      measurement_preference,
      express_delivery,
      estimated_price,
      advance_paid,
      appointment_date,
      delivery_date,
      address_locality,
      notes
    } = req.body;

    // Validation
    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer Name is required'
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Valid 10-digit Phone Number is required'
      });
    }

    // Clean phone number (strip spaces/dashes)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number'
      });
    }

    // Auto-calculate suggested delivery date if not provided
    let calculatedDelivery = delivery_date;
    if (!calculatedDelivery && appointment_date) {
      const appt = new Date(appointment_date);
      const daysToAdd = express_delivery ? 1 : (service_name && service_name.includes('Suit') ? 5 : 3);
      appt.setDate(appt.getDate() + daysToAdd);
      calculatedDelivery = appt.toISOString().split('T')[0];
    }

    const newBooking = db.createBooking({
      customer_name,
      phone: cleanPhone,
      email,
      service_name: service_name || 'Gents Suit Stitching',
      package_type: package_type || 'Standard Bespoke Stitching',
      fabric_option: fabric_option || 'Customer Provided',
      measurement_preference: measurement_preference || 'In-Shop Measurement (Ambattur OT)',
      express_delivery: Boolean(express_delivery),
      estimated_price: Number(estimated_price) || 1200,
      advance_paid: Number(advance_paid) || 0,
      appointment_date: appointment_date || new Date().toISOString().split('T')[0],
      delivery_date: calculatedDelivery,
      address_locality: address_locality || 'Ambattur, Chennai',
      notes
    });

    return res.status(201).json({
      success: true,
      message: 'Tailoring appointment successfully booked!',
      tracking_id: newBooking.tracking_id,
      data: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create appointment booking',
      error: error.message
    });
  }
});

/**
 * PATCH /api/bookings/:id
 * Update stitching status (e.g., "Received", "In-Stitching", "Ready for Pickup", "Completed", "Cancelled")
 */
router.patch('/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const allowedStatuses = [
      'Received',
      'In-Cutting',
      'In-Stitching',
      'Ready for Pickup',
      'Completed',
      'Cancelled'
    ];

    if (updates.status && !allowedStatuses.includes(updates.status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
      });
    }

    const updated = db.updateBooking(id, updates);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Booking with ID "${id}" not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order status successfully updated to "${updated.status}"`,
      data: updated
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

/**
 * DELETE /api/bookings/:id
 * Delete or cancel a booking
 */
router.delete('/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = db.deleteBooking(id);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: `Booking with ID "${id}" not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Booking "${id}" successfully deleted.`
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: error.message
    });
  }
});

module.exports = router;
