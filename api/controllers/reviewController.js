import Review from '../models/Review.js';

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { hotelId, rating, comment, userId } = req.body;
        console.log({ hotelId, rating, comment, userId })


        const newReview = new Review({
            userId,
            hotelId,
            rating,
            comment,
        });

        await newReview.save();
        res.status(200).json({ message: 'Review created successfully', review: newReview });
    } catch (err) {
        res.status(500).json({ error: 'Server error while creating review' });
    }
};

// Get all reviews for a hotel
export const getReviewsForListing = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const reviews = await Review.find({ hotelId: hotelId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);

    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });

    }
};

// Like a review
export const likeReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { userId } = req.body;
        console.log({ reviewId, userId });

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        // Toggle like: if already liked, remove the like; otherwise, add it
        if (review.likedBy.includes(userId)) {
            review.likedBy = review.likedBy.filter(id => id.toString() !== userId.toString());
            res.status(200).json({ message: 'Review unliked', likedBy: review.likedBy });
        } else {
            review.likedBy.push(userId);
            res.status(200).json({ message: 'Review liked', likedBy: review.likedBy });
        }

        await review.save();
    } catch (err) {
        res.status(500).json({ error: 'Failed to like/unlike review' });
    }
};

// Unlike a review
export const editReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        // const userId = req.user._id;
        const { rating, comment } = req.body; // Accept new rating and comment

        console.log({ reviewId, rating, comment });

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        // // Check if the user is the owner of the review
        // if (review.userId.toString() !== userId.toString()) {
        //     return res.status(403).json({ error: 'Not authorized to edit this review' });
        // }

        // Update the review's content
        if (rating) review.rating = rating; // Update rating if provided
        if (comment) review.comment = comment; // Update comment if provided

        await review.save();

        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update review' });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        // const userId = req.user._id;

        console.log({ reviewId });
        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        // if (review.user.toString() !== userId.toString()) {
        //     return res.status(403).json({ error: 'Not authorized to delete this review' });
        // }

        await review.deleteOne();
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete review' });
        console.log(err)

    }
};
