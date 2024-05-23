import React, { FC } from 'react';
import { Flowchart } from './index';
import { FlowchartHandles, useFlowchart } from './hook';
import { ConnectorData, NodeData } from '../base/types';

export const FlowchartPrimary: FC = () => {

  const { setHandles, flowchart } = useFlowchart();
  const [txt, setTxt] = React.useState('node');
  const [data, setData] = React.useState<{ nodes: NodeData[], connectors: ConnectorData[] }>({ nodes: [], connectors: [] });

  const onReady = (flowchart: FlowchartHandles) => {
    let nodes = [
      { X: 50, Y: 50, text: 'node1', id: 1 },
      { X: 150, Y: 50, text: 'node2', id: 2 },
    ];
    let connectors = [
      { from: 1, to: 2 },
      { from: 2, to: 2 },
    ];
    flowchart.addNodes(nodes, connectors);
    setData(flowchart.getData());
  }

  return (
    <div className="App">
      <input type='text' value={txt} onChange={e => setTxt(e.target.value)} />
      <button onClick={() => { flowchart!.addNode(100, 100, txt) }}>Add Node</button>
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