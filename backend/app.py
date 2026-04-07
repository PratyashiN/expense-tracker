from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# Connect to database
def get_db_connection():
    conn = sqlite3.connect('expenses.db')
    conn.row_factory = sqlite3.Row
    return conn

# Create table if not exists
def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            type TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def home():
    return "Expense Tracker Backend Running!"

# Add transaction
@app.route('/add', methods=['POST'])
def add_transaction():
    data = request.json
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO transactions (title, amount, type) VALUES (?, ?, ?)',
        (data['title'], data['amount'], data['type'])
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Transaction added!"})

# Get all transactions
@app.route('/transactions', methods=['GET'])
def get_transactions():
    conn = get_db_connection()
    transactions = conn.execute('SELECT * FROM transactions').fetchall()
    conn.close()
    return jsonify([dict(row) for row in transactions])

# Delete transaction
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM transactions WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Deleted successfully"})

if __name__ == '__main__':
    if __name__ == "__main__":
      app.run()