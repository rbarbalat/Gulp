import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkLoadSingleBusiness } from "../../store/business";


export default function SingleBusiness()
{
    const { business_id } = useParams();
    const business = useSelector(state => state.businesses.singleBus);
    const busIsEmpty = Object.keys(business).length == 0;

    const dispatch = useDispatch();
    useEffect(async () => {
        //if(Number(business_id) !== business.id)
        const res = await dispatch(thunkLoadSingleBusiness(business_id));
        console.log("res in useEffect")
        console.log(res)
    }, [dispatch, business_id])

    if(busIsEmpty) return <div>loading</div>
    return(
        <div>
            <h1>Single Business Page</h1>
            <div style={{"color": "red"}}>Name</div>
            <div>{business.name}</div>
            <div style={{"color": "red"}}>Description</div>
            <div>{business.description}</div>
            <div style={{"color": "red"}}>address</div>
            <div>{business.address}</div>
            <div style={{"color": "red"}}>location</div>
            <div>{business.city}, {business.state}</div>
            <div style={{"color": "red"}}>preview image</div>
            <div>{business.preview_image}</div>
            <div style={{"color": "red"}}>Rating</div>
            <div>{business.average}</div>
            <div style={{"color": "red"}}>Number of Reviews</div>
            <div>{business.numReviews}</div>

            <p style={{"color": "red"}}>
                Owned by {business.owner.username}
            </p>

            <p style={{"color": "red"}}>
                Business Images
            </p>

            <p>
                <ul>
                    {
                        business.images.map(image => (
                           <li key = {image.id}>
                                {image.url}
                           </li>
                        ))
                    }
                </ul>
            </p>

        </div>
    )
}
