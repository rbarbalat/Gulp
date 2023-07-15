import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import { thunkLoadSingleBusiness } from "../../store/business";
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
    async function linkEdit()
    {
        //load the singleBus in the store so the useSelector in
        //the edit form can access it right away
        const res = await dispatch(thunkLoadSingleBusiness(business.id));
        if(res.error)
        {
            console.log("bad response from inside linkEdit in BusCard");
            console.log(res);
        }else{
            console.log("good response from inside linkEdit");
            console.log(res);
            history.push(`/businesses/${business.id}/edit`);
        }
    }
    async function deleteBus()
    {
        return null;
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
                <div className="bus_card_name_and_buttons_wrapper">
                    <div className = "business_name" onClick={linkBusiness}>{business.name}</div>
                    {
                        isOwner &&
                        <div className = "bus_card_buttons">
                            <button onClick={linkEdit}>Edit</button>
                            <button onClick={deleteBus}>Delete</button>
                        </div>
                    }
                </div>
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
