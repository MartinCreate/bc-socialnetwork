import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [recents, setRecents] = useState(true);

    useEffect(() => {
        console.log("useEffect is running!");

        axios.get(`/most-recent`).then(({ data }) => {
            setUsers(data);
        });
    }, []);

    useEffect(() => {
        let abort;
        (async () => {
            if (search) {
                const { data } = await axios.get(`/search-users/${search}`);
                if (!abort && typeof data != "string") {
                    setUsers(data);
                    setRecents(false);
                }
            }
        })();

        return () => {
            abort = true;
        };
    }, [search]);

    return (
        <div id="search-container">
            <p>Find People</p>
            <input
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Members"
            />
            <div id="search-results">
                {recents && <h3>Newest Members</h3>}
                {!recents && <h3>Search Results</h3>}

                {users.map((each) => (
                    <div className="search-result" key={each.id}>
                        <Link to={`/user/${each.id}`}>
                            <img src={each.image_url || "/default.png"} />
                        </Link>
                        <p>
                            {each.first} {each.last}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
