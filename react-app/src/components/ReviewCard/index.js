import { useSelector, useDispatch } from "react-redux";
import { thunkDeleteReview } from "../../store/review";
import "./ReviewCard.css";

export default function ReviewCard({review, user, business_id})
{
    const isReviewer = user?.id === review?.reviewer_id;
    const dispatch = useDispatch();

    //disappears from list of user's reviews b/c AllRevOfUser
    //accesses the store for reviews
    async function deleteReview()
    {
        const res = await dispatch(thunkDeleteReview(review?.id));
        if(res.error)
        {
            console.log("bad response from inside deleteBus");
            console.log(res);
            alert("something went wrong with the deletion");
        }else {
            console.log("good response from inside deleteBus");
            console.log(res);
            alert("succesful deletion");
            if(business_id)
            {
                // const res2 = dispatch(thunkLoadSingleBusiness(business_id))
            }
            return;
        }
    }

    //returning empty review for development for now
    if(Object.keys(review).length === 0) return <div>empty review</div>
    return(
        <div className = "rev_card_wrapper">
            <div className = "reviewer_section">
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
                        {review.reviewer.numReviews} reviews
                    </div>
                </div>
                {
                    isReviewer &&
                    <div className="rev_card_buttons_wrapper">
                        <button>Edit Review</button>
                        <button onClick={deleteReview}>Delete Review</button>
                    </div>
                }
            </div>

            <div className = "reviewer_rating">
                {review.rating} stars {review.updated_at ? review.updated_at : review.created_at}
            </div>

            <div className = "review_text">
                {review.review}
            </div>

            {
                review.images.length > 0 ?
                <div className = "submitted_images">
                    {
                        review.images.map(image => (
                            <div key = {image.id} className = "submitted_image_wrapper">
                                <img className = "submitted_image"></img>
                            </div>
                        ))
                    }
                </div>
                :
                null
            }
        </div>
    )
}
