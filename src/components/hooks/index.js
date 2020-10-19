import { useState } from 'react';

const epsolon = 1e-6;

export function useMarkovChain() {
  const [nodes, setNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);

  const addNode = () => {
    setNodes([...nodes, new Node(nodes.length)])
  }

  const removeNode = () => {
    setNodes(nodes.slice(0, -1));
  }

  const tryUpdateNodeProbabilities = (label, newProbabilities, force = false) => {
    const newNodes = [...nodes];

    // Normalizing Step
    const sum = newProbabilities.reduce((accumulator, currentValue) => accumulator + currentValue);

    if (force) {
      newProbabilities = newProbabilities.map(probability => probability / sum);
    }

    const newNode = { ...newNodes[label] };
    newNode.transitionProbabilities = newProbabilities;
    newNodes[label] = newNode;

    if (sum + epsolon < 1 || sum - epsolon > 1) {
      return false;
    }

    setNodes(newNodes);
    return true;
  }

  return {
    nodes,
    currentNode,
    setCurrentNode,
    addNode,
    removeNode,
    tryUpdateNodeProbabilities,
    selectedNode,
    setSelectedNode
  };
}

class Node {
  constructor(label) {
    this.isSelected = false;
    this.label = label;
    this.transitionProbabilities = [];

    this.transitionProbabilities[label] = 1;
  }
}