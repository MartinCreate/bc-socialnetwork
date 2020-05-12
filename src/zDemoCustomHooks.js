////---------------------------- in a hooks.js ------------------------------------------------------------------------------------//
import { useState } from "react";
import axios from "axios";

//replace handleChange() with:
export function useStatefulFields() {
    //custom hooks can use other hooks
    const [fields, setFields] = useState({});

    function handleChange({ target }) {
        setFields({
            ...fields,
            [target.name]: target.value,
        });
    }

    return [fields, handleChange];
}

//replace submit() with:
export function useAuthSubmit(url, fields) {
    const [error, setError] = useState(false);

    function submit() {
        axios
            .post(url, fields)
            .then(({ data }) =>
                data.success ? location.replace("/") : setError(true)
            );
    }

    return [error, submit];
}

////---------------------------- in e.g. register.js ------------------------------------------------------------------------------------//
import { useStatefulFields, useAuthSubmit } from "./zDemoCustomHooks";

//Demo of hooks for today's class (12.May)

function Register() {
    //---The commented out code is replaced by the custom hooks
    // const [error, setError] = useState(false);
    // const [fields, setFields] = useState({});

    //  function handleChange({ target }) {
    //      setFields({
    //          ...fields,
    //          [target.name]: target.value,
    //      });
    //  }

    // function submit() {
    //     axios
    //         .post("/register", fields)
    //         .then(({ data }) =>
    //             data.success ? location.replace("/") : setError(true)
    //         );
    // }

    const [error, submit] = useAuthSubmit("/register", fields);
    const [fields, handleChange] = useStatefulFields();

    return <div>register component</div>;
}
