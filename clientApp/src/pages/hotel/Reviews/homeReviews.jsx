// HomeReviews.js
import React, { useState, useEffect, useContext } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { createReview, getReviewsForListing, likeReview, updateReview, deleteReview } from '../../../Lib/api';
import { AuthContext } from '../../../contextApi/AuthContext';
import ReviewSlider from './ReviewSlider';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export const HomeReviews = ({ inModal, onClose }) => {
    const {id} = useParams();
    const { t, i18n } = useTranslation(); // Use the translation hook
    const isRTL = i18n.language === "ar";

    const { state } = useContext(AuthContext);
    const user = state?.user;
    const logined = user ? true : false;
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [reviewData, setReviewData] = useState(null);
    const [showFullReviews, setShowFullReviews] = useState(inModal); // Show all reviews if in modal
    const listingId = id; // Replace with actual listing ID or prop

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
        // Disable scrolling on the home page when the review form is shown
        document.body.style.overflow = showReviewForm ? 'hidden' : 'auto';

        // Cleanup function to reset overflow when component unmounts or review form is closed
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showReviewForm]);

    // Check if user has already submitted a review
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
                // Refresh reviews from server instead of manually updating state
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

        // Confirm deletion
        if (!window.confirm(t('reviews.confirmDelete'))) {
            return;
        }

        try {
            const res = await deleteReview(reviewId);

            if (res.status === 200) {
                // Remove review from state
                setReviews(reviews.filter(review => review._id !== reviewId));
                setErrorMessage('');

                // Reset review data if we were editing it
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

    // If not showing the modal or full reviews, just show the slider
    if (!inModal && !showFullReviews) {
        return (
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
        );
    }

    // Modal or full review view
    return (
        <div className={`${inModal ? "fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end items-center" : ""}`}>
            <div className={`bg-blue rounded-lg ${inModal ? "p-4 md:p-20 w-full md:w-1/2 max-h-90vh  h-full overflow-y-auto relative" : ""}`}>
                {inModal && (
                    <button
                        onClick={() => {
                            setShowFullReviews(false);
                            onClose()
                        }}
                        className="absolute top-6 md:top-10 right-10 text-gray-900 hover:text-gray-700 bg-red-500 rounded-full w-10 h-10 p-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <div className="flex justify-between items-center mb-6">

                    {!inModal && (
                        <button
                            onClick={() => {
                                setShowFullReviews(false);
                                onClose()
                            }}
                            className="text-blue"
                        >
                            {t('reviews.backToPreview')}
                        </button>
                    )}
                </div>

                {user && (
                    <button 
                        onClick={userReview ? handleEditReview : () => setShowReviewForm(!showReviewForm)} 
                        className={`mb-6 bg-orange-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-200 absolute top-6 md:top-10  left-20`}
                    >
                        {userReview ? t('reviews.editReview') : t('reviews.writeReview')}
                    </button>
                )}

                {!user && (
                    <p className="mb-6 text-gray-600">{t('reviews.loginToReview')}</p>
                )}

                {showReviewForm && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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
                    </div>
                )}

                {/* {errorMessage && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {errorMessage}
                    </div>
                )} */}

                <ReviewSlider
                inModal={inModal}
                    reviews={reviews}
                    onLike={handleLike}
                    currentUserId={user?.id}
                    previewMode={false}
                />
            </div>
            
        </div>
    );
};

export default HomeReviews;