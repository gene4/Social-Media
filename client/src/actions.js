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

export const getOtherFriends = async ({ userId }) => {
    try {
        const { data } = await axios.get(`/other-friends/${userId}`);
        return {
            type: "RECEIVE_OTHER_FRIENDS",
            payload: data,
        };
    } catch (error) {
        console.log("error in axios to other friends", error);
    }
};

export const acceptFriendRequest = async (wanabeId) => {
    await axios.post(`/accept-request/${wanabeId}`);
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
    return {
        type: "LAST_10_MESSAGES",
        payload: messages,
    };
};

export const chatMessage = async (message) => {
    console.log("new chat msg", message);
    return {
        type: "NEW_MESSAGE",
        payload: message,
    };
};

export const getPosts = async (userId) => {
    console.log("trying to get posts", userId);
    try {
        const { data } = await axios.get(`/posts/${userId}`);
        console.log("got posts:", data);
        if (Array.isArray(data)) {
            return {
                type: "GET_POSTS",
                payload: data,
            };
        } else {
            return {
                payload: {},
            };
        }
    } catch (error) {
        console.log("error in axios to posts", error);
    }
};

export const insertPost = async (postData) => {
    try {
        const { data } = await axios.post(`/insert/post`, postData);
        console.log("data from insert post", data);
        if (data.success) {
            return {
                type: "INSERT_POSTS",
                payload: data.post,
            };
        }
    } catch (error) {
        console.log("error in inserting posts", error);
    }
};
