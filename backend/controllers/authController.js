// controllers/authController.js
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        // 1) Get user based on POSTed email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // Don't reveal if the user exists or not
            return res.status(200).json({
                status: 'success',
                message: 'If an account exists with this email, you will receive a password reset link.'
            });
        }

        // 2) Generate the random reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // 3) Send it to user's email
        const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                message
            });

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!'
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return next(new Error('There was an error sending the email. Try again later!'));
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Reset password
// @route   PATCH /api/users/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        // 1) Get user based on the token
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        // 2) If token has not expired, and there is user, set the new password
        if (!user) {
            return next(new Error('Token is invalid or has expired'));
        }

        // 3) Update changedPasswordAt property for the user
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // 4) Log the user in, send JWT
        createSendToken(user, 200, res);
    } catch (err) {
        next(err);
    }
};