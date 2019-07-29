import { left2, right2 } from "./jsons";
import jsonFormatter from "./jsonFormatter";
import React from "react";
import { render } from "react-dom";
import "./styles.css";
let jsondiffpatch = require("jsondiffpatch");


const delta = jsondiffpatch
.create({
    propertyFilter: function(name, context) {
      return !["linkedMedia", "imageSize", "sizes"].includes(name);
  }
})
.diff(left2, right2);

console.log("xxx12", delta, new jsonFormatter().format(delta));
const App = () => {
  const elements = ['one', 'two', 'three'];

  const items = []

  for (const [index, value] of elements.entries()) {
    items.push(<li key={index}>{value}</li>)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <p>
        {items}
      </p>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  );
}

render(
  <App />,
  document.getElementById("app")
)

