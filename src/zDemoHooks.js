import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function Hello() {
    const [first, setFirst] = useState("Mortin");
    //---the above line does the same as the lines below in class:
    // this.state({
    //     first: 'Andrea'
    // });
    //---setFirst is a function that lets us change the value of 'first'
    const [country, setCountry] = useState("");
    const [countries, setCountries] = useState([]);

    // useEffect(() => {
    //     console.log(`'${first}', has been rendered in useEffect!`);
    // });

    useEffect(() => {
        console.log("useEffect runs!");

        axios
            .get(`http://flame-egg.glitch.me/?q=${country}`)
            .then(({ data }) => {
                // console.log("data from flame egg: ", data);
                setCountries(data);
            });

        //the "return" below is called a 'cleanup function'
        return () => {
            //this function runs before the useEffect code above
            console.log(`about to replace ${country} with a new value`);
        };
    }, [country]);

    ////--------- for project --------//
    //// the code below takes care of out of order requests (like we did in incremental search)
    function User({ id }) {
        const [user, setUser] = useState();
        useEffect(() => {
            //declare abort, but leave it undefined/falsy
            let abort;
            (async () => {
                //because axios takes some time to complete, in that time we could've received a new id which would cause a new re-render, and when that happens, our cleanup function runs before the next rerender. When the actual render happens, useEffect runs again and redeclares abort as undefined.
                const { data } = await axios.get(`/other-user/${id}`);
                // if abort is falsy, setUser
                if (!abort) {
                    setUser(data.user);
                }
            })();

            //if the id changes, set abort to true, which makes sure setUser doesn't run
            return () => {
                abort = true;
            };
        }, [id]);

        /* ... */
    }
    ////--------- for project above --------//

    return (
        <div>
            <p>Hello {first}! We are learning hooks today!!</p>
            <input
                onChange={(e) => setFirst(e.target.value)}
                placeholder="First Name"
            />
            <input
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
            />
            <ul>
                {/* for my project, use the user's id as the key  */}
                {countries.map((countryExample) => (
                    <li key={countryExample}>{countryExample}</li>
                ))}
            </ul>
        </div>
    );
}
