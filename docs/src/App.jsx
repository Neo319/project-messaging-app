import "./App.css";
import footer from "./components/footer";
import header from "./components/header";

function App() {
  return (
    <>
      {header()}
      <p>description...</p>

      {/* ROUTES */}
      <p>Client-side routing test go!! </p>
      <ul>
        <li>
          <a href="signup" target="_blank" rel="noopener noreferrer">
            Sign up page
          </a>
        </li>
        <li>
          <a href="login" target="_blank" rel="noopener noreferrer">
            Login page
          </a>
        </li>
        <li>
          <a href="dashboard">Dashboard</a>
        </li>
        <li>
          <a href="message" rel="noopener noreferrer">
            Message
          </a>
        </li>
      </ul>
      {footer()}
    </>
  );
}

export default App;
