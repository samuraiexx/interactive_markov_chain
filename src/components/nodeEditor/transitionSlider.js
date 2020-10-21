import React from 'react';
import {
  Grid,
  Typography,
  Slider,
  Input,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles({
  input: {
    width: 42,
  },
});

const handleSliderChange = (event, newValue) => {
};

const handleInputChange = (event) => {
};


function TransitionSlider({ label, probability, setProbability }) {
  const classes = useStyles();

  const handleBlur = () => {
    if (probability < 0) {
      setProbability(0);
    } else if (probability > 100) {
      setProbability(100);
    }
  };


  return (
    <div>
      <Typography id="input-slider" gutterBottom>
        Node {label}:
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={probability}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={probability}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default TransitionSlider;