// import express
const express = require("express");
// import the product model
const Product = require("../models/Product");
// import the protect middleware
const { protect, admin } = require("../middleware/authMiddleware");

// initialize router
const router = express.Router();

// Create a route to retrieve a list of all products in the system
// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin, only admin can get all products
router.get("/", protect, admin, async (req, res) => {
    try {
        // Fetch all products found in the database
        const products = await Product.find({});
        // send a list of products back in response
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
});

// export the router
module.exports = router;

// include the following routes in server.js

// Create a new collection "Admin Product" > name it "Products" > GET > URL:http://localhost:9000/api/admin/products
// Authorisation > Bearer > Token copy from Admin Login request
// You can see a 200 status code and all products as Array