import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
// import {thunkLoadSingleBusiness } from "../../store/business";
import { linkEditBus, deleteBusiness } from "../../helpers";
import StarRatingInput from "../StarRatingInput";
import "./BusCard.css";

export default function BusCard({business, user})
{
    const isOwner = user?.id === business?.owner_id;
    const history = useHistory();
    const dispatch = useDispatch();
    function linkBusiness()
    {
        history.push(`/businesses/${business.id}`)
    }

    // const style = {
    //     borderBottom: "1px solid gray"
    // }

    if(Object.keys(business).length === 0) return <div>loading</div>
    // return <div>Hello World!!! from business {business.id}</div>
    return(
        <div className = "bus_card_wrapper" onClick={linkBusiness}>
            <div className = "preview_image_wrapper">
                <img alt="bus_preview_image" className ="bus_preview" src={business.preview_image}></img>
            </div>
            <div className = "bus_info_wrapper">
                <div className="bus_card_name_and_buttons_wrapper">
                    <div className = "business_name">{business.name}</div>
                    {
                        isOwner &&
                        <div className = "bus_card_buttons">
                            <div className="bus_edit" onClick={() => linkEditBus(business.id, dispatch, history)}>Edit</div>
                            <div className="bus_delete" onClick={() => deleteBusiness(business.id, user.id, dispatch, history)}>Delete</div>
                        </div>
                    }
                </div>
                {
                    business.average ?
                    <div className="average_and_stars">
                        <StarRatingInput rating={Math.round(business.average)} form={false}/>
                        <div>{business.numReviews} reviews</div>
                        {/* <div>({String(business.average).slice(0,4)})</div> */}
                    </div>
                    :
                    <div className="first_review">Leave the first review!</div>
                }
                <div>{business.address}</div>
                <div>{business.city}, {business.state}</div>
                <div>{business.description}</div>
            </div>
        </div>
    )
}
