import { useState } from 'react';

const eps = 1e-6;

export function useMarkovChain() {
  const [nodes, setNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(0);

  const addNode = () => {
    const addedNodeLabel = nodes.length;
    const newNodes = [...nodes]
      .map(node => ({ ...node, transitionProbabilities: { ...node.transitionProbabilities, addedNodeLabel: 0 } }));

    newNodes.push(new Node(addedNodeLabel));
    setNodes(newNodes);
  }

  const removeNode = () => {
    const removedNodeLabel = nodes.length - 1;
    const newNodes = nodes
      .slice(0, -1)
      .map(node => {
        delete node.transitionProbabilities[removedNodeLabel];
        return node;
      });

    setNodes(newNodes);
  }

  const iterate = () => {
    const randVal = Math.random();
    let prefSum = 0;
    let idx = 0;
    for (const prob in currentNode.transitionProbabilities) {
      prefSum += prob;
      if (prefSum > randVal + eps) {
        currentNode = nodes[idx];
        return currentNode;
      }
      idx++;
    }
    return currentNode;
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

    if (sum + eps < 1 || sum - eps > 1) {
      return false;
    }

    setNodes(newNodes);
    return true;
  }

  const test = () => {
    while (nodes.length > 0) {
      removeNode();
    }

    for (let i = 0; i < 5; i++) {
      addNode();
    }

    for (let i = 0; i < 4; i++) {
      nodes[i].transitionProbabilities[i+1] = 0.5
    }

    for (let i = 1; i < 5; i++) {
      nodes[i].transitionProbabilities[i-1] = 0.5
    }
  }

  return {
    nodes,
    currentNode,
    setCurrentNode,
    addNode,
    removeNode,
    iterate, 
    tryUpdateNodeProbabilities,
  };
}

class Node {
  constructor(label) {
    this.label = label.toString();
    this.transitionProbabilities = new Array(label + 1).fill(0);
    this.transitionProbabilities[label] = 1;
  }
}