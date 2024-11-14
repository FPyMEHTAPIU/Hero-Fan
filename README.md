# Hero Fan
A full-stack (Marvel) Hero Fan webpage created for the Web Express Coding Challenge at Hive Helsinki

## Table of Contents
1. [Technologies Used](#technologies-used)
2. [Website Functionality](#website-functionality)
   - [Without Authorization](#without-authorization)
   - [Only Authorized Users](#only-authorized-users)
3. [Pages Created](#pages-created)
4. [Data Source](#data-source)
5. [Setup Instructions](#setup-instructions)
   - [Docker Setup](#docker-setup)
   - [Back-End / Front-End Setup](#back-end--front-end-setup)

---

## Technologies Used
- **Database**: PostgreSQL, created and run via Docker
- **Back-End**: Node.js, Express
- **Front-End**: React, Next.js

## Pages Created

- **Main page** with characters and pagination
- **Character dynamic page**
- **User dynamic page**
- **Search results page**
- **404 error page**

Also, a **header** and **footer** are created, which appear on every page. Registration uses a popup window instead of a separate page.

## Website Functionality

### Without Authorization
- View characters preview on the main page
- View detailed information about each character
- Search for characters
- User registration and login
- Character sorting

### Only Authorized Users
- View the user page (own and other users' profiles)
- Add/remove characters from favorites
- Like/dislike characters
- Search for users
- Change login/password only for their own account

## Data Source
This website fetches data from the **Marvel API**, stores it in the database, and works with the database for faster performance. In the future, a data update logic will be added to periodically refresh the data.

## Setup Instructions

### Docker Setup
1. Pull the Docker image using the command:
   ```bash
   docker pull fpymehtapiu/my-marv-db:latest
2. Create a container using the command:
   ```bash
   docker run --name my-sp-container -p 5432:5432 --env-file .env my-sp-db
3. Start the container:
   ```bash
   docker start my-sp-container

### Back-End / Front-End Setup
1. In the `frontend` and `backend` directories, run the following command to install dependencies
   ```bash
   npm install
2. Then, in each directory, run:
   ```bash
   npm run dev

The back-end will run on port 3000, and the front-end will redirect to port 3001.

Now, the website will be available at http://localhost:3001.

## The deployment is coming soon =)
