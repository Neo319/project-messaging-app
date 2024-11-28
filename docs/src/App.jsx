import "./styles/App.css";
import "./styles/Homepage.css";
import footer from "./components/footer";
import header from "./components/header";

function App() {
  console.log("env file data here:");
  console.log(import.meta.env.VITE_SAMPLE_URL);

  return (
    <>
      {header()}
      <article>
        <p>
          This project aims to use a combination of Node.js backend and React.js
          frontend development to create a functional message board, akin to
          Discord, Facebook messenger, etc. This project is part of{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.theodinproject.com/lessons/nodejs-messaging-app"
          >
            The Odin Project Curriculum
          </a>
          , an open-source online educational resource for web developers.
        </p>

        {/* SERVER STATUS TEST */}

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
      </article>
      {footer()}
    </>
  );
}

export default App;