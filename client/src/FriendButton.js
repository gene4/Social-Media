import { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ userId }) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        let abort;
        console.log("userId", userId);
        axios.get(`/friendship-status/${userId}`).then(({ data }) => {
            if (!abort) {
                console.log("friendship data", data);
                if (!data[0]) {
                    setButtonText("Send Friend Request");
                } else {
                    if (data[0] && data[0].accepted == false) {
                        if (data[0].sender_id == userId) {
                            setButtonText("Accept Friend Request");
                        } else {
                            setButtonText("Cancel Friend Request");
                        }
                    } else if (data[0] && data[0].accepted == true) {
                        setButtonText("End Friendship");
                    }
                }
            }
        });
        return () => {
            abort = true;
        };
    }, []);

    function clickHandler() {
        if (buttonText === "Send Friend Request") {
            setButtonText("Cancel Friend Request");
            axios.post(`/make-request/${userId}`);
        }
        if (buttonText === "Cancel Friend Request") {
            setButtonText("Send Friend Request");
            axios.post(`/cancel-request/${userId}`);
        }

        if (buttonText === "Accept Friend Request") {
            setButtonText("End Friendship");
            axios.post(`/accept-request/${userId}`);
        }

        if (buttonText === "End Friendship") {
            setButtonText("Send Friend Request");
            axios.post(`/cancel-request/${userId}`);
        }
    }

    return (
        <button className="friend-button" onClick={() => clickHandler()}>
            {buttonText}
        </button>
    );
}
