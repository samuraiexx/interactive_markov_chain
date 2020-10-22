import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Modal,
  Drawer,
  Button,
  ButtonGroup,
  makeStyles,
  Slider,
  Paper,
} from "@material-ui/core";
import ForceGraph2D from 'react-force-graph-2d';
import _ from 'lodash';

import History from '../nodeHistory/plotHistory';
import { useMarkovChain } from '../hooks';
import NodeEditor from '../nodeEditor';
import { nodesPosition, renderNodeCanvas } from './nodeCanvasObject';

const useStyles = makeStyles(theme => ({
  container: {
    width: "50%",
    float: "left",
    padding: "20px"
  },
  graphContainer: {
  },
  sliderContainer: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: 300,
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    width: 600,
    height: 400,
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


function MarkovChain(markovChainState) {
  const {
    nodes,
    tryUpdateNodeProbabilities,
    addNode,
    removeNode,
    iterate,
    currentNode,
    resetIteration,
  } = markovChainState;

  const [selectedNode, setSelectedNode] = useState(null);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [runTimeout, setRunTimeout] = useState(null);
  const [runSpeed, setRunSpeed] = useState(10);
  const toggleDrawer = useCallback(() => setOpen(!open), [setOpen, open]);
  const toggleModal = useCallback(() => setOpenModal(!openModal), [setOpenModal, openModal]);
  const [modalStyle] = React.useState(getModalStyle);
  const onNodeClick = useCallback(node => {
    setSelectedNode(node.id);
    toggleDrawer();
  }, [setSelectedNode, toggleDrawer]);
  const onNodeRightClick = useCallback(node => {
    setSelectedNode(node.id);
    handleOpenModal();
  }, [setSelectedNode, toggleModal]);
  const linkWidth = useCallback(link => link.width, []);
  const linkColor = useCallback(() => "#e3e3e3", []);
  const handleSliderChange = useCallback((event, newValue) => setRunSpeed(newValue), [setRunSpeed]);
  const classes = useStyles();

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const nodeEditorProps = useMemo(() => ({
    node: nodes[selectedNode],
    tryUpdateNodeProbabilities: (probabilities, force = false) => tryUpdateNodeProbabilities(selectedNode, probabilities, force),
    toggleDrawer
  }), [nodes, tryUpdateNodeProbabilities, toggleDrawer, selectedNode]);

  const historyProps = useMemo(() => ({
    node: nodes[selectedNode]
  }), [nodes, selectedNode]);

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

  const modalBody = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">History of Node {selectedNode}</h2>
      <p id="simple-modal-description">
      </p>
      <History {...historyProps} />
    </div>
  );

  return (
    <div className={classes.container}>
      <Paper className={classes.graphContainer} >
        <ForceGraph2D
          width={535}
          height={300}
          graphData={data}
          onNodeClick={onNodeClick}
          onNodeRightClick={onNodeRightClick}
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
          max={200}
        />
      </div>
      <div align="left">
        <ButtonGroup aria-label="outlined primary button group">
          <Button onClick={addNode}>Add Node</Button>
          <Button onClick={removeNode}>Remove Node</Button>
          <Button onClick={iterate}>Step</Button>
          <Button onClick={onClickRun}>Run</Button>
          <Button onClick={onClickStop}>Stop</Button>
          <Button onClick={resetIteration}>Reset</Button>
        </ButtonGroup>
      </div>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <NodeEditor {...nodeEditorProps} />
      </Drawer>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {modalBody}
      </Modal>
    </div>
  );
}

export default MarkovChain;