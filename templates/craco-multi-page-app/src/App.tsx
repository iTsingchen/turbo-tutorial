import { useState } from "react";
import { Button } from "@turbo-tutorial/widgets";

import logo from "./logo.svg";
import "./App.css";

type Props = {
  name: string;
};

function App({ name }: Props) {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="uppercase">{name}</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to reload!!!
        </p>
        <p>
          Count: {count} <Button onClick={() => setCount(count + 1)}>+1</Button>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>Git Version: {process.env.GIT_VERSION}</p>
      </header>
    </div>
  );
}

export default App;
