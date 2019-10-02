# @brc/react-d3-graph &middot;

This is a fork off Daniel Caldas's work: [https://github.com/danielcaldas/react-d3-graph](https://github.com/danielcaldas/react-d3-graph) mainly to address
features related to customizing layout options and rectangular node shapes.

 <!--
### _Interactive and configurable graphs with react and d3 effortlessly_

[![react-d3-graph gif sample](https://github.com/danielcaldas/react-d3-graph/blob/master/sandbox/rd3g_v2.gif?raw=true)](https://danielcaldas.github.io/react-d3-graph/sandbox/index.html)

## Playground

[Here a live playground](https://danielcaldas.github.io/react-d3-graph/sandbox/index.html) page where you can interactively config your own graph, and generate a ready to use configuration! :sunglasses:

You can also load different datasets and configurations via URL query parameter, here are the links:

*   [small dataset](https://goodguydaniel.com/react-d3-graph/sandbox/index.html?data=small) - small example.
*   [custom node dataset](https://goodguydaniel.com/react-d3-graph/sandbox/index.html?data=custom-node) - sample config with custom views.
*   [marvel dataset!](https://goodguydaniel.com/react-d3-graph/sandbox/index.html?data=marvel) - sample config with directed collapsible graph and custom svg nodes.

Do you want to visualize your own data set on the live sandbox? Just submit a PR! You're welcome 😁

## Documentation :book:

Full documentation [here](https://danielcaldas.github.io/react-d3-graph/docs/index.html).
-->

## Install

[![https://nodei.co/npm/YOUR-MODULE-NAME.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/@brc/react-d3-graph.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@brc/react-d3-graph)

```bash
npm install @brc/react-d3-graph // using npm
```

## Usage sample

Graph component is the main component for react-d3-graph components, its interface allows its user to build the graph once the user provides the data, configuration (optional) and callback interactions (also optional).
The code for the [live example](https://danielcaldas.github.io/react-d3-graph/sandbox/index.html) can be consulted [here](https://github.com/danielcaldas/react-d3-graph/blob/master/sandbox/Sandbox.jsx).

```javascript
import { Graph } from "react-d3-graph";

// graph payload (with minimalist structure)
const data = {
    nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
    links: [{ source: "Harry", target: "Sally" }, { source: "Harry", target: "Alice" }],
};

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
    nodeHighlightBehavior: true,
    node: {
        color: "lightgreen",
        size: 120,
        highlightStrokeColor: "blue",
    },
    link: {
        highlightColor: "lightblue",
    },
};

// graph event callbacks
const onClickGraph = function() {
    window.alert(`Clicked the graph background`);
};

const onClickNode = function(nodeId) {
    window.alert(`Clicked node ${nodeId}`);
};

const onRightClickNode = function(event, nodeId) {
    window.alert(`Right clicked node ${nodeId}`);
};

const onMouseOverNode = function(nodeId) {
    window.alert(`Mouse over node ${nodeId}`);
};

const onMouseOutNode = function(nodeId) {
    window.alert(`Mouse out node ${nodeId}`);
};

const onClickLink = function(source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
};

const onRightClickLink = function(event, source, target) {
    window.alert(`Right clicked link between ${source} and ${target}`);
};

const onMouseOverLink = function(source, target) {
    window.alert(`Mouse over in link between ${source} and ${target}`);
};

const onMouseOutLink = function(source, target) {
    window.alert(`Mouse out link between ${source} and ${target}`);
};

<Graph
    id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
    data={data}
    config={myConfig}
    onClickNode={onClickNode}
    onRightClickNode={onRightClickNode}
    onClickGraph={onClickGraph}
    onClickLink={onClickLink}
    onRightClickLink={onRightClickLink}
    onMouseOverNode={onMouseOverNode}
    onMouseOutNode={onMouseOutNode}
    onMouseOverLink={onMouseOverLink}
    onMouseOutLink={onMouseOutLink}
/>;
```
