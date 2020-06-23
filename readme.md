# Social Network - amJam

A musician-oriented social network for casual/amateur musicians to meet up and organize jam-sessions. This is a single-page React.js web application.

## Features

-   Welcome Page
    -   Register/login
    -   Reset password - receive email with code that allows you to change your account password
-   Profile Page
    -   Upload profile picture
    -   Create personal bio on profile-page
-   Friends Page
    -   Shows current friends, and pending friendrequests to you
    -   Accet/decline/end friendships
-   Search Page
    -   Before search: shows 3 most recently joined members
    -   Search by first or last name
    -   Click on search result to view other user's profile page and make friend-request
-   Friendships with other users
    -   send friendrequest
    -   cancel sent friendrequest
    -   accept/decline friendrequest
    -   unfriend
-   Chat Page
    -   Public chat - chat with anyone who is currently logged in
    -   Private chat
        -   view all your private chats (organized by most recently chatted with)
        -   search among your friends and start chat
        -   red/green highlight on search-result to indicate whether or not you currently have an active chat with friend
        -   realtime orange-highlight notification for when friend whose chat window you currently are not in sent you a message

## Tech Stack

-   React
-   Redux
-   Node.js
-   Express
-   Socket.IO - for live-chat
-   Amazon Web Services - for storing the uploaded images and sending password-reset email
-   PostgreSQL - for storing
    -   user info (first- last name, email, hashed password, bio, profile picture url)
    -   friendships (active, pending)
    -   chat messages (public, private)

## Screenshots

### Profile Page

![](./public/screenshots/1.png)
![](./public/screenshots/2.png)

### Friends Page

### Search Page

###

###

![](./public/screenshots/3.png)
![](./public/screenshots/4.png)
![](./public/screenshots/5.png)
