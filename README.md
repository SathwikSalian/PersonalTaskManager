# Personal Task Manager

A simple full-stack web application that helps users manage their daily tasks. Users can add tasks, assign priorities, track completion status, filter tasks, and delete tasks.

This project was built to understand how a frontend, backend, REST APIs, and database work together in a full-stack application.

## Live Demo

- **Frontend:** https://personal-task-manager-frontend-camb.onrender.com
- **Backend API:** https://personal-task-manager-api-0xuh.onrender.com

## Features

- **Add Tasks:** Create new tasks with a task name.
- **Priority Management:** Assign High, Medium, or Low priority to each task.
- **View Tasks:** Retrieve and display saved tasks from the database.
- **Complete Tasks:** Mark pending tasks as completed.
- **Task Locking:** Completed tasks cannot be unchecked.
- **Delete Tasks:** Remove tasks that are no longer needed.
- **Filter Tasks:** Filter tasks by priority or completion status.
- **Creation Date:** Display the date and time when a task was created.
- **Persistent Storage:** Store task information in an SQLite database.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Structures the web page |
| CSS | Styles the user interface |
| JavaScript | Handles frontend interactions and API requests |
| Python | Backend programming language |
| Flask | Creates backend routes and REST APIs |
| SQLite | Stores task information |
| Flask-CORS | Enables communication between frontend and backend |
| Git & GitHub | Version control and project hosting |
| Render | Application deployment |

## Project Architecture

The application follows a simple three-layer architecture:

```text
             USER
               |
               v
       FRONTEND (HTML, CSS)
          JavaScript
               |
               | HTTP Requests
               | (REST API)
               v
        BACKEND (Python)
             Flask
               |
               | SQL Queries
               v
         DATABASE
            SQLite
```

### How It Works

1. The user interacts with the frontend to add, complete, filter, or delete tasks.
2. JavaScript sends HTTP requests to the Flask backend using the Fetch API.
3. Flask processes the requests and performs the required database operations.
4. SQLite stores or retrieves the task information.
5. The backend sends a JSON response to the frontend.
6. JavaScript updates the user interface based on the response.

## Project Structure

```text
PersonalTaskManager/
│
├── index.html
├── style.css
├── script.js
│
├── app.py
├── tasks.db
│
├── requirements.txt
├── .gitignore
└── README.md
```

**File descriptions:**

- `index.html` – Defines the structure of the application.
- `style.css` – Contains the styling and responsive design.
- `script.js` – Handles user interactions, task operations, filtering, and API communication.
- `app.py` – Contains the Flask backend and REST API endpoints.
- `tasks.db` – SQLite database used to store task information.
- `requirements.txt` – Lists the Python dependencies.
- `.gitignore` – Specifies files that should not be uploaded to GitHub.

## REST API Endpoints

The backend provides the following REST API endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Add a new task |
| PUT | `/api/tasks/<id>` | Update task completion status |
| DELETE | `/api/tasks/<id>` | Delete a task |

### Example API Request

**POST `/api/tasks`**

Request body:

```json
{
  "task": "Learn Java",
  "priority": "High"
}
```

The backend validates the input, inserts the task into SQLite, and returns a JSON response.

## Installation and Setup

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- Python 3
- Visual Studio Code (or another code editor)
- Git

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
```

Navigate into the project directory:

```bash
cd PersonalTaskManager
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Flask Backend

```bash
python app.py
```

The backend will start locally at:

```text
http://127.0.0.1:5000
```

The SQLite database is initialized automatically when the backend starts.

### 5. Run the Frontend

Open `index.html` in your browser, preferably using the VS Code Live Server extension.

For local development, update the `API_URL` variable in `script.js` to:

```javascript
const API_URL = "http://127.0.0.1:5000";
```

For the deployed application, use:

```javascript
const API_URL = "https://personal-task-manager-api-0xuh.onrender.com";
```

## Deployment

The application is deployed using **Render**.

- The frontend is deployed as a Static Site.
- The Flask backend is deployed as a Web Service using Gunicorn.
- The frontend communicates with the deployed backend through REST API requests.

## Learning Outcomes

Through this project, I gained practical experience with:

- Understanding frontend and backend communication.
- Building REST APIs using Python Flask.
- Performing CRUD operations (Create, Read, Update, Delete).
- Connecting a Flask application to an SQLite database.
- Sending and receiving JSON data using JavaScript Fetch API.
- Handling HTTP methods and status codes.
- Managing cross-origin requests using Flask-CORS.
- Using Git and GitHub for version control.
- Deploying a full-stack application using Render.

## Future Improvements

Some features that can be added in the future:

- User authentication and individual task management.
- Task editing functionality.
- Due dates and reminders.
- Search functionality.
- Improved dashboard and analytics.

---

**Developed as a full-stack learning project.**
