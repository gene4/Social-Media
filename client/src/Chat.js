import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Chat() {
    const elementRef = useRef();

    const chatMessages = useSelector((state) => state && state.messages);

    useEffect(() => {
        elementRef.current.scrollTop =
            elementRef.current.scrollHeight - elementRef.current.clientHeight;
    }, [chatMessages]);

    console.log("chatMessages", chatMessages);

    function addClass(index) {
        if (index % 2 == 0) {
            return "even";
        } else {
            return "odd";
        }
    }

    function keyCheck(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            //emit to server
            socket.emit("new chat message", e.target.value);
            e.target.value = "";
        }
    }
    return (
        <div className="chat">
            <div className="chat-container" ref={elementRef}>
                {chatMessages &&
                    chatMessages.map((each, index) => (
                        <div className="message" key={index}>
                            <Link to={`/user/${each.id}`}>
                                {" "}
                                <img
                                    width="40"
                                    height="40"
                                    src={each.url}
                                />{" "}
                            </Link>
                            <p className={addClass(index)}>{each.message}</p>
                        </div>
                    ))}
            </div>
            <textarea
                onKeyDown={keyCheck}
                placeholder="Add your chat here..."
            ></textarea>
        </div>
    );
}
