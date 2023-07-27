
import "./ReplyCard.css";
export default function ReplyCard({reply, owner})
{
    let date = new Date(reply?.created_at)?.toDateString()?.slice(4);
    if(date)
    {
       if(date[4] === "0")
       date = date.slice(0,4) + date.slice(5);
    }
    return (
        <div className = "single_reply_wrapper">
            <div className = "single_reply_image_and_owner_wrapper">
                <div className = "single_reply_image_wrapper">
                    <img className = "single_reply_owner_pic" alt="owner" src={owner.url}></img>
                </div>
                <div className = "single_reply_owner">{owner.username}</div>
            </div>
            <div className = "single_reply_date">{date}</div>
            <div className = "single_reply_text">{reply.reply}</div>
        </div>
    )
}
