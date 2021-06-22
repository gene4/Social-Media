import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, insertPost } from "./actions";

export default function Wall({ userId }) {
    const elementRef = useRef();

    const [inputValue, setInputValue] = useState("");

    const posts = useSelector((state) => state && state.posts);

    const dispatch = useDispatch();
    console.log("posts:", posts);
    useEffect(() => {
        if (userId) {
            dispatch(getPosts(userId));
        }
    }, [userId]);

    console.log("elementRef.current.scrollTop", elementRef.current);

    function sendPost(e) {
        console.log("post sent");
        dispatch(
            insertPost({
                post: inputValue,
                recipientId: userId,
            })
        );
        setInputValue("");
    }
    if (!posts) {
        return null;
    }

    return (
        <div className="wall">
            <div className="posts-container">
                {posts && !posts.length && <p>No posts yet!</p>}
                {posts &&
                    posts.map((post, index) => (
                        <div key={index}>
                            <Link to={`/user/${post.sender_id}`}>
                                <p className="post-user">
                                    {" "}
                                    <img
                                        width="40"
                                        height="40"
                                        src={post.url}
                                    />{" "}
                                    {post.first} {post.last}:
                                </p>
                            </Link>
                            <div className="post">
                                <p>{post.post}</p>
                            </div>
                        </div>
                    ))}
            </div>
            <textarea
                wrap="off"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
            ></textarea>
            <button onClick={sendPost}>Post</button>
        </div>
    );
}
