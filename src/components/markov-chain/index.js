import React, { useState } from 'react';
import {
  Drawer,
  Button,
  ButtonGroup,
} from "@material-ui/core"
import { Graph } from "react-d3-graph";

import NodeEditor from '../nodeEditor';

function MarkovChain(props) {
  const {
    nodes,
    selectedNode,
    tryUpdateNodeProbabilities,
    /*
      currentNode,
      setCurrentNode,
      setSelectedNode,
      addNode,
      removeNode,
    */
  } = props;

  const nodeEditorProps = {
    node: nodes[selectedNode],
    tryUpdateNodeProbabilities: probabilities => tryUpdateNodeProbabilities(selectedNode, probabilities)
  }

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);


  // graph payload (with minimalist structure)
  // https://danielcaldas.github.io/react-d3-graph/docs/
  const data = {
    nodes: [{ id: 0 }, { id: 1 }, { id: 2 }],
    links: [
      { source: 0, target: 1, strokeWidth: 5 },
      { source: 1, target: 0 },
      { source: 0, target: 2 },
    ],
  };

  // the graph configuration, you only need to pass down properties
  // that you want to override, otherwise default ones will be used
  const myConfig = {
    nodeHighlightBehavior: true,
    directed: true,
    highlightDegree: 0,
    d3: {
      linkLength: 200,
    },
    node: {
      color: "rgb(81,81,81)",
      size: 2000,
      highlightStrokeColor: "white",
      labelPosition: "center",
      fontSize: 20,
      highlightFontSize: 20,
      fontColor: "white",
    },
    link: {
      highlightColor: "white",
      type: "CURVE_SMOOTH"
    },
  };

  const onClickNode = function (nodeId) {
    console.log(`Clicked node ${nodeId}`);
  };

  const onRightClickNode = function (event, nodeId) {
    console.log(`Right clicked node ${nodeId}`);
  };

  const onMouseOverNode = function (nodeId) {
    console.log(`Mouse over node ${nodeId}`);
  };

  const onMouseOutNode = function (nodeId) {
    console.log(`Mouse out node ${nodeId}`);
  };

  const onClickLink = function (source, target) {
    console.log(`Clicked link between ${source} and ${target}`);
  };

  const onRightClickLink = function (event, source, target) {
    console.log(`Right clicked link between ${source} and ${target}`);
  };

  const onMouseOverLink = function (source, target) {
    console.log(`Mouse over in link between ${source} and ${target}`);
  };

  const onMouseOutLink = function (source, target) {
    console.log(`Mouse out link between ${source} and ${target}`);
  };

  const onNodePositionChange = function (nodeId, x, y) {
    console.log(`Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`);
  };

  return (
    <React.Fragment>
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        data={data}
        config={myConfig}
        onClickNode={onClickNode}
        onRightClickNode={onRightClickNode}
        onClickLink={onClickLink}
        onRightClickLink={onRightClickLink}
        onMouseOverNode={onMouseOverNode}
        onMouseOutNode={onMouseOutNode}
        onMouseOverLink={onMouseOverLink}
        onMouseOutLink={onMouseOutLink}
        onNodePositionChange={onNodePositionChange}
      />
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <Button onClick={toggleDrawer}>Open</Button>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <NodeEditor {...nodeEditorProps} />
      </Drawer>
    </React.Fragment>
  );
}

export default MarkovChain;