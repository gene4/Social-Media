import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, insertPost } from "./actions";

export default function Wall({ userId }) {
    const [draft, setDraft] = useState("");

    const posts = useSelector((state) => state && state.posts);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPosts(userId));
    }, []);
    console.log("posts:", posts);

    return (
        <div className="wall">
            <div className="posts-container">
                {posts &&
                    posts.map((each, index) => (
                        <div key={index}>
                            <Link to={`/user/${each.sender_id}`}>
                                <p className="post-user">
                                    {" "}
                                    <img
                                        width="40"
                                        height="40"
                                        src={each.url}
                                    />{" "}
                                    {each.first} {each.last}:
                                </p>
                            </Link>
                            <div className="post">
                                <p>{each.post}</p>
                            </div>
                        </div>
                    ))}
            </div>
            <textarea
                wrap="off"
                onChange={(e) => setDraft(e.target.value)}
                defaultValue=""
            ></textarea>
            <button
                onClick={() =>
                    dispatch(
                        insertPost({
                            post: draft,
                            recipientId: userId,
                        })
                    )
                }
            >
                Post
            </button>
        </div>
    );
}
