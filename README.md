A lightweight component to design flowcharts. 

## Usage

Install `react-flowchart-builder` using npm.

```shell
npm install react-flowchart-builder
```

Then you can just import the component and its hook:

```js
import { FlowchartHandles, useFlowchart } from 'react-flowchart-builder';
```

and use it as below:

```js
const { setHandles, flowchart } = useFlowchart();
```

```js
<button onClick={() => { flowchart.addNode(50, 50, 'my node') }}>Add Node</button>
<Flowchart setHandles={setHandles} width='700px' height='400px' />
```

By clicking the button, a new node is added at `x = 50, y = 50`. Drag the resource (orange square) from one node to another to add connections.

## Loading/Saving a Flowchart

Load/save a flowchart using the data model below:

```js
const load = () => {
  let nodes = [
    { X: 50, Y: 50, text: 'node1', id: 1 },
    { X: 150, Y: 50, text: 'node2', id: 2 },
  ];
  let connectors = [
    { from: 1, to: 2 },
    { from: 2, to: 2 },
  ];
  flowchart.addNodes(nodes, connectors);
}

const save = () => console.log(flowchart.getData()) // { nodes: […], connectors: […] }
```

```js
<button onClick={load}>Load</button>
<button onClick={save}>Save</button>
```
