import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.2),
    },
  },
}));

export default function ChipEventHandler(props) {
  const classes = useStyles();

  const handleDelete = () => {
    console.info('eliminar : ' + props.id);
  };

  const handleClick = () => {
    console.info('editar : ' + props.id);
  };

  return (
    <div className={classes.root}>
      <Chip
        // variant="outlined"
        label={props.label}
        onClick={handleClick}
        onDelete={handleDelete}
      />
    </div>
  );
}