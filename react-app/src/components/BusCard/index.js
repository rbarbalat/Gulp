import "./BusCard.css";

export default function BusCard({business})
{
    if(Object.keys(business).length === 0) return <div>loading</div>
    // return <div>Hello World!!! from business {business.id}</div>
    return(
        <div className = "bus_card_wrapper">
            <div className = "preview_image_wrapper">
                {/* <img className ="bus_preview" src={business.preview_image}></img> */}
                <img className ="bus_preview"></img>
            </div>
            <div className = "bus_info_wrapper">
                <div>{business.name}</div>
                <div>{business.average} stars and business.numReviews</div>
                <div>{business.description}</div>
            </div>
        </div>
    )
}