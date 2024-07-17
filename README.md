A lightweight component to design flowcharts. Check out the [demo](https://d5y3kk.csb.app/) for some examples.

## Features

- Different shapes of nodes.
- Add/Remove links between nodes using the mouse
- Enable/Disable adding/removing links
- Drag nodes
- Raw or typed input/output

![Screenshot of ImageAnnotator](https://github.com/TaqBostan/content/blob/main/flowchart.png?raw=true)

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
<Flowchart setHandles={setHandles} width='700px' height='400px' editable={true} />
```

Clicking the button creates a new node at `x = 50, y = 50`. Drag the orange square from one node to another to add connections.

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

## Props

The following props can be defined on `Flowchart`:

| Prop | Type | Description | Default |
|---|---|---|---|
| `width` \* | `string` | Flowchart width |  |
| `height` \* | `string` | Flowchart height |  |
| `editable` | `boolean` | Enable/Disable adding/removing connectors (links between nodes) | `false` |
| `onReady` | `FlowchartHandles => any` | When the flowchart is mounted |   |

(\*) required props

## Handles
You can access the handles using the `Flowchart` object as follows:

```js
<button onClick={() => { flowchart!.addRhomNode(100, 100, txt) }}>Add Rhombus Node</button>
```

Below is a list of all handles:
| Handle | Type | Description |
|---|---|---|
|`addRectNode`|`(left: number, top: number, text: string, id?: number, color?: string)=> number`|Allows adding rectangles node by dragging the left mouse button|
|`addCircleNode`|`(left: number, top: number, text: string, id?: number, color?: string)=> number`|Allows adding circles node by dragging the left mouse button|
|`addRhomNode`|`(left: number, top: number, text: string, id?: number, color?: string)=> number`|Allows adding rhombus node by dragging the left mouse button|
|`getData`|`(): { nodes: NodeData[], connectors => ConnectorData[] }`|Gets all nodes and connectors|
`changeConnType`|`(id: number, type: string) => void`|Changes type of connectors (solid/dashed)


## Node

Below is the data model for nodes:

| Prop | Type | Description | Default |
|---|---|---|---|
| `id` | `number` | Node identifier |  |
| `X` \* | `number` | The `x` position of the node |  |
| `Y` \* | `number` | The `y` position of the node |  |
| `text` \* | `string` | Node text |  |
| `shape` | `string` | Node shape can be `rectangle`, `circle`, or `rhombus` | `rectangle` |

(\*) required props

## Connector

Below is the data model for connectors (links between nodes):

| Prop | Type | Description | Default |
|---|---|---|---|
| `from` \* | `number` | The `id` of the origin node |  |
| `to` \* | `number` | The `id` of the destination node |  |
| `text` | `string` | Connector label |  |

(\*) required props

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