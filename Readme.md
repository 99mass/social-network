# Social Network Project Readme
## Overview

Welcome to our Social Network project! This web application allows users to connect, share posts, create and join groups, send private messages, and much more. The project is built using a combination of frontend and backend technologies, including NextJS for the frontend, Go for the backend, SQLite for the database, and Docker for containerization.
### Table of Contents

   * Getting Started
        * Prerequisites
        * Installation
   * Folder Structure
   * Backend
       * App Logic
       * Database Structure
       * Migrations
       * Docker Container
   * Frontend
       * JS Framework
       * Docker Container
   * Authentication
   * Features
       * Followers
       * Profile
       * Posts
       * Groups
       * Chat
       * Notifications
   * Allowed Packages

### Getting Started
#### Prerequisites

Make sure you have the following installed on your system:

   * Go
   * Node.js
   * Docker

#### Installation

   1. Clone the repository:
        
    git clone [repository-url]
    cd social-network



   2. Set up the backend:

    cd backend/server
    go run server.go



   3. Set up the frontend:

    cd frontend
    # Install dependencies and start the development server
    npm install
    npm run dev
    make dev

    Open your browser and navigate to http://localhost:3000 to see the application.

### Folder Structure

The project follows a structured folder layout for easy navigation and organization. The key folders are:

   * backend: Contains the backend application logic, server setup, and database operations.
   * frontend: Holds the frontend development files, including HTML, CSS, and JavaScript.

### Backend
#### App Logic

The backend logic handles user authentication, post creation, group management, private messaging, and more. Middleware functions are implemented for tasks like authentication, image handling, and WebSocket connections.
#### Database Structure

SQLite is used for the database, and the structure is defined based on an entity-relationship diagram. The pkg/db folder includes migrations and database-related functionalities.
#### Migrations

The migration system is implemented using the golang-migrate package. Migrations are stored in the pkg/db/migrations/sqlite folder and applied during the application's startup.
#### Docker Container

The backend is containerized using Docker, making it easy to deploy and manage. The Docker image is created to handle server-side logic, requests, and interaction with the SQLite database.
### Frontend
#### JS Framework

The frontend is built using a chosen JS framework Next.js to simplify development, enhance responsiveness, and improve performance.
#### Docker Container (Frontend)

The frontend is containerized using Docker, providing a clean and isolated environment for serving client-side code. The Docker image is created to handle HTML, CSS, and JavaScript files and communicates with the backend via HTTP requests.
#### Authentication

User registration and login are implemented with sessions and cookies for persistent authentication. The registration form collects essential user information, including email, password, first name, last name, date of birth, and optional fields like avatar, nickname, and about me.
### Features
#### Followers

Users can follow and unfollow each other. Follow requests are initiated by sending a request to the desired user, who can accept or decline the request. Public profiles automatically accept follow requests.
#### Profile

User profiles display information such as user details, activity (posts), and a list of followers and following users. Profiles can be public or private, and users can toggle their profile visibility.
#### Posts

Users can create posts and comments, including images or GIFs. Posts can be public, private (visible to followers only), or almost private (visible to selected followers).
#### Groups

Users can create groups with titles and descriptions, inviting others to join. Group members can create posts, comments, and events. Event details include title, description, day/time, and options for attending.
#### Chat

Private messages can be sent between users who are following each other. Groups have a common chat room, allowing members to send and receive messages.
### Notifications

Users receive notifications for follow requests, group invitations, group join requests, and created group events. Notifications are visible across all pages.
#### Packages Used

The project allows the use of:
 * standard Go packages
 * Gorilla WebSocket
 * golang-migrate
 * sql-migration
 * migration
 * sqlite3
 * bcrypt
 * UUID.

## Author
* Samba DIOP (ssambadi)
* Mouhamet Alioune DIOUF (mouhametadiouf)
* Oumar SAMB (osamb)
* Alassane DIOP (dalassane)
* Elhadji Malick LO (alo)
* Alain Gildas OGOU (alogou)  
## License
This project is licensed under the Zone01 License.

Feel free to explore, modify, and enhance the project as you see fit. Happy coding !!!