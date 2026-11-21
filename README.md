# AI Smart Daily Planner

A full-stack task management web application designed to help users organize daily activities, track deadlines, prioritize tasks, and monitor productivity.

The application provides an interactive dashboard with task statistics, progress tracking, and an easy-to-use interface.

## Tech Stack

**Frontend**
- React.js
- JavaScript
- HTML5 and CSS3
- Vite

**Backend**
- Python
- FastAPI
- REST APIs

**Database**
- SQLite

**Development Tools**
- Visual Studio Code
- Git and GitHub

## Features

- **Task Management:** Create, view, complete, and delete tasks.
- **Task Prioritization:** Organize tasks by High, Medium, and Low priority.
- **Deadline Tracking:** Assign deadlines and identify overdue tasks.
- **Task Search:** Search for tasks by title.
- **Filtering:** Filter tasks by completion status and priority.
- **Sorting:** Sort tasks by priority or deadline.
- **Dashboard:** View total, completed, and pending task counts.
- **Progress Tracking:** Monitor task completion using a dynamic progress bar.
- **Completion History:** Display the date when a task was completed.
- **Clear Completed Tasks:** Remove completed tasks from the planner.
- **Persistent Storage:** Store task information using SQLite.

## Project Structure

```text
AI-Smart-Daily-Planner/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── main.py
├── database.py
└── .gitignore
```

## How to Run the Project

### Prerequisites

Install the following software:

- Python
- Node.js and npm
- Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/9353rekha/AI-Smart-Daily-Planner.git
cd AI-Smart-Daily-Planner
```

### 2. Start the Backend

Install the required Python packages:

```bash
python -m pip install fastapi "uvicorn[standard]"
```

Start the FastAPI server:

```bash
python -m uvicorn main:app --reload
```

The backend runs at:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

Task API:

`http://127.0.0.1:8000/tasks`

**Note:** The current backend uses a local SQLite database path configured for the original development computer. Update the database connection path in `main.py` for your environment before running the backend.

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local address displayed in the terminal, usually:

`http://localhost:5173`

Vite may select another port, such as `5174`, if the default port is occupied.

## How It Works

1. The user creates a task through the React interface.
2. React sends an HTTP request to the FastAPI backend.
3. FastAPI processes the request and interacts with the SQLite database.
4. The database stores or retrieves the task information.
5. The backend returns a JSON response.
6. React updates the interface with the latest task information.

## REST API Operations

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/tasks` | Retrieve tasks |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/{taskid}` | Update a task |
| DELETE | `/tasks/{taskid}` | Delete a task |

## Future Improvements

- User authentication and individual accounts
- Task reminders and notifications
- Calendar integration
- Cloud deployment
- Improved mobile responsiveness
- Intelligent task scheduling recommendations

## Project Status

Core task management features are implemented and the application runs locally. Public deployment is planned as a future improvement.

## Author

**Rekha Meti Shivamurthy**

GitHub: [9353rekha](https://github.com/9353rekha)
