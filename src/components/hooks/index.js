import { useState } from 'react';

const epsolon = 1e-6;

export function useMarkovChain() {
  const [nodes, setNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(0);

  const addNode = () => {
    const addedNodeLabel = nodes.length;
    const newNodes = [...nodes]
      .map(node => {
        const newNode = { ...node, transitionProbabilities: { ...node.transitionProbabilities } }
        newNode.transitionProbabilities[addedNodeLabel] = 0;
        return newNode;
      });

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

  const tryUpdateNodeProbabilities = (label, newProbabilities, force = false) => {
    const newNodes = [...nodes];

    // Normalizing Step
    let sum = Object.values(newProbabilities).reduce((accumulator, currentValue) => accumulator + currentValue);

    if (force) {
      for (const label in newProbabilities) {
        newProbabilities[label] /= sum;
      }
      sum = Object.values(newProbabilities).reduce((accumulator, currentValue) => accumulator + currentValue);
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
  };
}

class Node {
  constructor(label) {
    this.label = label.toString();
    this.transitionProbabilities = new Array(label + 1).fill(0);
    this.transitionProbabilities[label] = 1;
  }
}