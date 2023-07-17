import "./TopCard.css";

export default function TopCard({business})
{
    if(Object.keys(business).length === 0) return <div>loading</div>
    // return <div>Hello World!!! from business {business.id}</div>

    //the non variable styles can be moved to the css file later
    const styles = {
        backgroundImage: `url(${business.preview_image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
    }
    return(
        <div className = "top_card_wrapper" style={styles}>
            <div className = "top_info_wrapper">
                <div className = "single_bus_name">{business.name}</div>
                <div className = "single_bus_rating">{business.average} stars and <span>{business.numReviews} reviews</span></div>
                <div className = "single_bus_address">{business.address}</div>
                <div className = "single_bus_location">{business.city}, {business.state}</div>
                {/* <div className = "single_bus_description">{business.description}</div> */}
            </div>
        </div>
    )
}
