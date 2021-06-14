import React from 'react';
import { render, cleanup } from '@testing-library/react';
import useNodeUnregistration from '../dist/shared/internal_hooks/useNodeUnregistration';
import getNodePortsId from '../dist/shared/functions/getNodePortsId';

describe('useNodeUnregistration hook', () => {
  afterEach(() => {
    cleanup();
    sinon.restore();
  });

  it('should be a function', () => {
    expect(useNodeUnregistration).to.be.a('function');
  });

  it('should perform the provided callback on component unmount', () => {
    const spy = sinon.spy();
    const inputs = [{ id: 'port-foo' }];
    const outputs = [{ id: 'port-bar' }];
    const node = { id: 'node-1', inputs, outputs };
    const inputPorts = getNodePortsId(node, 'inputs');
    const outputPorts = getNodePortsId(node, 'outputs');
    const TestComponent = () => {
      useNodeUnregistration(spy, inputs, outputs, node.id);

      return <div />;
    };

    const { rerender } = render(<TestComponent />);

    rerender(null);
    expect(spy.called).to.be.true;
    expect(spy.calledOnce).to.be.true;
    expect(spy.calledWith(node.id, inputPorts, outputPorts)).to.be.true;
  });
});
