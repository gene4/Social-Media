export default function reducer(state = {}, action) {
    let newState = {};
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        newState = {
            ...state,
            friendsAndWannabes: action.payload,
        };
    } else if (action.type == "RECEIVE_OTHER_FRIENDS") {
        newState = {
            ...state,
            friends: action.payload,
        };
    } else if (action.type == "ACCEPT_FRIEND_REQUEST") {
        newState = {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.map((user) => {
                console.log("action.payload", action.payload);
                if (user.id === action.payload) {
                    console.log("updating user value");
                    return {
                        ...user,
                        accepted: true,
                    };
                } else {
                    return user;
                }
            }),
        };
    } else if (action.type == "UNFRIEND") {
        newState = {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.filter((user) => {
                if (user.id != action.payload) {
                    return {
                        ...user,
                    };
                }
            }),
        };
    } else if (action.type == "LAST_10_MESSAGES") {
        newState = {
            ...state,
            messages: action.payload,
        };
    } else if (action.type == "NEW_MESSAGE") {
        newState = {
            ...state,
            messages: state.messages.map((message) => {
                state.messages.push(action.payload);
                return {
                    ...message,
                };
            }),
        };
    } else if (action.type == "GET_POSTS") {
        newState = {
            ...state,
            posts: action.payload,
        };
    } else if (action.type == "INSERT_POSTS") {
        newState = {
            ...state,
            posts: state.posts.map((post) => {
                state.posts.push(action.payload);
                return {
                    ...post,
                };
            }),
        };
    }

    return newState;
}
