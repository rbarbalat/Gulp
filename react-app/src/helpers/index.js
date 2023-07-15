import { thunkLoadSingleReview, thunkDeleteReview } from "../store/review";
import { thunkLoadSingleBusiness, thunkDeleteBusiness } from "../store/business";

export async function linkEditReview(review_id, dispatch, history)
{
    const res = await dispatch(thunkLoadSingleReview(review_id));
    // const res = await dispatch(thunkLoadSingleReview(review.id));

    // singleRev will be in the store so the useSelectors on the
    // edit form will be able to get the existing values right away
    if(res.error)
    {
        console.log("bad response inside linkEdit in ReviewCard")
        console.log(res);
    }else{
        console.log("good response inside linkEdit in ReviewCard");
        console.log(res)
        history.push(`/reviews/${review_id}`);
        return;
    }
}

export async function deleteReview(review_id, dispatch, business_id)
{
    //const res = await dispatch(thunkDeleteReview(review.id));
    const res = await dispatch(thunkDeleteReview(review_id));
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
            //if you are deleting from the single business page
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

export async function linkEditBus(business_id, dispatch, history)
{
    //load the singleBus in the store so the useSelector in
    //the edit form can access it right away
    // const res = await dispatch(thunkLoadSingleBusiness(business.id));
    const res = await dispatch(thunkLoadSingleBusiness(business_id));
    if(res.error)
    {
        console.log("bad response from inside linkEdit in BusCard");
        console.log(res);
    }else{
        console.log("good response from inside linkEdit");
        console.log(res);
        history.push(`/businesses/${business_id}/edit`);
    }
}

export async function deleteBusiness(business_id, user_id, dispatch, history)
{
    const res = await dispatch(thunkDeleteBusiness(business_id));
    if(res.error)
    {
        console.log("bad response from inside deleteBusiness");
        console.log(res);
        alert("something went wrong with the deletion");
    }else {
        console.log("good response from inside deleteBusiness");
        console.log(res);
        //owner linked back to his profile after deleting a business
        history.push(`/users/${user_id}`);
        return;
    }
}