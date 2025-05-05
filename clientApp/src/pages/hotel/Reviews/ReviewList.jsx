// ReviewList.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const ReviewList = ({ reviews, onLike, currentUserId }) => {
    const { t, i18n } = useTranslation(); // Initialize translation function
    const isRTL = i18n.dir() === 'rtl'; // Check if the language is RTL

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8  px-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{t('reviews.review.firstReviewPrompt')}</h3>
                <p className="text-gray-600 mb-4">{t('reviews.review.feedbackMatters')}</p>
                <button className="bg-blue hover:bg-blue text-white font-medium py-2 px-4 rounded transition duration-200">
                    {t('reviews.review.writeAReview')}
                </button>
            </div>
        );
    }

    // Helper function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className={`space-y-6 overflow-y-auto max-h-[70vh]  p-4 md:p-0  `} dir='ltr'>
            <div className="flex justify-between items-center mb-4">

            </div>

            <div className={`bg-orange-500 border rounded-t-lg p-4 mb-4 `} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="flex items-start">
                    <div className="text-blue mx-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div >
                        <p className="text-sm md:text-lg text-black">{t('reviews.feedbackMatters')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((review, index) => {
                    const isLikedByUser = review.likedBy?.includes(currentUserId);
                    const isLastOdd = index === reviews.length - 1 && reviews.length % 2 === 1;
                    const isFirstReview = index === 0;

                    return (
                        <div
                            key={review._id}
                            className={`border rounded-lg p-4 bg-blue/10 shadow-sm hover:shadow-md transition-shadow duration-300 ${isFirstReview ? 'md:col-span-2' : ''} `}
                        >
                            <div className="flex justify-between">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                        {review.userId?.username?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{review.userId?.username || t('reviews.anonymous')}</h3>
                                        <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="bg-blue text-white px-2 py-1 rounded text-sm">
                                        {review.rating} ★
                                    </div>
                                </div>
                            </div>

                            <p className="mt-3 text-gray-700">{review.comment}</p>

                            <div className="mt-4 flex items-center justify-between">
                                <button
                                    onClick={() => onLike(review._id)}
                                    className={`flex items-center text-sm ${isLikedByUser ? 'text-blue' : 'text-gray-500'} hover:text-blue`}
                                    disabled={!currentUserId}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        viewBox="0 0 20 20"
                                        fill={isLikedByUser ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        strokeWidth={isLikedByUser ? "0" : "1.5"}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>
                                        {review.likedBy?.length || 0} {review.likedBy?.length === 1 ? t('reviews.person') : t('reviews.people')} {t('reviews.foundHelpful')}
                                    </span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReviewList;