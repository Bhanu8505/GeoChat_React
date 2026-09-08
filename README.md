# GeoChat Frontend

GeoChat is a real-time, location-based chat application that allows users to discover nearby people and communicate with them through real-time conversations.

This repository contains the **React frontend** for GeoChat. It communicates with the GeoChat backend through REST APIs and WebSockets.

---

## 🚀 Features

- 🔐 User registration and login
- ✉️ Email verification
- 🔄 Automatic access-token refresh
- 👤 User profile management
- 📍 Location-based nearby user discovery
- 💬 Real-time chat
- ⚡ WebSocket/STOMP communication
- 🔔 Real-time notifications
- 📨 Chat request management
- 🟢 Online/offline presence
- 📱 Responsive user interface
- 🧭 Client-side routing
- 🛡️ Protected routes
- ❌ Field-level form validation
- 🔄 Loading and error states

---

# 🏗️ Application Architecture

```text
                         ┌──────────────────┐
                         │    React App     │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                  REST                     WebSocket
                    │                           │
                    ▼                           ▼
             ┌──────────────┐          ┌────────────────┐
             │ Axios Client │          │ STOMP Client   │
             └──────┬───────┘          └───────┬────────┘
                    │                          │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │ API Gateway   │
                         └───────┬───────┘
                                 │
                ┌────────────────┼────────────────┐
                ▼                ▼                ▼
          Auth Service      User Service      Chat Service
                                                   │
                                                   ▼
                                           Notification Service
```

---

# 🛠️ Tech Stack

### Frontend

- React
- JavaScript
- Vite
- React Router
- Tailwind CSS
- Axios
- STOMP.js
- WebSocket

### Backend Integration

- REST APIs
- JWT Authentication
- WebSockets
- STOMP
- Kafka-based notification system

---

# 📁 Project Structure

```text
src/
│
├── assets/
│
├── components/
│   ├── common/
│   ├── chat/
│   ├── notifications/
│   └── users/
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│
├── layouts/
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Home.jsx
│   ├── Chat.jsx
│   ├── Profile.jsx
│   └── ...
│
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── userService.js
│   ├── chatService.js
│   └── notificationService.js
│
├── routes/
│
├── App.jsx
├── main.jsx
└── index.css
```

The structure separates UI components, pages, authentication state, API communication, and reusable logic.

---

# 🔐 Authentication

GeoChat uses JWT-based authentication.

The frontend maintains the current authentication state through `AuthContext`.

### Authentication flow

```text
Login
  │
  ▼
Auth Service
  │
  ▼
Access Token
  │
  ├── Stored by frontend
  │
  ▼
Axios Request
  │
  ▼
Authorization: Bearer <token>
  │
  ▼
API Gateway
```

The access token is short-lived and is refreshed using the refresh token when required.

---

# 🔄 Token Refresh

The frontend automatically handles expired access tokens.

```text
API Request
     │
     ▼
Access Token
     │
     ▼
Backend
     │
     ├── 200 → Continue
     │
     └── 401
          │
          ▼
      Refresh Token
          │
          ▼
    New Access Token
          │
          ▼
     Retry Request
```

The Axios interceptor is responsible for attaching the latest access token to API requests.

---

# 🛡️ Protected Routes

Authenticated pages are protected from unauthenticated users.

Example:

```text
/login
/register
/verify-email
```

are public routes.

Authenticated pages such as:

```text
/home
/chat/:conversationId
/profile
/notifications
```

require the user to be logged in.

---

# 📍 Location-Based User Discovery

The application uses the browser's Geolocation API to obtain the user's current location.

```text
Browser
   │
   ▼
Geolocation API
   │
   ▼
Latitude + Longitude
   │
   ▼
User Service
   │
   ▼
Nearby Users
```

The backend uses PostGIS to perform geographical queries and return users within the configured radius.

---

# 💬 Real-Time Chat

Chat messages are delivered in real time using **WebSockets and STOMP**.

### Connection

```text
React
  │
  │ WebSocket
  ▼
API Gateway
  │
  ▼
Chat Service
```

The frontend subscribes to a conversation-specific destination:

```text
/topic/conversations/{conversationId}
```

When a message is sent:

```text
User A
  │
  ▼
Chat Service
  │
  ▼
WebSocket
  │
  ▼
User B
```

This allows messages to appear without manually refreshing the page.

---

# 🔔 Real-Time Notifications

Notifications are received through a user-specific WebSocket destination.

```text
Notification Service
        │
        ▼
WebSocket
        │
        ▼
/user/queue/notifications
        │
        ▼
React Application
```

The frontend listens for notifications and updates:

- Notification list
- Unread notification count
- Chat requests
- Other real-time events

---

# 📨 Chat Requests

Users can send nearby chat requests to other users.

The frontend handles:

- Sending chat requests
- Receiving notifications
- Displaying pending requests
- Accepting requests
- Rejecting requests
- Opening conversations after acceptance

---

# 🌐 API Integration

Axios is used for communication with the backend.

The API layer is separated into service modules.

Example:

```javascript
userService.myProfile()
chatService.sendMessage(...)
chatService.getAllMessagesInAConversation(...)
authService.login(...)
```

This keeps API-related logic separate from React components.

---

# 🔌 WebSocket Integration

The frontend uses STOMP over WebSockets.

A typical connection looks like:

```javascript
const client = new Client({
  webSocketFactory: () =>
    new WebSocket(`ws://localhost:9010/api/v1/chat/ws?token=${accessToken}`),
});
```

The client subscribes to the appropriate STOMP destination after establishing the connection.

---

# 🎨 UI

The application UI is built using **Tailwind CSS**.

Tailwind provides:

- Responsive layouts
- Utility-based styling
- Form styling
- Chat interfaces
- Notifications
- User cards
- Navigation components
- Loading and error states

---

# ⚙️ Local Setup

## Prerequisites

Make sure you have:

- Node.js 18+
- npm
- Git
- GeoChat backend running locally

---

## 1. Clone the Repository

```bash
git clone https://github.com/Bhanu8505/GeoChat_React.git
cd GeoChat-Frontend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
VITE_API_BASE_URL=http://localhost:9010
```

Do not commit `.env` files containing secrets.

If using Vite, environment variables exposed to the frontend should use the `VITE_` prefix.

---

## 4. Start the Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# 🔗 Backend Connection

The frontend communicates with the backend through the API Gateway.

```text
React
  │
  │ HTTP / WebSocket
  ▼
API Gateway
  │
  ├── Auth Service
  ├── User Service
  ├── Chat Service
  └── Notification Service
```

Make sure the backend services are running before using features such as authentication, chat, or notifications.

---

# 🧪 Development

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

# 📱 Main Application Pages

| Page          | Purpose                         |
| ------------- | ------------------------------- |
| Login         | Authenticate existing users     |
| Register      | Create a new account            |
| Verify Email  | Verify registered email         |
| Home          | Discover nearby users           |
| Chat          | Real-time conversations         |
| Profile       | View and edit user profile      |
| Notifications | View notifications and requests |

---

# 🔒 Security

The frontend follows several security practices:

- JWT authentication
- Authorization header for protected API requests
- Automatic access-token refresh
- Protected routes
- No hardcoded backend credentials
- Environment variables for configurable values
- Logout handling
- WebSocket authentication using access tokens

> The frontend should never contain private secrets such as database credentials, JWT signing keys, or SMTP passwords.

---

# 🐛 Error Handling

The application handles errors returned by the backend API and displays appropriate messages to users.

Validation errors are displayed at the relevant form fields.

For example:

```text
Username
[________________]

Username is required
```

API errors can also display a general error message when appropriate.

---

# 🔄 Application Flow

A typical user journey:

```text
Register
   │
   ▼
Verify Email
   │
   ▼
Login
   │
   ▼
Home
   │
   ▼
Discover Nearby Users
   │
   ▼
Send Chat Request
   │
   ▼
Receive Notification
   │
   ▼
Accept Request
   │
   ▼
Open Conversation
   │
   ▼
Real-Time Chat
```

# 🚧 Future Improvements

Potential improvements include:

- Dark mode
- Message read receipts
- Typing indicators
- Image/file sharing
- Message editing and deletion
- Infinite scrolling for conversations
- Push notifications
- Better offline support
- Improved WebSocket reconnection handling
- Progressive Web App support
- Production deployment

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Add my feature"
```

4. Push the branch

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

# 📄 License

This project is currently developed as a personal software engineering project.

---

# 👨‍💻 Author

**Bhanu Pundir**

### Technologies

```text
React
JavaScript
Vite
Tailwind CSS
Axios
React Router
WebSockets
STOMP
Spring Boot
Microservices
PostgreSQL
PostGIS
Kafka
```
