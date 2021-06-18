import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    acceptFriendRequest,
    unfriend,
    receiveFriendsAndWannabes,
} from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const friendsAndWannabes = useSelector((state) => state.friendsAndWannabes);

    useEffect(() => {
        dispatch(receiveFriendsAndWannabes());
    }, []);

    console.log("friendsAndWannabes", friendsAndWannabes);
    return (
        <div className="friends">
            {!friendsAndWannabes && <h1>No friends yet!</h1>}
            {friendsAndWannabes && <h1>Friends</h1>}
            <div className="users">
                {friendsAndWannabes &&
                    friendsAndWannabes
                        .filter(({ accepted }) => accepted)
                        .map((each, index) => (
                            <div key={index}>
                                <Link to={`/user/${each.id}`}>
                                    <img
                                        width="100"
                                        height="100"
                                        src={each.url}
                                    />

                                    <p>
                                        {each.first} {each.last}
                                    </p>
                                </Link>
                                <button
                                    onClick={() => dispatch(unfriend(each.id))}
                                >
                                    End Friendship
                                </button>
                            </div>
                        ))}
            </div>
            {friendsAndWannabes && <h1>Requests</h1>}
            <div className="users">
                {friendsAndWannabes &&
                    friendsAndWannabes
                        .filter(({ accepted }) => !accepted)
                        .map((each, index) => (
                            <div key={index}>
                                <Link to={`/user/${each.id}`}>
                                    <img
                                        width="100"
                                        height="100"
                                        src={each.url}
                                    />

                                    <p>
                                        {each.first} {each.last}
                                    </p>
                                </Link>
                                <button
                                    onClick={() =>
                                        dispatch(acceptFriendRequest(each.id))
                                    }
                                >
                                    Accept Friendship
                                </button>
                                <button
                                    onClick={() => dispatch(unfriend(each.id))}
                                >
                                    Reject Friendship
                                </button>
                            </div>
                        ))}
            </div>
        </div>
    );
}
