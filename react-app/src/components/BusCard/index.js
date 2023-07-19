import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useState} from "react";
// import {thunkLoadSingleBusiness } from "../../store/business";
import { linkEditBus, deleteBusiness } from "../../helpers";
import StarRatingInput from "../StarRatingInput";
import "./BusCard.css";

export default function BusCard({business, user})
{
    const isOwner = user?.id === business?.owner_id;
    const history = useHistory();
    const dispatch = useDispatch();

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
                        "bus_confirm_delete", "bus_cancel_delete"
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

    if(Object.keys(business).length === 0) return <div>loading</div>
    // return <div>Hello World!!! from business {business.id}</div>
    return(
        <div className = "bus_card_wrapper">
            <div className = "preview_image_wrapper">
                {/* <img alt="bus_preview_image" className ="bus_preview" src={business.preview_image}></img> */}
                <i className="fa-sharp fa-solid fa-arrow-left bus_card" onClick={prevImage}></i>
                <i className="fa-sharp fa-solid fa-arrow-right bus_card" onClick={nextImage}></i>
                <img alt="bus_preview_image" className ="bus_preview" src={urls[index]}></img>
            </div>
            <div className = "bus_info_wrapper" onClick={linkBusiness}>
                <div className="bus_card_name_and_buttons_wrapper">
                    <div className = "business_name">{business.name}</div>
                    {
                        isOwner &&
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
