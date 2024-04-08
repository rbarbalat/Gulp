import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteReply } from "../../helpers";
import { thunkUpdateReply } from "../../store/reply";
import { thunkLoadSingleBusiness } from "../../store/business";
import "./ReplyCard.css";

export default function ReplyCard({reply})
{
    const user = useSelector(state => state.session.user);
    const owner = useSelector(state => state.businesses.singleBus.owner);
    const { business_id } = useParams();

    const isOwner = user?.id === owner?.id;

    const [confirm, setConfirm] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [content, setContent] = useState(reply ? reply.reply : "");
    const [valErrors, setValErrors] = useState({});

    const dispatch = useDispatch();

    const editAndDelete = (
        <div className="reply_card_buttons_wrapper">
            <div className = "reply_edit" onClick={() => setShowForm(true)}>Edit</div>
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

    let updated_date = null;

    function closeForm()
    {
        setContent(reply?.reply);
        setShowForm(false);
        setValErrors({});
    }
    async function onSubmitReply(event)
    {
        event.preventDefault();

        const res = await dispatch(thunkUpdateReply(reply.id, {
            reply: content
        }));
        if(res.error)
        {
            const errors = {}
            errors.reply = res.error.reply;
            setValErrors(errors);
        }else{
            await dispatch(thunkLoadSingleBusiness(business_id));
            setShowForm(false);
            setValErrors({});
        }
    }

    return (
        <div className = "single_reply_wrapper">
            <div className = "single_reply_top_section">
                <div className = "single_reply_image_and_owner_wrapper">
                    <div className = "single_reply_image_wrapper">
                        <img className = "single_reply_owner_pic" alt="owner" src={owner.url}></img>
                    </div>
                    <div className = "single_reply_owner">{owner.username}</div>
                </div>
                { isOwner && confirm && confirmAndCancel}
                { isOwner && !confirm && editAndDelete}
            </div>
        {
            updated_date ?
            <div className = "single_reply_date">{updated_date} (Updated)</div>
            :
            <div className = "single_reply_date">{date}</div>
        }
            <div className = "single_reply_text">{reply.reply}</div>
        {
                //the classNames are being reused from the create reply form
                //the styles are on ReviewCard.css
                showForm &&
                <div className = "reply_form_wrapper">
                    <form onSubmit={onSubmitReply}>
                        <textarea className = "reply_form_text_area" value={content}
                            onChange={e => setContent(e.target.value)} />
                        <button className = "submit_reply_button">Edit</button>
                    </form>
                    <button className = "cancel_reply_button" onClick={closeForm}>Cancel</button>
                    {valErrors.reply && <div className = "create_reply_error">{valErrors.reply}</div>}
                </div>
        }
        </div>
    )
}
