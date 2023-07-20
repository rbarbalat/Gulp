import {useHistory} from "react-router-dom";
import StarRatingInput from "../StarRatingInput";
import "./MiniBusCard.css";

export default function MiniBusCard({business})
{
    const history = useHistory();

    function linkBusiness()
    {
        history.push(`/businesses/${business.id}`)
    }

    if(Object.keys(business).length === 0) return <div>loading</div>
    return(
        <div className = "mini_bus_card_wrapper" onClick={linkBusiness}>
                <div className = "mini_business_name">{business.name}</div>
                {
                    business.average ?
                    <div className="mini_average_and_stars">
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
                    <div className="mini_first_review">Leave the first review!</div>
                }
            <div className = "mini_preview_image_wrapper">
                <img alt="mini preview" className ="mini_bus_preview" src={business.preview_image}></img>
            </div>
        </div>
    )
}
