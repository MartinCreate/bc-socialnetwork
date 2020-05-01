import React from "react";

// export default function Child(props) {
//     console.log("props: ", props);
//     return (
//         <h1>Childish component, birthed from the looms of {props.lastName}</h1>
//     );
// }

//same as above but with class
export default class Child extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick() {
        console.log("handleClick is running!");
        //
        this.setState({
            first: "Murhting",
        });
    }

    render() {
        console.log("this.props: ", this.props);
        return (
            <div>
                Childish component, birthed from the looms of{" "}
                {this.props.lastName}
                <p onClick={() => this.handleClick()}>Click me!</p>
            </div>
            //in the p tag, we use an arrow function, which remember 'this' from HelloWorld, rather than create a new, undefined 'this'. This takes care of the error that the 'this' in handleClick is undefined. (in vue we solved this by doing 'var self = this' outside of the function, but here we can use ES6 thanks to babbel, and in ES6 we can use arrow functions, which don't have the problem with 'this' that regular functions have)
        );
    }
}
