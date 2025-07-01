// routes/vendor.js
const express = require('express');
const router = express.Router();
const Vendor = require('../models/vendor');



// GET all vendors
router.get('/getall', async (req, res) => {
  try {
    const vendors = await Vendor.getAll(); //from the Vendor.js in model folder we are calling the getall method from there
    res.json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



// GET vendor by vendorId
// ✅ CORRECT
// /http://localhost:5000/api/vendors/getvendorByid/VEN7
router.get('/getvendorByid/:vendorId', async (req, res) => {
  const vendorId = req.params.vendorId;
  try {
    const vendor = await Vendor.getByVendorId(vendorId);
    if (!vendor) {
      return res.status(404).send('Vendor not found');
    }
    res.json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
})

// POST new vendor
router.post('/', async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).send('Vendor created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;