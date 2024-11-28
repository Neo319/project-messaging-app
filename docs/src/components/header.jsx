import "../styles/App.css";
import icon from "../assets/messageIcon2.jpg";
import reactLogo from "../assets/react.svg";
export default function header() {
  return (
    <>
      <header>
        <a href="/">
          <img src={icon} alt="messager logo" className="headerIcon" />
        </a>
        <img src={reactLogo} alt="react logo" className="reactIcon" />

        <a href="/">
          <h1>Project Message App</h1>
        </a>
      </header>
    </>
  );
}
