
import os
import sqlite3
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATABASE = os.path.join(os.path.dirname(__file__), "tasks.db")


# Initialize database and safely update existing table
def init_db():
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            priority TEXT NOT NULL DEFAULT 'Medium',
            created_at TEXT
        )
    """)

    # Check which columns already exist
    cursor.execute("PRAGMA table_info(tasks)")
    columns = [row[1] for row in cursor.fetchall()]

    # Add priority column if it does not exist
    if "priority" not in columns:
        cursor.execute("""
            ALTER TABLE tasks
            ADD COLUMN priority TEXT NOT NULL DEFAULT 'Medium'
        """)

    # Add created_at column if it does not exist
    if "created_at" not in columns:
        cursor.execute("""
            ALTER TABLE tasks
            ADD COLUMN created_at TEXT
        """)

    # Give older tasks a creation date
    cursor.execute("""
        UPDATE tasks
        SET created_at = datetime('now', 'localtime')
        WHERE created_at IS NULL
    """)

    connection.commit()
    connection.close()

    print("Database initialized successfully!")


# Home route
@app.route("/")
def home():
    return "Task Manager Backend is running!"


# GET: Retrieve all tasks
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()
    cursor.execute("SELECT * FROM tasks ORDER BY id DESC")
    rows = cursor.fetchall()

    tasks = []

    for row in rows:
        tasks.append({
            "id": row["id"],
            "task": row["task"],
            "completed": bool(row["completed"]),
            "priority": row["priority"],
            "created_at": row["created_at"]
        })

    connection.close()

    return jsonify(tasks)


# POST: Add a new task
@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.get_json() or {}

    task_name = data.get("task")
    priority = data.get("priority", "Medium")

    if not task_name or not task_name.strip():
        return jsonify({
            "message": "Task cannot be empty!"
        }), 400

    if priority not in ["High", "Medium", "Low"]:
        return jsonify({
            "message": "Invalid priority!"
        }), 400

    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO tasks (task, priority, created_at)
        VALUES (?, ?, ?)
    """, (task_name.strip(), priority, created_at))

    connection.commit()

    task_id = cursor.lastrowid
    connection.close()

    return jsonify({
        "message": "Task added successfully!",
        "id": task_id,
        "task": task_name.strip(),
        "completed": False,
        "priority": priority,
        "created_at": created_at
    }), 201


# DELETE: Delete a task
@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM tasks WHERE id = ?",
        (task_id,)
    )

    connection.commit()

    if cursor.rowcount == 0:
        connection.close()
        return jsonify({
            "message": "Task not found!"
        }), 404

    connection.close()

    return jsonify({
        "message": "Task deleted successfully!"
    }), 200


# PUT: Update task completion status

@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json() or {}
    completed = data.get("completed")

    if not isinstance(completed, bool):
        return jsonify({
            "message": "Invalid completion status!"
        }), 400

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    # Check whether the task exists
    cursor.execute(
        "SELECT completed FROM tasks WHERE id = ?",
        (task_id,)
    )

    task = cursor.fetchone()

    if task is None:
        connection.close()
        return jsonify({
            "message": "Task not found!"
        }), 404

    # Prevent changing an already completed task
    if task[0] == 1:
        connection.close()
        return jsonify({
            "message": "Completed tasks cannot be changed!"
        }), 403

    cursor.execute("""
        UPDATE tasks
        SET completed = ?
        WHERE id = ?
    """, (int(completed), task_id))

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Task updated successfully!",
        "id": task_id,
        "completed": completed
    }), 200



# Start Flask application
if __name__ == "__main__":
    init_db()
    app.run(debug=True)
