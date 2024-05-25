A lightweight component to design flowcharts. 

## Usage

Install `react-flowchart-builder` using npm.

```shell
npm install react-flowchart-builder
```

Then you can just import the component and its hook:

```js
import { Flowchart, useFlowchart } from 'react-flowchart-builder';
```

and use it as below:

```js
const { setHandles, flowchart } = useFlowchart();
```

```js
<button onClick={() => { flowchart.addNode(50, 50, 'my node') }}>Add Node</button>
<Flowchart setHandles={setHandles} width='700px' height='400px' />
```

By clicking the button, a new node is added at `x = 50, y = 50`. Drag the orange square from one node to another to add connections.

## Loading/Saving a Flowchart

Load/save a flowchart using the data model below:

```js
const load = () => {
  let nodes = [
    { id: 1, text: 'node1', X: 50, Y: 50 },
    { id: 2, text: 'node2', X: 150, Y: 50 },
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

## Contributing

- Fork the project.
- Make changes.
- Run the project in development mode: `npm run ladle`.
- Test your changes using `flowchart.stories.tsx` or your own Stories (`*.stories.tsx`).
- Update README with appropriate docs.
- Commit and PR

## Dependencies

React Flowchart has no dependency. However the following peer dependencies must be specified by your project in order to avoid version conflicts:
[`react`](https://www.npmjs.com/package/react),
[`react-dom`](https://www.npmjs.com/package/react-dom).
NPM will not automatically install these for you but it will show you a warning message with instructions on how to install them.