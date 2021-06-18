import axios from "./axios";

export const receiveFriendsAndWannabes = async () => {
    try {
        const { data } = await axios.get("/friends.json");
        if (data.length) {
            return {
                type: "RECEIVE_FRIENDS_WANNABES",
                payload: data,
            };
        } else {
            console.log("error in receiveFriendsAndWannabes");
            return {
                type: "RECEIVE_FRIENDS_WANNABES",
                error: true,
            };
        }
    } catch (error) {
        console.log("error in axios to /friends.json", error);
    }
};

export const acceptFriendRequest = async (wanabeId) => {
    console.log("in action about to make post", wanabeId);
    await axios.post(`/accept-request/${wanabeId}`);
    console.log("in action", wanabeId);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        payload: wanabeId,
    };
};

export const unfriend = async (canceledId) => {
    await axios.post(`/cancel-request/${canceledId}`);

    return {
        type: "UNFRIEND",
        payload: canceledId,
    };
};

export const chatMessages = async (messages) => {
    console.log("IN ACTION LAST 10", messages);
    return {
        type: "LAST_10_MESSAGES",
        payload: messages,
    };
};

export const chatMessage = async (message) => {
    console.log("IN ACTION new message", message);
    return {
        type: "NEW_MESSAGE",
        payload: message,
    };
};
