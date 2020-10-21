import React, { useState, useMemo, useCallback } from 'react';
import {
  Drawer,
  Button,
  ButtonGroup,
} from "@material-ui/core";
import ForceGraph2D from 'react-force-graph-2d';
import _ from 'lodash';

import NodeEditor from '../nodeEditor';
import nodeCanvasObject from './nodeCanvasObject';

function MarkovChain(props) {
  const {
    nodes,
    tryUpdateNodeProbabilities,
    addNode,
    removeNode,
    iterate,
    test,
    /*
      currentNode,
      setCurrentNode,
    */
  } = props;

  const [selectedNode, setSelectedNode] = useState(null);
  const nodeEditorProps = {
    node: nodes[selectedNode],
    tryUpdateNodeProbabilities: probabilities => tryUpdateNodeProbabilities(selectedNode, probabilities)
  }

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);

  const data = {
    nodes: nodes.map(node => ({ id: node.label, name: node.label })),
    links: _.flatten(
      nodes.map(node => (
        Object.entries(node.transitionProbabilities)
          .map(([target, p]) => ({
            source: node.label,
            target,
            width: 5 * p,
          }))
      ))
    )
  }

  const onNodeClick = useCallback(node => {
    setSelectedNode(node.label);
    toggleDrawer();
  });

  return (
    <React.Fragment>
      <ForceGraph2D
        height="300"
        graphData={data}
        onNodeClick={onNodeClick}
        nodeLabel="id"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
        linkWidth={link => link.width}
        nodeCanvasObject={nodeCanvasObject}
        d3VelocityDecay={1}
        linkColor={id => "#e3e3e3"}
      />
      <ButtonGroup aria-label="outlined primary button group">
        <Button onClick={addNode}>Add Node</Button>
        <Button onClick={removeNode}>Remove Node</Button>
        <Button onClick={test}>Generate Test Graph</Button>
        <Button onClick={iterate}>Step</Button>
      </ButtonGroup>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <NodeEditor {...nodeEditorProps} />
      </Drawer>
    </React.Fragment>
  );
}

export default MarkovChain;