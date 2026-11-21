
import sqlite3

connection = sqlite3.connect("planner.db")

cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT,
    deadline TEXT,
    status TEXT
)
""")
cursor.execute("PRAGMA table_info(tasks)")
columns = [column[1] for column in cursor.fetchall()]

if "completedat" not in columns:
    cursor.execute("ALTER TABLE tasks ADD COLUMN completedat TEXT")

connection.commit()
connection.close()

print("Tasks table created successfully!")
