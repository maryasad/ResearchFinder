import sqlite3

def create_db():
    conn = sqlite3.connect('research.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Run the database setup
if __name__ == "__main__":
    create_db()
print("Database and table 'subjects' created successfully!")
