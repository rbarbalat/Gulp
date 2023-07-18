import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { thunkLoadSingleBusiness, thunkDeleteBusiness } from "../../store/business";
import TopCard from "../TopCard";
import ReviewCard from "../ReviewCard";

import "./SingleBusiness.css";


export default function SingleBusiness()
{
    const business = useSelector(state => state.businesses.singleBus);
    const busIsEmpty = Object.keys(business).length === 0;

    const user = useSelector(state => state.session.user);

    //make sure this line never causes a typeerror
    //initial state for both is an object, so worst case undefined === undefined
    const isOwner = user?.id === business?.owner_id;

    const { business_id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
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
    //MOVE THIS FUNCTION TO THE BusCard component
    async function deleteBus()
    {
        const res = await dispatch(thunkDeleteBusiness(business_id));
        if(res.error)
        {
            console.log("bad response from inside deleteBus");
            console.log(res);
            alert("something went wrong with the deletion");
        }else {
            console.log("good response from inside deleteBus");
            console.log(res);
            //owner linked back to his profile after deleting a business
            history.push(`/users/${user.id}`);
            return;
        }
    }
    function linkReview()
    {
        history.push(`/businesses/${business_id}/reviews`);
    }

    if(busIsEmpty) return <div>loading</div>
    return(
        <>
                <TopCard business={business} />
            {
                business.images.length > 0 ?
                <div className = "single_bus_submitted_images">
                    {
                        business.images.map(image => (
                            <div key = {image.id} className = "single_bus_submitted_image_wrapper">
                                <img className = "single_bus_submitted_image" src={image.url} alt="bus_preview_image"></img>
                            </div>
                        ))
                    }
                </div>
                :
                null
            }

        { isOwner && <p><button onClick={linkEdit}>Edit</button></p>}
        { isOwner && <p><button onClick={deleteBus}>Delete</button></p>}

        { !isOwner && <p><button onClick={linkReview}>Write a Review!</button></p>}

        <div className ="single_bus_wrapper">
            {
                business.reviews.map(review => (
                    <ReviewCard key = {review.id} review={review}
                    user={user} business_id = {business_id} user_profile={false} />
                ))
            }
        </div>
    </>
    )
}
