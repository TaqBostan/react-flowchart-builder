import React, { FC } from 'react';
import { Flowchart } from './index';
import { FlowchartHandles, useFlowchart } from './hook';
import { ConnectorData, NodeData } from '../base/types';

export const FlowchartPrimary: FC = () => {

  const { setHandles, flowchart } = useFlowchart();
  const [txt, setTxt] = React.useState('node');
  const [data, setData] = React.useState<{ nodes: NodeData[], connectors: ConnectorData[] }>({ nodes: [], connectors: [] });

  const onReady = (flowchart: FlowchartHandles) => {
    let nodes = JSON.parse(`[ { "id": 2, "X": 204, "Y": 226, "text": "Check time", "shape": "rectangle" }, { "id": 4, "X": 418, "Y": 14, "text": "Take bus", "shape": "rectangle" }, { "id": 5, "X": 394, "Y": 432, "text": "Take subway", "shape": "rectangle" }, { "id": 1, "X": 14, "Y": 201, "text": "Leave home", "shape": "circle" }, { "id": 6, "X": 690, "Y": 213, "text": "Reach school", "shape": "circle" }, { "id": 3, "X": 383, "Y": 190, "text": "Before 7 am?", "shape": "rhombus" } ]`);
    let connectors = JSON.parse(`[ { "from": 2, "to": 3 }, { "from": 4, "to": 6 }, { "from": 5, "to": 6 }, { "from": 1, "to": 2 }, { "from": 3, "to": 4, "text": "Yes" }, { "from": 3, "to": 5, "text": "No" } ]`);
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
      <div style={{ borderStyle: 'dotted', width: 'fit-content' }}>
        <Flowchart setHandles={setHandles} width='900px' height='500px' editable={true} onReady={onReady} />
      </div>
      <h3>Nodes:</h3>
      <div>{JSON.stringify(data.nodes, null, 2)}</div>
      <br />
      <h3>Connectors:</h3>
      <div>{JSON.stringify(data.connectors, null, 2)}</div>
    </div>
  );
}