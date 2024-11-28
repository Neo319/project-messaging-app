import "../styles/App.css";

import header from "../components/header";
import UserPanel from "../components/userPanel";

export default function Dashboard() {
  return (
    <>
      {header()}
      <h1>Hi. Message page here.</h1>
      {UserPanel()}
    </>
  );
}
