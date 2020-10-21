import React, { useCallback } from 'react';
import {
  Grid,
  Slider,
  TextField,
} from '@material-ui/core';

function TransitionSlider({ label, probability, onChange }) {
  const handleBlur = useCallback(() => {
    if (probability < 0) {
      onChange(0);
    } else if (probability > 1) {
      onChange(1);
    }
  }, [probability, onChange]);

  const handleSliderChange = useCallback((event, newValue) => onChange(newValue), [onChange]);
  const handleTextChange = useCallback(event => onChange(event.target.value), [onChange]);

  return (
    <div>
      <p>Node {label}</p>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={probability}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            step={0.01}
            min={0}
            max={1}
          />
        </Grid>
        <Grid item>
          <TextField
            value={probability}
            variant="outlined"
            onChange={handleTextChange}
            onBlur={handleBlur}
            type="number"
            inputProps={{
              step: 0.1,
              min: 0,
              max: 1,
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default TransitionSlider;