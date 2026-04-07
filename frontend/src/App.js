import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  // Fetch transactions
  const fetchTransactions = async () => {
    const res = await fetch("https://expense-tracker-backend-2hgl.onrender.com/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Add transaction
  const addTransaction = async () => {
    if (!title || !amount) return;

    await fetch("https://expense-tracker-backend-2hgl.onrender.com/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, amount, type }),
    });

    setTitle("");
    setAmount("");
    fetchTransactions();
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    await fetch(`https://expense-tracker-backend-2hgl.onrender.com/delete/${id}`, {
      method: "DELETE",
    });
    fetchTransactions();
  };

  // Calculations
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = income - expense;

  // Chart Data
  const data = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const COLORS = ["#4CAF50", "#f44336"];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}> Expense Tracker</h1>

      {/* Balance Card */}
      <div style={styles.card}>
        <h2>Balance: ₹{balance}</h2>
        <p style={{ color: "green" }}>Income: ₹{income}</p>
        <p style={{ color: "red" }}>Expense: ₹{expense}</p>
      </div>

      {/* Chart */}
      <div style={styles.card}>
        <h2>Spending Overview 📊</h2>

        <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Input Section */}
      <div style={styles.inputBox}>
        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          style={styles.input}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button style={styles.button} onClick={addTransaction}>
          Add Transaction
        </button>
      </div>

      {/* Transactions */}
      <h2>Transactions</h2>

      <ul style={styles.list}>
        {transactions.map((t) => (
          <li key={t.id} style={styles.item}>
            <span>
              {t.title} - ₹{t.amount} ({t.type})
            </span>
            <button
              style={styles.deleteBtn}
              onClick={() => deleteTransaction(t.id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: "500px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial",
  },
  heading: {
    textAlign: "center",
  },
  card: {
    background: "#f5f5f5",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "center",
  },
  inputBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    background: "#fafafa",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
  },
  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default App;