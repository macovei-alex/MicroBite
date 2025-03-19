import { useState } from "react";
import { Link } from "react-router";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>Click here</button>
      <h1 className="text-3xl font-bold underline">TailwindCSS test</h1>
      <nav>
        <Link to="/login" className="text-blue-500 text-3xl">
          /login
        </Link>
      </nav>
    </>
  );
}
