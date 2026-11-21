
from fastapi import FastAPI, HTTPException

from fastapi.middleware.cors import CORSMiddleware


import sqlite3

def getconnection():
    connection = sqlite3.connect(r"D:\AI-Smart-Daily-Planner\planner.db")
    connection.row_factory = sqlite3.Row
    return connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {"message": "Welcome to AI Smart Daily Planner"}

from pydantic import BaseModel

class Task(BaseModel):
    title: str
    description: str
    priority: str = "Medium"
    deadline: str = ""
    status: str = "Pending"
    completedat: str = ""

@app.post("/tasks")
def addtask(task: Task):
    connection = getconnection()
    try:
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO tasks (title, description, priority, deadline, status)
            VALUES (?, ?, ?, ?, ?)
        """, (
            task.title,
            task.description,
            task.priority,
            task.deadline,
            task.status
        ))

        connection.commit()

        newtask = {
            "id": cursor.lastrowid,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "deadline": task.deadline,
            "status": task.status
        }

        return {
            "message": "Task added successfully",
            "task": newtask
        }
    finally:
        connection.close()



@app.get("/tasks")
def gettasks(status: str = None, priority: str = None, sort: str = None):
    connection = getconnection()

    try:
        cursor = connection.cursor()

        query = "SELECT * FROM tasks WHERE 1=1"
        values = []

        if status:
            query += " AND LOWER(status) = LOWER(?)"
            values.append(status)

        if priority:
            query += " AND LOWER(priority) = LOWER(?)"
            values.append(priority)

        if sort == "deadline":
            query += " ORDER BY (deadline = ''), deadline ASC"

        cursor.execute(query, values)

        return [dict(task) for task in cursor.fetchall()]

    finally:
        connection.close()



@app.put("/tasks/{taskid}")
def updatetask(taskid: int, updatedtask: Task):
    connection = getconnection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
    UPDATE tasks
    SET title = ?,
        description = ?,
        priority = ?,
        deadline = ?,
        status = ?,
        completedat = ?
    WHERE id = ?
""", (
    updatedtask.title,
    updatedtask.description,
    updatedtask.priority,
    updatedtask.deadline,
    updatedtask.status,
    updatedtask.completedat,
    taskid
))

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Task not found"
            )

        connection.commit()

        return {
            "message": "Task updated successfully",
            "taskid": taskid
        }

    finally:
        connection.close()

@app.delete("/tasks/{taskid}")
def deletetask(taskid: int):
    connection = getconnection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            "DELETE FROM tasks WHERE id = ?",
            (taskid,)
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Task not found"
            )

        connection.commit()

        return {"message": "Task deleted successfully"}

    finally:
        connection.close()

@app.get("/tasks/summary")
def tasksummary():
    connection = getconnection()

    try:
        cursor = connection.cursor()

        cursor.execute("SELECT COUNT(*) FROM tasks")
        total = cursor.fetchone()[0]

        cursor.execute(
            "SELECT COUNT(*) FROM tasks WHERE LOWER(status) = 'completed'"
        )
        completed = cursor.fetchone()[0]

        cursor.execute(
            "SELECT COUNT(*) FROM tasks WHERE LOWER(status) = 'pending'"
        )
        pending = cursor.fetchone()[0]

        return {
            "total": total,
            "completed": completed,
            "pending": pending
        }

    finally:
        connection.close()




