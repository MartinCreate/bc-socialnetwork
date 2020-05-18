const bla = [
    { here: "is an object", prop2: 2 },
    { here: "is another object", prop2: 21 },
];

let test;

[...test] = bla;

console.log("test: ", test);
