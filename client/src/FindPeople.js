import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import FriendButton from "./FriendButton";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!searchInput) {
            axios
                .get("/users/last")
                .then(({ data }) => {
                    setUsers(data);
                })
                .catch((e) => {
                    console.log("cant find users", e);
                });
        }
    }, []);

    useEffect(() => {
        let abort;

        if (searchInput) {
            axios
                .get(`/users/search/${searchInput}`)
                .then(({ data }) => {
                    console.log("data", data);
                    if (!abort) {
                        if (data.length == 0) {
                            console.log("elseifblock");
                            // setError(true);
                        } else {
                            // setError(false);
                            setUsers(data);
                        }
                    }
                })
                .catch((e) => {
                    setError(true);
                    console.log("cant find users", e);
                });
        }

        return () => {
            abort = true;
        };
    }, [searchInput]);

    return (
        <div>
            <div className="search">
                <h1>Who are you looking for?</h1>
                <input
                    onChange={(e) => setSearchInput(e.target.value)}
                    defaultValue={searchInput}
                />
            </div>

            <div className="users">
                {error && <h1>No person found!</h1>}
                {users.map((each, index) => (
                    <div key={index}>
                        <Link to={`/user/${each.id}`}>
                            <img width="200" height="200" src={each.url} />

                            <p>
                                {each.first} {each.last}
                            </p>
                        </Link>
                        <FriendButton userId={each.id} />
                    </div>
                ))}
            </div>
        </div>
    );
}
