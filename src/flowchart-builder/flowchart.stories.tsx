import React, { FC } from 'react';
import { Flowchart } from './index';
import { FlowchartHandles, useFlowchart } from './hook';
import { ConnectorData, NodeData } from '../base/types';

export const FlowchartPrimary: FC = () => {

  const { setHandles, flowchart } = useFlowchart();
  const [txt, setTxt] = React.useState('node');
  const [data, setData] = React.useState<{ nodes: NodeData[], connectors: ConnectorData[] }>({ nodes: [], connectors: [] });

  const onReady = (flowchart: FlowchartHandles) => {
    let nodes = JSON.parse(`[ { "id": 2, "X": 530, "Y": 64, "text": "node2", "shape": "rectangle" }, { "id": 5, "X": 289, "Y": 284, "text": "node", "shape": "rectangle" }, { "id": 1, "X": 50, "Y": 50, "text": "start", "shape": "circle" }, { "id": 3, "X": 50, "Y": 278, "text": "node", "shape": "circle" }, { "id": 6, "X": 550, "Y": 290, "text": "end", "shape": "circle" }, { "id": 4, "X": 283, "Y": 138, "text": "node", "shape": "rhombus" } ]`);
    let connectors = JSON.parse(`[ { "from": 2, "to": 2, "text": "label 2" }, { "from": 5, "to": 6 }, { "from": 1, "to": 2, "text": "label 1" }, { "from": 1, "to": 3 }, { "from": 3, "to": 4 }, { "from": 4, "to": 2 }, { "from": 4, "to": 5 }, { "from": 4, "to": 6 }, { "from": 4, "to": 4 } ]`);
    flowchart.addNodes(nodes, connectors);
    setData(flowchart.getData());
  }

  return (
    <div className="App">
      <input type='text' value={txt} onChange={e => setTxt(e.target.value)} />
      <button onClick={() => { flowchart!.addRectNode(100, 100, txt) }}>Add Rectangle Node</button>
      <button onClick={() => { flowchart!.addCircleNode(100, 100, txt) }}>Add Circle Node</button>
      <button onClick={() => { flowchart!.addRhomNode(100, 100, txt) }}>Add Rhombus Node</button>
      <button onClick={() => { setData(flowchart!.getData()) }}>Get Nodes and Connections</button>
      <div>
        <Flowchart setHandles={setHandles} width='700px' height='400px' onReady={onReady} />
      </div>
      <h3>Nodes:</h3>
      <div>{JSON.stringify(data.nodes, null, 2)}</div>
      <br />
      <h3>Connectors:</h3>
      <div>{JSON.stringify(data.connectors, null, 2)}</div>
    </div>
  );
}