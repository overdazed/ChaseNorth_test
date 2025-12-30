const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('wishlist');
    
    res.status(200).json({
        success: true,
        count: user.wishlist.length,
        data: user.wishlist
    });
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    
    // Check if product is already in wishlist
    const user = await User.findById(req.user.id);
    if (user.wishlist.includes(productId)) {
        return res.status(400).json({
            success: false,
            message: 'Product already in wishlist'
        });
    }
    
    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();
    
    res.status(200).json({
        success: true,
        count: user.wishlist.length,
        data: user.wishlist
    });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    
    const user = await User.findById(req.user.id);
    
    // Check if product is in wishlist
    if (!user.wishlist.includes(productId)) {
        return res.status(400).json({
            success: false,
            message: 'Product not in wishlist'
        });
    }
    
    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    
    res.status(200).json({
        success: true,
        count: user.wishlist.length,
        data: user.wishlist
    });
});

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
exports.checkWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    
    const user = await User.findById(req.user.id);
    const isInWishlist = user.wishlist.some(id => id.toString() === productId);
    
    res.status(200).json({
        success: true,
        isInWishlist
    });
});
