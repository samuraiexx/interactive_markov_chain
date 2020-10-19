import React from 'react';
import {
  Button,
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
  /*
  const {
    nodes,
    currentNode,
    selectedNode,
    setCurrentNode,
    setSelectedNode,
    addNode,
    removeNode,
    tryUpdateNodeProbabilities
  } = markovChainState;
  */

  return (
    <div>
      <h1>Interactive Markov Chains</h1>
      <h2>State Statistics</h2>
      <p>Steps: 234</p>
      <Button>asdf</Button>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <MarkovChain {...markovChainState} />
    </div>
  );
}

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.),
  createData('Eclair', 262, 16.0, 24, 6.),
  createData('Cupcake', 305, 3.7, 67, 4.),
  createData('Gingerbread', 356, 16.0, 49, 3.),
];

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default Home;