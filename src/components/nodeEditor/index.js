import React, { useState, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  makeStyles
} from '@material-ui/core';
import TransitionSlider from './transitionSlider';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: theme.spacing(40),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    height: "100%",
  },
  subtitle: {
    marginBottom: theme.spacing(1),
  },
  inputsContainer: {
    '& > *': {
      marginBottom: theme.spacing(4),
    },
  },
  buttonsContainer: {
    marginTop: "auto",
    marginBottom: theme.spacing(2),
    '& > *': {
      margin: theme.spacing(1),
    },
  }
}));

function NodeEditor({ node, tryUpdateNodeProbabilities, toggleDrawer }) {
  const classes = useStyles();
  const [isDialogOpen, setDialogIsOpen] = useState(false);
  const [transitionProbabilities, setTransitionProbabilities] = useState(node.transitionProbabilities);
  const toggleDialog = useCallback(() => setDialogIsOpen(!isDialogOpen), [setDialogIsOpen, isDialogOpen]);
  const handleDialogConfirm = useCallback(() => {
    tryUpdateNodeProbabilities(transitionProbabilities, true)
    toggleDrawer();
  }, [tryUpdateNodeProbabilities, toggleDrawer, transitionProbabilities]);

  const handleConfirm = useCallback(() => {
    const sucess = tryUpdateNodeProbabilities(transitionProbabilities);
    if (!sucess) {
      toggleDialog();
      return;
    }
    toggleDrawer();
  }, [toggleDrawer, toggleDialog, tryUpdateNodeProbabilities, transitionProbabilities]);

  const handleProbabilitiesChange = useMemo(() => (
    Object.entries(transitionProbabilities)
      .map(([label]) => newValue => {
        const newTransitionProbabilities = { ...transitionProbabilities };
        newTransitionProbabilities[label] = parseFloat(newValue);
        setTransitionProbabilities(newTransitionProbabilities);
      })
  ), [transitionProbabilities, setTransitionProbabilities]);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <h1>Editing Node {node.label}</h1>
        <h3 className={classes.subtitle}>Transition Probabilities</h3>
        <div className={classes.inputsContainer}>
          {
            Object.entries(transitionProbabilities)
              .map(([label, p]) =>
                <TransitionSlider key={label} label={label} probability={p} onChange={handleProbabilitiesChange[label]} />
              )
          }
        </div>
        <div className={classes.buttonsContainer}>
          <Button onClick={toggleDrawer}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Normalize transition values?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The inserted transition values sum is not 1.
            Do you want to normalize those values and continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogConfirm} color="primary" autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default NodeEditor;