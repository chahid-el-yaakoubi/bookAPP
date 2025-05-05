import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../contextApi/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const ReviewForm = ({ onNewReview, onUpdateReview, reviewData, onCancel, onDeleteReview }) => {
    const navigate = useNavigate();
    const { state } = useContext(AuthContext);
    const user = state?.user;
    const { t } = useTranslation();
    const [reviewText, setReviewText] = useState(reviewData ? reviewData.text : '');
    const [rating, setRating] = useState(reviewData ? reviewData.rating : 0);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        if (reviewText.length < 10) {
            setError(t('reviews.reviewMinLength'));
            return;
        }

        setError('');

        const reviewPayload = { comment: reviewText, rating };

        if (reviewData) {
            onUpdateReview({ id: reviewData.id, ...reviewPayload });
        } else {
            onNewReview(reviewPayload);
        }
    };

    // If user is not logged in, show login message and button
    if (!user) {
        return (
            <div className="bg-black absolute inset-0 bg-opacity-35">
                <div className="bg-primary/90 shadow-lg rounded-lg p-6 mb-4 absolute top-1/3 left-1/4 right-1/4 flex flex-col items-center">
                    <h2 className="text-xl font-semibold my-4 text-red-300">
                        {t('auth.loginRequired') || 'Login Required'}
                    </h2>
                    <p className="text-center mb-6 text-white text-xl">
                        {t('auth.loginToReview') || 'Please login to leave a review'}
                    </p>
                    <div className="flex gap-10">
                        <button
                            onClick={() => {
                                navigate('/login', '_blank')
                            }}
                            className="bg-blue hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition duration-200"
                        >
                            {t('auth.login') || 'Login Now'}
                        </button>
                        <button
                            onClick={onCancel}
                            className="bg-blue hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition duration-200"
                        >
                            {t('auth.cancel') || 'Cancel'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black absolute inset-0 bg-opacity-35">
            <div className="bg-primary shadow-lg rounded-lg p-6 mb-4 absolute top-0 left-10 right-10">
                <h2 className="text-xl font-semibold my-4 text-blue">
                    {reviewData ? t('reviews.editReview') || 'Edit Review' : t('reviews.leaveAReview') || 'Leave a Review'}
                </h2>

                <div className="flex items-center mb-4 mt-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`cursor-pointer text-4xl hover:scale-110 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </span>
                    ))}
                    {rating > 0 && (
                        <span className="ml-2 text-gray-100">({rating}/5)</span>
                    )}
                </div>

                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="border p-2 w-full mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                    placeholder={t('reviews.reviewPlaceholder') || 'Write your review here (minimum 10 characters)'}
                    rows="4"
                />

                {error && (
                    <p className="text-red-500 mt-2">{error}</p>
                )}

                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded transition duration-200"
                    >
                        {t('reviews.cancel') || 'Cancel'}
                    </button>

                    {reviewData && (
                        <button
                            type="button"
                            onClick={() => onDeleteReview(reviewData.id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-200"
                        >
                            {t('reviews.removeReview') || 'Remove Review'}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-blue hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
                        disabled={!rating || reviewText.length < 10}
                    >
                        {reviewData ? t('reviews.updateReview') || 'Update Review' : t('reviews.submitReview') || 'Submit Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;