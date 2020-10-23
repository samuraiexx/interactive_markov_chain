import { useState, useCallback, useMemo, useEffect } from 'react';

import { matrixExp, transpose, EPS, INF, equal, multiplyMatrixVec } from '../utils';

export function useMarkovChain() {
  const [nodes, setNodes] = useState([new Node(0, 1)]);
  const [currentNode, setCurrentNode] = useState(0);
  const [initialNode, setInitialNode] = useState(0);

  const totalSteps = useMemo(() => {
    let total = 0;
    nodes.forEach(node => {
      total += node.visited.slice(-1)[0];
    });
    return total - 1;
  }, [nodes]);

  useEffect(() => {
    if (totalSteps === 0) {
      setInitialNode(currentNode);
    }
  }, [totalSteps, initialNode, currentNode]);

  const [expected, equilibrium, equilibriumExists] = useMemo(() => {
    // Calc Matrix
    const transitionMatrix = transpose(nodes
      .reduce((acc, node) => {
        acc.push(node.transitionProbabilities);
        return acc;
      }, [])
    );

    const initial = Array(nodes.length).fill(0);
    initial[initialNode] = 1;

    const expected = multiplyMatrixVec(matrixExp(transitionMatrix, totalSteps), initial);
    const equilibrium = multiplyMatrixVec(matrixExp(transitionMatrix, INF), initial);
    const equilibriumExists = equal(equilibrium, multiplyMatrixVec(transitionMatrix, equilibrium));

    return [expected, equilibrium, equilibriumExists];
  }, [nodes, totalSteps, initialNode]);

  const resetIteration = useCallback(() => {
    const newNodes = [...nodes].map(node => (
      { ...node, visited: [(node.label === "0" ? 1 : 0)] }
    ));
    setNodes(newNodes);
    setCurrentNode(0);
  }, [nodes]);

  const addNode = useCallback(() => {
    const addedNodeLabel = nodes.length;
    const newNodes = [...nodes]
      .map(node => {
        const newNode = { ...node, transitionProbabilities: [...node.transitionProbabilities] }
        newNode.transitionProbabilities[addedNodeLabel] = 0;
        newNode.visited = [(newNode.label === "0" ? 1 : 0)];
        return newNode;
      });

    newNodes.push(new Node(addedNodeLabel));
    setCurrentNode(0);
    setNodes(newNodes);
  }, [nodes]);

  const iterate = useCallback(() => {
    const randVal = Math.random();
    let prefSum = 0;

    const probabilities = nodes[currentNode].transitionProbabilities;
    for (const label in probabilities) {
      prefSum += probabilities[label];
      if (prefSum > randVal + EPS) {
        const newNodes = [...nodes].map(node => {
          const newNode = { ...node };
          newNode.visited.push(newNode.visited.slice(-1)[0] + (newNode.label === label));
          return newNode;
        });

        setNodes(newNodes);
        setCurrentNode(label);
        return;
      }
    }

    throw new Error("Iterate couldn't find the next node");
  }, [nodes, currentNode]);

  const tryUpdateNodeProbabilities = useCallback((label, newProbabilities, force = false) => {
    const newNodes = [...nodes];

    // Normalizing Step
    let sum = newProbabilities.reduce((accumulator, currentValue) => accumulator + currentValue);

    if (force) {
      for (const label in newProbabilities) {
        newProbabilities[label] /= sum;
      }
      sum = 1;
    }

    const newNode = { ...newNodes[label] };
    newNode.transitionProbabilities = newProbabilities;
    newNodes[label] = newNode;

    if (sum + EPS < 1 || sum - EPS > 1) {
      return false;
    }

    setNodes(newNodes);
    return true;
  }, [nodes]);

  const removeNode = useCallback(() => {
    if (nodes.length === 1) {
      return;
    }
    setCurrentNode(0);

    const newNodes = nodes.slice(0, -1)
      .map(node => {
        const newNode = { ...node };
        let transitionProbabilities = [...node.transitionProbabilities];
        transitionProbabilities.pop();

        let sum = transitionProbabilities.reduce((accumulator, currentValue) => accumulator + currentValue);
        if (sum + EPS < 1 || sum - EPS > 1) {
          if (sum === 0) {
            transitionProbabilities[newNode.label] = 1;
            sum = 1;
          }
          transitionProbabilities = transitionProbabilities.map(p => p /= sum);
        }

        newNode.transitionProbabilities = transitionProbabilities;
        newNode.visited = [newNode.label === "0" ? 1 : 0];
        return newNode;
      });

    setNodes(newNodes);
  }, [nodes]);

  const test = useCallback(() => {
    const length = 5;
    const newNodes = Array
      .from(Array(length).keys())
      .map(label => {
        const node = new Node(label, (label === 0 ? 1 : 0));
        const probs = Array(length).fill(0);
        const next = (parseInt(node.label) + 1) % length;
        const prev = (parseInt(node.label) - 1 + length) % length;

        probs[next] = 0.5;
        probs[prev] = 0.5;
        node.transitionProbabilities = probs;

        return node;
      });

    setNodes(newNodes);
  }, []);
  window.runTest = test;

  return {
    totalSteps,
    nodes,
    currentNode,
    expected,
    equilibrium,
    equilibriumExists,
    resetIteration,
    setCurrentNode,
    addNode,
    removeNode,
    iterate,
    test,
    tryUpdateNodeProbabilities,
  };
}

class Node {
  constructor(label, initialVisited = 0) {
    this.label = label.toString();
    this.visited = [initialVisited];
    this.transitionProbabilities = new Array(label + 1).fill(0);
    this.transitionProbabilities[label] = 1;
  }
}