import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Link } from "react-router-dom";

function App() {
  const [message, setMessage] = useState({});
  const [counter, setCounter] = useState(0);

  async function callHelloApi() {
    console.log("Calling API...");
    setCounter(counter + 1);
    if (counter % 2 !== 0) {
      console.log("Skipping API call, counter is odd.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/hello");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMessage(data);
      console.log("API response:", data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {message && message.message && counter % 2 !== 0 && (
        <p>{message.message}</p>
      )}
      <div className="card">
        <button onClick={() => callHelloApi()}>Call API</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Link to="/productPage">Click to product page</Link>
      <Link to="/dashboard">Go to Menu Page</Link>
      <Link to="/barangMasuk">Go to Barang Masuk Page</Link>
      <Link to="/barangKeluar">Go to Barang Keluar Page</Link>
      <Link to="/service">Go to Service Page</Link>
      <Link to="/pelanggan">Go to Pelanggan Page</Link>
      <Link to="/supplier">Go to Supplier Page</Link>
    </>
  );
}

export default App;
