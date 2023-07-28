import { useDispatch } from "react-redux";
import { useState } from "react";
import StarRatingInput from "../StarRatingInput";
import { useHistory } from "react-router-dom";
import { linkEditReview, deleteReview } from "../../helpers";
import { thunkReceiveReply } from "../../store/reply";
import { thunkLoadSingleBusiness } from "../../store/business";
import ReplyCard from "../ReplyCard";
import ReplyForm from "../ReplyForm";
import "./ReviewCard.css";

export default function ReviewCard({review, user, business_id, user_profile, owner})
{
    //user can be null if not logged in so need it
    const isReviewer = user?.id === review?.reviewer?.id;
    const isOwner = user?.id === owner?.id;

    const dispatch = useDispatch();
    const history = useHistory();

    const [confirm, setConfirm] = useState(false);
    const [content, setContent] = useState("");

    const [showForm, setShowForm] = useState(false);

    let date = new Date(review?.created_at)?.toDateString()?.slice(4);
    if(date)
    {
       if(date[4] === "0")
       date = date.slice(0,4) + date.slice(5);
    }

    function linkBusiness()
    {
        history.push(`/businesses/${review.business_id}`)
    }

    const editAndDelete = (
        <div className="rev_card_buttons_wrapper">
            <div className = "rev_edit" onClick={() => linkEditReview(review.id, dispatch, history)}>Edit</div>
            <div className = "rev_delete" onClick={() => setConfirm(true)}>Delete</div>
        </div>
    )
    const confirmAndCancel = (
        <div className="rev_card_buttons_wrapper">
            <div className = "rev_confirm_delete" onClick={() => deleteReview(review.id, dispatch, business_id)}>Confirm</div>
            <div className = "rev_cancel_delete" onClick={() => setConfirm(false)}>Cancel</div>
        </div>
    )

    function closeForm()
    {
        setContent("");
        setShowForm(false);
    }
    async function onSubmitReply(event)
    {
        event.preventDefault();
        const res = await dispatch(thunkReceiveReply(review.id, {
            reply: content
        }));
        if(res.error)
        {
            console.log(res);
        }else{
            // console.log(res)
            const res_two = await dispatch(thunkLoadSingleBusiness(business_id));
            // console.log(res_two);
            setContent("");
            setShowForm(false);
        }
    }

    //returning empty review for development for now
    if(Object.keys(review).length === 0) return <div>empty review</div>
    return(
        <div className = "rev_card_wrapper">
        {
            user_profile ?
            <div className="business_and_edit_delete_section">
                <div className="bus_name_in_review">
                    You wrote a review for <span onClick={linkBusiness} className="bus_name_link">{review.business.name}</span>
                </div>
                { isReviewer && confirm && confirmAndCancel}
                { isReviewer && !confirm && editAndDelete}
            </div>
            :
            <div className = "reviewer_section">
                <div className = "reviewer_image_wrapper">
                    <img className = "reviewer_image" alt="default avatar" src="https://s3-media0.fl.yelpcdn.com/assets/public/default_user_avatar_120x120_v2.yji-1fea61f9163feb39bc9a115a97bd99eb.png"></img>
                </div>
                <div className = "reviewer_info_wrapper">
                    <div className = "reviwer_username">
                        {review.reviewer.username}
                    </div>
                    <div className = "reviewer_numReviews">
                    {
                        review.reviewer.numReviews === 1 ?
                        `${review.reviewer.numReviews} review`
                        :
                        `${review.reviewer.numReviews} reviews`
                    }
                    </div>
                </div>
                { isReviewer && confirm && confirmAndCancel}
                { isReviewer && !confirm && editAndDelete}

                {
                    isOwner && review.replies.length === 0 &&
                    <div className = "owner_reply" onClick={() => setShowForm(true)}>Reply to {review.reviewer.username}</div>
                }
                {
                    isOwner && review.replies.length > 0 &&
                    <div className = "owner_reply_again" onClick={() => setShowForm(true)}>Reply Again</div>
                }
            </div>
        }

            <div className = "reviewer_rating">
                <StarRatingInput rating={review.rating} form={false}/>
                {/* <div>{review.created_at.split(",")[1].split(":")[0].slice(0,-3)}</div> */}
                <div>{date}</div>
            </div>

            {/* {review.updated_at ? review.updated_at : review.created_at} */}

            <div className = "review_text">
                {review.review}
            </div>

            {
                review.images.length > 0 ?
                <div className = "submitted_images_wrapper">
                    {
                        review.images.map(image => (
                            <div key = {image.id} className = "submitted_image_wrapper">
                                <img className = "submitted_image" src={image.url} alt="rev_preview_image"></img>
                            </div>
                        ))
                    }
                </div>
                :
                null
            }
            {
                !user_profile && review.replies.length > 0 &&
                <div className = "all_replies_wrapper">
                {
                    review.replies.map(reply => (
                        <ReplyCard key={reply.id} reply={reply} owner={owner} user={user} business_id = {business_id} />
                    ))
                }
                </div>
            }
            {
                showForm &&
                <div className = "reply_form_wrapper">
                    <form onSubmit={onSubmitReply}>
                        <textarea className = "reply_form_text_area" value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder = {`Reply to ${review.reviewer.username}`} />
                        <button className = "submit_reply_button">Reply</button>
                    </form>
                    <button className = "cancel_reply_button" onClick={closeForm}>Cancel</button>
                </div>
            }

        </div>
    )
}
