// src/helloworld.js
import React from "react";
import axios from "axios";
import Child from "./child";

// export default function HelloWorld() {
//     return <div>Hello, World!</div>; //this is an example of JSX
// }

////------------------------------------------ CLASS COMPONENT -----------------------------------------------------------//
// creating the component above but with a class
export default class HelloWorld extends React.Component {
    constructor() {
        super();
        // creating state. once information is stored in state, we can render it on screen. (similar to data: {} in vue)
        this.state = {
            first: "Martin",
            last: "Paul",
        };
    }

    //this is the React equivalent of 'mounted' in vue
    componentDidMount() {
        // // --------- in vue we would do smt like
        // axios.get('/images').then(function(resp) {
        //     self.images = resp.data;
        // });
        // //--------- in react we do (but not with resp)
        // axios.get("/some-route").then((resp) => {
        //     // this.setState is the function we use to update state in react
        //     this.setState({
        //         // first: "Martinado",
        //         first: resp.data.first, //example of how we might update state
        //     });
        // });
        // //For the purposes of deminstration, we'recalling setTimeout to simulate the asynchronicity (which just means 'it takes time to complete') of an axios request
        // setTimeout(() => {
        //     this.setState({
        //         first: "Penis",
        //     });
        // }, 3000);
    }

    render() {
        return (
            <div>
                Hello, {this.state.first} of house {this.state.last}
                <Child lastName={this.state.last} />
            </div>
        );
    }
}
