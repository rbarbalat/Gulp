import StarRatingInput from "../StarRatingInput";
import "./TopCard.css";

export default function TopCard({business})
{
    if(Object.keys(business).length === 0) return <div>loading</div>

    //the non variable styles can be moved to the css file later
    const styles = {
        // backgroundImage: `url(${business.preview_image})`,
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
                    <div className = "star_wrapper"><StarRatingInput rating={business.average} form={false}/></div>
                }
                {
                    business.numReviews > 0 &&
                    <div className = "single_bus_rating">{String(business.average).slice(0,4)} stars <span>{business.numReviews} reviews</span></div>
                }
                {
                    business.numReviews === 0 &&
                    <div className="no_reviews_top_card">No Reviews Yet</div>
                }
            </div>
        </div>
    )
}
