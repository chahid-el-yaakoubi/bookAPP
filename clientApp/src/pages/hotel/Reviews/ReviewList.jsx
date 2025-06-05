import React from 'react';
import { Heart, Star, Info, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Mock translation function for demo
const mockTranslation = {
    'reviews.review.firstReviewPrompt': 'Be the first to share your experience',
    'reviews.review.feedbackMatters': 'Your feedback helps others make informed decisions',
    'reviews.review.writeAReview': 'Write a Review',
    'reviews.feedbackMatters': 'Help others by sharing your honest experience and feedback',
    'reviews.anonymous': 'Anonymous User',
    'reviews.person': 'person',
    'reviews.people': 'people',
    'reviews.foundHelpful': 'found this helpful'
};

const ReviewList = ({ reviews = [], onLike = () => { }, currentUserId = "user1" }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    if (!reviews || reviews.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center py-12 px-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">{t('reviews.review.firstReviewPrompt')}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{t('reviews.review.feedbackMatters')}</p>
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        {t('reviews.review.writeAReview')}
                    </button>
                </div>
            </div>
        );
    }

    // Helper function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Generate star rating display
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`}
            />
        ));
    };

    // Mock data for demo
    const mockReviews = reviews.length > 0 ? reviews : [
        {
            _id: '1',
            userId: { username: 'Sarah Johnson' },
            rating: 5,
            comment: 'Absolutely fantastic experience! The service exceeded my expectations and I would definitely recommend this to anyone looking for quality and reliability.',
            createdAt: '2024-01-15',
            likedBy: ['user2', 'user3', 'user4']
        },
        {
            _id: '2',
            userId: { username: 'Michael Chen' },
            rating: 4,
            comment: 'Great overall experience with minor room for improvement in delivery time.',
            createdAt: '2024-01-10',
            likedBy: ['user1', 'user2']
        },
        {
            _id: '3',
            userId: { username: 'Emma Davis' },
            rating: 5,
            comment: 'Outstanding quality and customer service. Will definitely be coming back!',
            createdAt: '2024-01-08',
            likedBy: ['user1']
        },
        {
            _id: '4',
            userId: { username: 'Alex Rodriguez' },
            rating: 4,
            comment: 'Very satisfied with the purchase. Good value for money and quick delivery.',
            createdAt: '2024-01-05',
            likedBy: ['user2', 'user3']
        }
    ];

    const displayReviews = reviews.length > 0 ? reviews : mockReviews;

    return (
        <div className="max-w-6xl mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header Info Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <Info className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-slate-700 font-medium leading-relaxed">{t('reviews.feedbackMatters')}</p>
                    </div>
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayReviews.map((review, index) => {
                    const isLikedByUser = review.likedBy?.includes(currentUserId);
                    const isFirstReview = index === 0;

                    return (
                        <div
                            key={review._id}
                            className={`group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${isFirstReview ? 'lg:col-span-2 bg-gradient-to-br from-slate-50 to-white border-slate-300' : ''
                                }`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700 shadow-inner">
                                        {review.userId?.username?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">{review.userId?.username || t('reviews.anonymous')}</h3>
                                        <p className="text-sm text-slate-500">{formatDate(review.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        {renderStars(review.rating)}
                                    </div>
                                    <span className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {review.rating}.0
                                    </span>
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="mb-6">
                                <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => onLike(review._id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isLikedByUser
                                            ? 'bg-red-50 text-red-600 border border-red-200'
                                            : 'text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200'
                                        }`}
                                    disabled={!currentUserId}
                                >
                                    <Heart
                                        className={`w-4 h-4 transition-all duration-200 ${isLikedByUser ? 'fill-current' : ''
                                            }`}
                                    />
                                    <span className="text-sm font-medium">
                                        {review.likedBy?.length || 0} {review.likedBy?.length === 1 ? t('reviews.person') : t('reviews.people')} {t('reviews.foundHelpful')}
                                    </span>
                                </button>

                                <div className="text-sm text-slate-400">
                                    Helpful review
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Load More Button */}
            {displayReviews.length > 4 && (
                <div className="text-center mt-8">
                    <button className="bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                        Load More Reviews
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;