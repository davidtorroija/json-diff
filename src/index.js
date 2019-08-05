import { left2, right2 } from "./jsons";
import jsonFormatter from "./jsonFormatter";
import React from "react";
import { render } from "react-dom";
import "./styles.css";
let jsondiffpatch = require("jsondiffpatch");

const delta = jsondiffpatch
    .create({
        propertyFilter: function(name, context) {
            return ![
                "linkedMedia",
                "imageSize",
                "sizes",
                "uploadedMedia"
            ].includes(name);
        }
    })
    .diff(left2, right2);

Object.entries([]).map(([key, value]) => {
    if (typeof value === "object") {
        return <li key={key}>{key}: </li>;
    }
});

class ModifiedLayer extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.item;
    }

    onClick(e) {
        this.setState({ selected: !this.state.selected });
    }

    render() {
        return (
            <div className="board-cell" onClick={this.onClick.bind(this)}>
               {
                    Object.entries(this.item).map(([key, value]) => {
                        if (typeof value === "object") {
                            return <div key={key}>{key}: {value.new}</div>;
                        }
                    })
               }
            </div>
        );
    }
}
const App = () => {
    const json = new jsonFormatter().format(delta);
    const layers = json.data.items;
    console.log("xxx12", layers);

    const items = [];

    for (const [index, value] of layers.entries()) {
        items.push(
            <li key={index}>
                Layer {value.index}:
                {(() => {
                    if (value.action) {
                        return (
                            <div>
                                New Layer Added
                                <p>{JSON.stringify(value, null, 2)}</p>
                            </div>
                        );
                    } else {
                        return (
                            <div>
                                Layer Modified
                                <ModifiedLayer item={value}/>
                            </div>
                        );
                    }
                })()}
            </li>
        );
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">Welcome to React</h1>
            </header>
            <div>{items}</div>
            <p className="App-intro">
                To get started, edit <code>src/App.js</code> and save to reload.
            </p>
        </div>
    );
};

render(<App />, document.getElementById("app"));
