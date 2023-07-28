import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteReply } from "../../helpers";
import "./ReplyCard.css";
export default function ReplyCard({reply, owner, user, business_id})
{
    const [confirm, setConfirm] = useState(false);
    const isOwner = user?.id === owner?.id;

    const history = useHistory();
    const dispatch = useDispatch();

    function linkEditReply(){ return null; }
    // function deleteReply(){ return null; }

    const editAndDelete = (
        <div className="reply_card_buttons_wrapper">
            <div className = "reply_edit" onClick={() => linkEditReply(reply.id, dispatch, history)}>Edit</div>
            <div className = "reply_delete" onClick={() => setConfirm(true)}>Delete</div>
        </div>
    );
    const confirmAndCancel = (
        <div className="reply_card_buttons_wrapper">
            <div className = "reply_confirm_delete" onClick={() => deleteReply(reply.id, dispatch, business_id)}>Confirm</div>
            <div className = "reply_cancel_delete" onClick={() => setConfirm(false)}>Cancel</div>
        </div>
    );

    let date = new Date(reply?.created_at)?.toDateString()?.slice(4);
    if(date)
    {
       if(date[4] === "0")
       date = date.slice(0,4) + date.slice(5);
    }
    return (
        <div className = "single_reply_wrapper">
            <div className = "single_reply_top_section">
                <div className = "single_reply_image_and_owner_wrapper">
                    <div className = "single_reply_image_wrapper">
                        <img className = "single_reply_owner_pic" alt="owner" src={owner.url}></img>
                    </div>
                    <div className = "single_reply_owner">{owner.username}&nbsp;<span>(Owner)</span></div>
                </div>
                { isOwner && confirm && confirmAndCancel}
                { isOwner && !confirm && editAndDelete}
            </div>

            <div className = "single_reply_date">{date}</div>
            <div className = "single_reply_text">{reply.reply}</div>
        </div>
    )
}
