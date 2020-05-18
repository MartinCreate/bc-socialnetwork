import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [recents, setRecents] = useState(true);

    useEffect(() => noSearch(), []);

    useEffect(() => {
        let abort;
        (async () => {
            if (search) {
                const { data } = await axios.get(`/search-users/${search}`);
                if (!abort && typeof data != "string") {
                    setUsers(data);
                    setRecents(false);
                }
            } else {
                noSearch();
            }
        })();

        return () => {
            abort = true;
        };
    }, [search]);

    function noSearch() {
        setRecents(true);
        axios.get(`/most-recent`).then(({ data }) => {
            setUsers(data);
        });
    }

    return (
        <div id="search-page">
            <div id="search-left-col">
                <p id="search-header">Find People</p>
                <div className="input-field-div">
                    <input
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="enter first or last name"
                        id="search-input"
                    />
                    <span className="focus-border"></span>
                </div>
            </div>
            <div id="search-results">
                {recents && <h3>Newest Members</h3>}
                {!recents && <h3>Search Results</h3>}

                {users.map((each) => (
                    <Link
                        to={`/user/${each.id}`}
                        key={each.id}
                        id="search-name-link"
                    >
                        <div className="search-result" key={each.id}>
                            <img src={each.image_url || "/default.png"} />
                            <p>
                                {each.first} {each.last}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
