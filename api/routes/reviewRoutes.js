import express from 'express';
import {
  createReview,
  getReviewsForListing,
  likeReview,
  editReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', verifyUser, createReview);

router.put('/:reviewId',verifyUser, editReview);


// @route   GET /api/reviews/listing/:listingId
// @desc    Get all reviews for a listing
// @access  Public
router.get('/listing/:hotelId',verifyUser, getReviewsForListing);

// @route   POST /api/reviews/:reviewId/like
// @desc    Like a review
// @access  Private
router.post('/:reviewId/like',verifyUser, likeReview);

// @route   POST /api/reviews/:reviewId/unlike
// @desc    Unlike a review
// @access  Private

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete a review
// @access  Private (only review owner)
router.delete('/:reviewId',verifyUser, deleteReview);

export default router;
