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
      { X: 50, Y: 50, text: 'node2', id: 1, shape: 'circle' },
      { X: 150, Y: 50, text: 'node2', id: 2 },
    ];
    let connectors = [
      { from: 1, to: 2, text: 'label 1' },
      { from: 2, to: 2, text: 'label 2' },
    ];
    flowchart.addNodes(nodes, connectors);
    setData(flowchart.getData());
  }

  return (
    <div className="App">
      <input type='text' value={txt} onChange={e => setTxt(e.target.value)} />
      <button onClick={() => { flowchart!.addRectNode(100, 100, txt) }}>Add Rectangle Node</button>
      <button onClick={() => { flowchart!.addCircleNode(100, 100, txt) }}>Add Circle Node</button>
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