import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOtherFriends } from "./actions";

export default function OtherFriends(userId) {
    const dispatch = useDispatch();
    const friends = useSelector((state) => state.friends);

    useEffect(() => {
        let abort;
        if (!abort) {
            dispatch(getOtherFriends(userId));
        }
        return () => {
            abort = true;
        };
    }, []);

    if (!friends) {
        return null;
    }
    return (
        <div className="friends">
            {!friends.length && <h1>No friends yet!</h1>}
            {friends.length > 0 && <h1>Friends</h1>}
            <div className="users">
                {friends
                    .filter(({ accepted }) => accepted)
                    .map((each, index) => (
                        <div key={index}>
                            <Link to={`/user/${each.id}`}>
                                <img width="70" height="70" src={each.url} />

                                <p>
                                    {each.first} {each.last}
                                </p>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
}
