// controllers/authController.js
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Helper function to create and send JWT token
const createSendToken = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

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
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        //const message = `Forgot your password? \nClick here to reset your password: \n\n${resetURL}.\n\nIf you didn't forget your password, please ignore this email!`;

        const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Reset</h2>
        <p>Forgot your password? Click the button below to reset your password.</p>
        <a href="${resetURL}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                  color: white; text-decoration: none; border-radius: 4px; 
                  margin: 15px 0; font-weight: bold;">
            Reset Password
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${resetURL}">${resetURL}</a></p>
        <p>If you didn't request this, please ignore this email.</p>
    </div>
`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset (valid for 10 min)',
                message: `Forgot your password? Click here to reset: ${resetURL}\n\nIf you didn't request this, please ignore this email.`,
                html: html
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