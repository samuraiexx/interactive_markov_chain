import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Drawer,
  Button,
  ButtonGroup,
  makeStyles,
  Slider,
  Paper,
} from "@material-ui/core";
import ForceGraph2D from 'react-force-graph-2d';
import _ from 'lodash';

import NodeEditor from '../nodeEditor';
import { nodesPosition, renderNodeCanvas } from './nodeCanvasObject';

const useStyles = makeStyles(theme => ({
  container: {
    width: "50%"
  },
  graphContainer: {
    marginTop: theme.spacing(2),
    overflow: "hidden",
  },
  sliderContainer: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: 300,
  }
}));

function MarkovChain(props) {
  const {
    nodes,
    tryUpdateNodeProbabilities,
    addNode,
    removeNode,
    iterate,
    test,
    currentNode,
    /*
      setCurrentNode,
    */
  } = props;

  const [selectedNode, setSelectedNode] = useState(null);
  const [open, setOpen] = useState(false);
  const [runTimeout, setRunTimeout] = useState(null);
  const [runSpeed, setRunSpeed] = useState(10);
  const toggleDrawer = useCallback(() => setOpen(!open), [setOpen, open]);
  const onNodeClick = useCallback(node => {
    setSelectedNode(node.id);
    toggleDrawer();
  }, [setSelectedNode, toggleDrawer]);
  const linkWidth = useCallback(link => link.width, []);
  const linkColor = useCallback(() => "#e3e3e3", []);
  const handleSliderChange = useCallback((event, newValue) => setRunSpeed(newValue), [setRunSpeed]);
  const classes = useStyles();

  const nodeEditorProps = useMemo(() => ({
    node: nodes[selectedNode],
    tryUpdateNodeProbabilities: (probabilities, force = false) => tryUpdateNodeProbabilities(selectedNode, probabilities, force),
    toggleDrawer
  }), [nodes, tryUpdateNodeProbabilities, toggleDrawer, selectedNode]);

  const data = useMemo(() => ({
    nodes: nodes.map(node => ({
      id: node.label,
      name: node.label,
      isCurrentNode: node.label === currentNode.toString(),
      x: nodesPosition[node.label] && nodesPosition[node.label][0],
      y: nodesPosition[node.label] && nodesPosition[node.label][1]
    })),
    links: _.flatten(
      nodes.map(node => (
        Object.entries(node.transitionProbabilities)
          .map(([target, p]) => ({
            source: node.label,
            target,
            width: 5 * p,
          }))
          .filter(edge => edge.width > 0)
      ))
    )
  }), [nodes, currentNode]);

  const runStepRef = useRef(null);
  const runStep = useCallback(() => {
    if (runSpeed === 0) {
      setRunTimeout(null);
      return;
    }

    iterate();
    const runTimeout = setTimeout(() => {
      runStepRef.current();
    }, 5000 / runSpeed);

    setRunTimeout(runTimeout);
  }, [iterate, setRunTimeout, runSpeed]);
  runStepRef.current = runStep;

  const onClickRun = useCallback(() => {
    if (!_.isNull(runTimeout)) {
      return;
    }
    runStep();
  }, [runStep, runTimeout]);

  const onClickStop = useCallback(() => {
    setRunTimeout(null);
  }, []);

  useEffect(
    () => {
      return () => {
        if (_.isNull(runTimeout)) {
          return;
        }
        clearTimeout(runTimeout);
      }
    }, [runTimeout, setRunTimeout]);

  return (
    <div>
      <Paper className={classes.graphContainer} >
        <ForceGraph2D
          height={300}
          graphData={data}
          onNodeClick={onNodeClick}
          nodeLabel="id"
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.25}
          linkWidth={linkWidth}
          nodeCanvasObject={renderNodeCanvas}
          d3VelocityDecay={1}
          linkColor={linkColor}
        />
      </Paper>
      <div className={classes.sliderContainer} >
        <p>Run Speed</p>
        <Slider
          value={runSpeed}
          onChange={handleSliderChange}
          aria-labelledby="speed-slider"
          step={1}
          min={0}
          max={50}
        />
      </div>
      <ButtonGroup aria-label="outlined primary button group">
        <Button onClick={addNode}>Add Node</Button>
        <Button onClick={removeNode}>Remove Node</Button>
        <Button onClick={iterate}>Step</Button>
        <Button onClick={onClickRun}>Run</Button>
        <Button onClick={onClickStop}>Stop</Button>
        <Button onClick={_.noop}>Reset</Button>
        <Button onClick={test}>Generate Test Graph</Button>
      </ButtonGroup>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <NodeEditor {...nodeEditorProps} />
      </Drawer>
    </div>
  );
}

export default MarkovChain;