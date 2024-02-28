import { thunkLoadSingleReview, thunkDeleteReview } from "../store/review";
import {
            thunkLoadSingleBusiness, thunkDeleteBusiness,
            thunkLoadBusinesses, thunkLoadFavBusinessesOfUser
        } from "../store/business";

import { thunkDeleteReply } from "../store/reply";
import { authenticate } from "../store/session";

export async function linkEditReview(review_id, dispatch, history)
{
    // singleRev will be in the store so the useSelectors on the
    // edit form will be able to get the existing values right away

    const res = await dispatch(thunkLoadSingleReview(review_id));
    if(!res.error) return history.push(`/reviews/${review_id}`);
}

export async function deleteReview(review_id, dispatch, business_id)
{
    const res = await dispatch(thunkDeleteReview(review_id));
    if(!res.error)
    {
        if(business_id)
        {
            //if you are deleting from the single business page
            //the single business component pulls reviews from the business
            //store not the review store so need to trigger an update
            await dispatch(thunkLoadSingleBusiness(business_id));
        }
        //after deleting a business or review, need to pull new user session info
        //to get his updated numReviews/numBusinesses for the user profile
        await dispatch(authenticate());
        return;
    }
}

export async function linkEditBus(business_id, dispatch, history)
{
    //load the singleBus in the store so the useSelector in
    //the edit form can access it right away

    const res = await dispatch(thunkLoadSingleBusiness(business_id));
    if(!res.error) return history.push(`/businesses/${business_id}/edit`);

}

export async function deleteBusiness(business_id, user_id, dispatch, history)
{
    const res = await dispatch(thunkDeleteBusiness(business_id));
    if(!res.error)
    {
        //owner linked back to his profile after deleting a business
        //after deleting a business or review (from the user profile), need to pull new user session info
        //to get the users updated numReviews/numBusinesses for the user profile
        await dispatch(authenticate());
        return history.push(`/users/${user_id}`);
    }
}

export async function deleteReply(reply_id, dispatch, business_id)
{
    const res = await dispatch(thunkDeleteReply(reply_id));
    //for now replies only appear on the single bus component
    //the single business component pulls replies from the business store
    //not the reply store so need to trigger an update
    if(!res.error && business_id) await dispatch(thunkLoadSingleBusiness(business_id));
}

export async function createFavorite(business_id, user_id, pathname, dispatch)
{
    const options = { method: "POST" };
    const res = await fetch(`/api/businesses/${business_id}/favorites`, options);
    if(res.ok)
    {
        //user favorites data are pulled from the session store
        await dispatch(authenticate());
        if(pathname === "/businesses") await dispatch(thunkLoadBusinesses());
        if(pathname === `businesses/${business_id}`) await dispatch(thunkLoadSingleBusiness(business_id));
        if(pathname === `/users/${user_id}`) await dispatch(thunkLoadFavBusinessesOfUser())
    }
}
export async function deleteFavorite(favorite_id, user_id, pathname, dispatch, business_id)
{
    const options = { method: "Delete"};
    const res = await fetch(`/api/favorites/${favorite_id}`, options);
    if(res.ok)
    {
        //user favorites data are pulled from the session store
        await dispatch(authenticate());
        if(pathname === "/businesses") await dispatch(thunkLoadBusinesses());
        if(pathname === `businesses/${business_id}`) await dispatch(thunkLoadSingleBusiness(business_id));
        if(pathname === `/users/${user_id}`) await dispatch(thunkLoadFavBusinessesOfUser());
    }
}
