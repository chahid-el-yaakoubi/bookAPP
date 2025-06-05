// HomeReviews.js
import React, { useState, useEffect, useContext } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { createReview, getReviewsForListing, likeReview, updateReview, deleteReview } from '../../../Lib/api';
import { AuthContext } from '../../../contexts/AuthContext';
import ReviewSlider from './ReviewSlider';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export const HomeReviews = ({ inModal, onClose }) => {
    const {id} = useParams();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    const { state } = useContext(AuthContext);
    const user = state?.user;
    const logined = user ? true : false;
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [reviewData, setReviewData] = useState(null);
    const [showFullReviews, setShowFullReviews] = useState(inModal);
    const listingId = id;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await getReviewsForListing(listingId);
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setErrorMessage(t('reviews.loadReviewsFailed'));
            }
        };
        fetchReviews();
    }, [listingId, t]);

    useEffect(() => {
        document.body.style.overflow = showReviewForm ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showReviewForm]);

    const userReview = user ? reviews.find(review => review.userId._id === user.id) : null;

    const handleReview = async (review) => {
        try {
            const reviewData = {
                userId: user.id,
                hotelId: listingId,
                rating: review.rating,
                comment: review.comment,
            };

            let res;
            if (review.id) {
                res = await updateReview(review.id, reviewData);
            } else {
                res = await createReview(reviewData);
            }

            if (res.status === 200) {
                const updatedReviews = await getReviewsForListing(listingId);
                setReviews(updatedReviews.data);
                setShowReviewForm(false);
                setReviewData(null);
                setErrorMessage('');
            } else {
                setErrorMessage(t('reviews.failedToProcessReview'));
            }
        } catch (error) {
            console.error("Error processing review:", error);
            setErrorMessage(t('reviews.errorProcessingReview'));
        }
    };

    const handleLike = async (reviewId) => {
        if (!user) {
            setErrorMessage(t('reviews.loginToLike'));
            return;
        }

        try {
            const reviewData = {
                userId: user.id,
            };
            const res = await likeReview(reviewId, reviewData);

            if (res.status === 200) {
                const updatedReviews = reviews.map(review =>
                    review._id === reviewId ? { ...review, likedBy: res.data.likedBy } : review
                );
                setReviews(updatedReviews);
                setErrorMessage('');
            } else {
                setErrorMessage(t('reviews.failedToLike'));
            }
        } catch (error) {
            console.error("Error liking review:", error);
            setErrorMessage(t('reviews.errorLikingReview'));
        }
    };

    const handleEditReview = () => {
        if (!userReview) return;

        setReviewData({
            text: userReview.comment,
            rating: userReview.rating,
            id: userReview._id
        });
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if (!user) {
            setErrorMessage(t('reviews.loginToDelete'));
            return;
        }

        if (!window.confirm(t('reviews.confirmDelete'))) {
            return;
        }

        try {
            const res = await deleteReview(reviewId);

            if (res.status === 200) {
                setReviews(reviews.filter(review => review._id !== reviewId));
                setErrorMessage('');

                if (reviewData && reviewData.id === reviewId) {
                    setReviewData(null);
                    setShowReviewForm(false);
                }
            } else {
                setErrorMessage(t('reviews.failedToDelete'));
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            setErrorMessage(t('reviews.errorDeletingReview'));
        }
    };

    // Preview mode with slider
    if (!inModal && !showFullReviews) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <ReviewSlider
                    reviews={reviews}
                    onShowAllReviews={() => {
                        setShowFullReviews(true);
                        onClose()
                    }}
                    onShowAllAddReviews={() => {
                        setShowReviewForm(true);
                        setShowFullReviews(true);
                        onClose()
                    }}
                    onLike={handleLike}
                    currentUserId={user?.id}
                    previewMode={true}
                    logined={logined}
                />
            </div>
        );
    }

    // Modal or full review view
    return (
        <div className={`${inModal ? "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" : ""}`}>
            <div className={`bg-white rounded-2xl shadow-2xl ${inModal ? "w-full max-w-4xl max-h-[90vh] overflow-hidden" : ""} relative`}>
                
                {/* Modal Header */}
                {inModal && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {t('reviews.customerReviews', 'Customer Reviews')}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {reviews.length} {reviews.length === 1 ? t('reviews.review', 'review') : t('reviews.reviews', 'reviews')}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setShowFullReviews(false);
                                onClose()
                            }}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Content Area */}
                <div className={`${inModal ? 'p-6 overflow-y-auto max-h-[calc(90vh-140px)]' : ''}`}>
                    
                    {/* Back Button for Non-Modal */}
                    {!inModal && showFullReviews && (
                        <div className="mb-6">
                            <button
                                onClick={() => {
                                    setShowFullReviews(false);
                                    onClose()
                                }}
                                className="inline-flex items-center text-blue hover:text-blue font-medium transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                {t('reviews.backToPreview')}
                            </button>
                        </div>
                    )}

                    {/* Review Action Section */}
                    <div className="mb-8">
                        {user ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue to-indigo-50 rounded-xl border border-blue">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        {userReview ? t('reviews.yourReview', 'Your Review') : t('reviews.shareExperience', 'Share Your Experience')}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {userReview 
                                            ? t('reviews.editReviewDescription', 'Update or modify your existing review') 
                                            : t('reviews.feedbackMatters', 'Help others by sharing your experience')
                                        }
                                    </p>
                                </div>
                                <button 
                                    onClick={userReview ? handleEditReview : () => setShowReviewForm(!showReviewForm)} 
                                    className="inline-flex items-center px-6 py-3 bg-blue hover:bg-blue text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                                >
                                    {userReview ? (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            {t('reviews.editReview')}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                            {t('reviews.writeReview')}
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{t('reviews.loginToReview')}</h3>
                                <p className="text-gray-600 text-sm">{t('reviews.loginDescription', 'Please sign in to share your experience and help other travelers')}</p>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
                            <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="font-medium">Error</p>
                                <p className="text-sm mt-1">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Review Form Modal */}
                    {showReviewForm && (
                        <ReviewForm
                            onNewReview={handleReview}
                            onUpdateReview={handleReview}
                            reviewData={reviewData}
                            onCancel={() => {
                                setShowReviewForm(false);
                                setReviewData(null);
                            }}
                            onDeleteReview={handleDeleteReview}
                        />
                    )}

                    {/* Reviews List */}
                    <div className="space-y-1">
                        <ReviewSlider
                            inModal={inModal}
                            reviews={reviews}
                            onLike={handleLike}
                            currentUserId={user?.id}
                            previewMode={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeReviews;