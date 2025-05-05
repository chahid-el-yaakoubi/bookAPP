import React, { useState, useEffect } from 'react'
import HomeReviews from './homeReviews';


export const LayoutReviews = () => {
    const [isModal, setIsModal] = useState(false);

    // When modal is open, prevent body scrolling
    useEffect(() => {
        if (isModal) {
            // Disable scrolling on body when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable scrolling when modal is closed
            document.body.style.overflow = 'auto';
        }
        
        // Cleanup function to ensure scrolling is restored when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModal]);
 
    
    const onClose = () => {
        setIsModal(!isModal); // This should just set to false, not toggle
    }

    return (
        <>
            <HomeReviews inModal={isModal} isOpen={isModal} onClose={onClose} />
        </>
    )
}

export default LayoutReviews;