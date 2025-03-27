# North Chat

North Chat is a chat application that allows users to create chat rooms and communicate with other users in real time. The application is built using Django and Django Channels with a React frontend.

## Backend

The backend of the application is built using Django Rest Framework and Django Channels. The backend is responsible for handling the creation of chat rooms, messages, and users. The backend also handles the WebSocket connections for the chat rooms.

## Frontend

The frontend of the application is built using React, Tailwind CSS and ShadCN UI. The frontend is responsible for displaying the chat rooms, messages, and users. The frontend also handles the WebSocket connections for the chat rooms.

## Installation

### Backend (Python 3.13)

1. Navigate to the `backend` directory
2. Create and activate virtual environment
3. Install the dependencies
   ```bash
   pip install -r requirements.txt
   ```
4. Run the migrations
   ```bash
   python manage.py migrate
   ```
5. Run the server
   ```bash
   python manage.py runserver
   ```
6. The backend should now be running on `http://localhost:8000`

### Backend (Docker)

1. Navigate to the `backend` directory
2. Make sure you have Docker Compose setup
3. Run the following command
   ```bash
   docker compose up
   ```

### Frontend

1. Navigate to the `frontend` directory
2. Install the dependencies
   ```bash
   npm install
   ```
3. Run the development server
   ```bash
   npm run dev
   ```

## TODO

- [x] Add online status functionality
- [x] Update home page
- [x] Dockerize the application
- [x] Deploy website
- [ ] Add remove friend and fix refresh bug
- [ ] Add video call feature?

## Contributions

Contributions are super welcome! If you find any issues or have suggestions for improvement, feel free to open an issue or submit a pull request 🤗
