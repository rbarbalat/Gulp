import StarRatingInput from "../StarRatingInput";
import "./TopCard.css";

export default function TopCard({business})
{
    if(Object.keys(business).length === 0) return <div>loading</div>

    const styles = {
        backgroundImage: `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.2)), url(${business.preview_image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
    }
    return(
        <div className = "top_card_wrapper" style={styles}>
            <div className = "top_info_wrapper">
                <div className = "single_bus_name">{business.name}</div>
                {
                    business.numReviews > 0 &&
                    <div className = "star_wrapper">
                        <StarRatingInput rating={business.average} form={false}/>
                        <span>&nbsp;{String(business.average).slice(0,4)}</span>
                    </div>
                }
                {
                    business.numReviews > 0 &&
                    <div className = "single_bus_num_reviews">{business.numReviews} reviews</div>
                }
                {
                    business.numReviews === 0 &&
                    <div className="no_reviews_top_card">No Reviews Yet</div>
                }
            </div>
        </div>
    )
}
