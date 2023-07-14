import { useSelector, useDispatch } from "react-redux";
import { thunkDeleteReview } from "../../store/review";
import { thunkLoadSingleBusiness } from "../../store/business";
import { useHistory } from "react-router-dom";
import "./ReviewCard.css";

export default function ReviewCard({review, user, business_id})
{
    //prob don't need to use optional chaining on review here
    //user can be null if not logged in so need it
    const isReviewer = user?.id === review.reviewer.id;

    const dispatch = useDispatch();
    const history = useHistory();

    //disappears from list of user's reviews b/c AllRevOfUser
    //accesses the store for reviews
    async function deleteReview()
    {
        const res = await dispatch(thunkDeleteReview(review.id));
        if(res.error)
        {
            console.log("bad response from inside deleteBus");
            console.log(res);
            alert("something went wrong with the deletion");
        }else {
            console.log("good response from inside deleteBus");
            console.log(res);
            if(business_id)
            {
                //the single business component pulls reviews from the business
                //store not the review store so need to trigger an update
                const res_two = await dispatch(thunkLoadSingleBusiness(business_id));
                if(res_two.error)
                {
                    console.log("problem loading single business after review deletion");
                    console.log(res_two);
                }else {
                    console.log("reloaded the single business page after deleting a review")
                    console.log(res_two)
                }
            }
            return;
        }
    }
    function linkEdit()
    {
        history.push(`/reviews/${review.id}`)
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
                        <button onClick={linkEdit}>Edit Review</button>
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
