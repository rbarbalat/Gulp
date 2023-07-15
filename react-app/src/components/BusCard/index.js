import {useHistory} from "react-router-dom";
import "./BusCard.css";

export default function BusCard({business, user})
{
    const isOwner = user?.id === business?.owner_id;
    const history = useHistory();
    function linkBusiness()
    {
        history.push(`/businesses/${business.id}`)
    }
    if(Object.keys(business).length === 0) return <div>loading</div>
    // return <div>Hello World!!! from business {business.id}</div>
    return(
        <div className = "bus_card_wrapper">
            <div className = "preview_image_wrapper">
                {/* <img className ="bus_preview" src={business.preview_image}></img> */}
                <img className ="bus_preview"></img>
            </div>
            <div className = "bus_info_wrapper">
                <div className = "business_name" onClick={linkBusiness}>{business.name}</div>
                {
                    business.average ?
                    <div>{String(business.average).slice(0,4)} stars</div>
                    :
                    null
                }
                {
                    business.numReviews > 0 ?
                    <div>{business.numReviews} reviews</div>
                    :
                    <div>No reviews yet!</div>
                }
                {/* <div>{business.numReviews} reviews</div> */}
                <div>{business.description}</div>
            </div>
        </div>
    )
}
