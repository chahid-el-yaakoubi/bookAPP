// ReviewSlider.jsx
import React from 'react';
import ReviewList from './ReviewList';
import { useTranslation } from 'react-i18next';

const ReviewSlider = ({
    reviews,
    onShowAllReviews,
    onLike,
    currentUserId,
    previewMode = true,
    maxPreviewCount = 3,
    inModal,
    onShowAllAddReviews,
    logined
}) => {
    const { t } = useTranslation();

    console.log(logined)

    // Get average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    // In preview mode, only show a limited number of reviews
    const displayedReviews = previewMode ? reviews.slice(0, maxPreviewCount) : reviews;

    return (
        <div className="review-slider p-4 md:p-6 bg-white rounded-lg shadow mt-20 md:mt-0">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('reviews.guestReviews')}</h2>
                <div className="flex items-center">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full mr-2">
                        {averageRating} ★
                    </div>
                    <span className="text-gray-600">{reviews.length} {t('reviews.reviews')}</span>
                </div>
            </div>

            {reviews.length > 0  ? (
                <>
                    <ReviewList
                        reviews={displayedReviews}
                        onLike={onLike}
                        currentUserId={currentUserId}
                    />



                    {previewMode && reviews.length > maxPreviewCount ? (
                        <button
                            onClick={onShowAllReviews}
                            className="mt-4 w-full bg-blue hover:bg-blue text-white py-2 px-4 rounded-b-lg transition duration-200"
                        >
                            {t('reviews.viewAllReviews', { count: reviews.length })}
                        </button>
                    ) : (<>
                        {!inModal && logined  ? <button
                            onClick={onShowAllReviews}
                            className="mt-4 w-full bg-blue hover:bg-blue text-white py-2 px-4 rounded-b-lg transition duration-200"
                        >

                            {t('reviews.showur')}
                            {/* {logined ? <>{t('reviews.showur')}</> : <>{t('reviews.befirstadd')}</>} */}
                        </button> : <button
                            onClick={onShowAllAddReviews}
                            className="mt-4 w-full bg-blue hover:bg-blue text-white py-2 px-4 rounded-b-lg transition duration-200"
                        >
                            {t('reviews.befirstadd')}
                        </button>}

                    </>)}
                </>
            ) : (<>
                {!inModal ?

                    <>

                        <p className="text-gray-500 italic">{t('reviews.noReviews')}</p>

                        <button
                            onClick={onShowAllAddReviews}
                            className="mt-4 w-full bg-blue hover:bg-blue text-white py-2 px-4 rounded-b-lg transition duration-200"
                        >
                            {t('reviews.befirstadd')}
                        </button>
                    </> : ''}

            </>)}
        </div>
    );
};

export default ReviewSlider;