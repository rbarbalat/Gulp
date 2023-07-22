import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { thunkLoadSingleBusiness } from "../../store/business";
import TopCard from "../TopCard";
import ReviewCard from "../ReviewCard";
import {deleteBusiness} from "../../helpers";

import "./SingleBusiness.css";


export default function SingleBusiness()
{
    const business = useSelector(state => state.businesses.singleBus);
    const busIsEmpty = Object.keys(business).length === 0;

    const user = useSelector(state => state.session.user);
    const [confirm, setConfirm] = useState(false);

    const [sort, setSort] = useState("newest");

    //initial state for both is an object, so worst case undefined === undefined
    const isOwner = user?.id === business?.owner_id;
    const hasReviewed = business?.reviewers?.includes(user?.id);

    const reviews = business.reviews?.slice();

    if(sort === "newest") reviews?.sort((a,b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    if(sort === "oldest") reviews?.sort((a,b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    if(sort === "best") reviews?.sort((a,b) => { return b.rating - a.rating; });

    if(sort === "worst") reviews?.sort((a,b) => { return a.rating - b.rating; })

    const { business_id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const confirmAndCancel = (
        <div className = "bus_card_buttons_confirm_single">
            <button className = "bus_confirm_delete_button" onClick={() => deleteBusiness(business.id, user.id, dispatch, history)}>Confirm</button>
            <button className = "bus_cancel_delete_button" onClick={() => setConfirm(false)}>Cancel</button>
        </div>
    );

    const editAndDelete = (
        <div className = "bus_card_buttons_not_confirm_single">
            <button className="bus_edit_button" onClick={linkEdit}>Edit</button>
            <button className="bus_delete_button" onClick={() => setConfirm(true) }>Delete</button>
        </div>
    );

    useEffect(() => {
        //if(Number(business_id) !== business.id)
        async function fetchData()
        {
            const res = await dispatch(thunkLoadSingleBusiness(business_id));
            console.log("res in useEffect");
            console.log(res);
        }
        fetchData();
    }, [dispatch, business_id])

    function linkEdit()
    {
        //don't need the linkEditBus helper b/c if coming
        //from this component don't need to dispatch load single bus
        history.push(`/businesses/${business_id}/edit`);
    }

    function linkReview()
    {
        history.push(`/businesses/${business_id}/reviews`);
    }

    if(busIsEmpty) return <div>loading</div>
    return(
        <>
            <TopCard business={business} />
            <button onClick={() => setSort("newest")}>newest</button>
            <button onClick={() => setSort("oldest")}>oldest</button>
            <button onClick={() => setSort("best")}>best</button>
            <button onClick={() => setSort("worst")}>worst</button>
            <div className="single_bus_middle_wrapper">
                <div className="single_bus_about">{business.name}</div>
                <div className="single_bus_description_not_card">{business.description}</div>
                {
                    business.images.length > 0 &&
                    <div className = "single_bus_submitted_images">
                    {
                        business.images.map(image => (
                            <div key = {image.id} className = "single_bus_submitted_image_wrapper">
                                <img className = "single_bus_submitted_image" src={image.url} alt="bus_preview_image"></img>
                            </div>
                        ))
                    }
                    </div>
                }
                { isOwner && confirm && confirmAndCancel}
                { isOwner && !confirm && editAndDelete}
                { !isOwner && hasReviewed && <div className="ty_for_review">Thank you for your review!</div> }
                { !isOwner && !hasReviewed && <button className="review_button" onClick={linkReview}>Write a Review!</button>}
            </div>

        <div className ="single_bus_wrapper">
            {
                reviews.map(review => (
                // business.reviews.map(review => (
                    <ReviewCard key = {review.id} review={review}
                    user={user} business_id = {business_id} user_profile={false} />
                ))
            }
        </div>

        <div className="single_bus_bottom_space"></div>
    </>
    )
}
