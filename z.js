// let rows = [
//     {
//         id: 204,
//         first: "Zz",
//         last: "zZ",
//         email: "zz@zz",
//         password:
//             "$2a$10$49V3Zclvd/to4mrYJN8l1OL3miYVuMpxcTzbVVyqJv7WXIj385GpG",
//         image_url:
//             "https://martinpaul-msg-socialnetwork.s3.eu-central-1.amazonaws.com/gi8JTOb2eet8IGIkWGqK_Lh7y3R30_Dq.jpg",
//         bio: null,
//         created_at: "2020-05-08T08:29:49.544Z",
//     },
//     {
//         id: 202,
//         first: "Wyatt",
//         last: "Hyland",
//         email: "msg199@example.com",
//         password:
//             "$2a$10$4nXON5ppATl3dCl2ywISUuIDXFZ3JvBsYNccRZp7IjgBdV52/SCB6",
//         image_url:
//             "https://images-na.ssl-images-amazon.com/images/M/MV5BMjEzNjAzMTgzMV5BMl5BanBnXkFtZTcwNjU2NjA2NQ@@._V1_UY256_CR11,0,172,256_AL_.jpg",
//         bio:
//             "Brother-in-Law. Step-Father. Exotic Dancer. If you can't take the kitsch... 🌛🧲🚕",
//         created_at: "2020-05-07T07:13:20.415Z",
//     },
//     {
//         id: 201,
//         first: "Georgina",
//         last: "Murphy",
//         email: "msg198@example.com",
//         password:
//             "$2a$10$4nXON5ppATl3dCl2ywISUuIDXFZ3JvBsYNccRZp7IjgBdV52/SCB6",
//         image_url:
//             "https://images-na.ssl-images-amazon.com/images/M/MV5BMTQ1Mzg3NTA0OF5BMl5BanBnXkFtZTcwNTgyNTM5OQ@@._V1_UY256_CR84,0,172,256_AL_.jpg",
//         bio:
//             "Roommate. Step-Daughter. Baker. It's good to be the king. 🏒🛹⭐️",
//         created_at: "2020-05-07T07:13:20.415Z",
//     },
// ];

// // console.log("rows: ", rows);

// rows.map((each) => console.log("each: ", each.id));

//checking if toLowerCase() is mutating (it's not)
// async function example() {
//     const word = "Apple";
//     const wordy = await word.toLowerCase();

//     console.log("word: ", word);
//     console.log("wordy: ", wordy);
// }

//Getting friends:

//Getting requests:
// let requestArr = [];
let requests = "";
for (let i = 80; i == 100; i++) {
    requests += `INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, ${i}, FALSE); `;
}

console.log("requests: ", requests);
