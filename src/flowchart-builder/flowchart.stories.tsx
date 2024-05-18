import React, { FC } from 'react';
import { Flowchart } from './index';
import { useFlowchart } from './hook';

export const FlowchartPrimary: FC = () => {

  const { setHandles, flowchart } = useFlowchart();
  const [txt, setTxt] = React.useState('node');

  return (
    <div className="App">
      <input type='text' value={txt} onChange={e => setTxt(e.target.value)}/>
      <button onClick={() => { flowchart!.addNode(100, 100, txt) }}>Add Node</button>
      <div>
        <Flowchart setHandles={setHandles} width='600px' height='600px' />
      </div>
    </div>
  );
}