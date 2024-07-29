import { cleanup, fireEvent, render, prettyDOM, renderHook } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { Flowchart } from './index';
import { FlowchartHandles, useFlowchart } from './hook';
import { LinkData, NodeData } from '../base/types';

export const ns = "http://www.w3.org/2000/svg";


afterEach(cleanup);

Object.defineProperty(global.SVGElement.prototype, 'getBBox', {
  writable: true,
  value: jest.fn().mockReturnValue({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }),
});

it('Load: circle', () => {
  let nodes = JSON.parse(`[{ "id": 20, "X": 91, "Y": 119, "text": "Start", "shape": "circle", "color": "transparent" }]`);
  let links: LinkData[] = [];
  let hk = renderHook(() => React.useState<{ nodes: NodeData[], links: LinkData[] }>({ nodes: [], links: [] }));
  const [data, setData] = hk.result.current;
  const onReady = (flowchart: FlowchartHandles) => {
    flowchart.addNodes(nodes, links);
    setData(flowchart.getData());
  }
  const res = renderHook(useFlowchart);
  let { setHandles, flowchart } = res.result.current;
  const _flowchart = render(
    <Flowchart setHandles={setHandles} width='1200px' height='600px' editable={true} onReady={onReady} />,
  );
  let circles = _flowchart.container.getElementsByTagName('circle');
  expect(circles.length).toBe(1);
  expect(_flowchart.getByText('Start')).toBeInTheDocument();
});

it('editable true', () => {
  let nodes = JSON.parse(`[{ "id": 20, "X": 91, "Y": 119, "text": "Start", "shape": "circle", "color": "transparent" }]`);
  let links: LinkData[] = [];
  let hk = renderHook(() => React.useState<{ nodes: NodeData[], links: LinkData[] }>({ nodes: [], links: [] }));
  const [data, setData] = hk.result.current;
  const onReady = (flowchart: FlowchartHandles) => {
    flowchart.addNodes(nodes, links);
    setData(flowchart.getData());
  }
  const res = renderHook(useFlowchart);
  let { setHandles, flowchart } = res.result.current;
  const _flowchart = render(
    <Flowchart setHandles={setHandles} width='1200px' height='600px' editable={true} onReady={onReady} />,
  );
  _flowchart.container.querySelector('defs')?.remove();
  let source = _flowchart.container.querySelector('svg')!.getElementsByClassName('source pointer')[0];
  expect(source.getAttribute('width')).toEqual("12");
  expect(source.getAttribute('height')).toEqual("12");
});

it('editable false', () => {
  let nodes = JSON.parse(`[{ "id": 20, "X": 91, "Y": 119, "text": "Start", "shape": "circle", "color": "transparent" }]`);
  let links: LinkData[] = [];
  let hk = renderHook(() => React.useState<{ nodes: NodeData[], links: LinkData[] }>({ nodes: [], links: [] }));
  const [data, setData] = hk.result.current;
  const onReady = (flowchart: FlowchartHandles) => {
    flowchart.addNodes(nodes, links);
    setData(flowchart.getData());
  }
  const res = renderHook(useFlowchart);
  let { setHandles, flowchart } = res.result.current;
  const _flowchart = render(
    <Flowchart setHandles={setHandles} width='1200px' height='600px' editable={false} onReady={onReady} />,
  );
  _flowchart.container.querySelector('defs')?.remove();
  let rects = _flowchart.container.querySelector('svg')!.getElementsByTagNameNS(ns, 'rect')!;
  for (let i = 0; i < rects.length; i++) {
    let rect = rects[i];
    expect(rect).not.toHaveClass("source");
    expect(rect).not.toHaveClass("pointer");
  }
});

it('Show content', () => {
  let nodes = JSON.parse(`[{ "id": 20, "X": 91, "Y": 119, "text": "Start", "shape": "circle", "color": "transparent" }]`);
  let links: LinkData[] = [];
  const onReady = (flowchart: FlowchartHandles) => {
    flowchart.addNodes(nodes, links);
  }
  const res = renderHook(useFlowchart);
  let { setHandles, flowchart } = res.result.current;
  const _flowchart = render(
    <Flowchart setHandles={setHandles} width='1200px' height='600px' onReady={onReady} />,
  );
  _flowchart.container.querySelector('defs')?.remove();
  // console.log(prettyDOM(_flowchart.container.querySelector('svg')!));
});