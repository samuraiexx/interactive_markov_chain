import React, { useState, useCallback } from 'react';
import {
  Grid,
  Typography,
  Slider,
  Input,
  makeStyles
} from '@material-ui/core';
import TransitionSlider from './transitionSlider';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

function NodeEditor({ node, tryUpdateNodeProbabilities }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(30);
  const [transitionProbabilities, setTransitionProbabilities] = useState(node.transitionProbabilities);

  /*
  for (const label in transitionProbabilities) {
    handleProbabilitiesChange[label] =
      useCallback((event, newValue) => {
        const newTransitionProbabilities = { ...transitionProbabilities };
        newTransitionProbabilities[label] = newValue;
        setTransitionProbabilities(newTransitionProbabilities);
      }, [transitionProbabilities, setTransitionProbabilities])
  }
  */

  return (
    <div className={classes.root}>
      {
        Object.entries(transitionProbabilities)
          .map(([label, p]) =>
            <TransitionSlider label={label} probability={p} setProbability={null} />
          )
      }
    </div>
  );
}

export default NodeEditor;