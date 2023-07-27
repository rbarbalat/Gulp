export const LOAD_REPLIES = 'reviews/LOAD_REPLIES';
export const LOAD_SINGLE_REPLY = "reviews/LOAD_SINGLE_REPLY";
export const RECEIVE_REPLY = 'reviews/RECEIVE_REPLY';
export const UPDATE_REPLY = 'reviews/UPDATE_REPLY';
export const REMOVE_REPLY = 'reviews/REMOVE_REPLY';

const actionLoadReplies = (replies) => {
    //reviews is an array of review objects
    return {
        type: LOAD_REPLIES,
        replies
    }
}
//maybe also loadRepliesofBusiness or Review?
export const thunkLoadRepliesOfUser = () => async (dispatch) => {
    try {
        const res = await fetch("/api/replies/current");
        if(res.ok)
        {
            const serverData = await res.json();
            // console.log("good response from thunkLoadReviewsOfUser")
            // console.log(serverData)
            dispatch(actionLoadReplies(serverData));
            return serverData;
        } else {
            const errorData = await res.json();
            // console.log("error response for thunkLoadReviewsOfUser");
            // console.log(errorData);
            return errorData;
        }
    } catch (error){
        // console.log("CAUGHT error response for thunkLoadReviewsOfUser")
        // console.log(error);
    }
}

const actionReceiveReply = (reply) => {
    return {
        type: RECEIVE_REPLY,
        reply
    }
}

export const thunkReceiveReply = (review_id, reply) => async (dispatch) => {
    try {
        const options = {
            method: "Post",
            //add headers application/json
            body: JSON.stringify(reply)
        };
        const res = await fetch(`/api/reviews/${review_id}/replies`, options);
        if(res.ok)
        {
            const serverData = await res.json();
            dispatch(actionReceiveReply(serverData));
            // console.log("good response for thunkReceiveReview");
            // console.log(serverData);
            return serverData;
        }else {
            const errorData = await res.json();
            console.log("error response for thunkReceiveReview");
            console.log(errorData);
            return errorData;
        }
    } catch (error){
        // console.log("CAUGHT error response for thunkReceiveReview");
        // console.log(error);
    }
}

const actionUpdateReply = (reply) => {
    return {
        type: UPDATE_REPLY,
        reply
    }
}
export const thunkUpdateReply = (review_id, reply) => async (dispatch) => {
    try {
        const options = {
            method: "Put",
            //add headers application json
            body: JSON.stringify(reply)
        }
        const res = await fetch(`/api/replies/${review_id}`, options);
        if(res.ok)
        {
            const serverData = await res.json();
            dispatch(actionUpdateReply(serverData));
            // console.log("good response for thunkUpdateReview");
            // console.log(serverData);
            return serverData;
        }else {
            const errorData = await res.json()
            console.log("error response for thunkUpdateReview");
            console.log(errorData);
            return errorData;
        }
    } catch (error){
        // console.log("CAUGHT error response for thunkUpdateReview");
        // console.log(error);
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
    }
    try{
        const res = await fetch(`/api/replies/${id}`, options);
        if(res.ok)
        {
            const serverData = await res.json();
            dispatch(actionDeleteReply(id));
            // console.log("good response from thunkDeleteReview")
            // console.log(serverData)
            return serverData;
        } else {
            const errorData = await res.json();
            console.log("error response for thunkDeleteReview");
            console.log(errorData);
            return errorData;
        }
    } catch(error)
    {
        // console.log("CAUGHT error response for thunkDeleteReview");
        // console.log(error);
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
