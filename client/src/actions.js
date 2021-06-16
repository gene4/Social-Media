import axios from "./axios";

export const receiveFriendsAndWannabes = async () => {
    const { data } = await axios.get("/friends.json");
    console.log("friends list", data);
    if (data.length > 0) {
        return {
            type: "RECEIVE_FRIENDS_WANNABES",
            payload: data,
        };
    } else
        return {
            type: "RECEIVE_FRIENDS_WANNABES",
            error: true,
        };
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
