export const LOAD_REPLIES = 'reviews/LOAD_REPLIES';
export const LOAD_SINGLE_REPLY = "reviews/LOAD_SINGLE_REPLY";
export const RECEIVE_REPLY = 'reviews/RECEIVE_REPLY';
export const UPDATE_REPLY = 'reviews/UPDATE_REPLY';
export const REMOVE_REPLY = 'reviews/REMOVE_REPLY';

const actionLoadReplies = (replies) => {
    return {
        type: LOAD_REPLIES,
        replies
    }
}

export const thunkLoadRepliesOfUser = () => async (dispatch) => {
    const res = await fetch("/api/replies/current");
    if(res.ok)
    {
        const serverData = await res.json();
        dispatch(actionLoadReplies(serverData));
        return serverData;
    }
    else
    {
        const errorData = await res.json();
        return errorData;
    }
}

const actionReceiveReply = (reply) => {
    return {
        type: RECEIVE_REPLY,
        reply
    }
}

export const thunkReceiveReply = (review_id, reply) => async (dispatch) => {
    const options = {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reply)
    };

    const res = await fetch(`/api/reviews/${review_id}/replies`, options);
    if(res.ok)
    {
        const serverData = await res.json();
        dispatch(actionReceiveReply(serverData));
        return serverData;
    }
    else
    {
        const errorData = await res.json();
        return errorData;
    }
}

const actionUpdateReply = (reply) => {
    return {
        type: UPDATE_REPLY,
        reply
    }
}

export const thunkUpdateReply = (reply_id, reply) => async (dispatch) => {
    const options = {
        method: "Put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reply)
    };

    const res = await fetch(`/api/replies/${reply_id}`, options);
    if(res.ok)
    {
        const serverData = await res.json();
        dispatch(actionUpdateReply(serverData));
        return serverData;
    }
    else
    {
        const errorData = await res.json()
        return errorData;
    }
}


const actionDeleteReply = (reply_id) => {
    return {
        type: REMOVE_REPLY,
        reply_id
    }
}

export const thunkDeleteReply = (id) => async (dispatch) => {
    const options = {
        method: "Delete"
    };

    const res = await fetch(`/api/replies/${id}`, options);
    if(res.ok)
    {
        const serverData = await res.json();
        dispatch(actionDeleteReply(id));
        return serverData;
    }
    else
    {
        const errorData = await res.json();
        return errorData;
    }
}

const initialState = {
    allReplies: {},
    singleReply: {}
}

const replyReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REPLIES:
            const normReplies = {};
            action.replies.forEach(ele => {
                normReplies[ele.id] = ele;
            })
            return {...state, allReplies: normReplies}
        case LOAD_SINGLE_REPLY:
            return {...state, singleReply: {...action.singleReply}}
        case RECEIVE_REPLY:
            return {
                ...state,
                allReplies: {...state.allReplies, [action.reply.id]: action.reply  },
                singleReply: {...action.reply}
            }
        case UPDATE_REPLY:
            return {
                ...state,
                allReplies: {...state.allReplies, [action.reply.id]: action.reply  },
                singleReply: {...state.singleReply, ...action.reply}
            }
        case REMOVE_REPLY:
            const newAllReplies = {...state.allReplies};
            delete newAllReplies[action.reply_id];
            return {allRev: newAllReplies, singleReply: {}}
        default:
            return state;
    }
}

export default replyReducer;
