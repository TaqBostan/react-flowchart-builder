import React, { FC } from 'react';
import { Flowchart } from './index';
import { FlowchartHandles, useFlowchart } from './hook';
import { LinkData, NodeData } from '../base/types';

export const FlowchartPrimary: FC = () => {
  const { setHandles, flowchart } = useFlowchart();
  const [txt, setTxt] = React.useState('node');
  const [data, setData] = React.useState<{ nodes: NodeData[], links: LinkData[] }>({ nodes: [], links: [] });
  const onReady = (flowchart: FlowchartHandles) => {
  let nodes = JSON.parse(`[ { "id": 9, "X": 59, "Y": 162, "text": "Shopping", "shape": "rectangle", "color": "#276ef140" }, { "id": 12, "X": 145, "Y": 334, "text": "Search items", "shape": "rectangle", "color": "#276ef140" }, { "id": 13, "X": 239, "Y": 221, "text": "Browse Items", "shape": "rectangle", "color": "#276ef140" }, { "id": 15, "X": 645, "Y": 369, "text": "View Item", "shape": "rectangle", "color": "#276ef140" }, { "id": 18, "X": 639, "Y": 49, "text": "Purchase made", "shape": "rectangle", "color": "#276ef140" }, { "id": 7, "X": 44, "Y": 26, "text": "Start", "shape": "circle", "color": "#27f17640" }, { "id": 19, "X": 849, "Y": 236, "text": "End", "shape": "circle", "color": "#f1306054" }, { "id": 14, "X": 430, "Y": 308, "text": "Item Found?", "shape": "rhombus", "color": "#efb9746b" }, { "id": 16, "X": 636, "Y": 157, "text": "Item Selected?", "shape": "rhombus", "color": "#efb9746b" } ]`);
  let links = JSON.parse(`[ { "id": 1, "from": 9, "to": 12, "text": "Use search bar", "type": "solid", "meta": { "ratioS": [ 0.21, -0.47 ], "ratioD": [ 0.17, -0.39 ] } }, { "id": 2, "from": 9, "to": 13, "text": "Browse", "type": "solid", "meta": { "ratioS": [ 0.16, 0 ], "ratioD": [ 0.19, 0 ] } }, { "id": 3, "from": 12, "to": 12, "text": "Another search", "type": "dashed" }, { "id": 4, "from": 12, "to": 14, "text": "Click search button", "type": "solid", "meta": { "ratioS": [ 0.16, -0.02 ] } }, { "id": 5, "from": 13, "to": 12, "text": "Use search bar", "type": "solid", "meta": { "ratioS": [ 0.01, -0.23 ], "ratioD": [ 0.22, -0.31 ] } }, { "id": 6, "from": 13, "to": 15, "text": "Click item", "type": "solid", "meta": { "ratioS": [ 0.28, 0.1 ] } }, { "id": 7, "from": 15, "to": 9, "text": "Not interested", "type": "dashed", "meta": { "ratioS": [ 0.27, 0.28 ], "ratioD": [ 0.24, 0.14 ] } }, { "id": 18, "from": 15, "to": 16, "type": "solid", "meta": { "ratioS": [ 0.14, 0 ] } }, { "id": 9, "from": 18, "to": 19, "text": "", "type": "solid", "meta": { "ratioD": [ 0.25, 0.05 ] } }, { "id": 10, "from": 18, "to": 9, "text": "More shopping", "type": "dashed", "meta": { "ratioS": [ 0.35, 0.15 ], "ratioD": [ 0.2, 0.13 ] } }, { "id": 11, "from": 7, "to": 9, "text": "Visit online store", "type": "solid", "meta": { "ratioS": [ 0.25, 0.04 ] } }, { "id": 12, "from": 14, "to": 15, "text": "Yes", "type": "solid", "meta": { "ratioD": [ 0.25, -0.03 ] } }, { "id": 17, "from": 14, "to": 12, "text": "No", "type": "solid", "meta": { "ratioS": [ -0.3, 0.91 ], "sideS": { "vertical": true, "firstSide": false }, "ratioD": [ 0.14, -0.42 ] } }, { "id": 19, "from": 16, "to": 19, "text": "No", "type": "solid", "meta": { "ratioD": [ 0.25, 0.08 ] } }, { "id": 20, "from": 16, "to": 18, "text": "Yes", "type": "solid", "meta": { "ratioD": [ 0.18, 0.01 ] } }, { "id": 21, "from": 16, "to": 9, "text": "More shopping", "type": "dashed", "meta": { "ratioS": [ 0.24, 0.99 ], "sideS": { "vertical": false, "firstSide": true }, "ratioD": [ 0.2, 0.14 ] } } ]`);
    flowchart.addNodes(nodes, links);
    setData(flowchart.getData());
  }

  return (
    <div className="App">
      <input type='text' value={txt} onChange={e => setTxt(e.target.value)} />
      <button onClick={() => { flowchart!.addRectNode(100, 100, txt, undefined, "#276ef140") }}>Add Rectangle Node</button>
      <button onClick={() => { flowchart!.addCircleNode(100, 100, txt, undefined, "#27f17640") }}>Add Circle Node</button>
      <button onClick={() => { flowchart!.addRhomNode(100, 100, txt) }}>Add Rhombus Node</button>
      <button onClick={() => { setData(flowchart!.getData()) }}>Get Nodes and Links</button>
      <input type="radio" id="solid" name="connType" onClick={e => flowchart!.changeLinkType(3, "solid")} />
      <label htmlFor="solid">Solid</label>
      <input type="radio" id="dashed" name="connType" onClick={e => flowchart!.changeLinkType(3, "dashed")} />
      <label htmlFor="dashed">Dashed</label>
      <div style={{ borderStyle: 'dotted', width: 'fit-content' }}>
        <Flowchart setHandles={setHandles} width='900px' height='500px' editable={true} onReady={onReady} />
      </div>
      <h3>Nodes:</h3>
      <div>{JSON.stringify(data.nodes, null, 2)}</div>
      <br />
      <h3>Links:</h3>
      <div>{JSON.stringify(data.links, null, 2)}</div>
    </div>
  );
}