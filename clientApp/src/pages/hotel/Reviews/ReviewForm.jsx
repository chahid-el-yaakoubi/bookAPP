import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const ReviewForm = ({ onNewReview, onUpdateReview, reviewData, onCancel, onDeleteReview }) => {
    const navigate = useNavigate();
    const { state } = useContext(AuthContext);
    const user = state?.user;
    const { t } = useTranslation();
    const [reviewText, setReviewText] = useState(reviewData ? reviewData.text : '');
    const [rating, setRating] = useState(reviewData ? reviewData.rating : 0);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        setIsSubmitting(true);

        if (reviewText.length < 10) {
            setError(t('reviews.reviewMinLength'));
            setIsSubmitting(false);
            return;
        }

        if (rating === 0) {
            setError(t('reviews.ratingRequired', 'Please select a rating'));
            setIsSubmitting(false);
            return;
        }

        setError('');

        const reviewPayload = { comment: reviewText, rating };

        try {
            if (reviewData) {
                await onUpdateReview({ id: reviewData.id, ...reviewPayload });
            } else {
                await onNewReview(reviewPayload);
            }
        } catch (error) {
            setError(t('reviews.submitError', 'Failed to submit review. Please try again.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Login Required Overlay
    if (!user) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all">
                    <div className="w-16 h-16 bg-blue rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('auth.loginRequired') || 'Login Required'}
                    </h2>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {t('auth.loginToReview') || 'Please sign in to your account to leave a review and share your experience with other travelers.'}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="flex-1 bg-blue hover:bg-blue text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            {t('auth.login') || 'Sign In'}
                        </button>
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-all duration-200"
                        >
                            {t('auth.cancel') || 'Cancel'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {reviewData ? t('reviews.editReview') || 'Edit Review' : t('reviews.leaveAReview') || 'Write a Review'}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {reviewData 
                                    ? t('reviews.updateReviewDescription', 'Update your review and rating')
                                    : t('reviews.shareExperienceDescription', 'Share your experience to help others')
                                }
                            </p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Rating Section */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                {t('reviews.overallRating', 'Overall Rating')} <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`text-3xl transition-all duration-200 hover:scale-110 focus:outline-none ${
                                                star <= rating 
                                                    ? 'text-yellow-400 drop-shadow-sm' 
                                                    : 'text-gray-300 hover:text-yellow-300'
                                            }`}
                                            onClick={() => setRating(star)}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                {rating > 0 && (
                                    <div className="flex items-center ml-4 px-3 py-1 bg-yellow-50 rounded-full">
                                        <span className="text-sm font-medium text-yellow-800">
                                            {rating}/5 {rating === 1 ? 'Star' : 'Stars'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {rating === 0 && (
                                <p className="text-sm text-gray-500 mt-2">
                                    {t('reviews.selectRating', 'Please select your rating by clicking on the stars')}
                                </p>
                            )}
                        </div>

                        {/* Review Text Section */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                {t('reviews.yourReview', 'Your Review')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl resize-none focus:outline-none transition-all duration-200 ${
                                        error && reviewText.length < 10
                                            ? 'border-red-300 focus:border-red-500 bg-red-50'
                                            : 'border-gray-200 focus:border-blue bg-white'
                                    }`}
                                    placeholder={t('reviews.reviewPlaceholder') || 'Share your experience... What did you like most? Any suggestions for improvement? (minimum 10 characters)'}
                                    rows="5"
                                    maxLength="1000"
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                    {reviewText.length}/1000
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-sm text-gray-500">
                                    {reviewText.length < 10 
                                        ? `${10 - reviewText.length} more characters needed`
                                        : '✓ Minimum length reached'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-100">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200"
                                >
                                    {t('reviews.cancel') || 'Cancel'}
                                </button>

                                {reviewData && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (window.confirm(t('reviews.confirmDelete', 'Are you sure you want to delete this review?'))) {
                                                onDeleteReview(reviewData.id);
                                            }
                                        }}
                                        className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-all duration-200 flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        {t('reviews.removeReview') || 'Delete'}
                                    </button>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!rating || reviewText.length < 10 || isSubmitting}
                                className={`px-8 py-3 font-medium rounded-lg transition-all duration-200 flex items-center justify-center ${
                                    !rating || reviewText.length < 10 || isSubmitting
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue hover:bg-blue text-white shadow-sm hover:shadow-md'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {reviewData ? t('reviews.updating', 'Updating...') : t('reviews.submitting', 'Submitting...')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {reviewData ? t('reviews.updateReview') || 'Update Review' : t('reviews.submitReview') || 'Submit Review'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;