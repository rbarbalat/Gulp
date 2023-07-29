import {useHistory, useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useState} from "react";
// import {thunkLoadSingleBusiness } from "../../store/business";
import { linkEditBus, deleteBusiness } from "../../helpers";
import StarRatingInput from "../StarRatingInput";
import "./BusCard.css";
import { thunkLoadBusinesses, thunkLoadFavBusinessesOfUser } from "../../store/business";
import { authenticate } from "../../store/session";

export default function BusCard({business, user})
{
    const isOwner = user?.id === business?.owner_id;
    const favorite = user?.favorites.find(favorite => favorite.business_id === business.id);
    //find returns undefined if no match
    const userFavorite = favorite !== undefined;
    const history = useHistory();
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    // console.log("pathname is ", pathname);
    // /users/14 or /businesses
    // console.log(favorite);
    // console.log(`business_${business.id} and ${userFavorite}`);

    const [confirm, setConfirm] = useState(false);

    const [index, setIndex] = useState(0);
    const urls = [business.preview_image, ...business.images];

    for(let i = 1; i<urls.length; i++)
    {
        urls[i] = urls[i].url
    }
    function linkBusiness(event)
    {
        const list = [
                        "bus_card_order_button", "bus_delete", "bus_edit",
                        "bus_confirm_delete", "bus_cancel_delete",
                        "fa-solid fa-heart black", "fa-solid fa-heart red"
                    ];
        if(list.includes(event.target.className) === false) history.push(`/businesses/${business.id}`)
    }
    function nextImage()
    {
        setIndex(index === urls.length - 1 ? 0 : index + 1 )
    }
    function prevImage()
    {
        setIndex(index === 0 ? urls.length - 1 : index - 1 )
    }
    function startOrder()
    {
        alert("Feature Coming Soon");
        return null;
    }
    async function modifyFavorite()
    {
        if(!userFavorite)
        {
            const options = { method: "POST" };
            const res = await fetch(`/api/businesses/${business.id}/favorites`, options);
            const data = await res.json();
            console.log(data)
            if(res.ok && pathname === "/businesses") await dispatch(thunkLoadBusinesses());
            if(res.ok && pathname === `/users/${user.id}`) await dispatch(thunkLoadFavBusinessesOfUser())
        }else{
            const options = { method: "Delete"};
            const res = await fetch(`/api/favorites/${favorite.id}`, options);
            if(res.ok) await dispatch(authenticate());
            if(res.ok && pathname === "/businesses") await dispatch(thunkLoadBusinesses());
            if(res.ok && pathname === `/users/${user.id}`) await dispatch(thunkLoadFavBusinessesOfUser())
        }
        return null;
    }

    if(Object.keys(business).length === 0) return <div>loading</div>
    // return <div>Hello World!!! from business {business.id}</div>
    return(
        <div className = "bus_card_wrapper">
            <div className = "preview_image_wrapper">
            {
                business.images?.length > 0 &&
                <i className="fa-sharp fa-solid fa-arrow-left bus_card" onClick={prevImage}></i>
            }
            {
                business.images?.length > 0 &&
                <i className="fa-sharp fa-solid fa-arrow-right bus_card" onClick={nextImage}></i>
            }
                <img alt="bus_preview_image" className ="bus_preview" src={urls[index]}></img>
            </div>
            <div className = "bus_info_wrapper" onClick={linkBusiness}>
                <div className="bus_card_name_and_buttons_wrapper">
                    <div className = "business_name">{business.name}</div>
                    {
                        isOwner ?
                        <div className = "bus_card_buttons">
                        {
                            confirm ?
                            <div className = "bus_card_buttons_confirm">
                                <div className = "bus_confirm_delete" onClick={() => deleteBusiness(business.id, user.id, dispatch, history)}>Confirm</div>
                                <div className = "bus_cancel_delete" onClick={() => setConfirm(false)}>Cancel</div>
                            </div>
                            :
                            <div className = "bus_card_buttons_not_confirm">
                                <div className="bus_edit" onClick={() => linkEditBus(business.id, dispatch, history)}>Edit</div>
                                <div className="bus_delete" onClick={() => setConfirm(true) }>Delete</div>
                            </div>
                        }
                        </div>
                        :
                        <i className={userFavorite ? "fa-solid fa-heart red" : "fa-solid fa-heart black"}
                            onClick={modifyFavorite}></i>
                    }
                </div>
                {
                    business.average ?
                    <div className="average_and_stars">
                        {/* change to a half star eventually */}
                        <StarRatingInput rating={business.average} form={false}/>
                        <div>
                            {
                                business.numReviews === 1 ?
                                `${business.numReviews} review`
                                :
                                `${business.numReviews} reviews`
                            }
                        </div>
                    </div>
                    :
                    <div className="first_review">No reviews yet!</div>
                }
                <div className = "bus_card_address">{business.address}</div>
                <div className= "bus_card_city_state">{business.city}, {business.state}</div>
                <div className = "bus_card_description">
                    {
                        business.description.length < 100 ? business.description
                        : business.description.slice(0, 100) + "..."
                    }
                    {business.description.length >= 100 && <span className="bus_card_read_more">Read More</span>}
                    </div>
                <button className = "bus_card_order_button" onClick={startOrder}>Start Order</button>
            </div>

        </div>
    )
}
