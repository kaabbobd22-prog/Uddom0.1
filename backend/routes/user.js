const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('wishlist', 'name images price');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update profile (name, phone, avatar)
router.put('/:id', async (req, res) => {
    try {
        const { name, phone, avatar } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { name, phone, avatar },
            { new: true }
        ).select('-password');
        res.json({ success: true, user: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST add address
router.post('/:id/address', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.addresses.push(req.body);
        const updated = await user.save();
        const obj = updated.toObject();
        delete obj.password;
        res.json({ success: true, user: obj });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE address
router.delete('/:id/address/:addressId', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.addresses = user.addresses.filter(a => String(a._id) !== req.params.addressId);
        const updated = await user.save();
        const obj = updated.toObject();
        delete obj.password;
        res.json({ success: true, user: obj });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST toggle wishlist (add/remove product)
router.post('/:id/wishlist/:productId', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const pid = req.params.productId;
        const idx = user.wishlist.findIndex(id => String(id) === pid);
        if (idx > -1) {
            user.wishlist.splice(idx, 1); // remove
        } else {
            user.wishlist.push(pid);       // add
        }
        await user.save();
        res.json({ success: true, wishlist: user.wishlist });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;