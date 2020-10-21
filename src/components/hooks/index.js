import { useState, useCallback } from 'react';

const eps = 1e-6;

export function useMarkovChain() {
  const [nodes, setNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(0);

  const addNode = useCallback(() => {
    const addedNodeLabel = nodes.length;
    const newNodes = [...nodes]
      .map(node => {
        const newNode = { ...node, transitionProbabilities: { ...node.transitionProbabilities } }
        newNode.transitionProbabilities[addedNodeLabel] = 0;
        return newNode;
      });

    newNodes.push(new Node(addedNodeLabel));
    setNodes(newNodes);
  }, [nodes]);

  const iterate = useCallback(() => {
    const randVal = Math.random();
    let prefSum = 0;

    const probabilities = nodes[currentNode].transitionProbabilities;
    for (const label in probabilities) {
      prefSum += probabilities[label];
      if (prefSum > randVal + eps) {
        setCurrentNode(label);
        return label;
      }
    }

    throw new Error("Iterate couldn't found the next node");
  }, [nodes, currentNode]);

  const tryUpdateNodeProbabilities = useCallback((label, newProbabilities, force = false) => {
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
  }, [nodes]);

  const removeNode = useCallback(() => {
    const removedNodeLabel = nodes.length - 1;
    const newNodes = nodes
      .slice(0, -1)
      .map(node => {
        delete node.transitionProbabilities[removedNodeLabel];
        return node;
      });

    setNodes(newNodes);
  }, [nodes]);

  const test = useCallback(() => {
    const length = 5;
    console.log({ length });
    const newNodes = Array
      .from(Array(length).keys())
      .map(label => {
        const node = new Node(label);
        const probs = Array(length).fill(0);
        const next = (parseInt(node.label) + 1) % length;
        const prev = (parseInt(node.label) - 1 + length) % length;

        probs[next] = 0.5;
        probs[prev] = 0.5;
        node.transitionProbabilities = probs;

        return node;
      });

    console.log(newNodes);
    setNodes(newNodes);
  }, []);

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