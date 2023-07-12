import "./ReviewCard.css";

export default function ReviewCard({review})
{
    if(Object.keys(review).length === 0) return <div>empty review</div>
    return(
        <div className = "rev_card_wrapper">
            <div className = "user_section">
                <div className = "reviewer_image_wrapper">
                    <img className = "reviewer_image"></img>
                </div>
                <div className = "reviewer_info_wrapper">
                    <div className = "reviwer_username">
                        {review.reviewer.username}
                    </div>
                    <div className = "reviewer_location">
                        city,state
                    </div>
                    <div className = "reviewer_numReviews">
                        x number of reviews
                    </div>
                </div>
            </div>

            <div className = "reviewer_rating">
                {review.rating} stars {review.updated_at ? review.updated_at : review.created_at}
            </div>

            <div className = "review_text">
                {review.review}
            </div>

            {
                review.images.length > 0 ?
                <div className = "review_images">
                    {
                        review.images.map(image => (
                            <img></img>
                        ))
                    }
                </div>
                :
                null
            }
        </div>
    )
}
