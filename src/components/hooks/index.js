import { useState } from 'react';

const eps = 1e-6;

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

  const iterate = () => {
    const randVal = Math.random();
    let prefSum = 0;
    let idx = 0;
    nodes[currentNode].transitionProbabilities.forEach((prob) => {
      prefSum += prob;
      if (prefSum > randVal + eps) {
        setCurrentNode(idx);
        return idx;
      }
      idx++;
    });
    return currentNode;
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

    let newNodes = [new Node(0), new Node(1), new Node(2), new Node(3), new Node(4)];

    newNodes.map((node) => {
      let probs = Array(newNodes.length).fill(0);
      const next = (parseInt(node.label) + 1) % newNodes.length;
      const prev = (parseInt(node.label) - 1 + newNodes.length) % newNodes.length;

      probs[next] = 0.5;
      probs[prev] = 0.5;
      node.transitionProbabilities = probs;
    });

    setNodes(newNodes);
  }

  return {
    nodes,
    currentNode,
    setCurrentNode,
    addNode,
    removeNode,
    iterate, 
    test, 
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