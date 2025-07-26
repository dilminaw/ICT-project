import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Validation middleware
const validateProfileUpdate = [
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters'),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender option'),
  body('dateOfBirth').optional().isISO8601().withMessage('Please enter a valid date of birth')
];

const validatePreferences = [
  body('notifications.email').optional().isBoolean().withMessage('Email notification must be boolean'),
  body('notifications.push').optional().isBoolean().withMessage('Push notification must be boolean'),
  body('notifications.sms').optional().isBoolean().withMessage('SMS notification must be boolean'),
  body('privacy.shareData').optional().isBoolean().withMessage('Share data must be boolean'),
  body('privacy.publicProfile').optional().isBoolean().withMessage('Public profile must be boolean'),
  body('theme').optional().isIn(['light', 'dark', 'auto']).withMessage('Invalid theme option')
];

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  res.json({
    success: true,
    data: {
      user
    }
  });
}));

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', validateProfileUpdate, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { firstName, lastName, gender, dateOfBirth, emergencyContact } = req.body;
  
  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (gender) updateData.gender = gender;
  if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
  if (emergencyContact) updateData.emergencyContact = emergencyContact;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user
    }
  });
}));

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', validatePreferences, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { notifications, privacy, theme } = req.body;
  
  const updateData = {};
  if (notifications) updateData['preferences.notifications'] = notifications;
  if (privacy) updateData['preferences.privacy'] = privacy;
  if (theme) updateData['preferences.theme'] = theme;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Preferences updated successfully',
    data: {
      user
    }
  });
}));

// @route   PUT /api/users/password
// @desc    Change password
// @access  Private
router.put('/password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  
  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      error: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', [
  body('password').notEmpty().withMessage('Password is required for account deletion')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { password } = req.body;

  const user = await User.findById(req.user._id);
  
  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      error: 'Password is incorrect'
    });
  }

  // Deactivate account instead of deleting (for data retention)
  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'Account deactivated successfully'
  });
}));

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  // This would typically aggregate data from emotion records
  // For now, return basic user stats
  
  const user = await User.findById(req.user._id);
  const daysSinceRegistration = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));

  res.json({
    success: true,
    data: {
      stats: {
        daysSinceRegistration,
        lastLogin: user.lastLogin,
        accountStatus: user.isActive ? 'active' : 'inactive',
        memberSince: user.createdAt
      }
    }
  });
}));

export default router; 