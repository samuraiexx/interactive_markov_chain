import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  // Tooltip,
} from "@material-ui/core"

import MarkovChain from '../markov-chain';
import { useMarkovChain } from '../hooks';

function Home() {
  const classes = useStyles();
  const markovChainState = useMarkovChain();
  const totalSteps = React.useMemo(() => {
    let total = 0;
    markovChainState.nodes.forEach(node => {
      total += node.visited;
    });
    return total;
  }, [markovChainState]);
  /*
  const {
    nodes,
    currentNode,
    setCurrentNode,
    addNode,
    removeNode,
    tryUpdateNodeProbabilities
  } = markovChainState;
  */

  return (
    <div>
      <h1>Interactive Markov Chains</h1>
      <h2>State Statistics</h2>
      <p>Steps: {totalSteps}</p>
      <div className={classes.container}>
        {markovChainState.nodes.length === 0
          ? <div className={classes.tableContainer}>
              <TableContainer component={Paper}>
              </TableContainer>
            </div>
          : <div className={classes.tableContainer}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" width="50">Node</TableCell>
                      <TableCell align="right">Visits</TableCell>
                      <TableCell align="right">Visits (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {markovChainState.nodes.map((node) => (
                      <TableRow key={node.label}>
                        <TableCell component="th" scope="row">
                          {node.label}
                        </TableCell>
                        <TableCell align="right">{node.visited}</TableCell>
                        <TableCell align="right">{(totalSteps === 0) ? "0.00 %"
                          : (node.visited * 100.0 / totalSteps).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
        }
        <MarkovChain {...markovChainState} />
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tableContainer: {
    width: "50%",
    padding: "20px",
  },
  table: {
    minWidth: 400,
  },
}));

export default Home;