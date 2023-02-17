import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    color: '#0e93c7',
    background: '#e9ecef',
  },
});

export default function CenteredTabs(props) {
  const classes = useStyles();
  // const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    // setValue(newValue);
    props.setLaboratorio(newValue);
  };

  

  return (
    <Paper className={classes.root}>
      <Tabs
        value={props.laboratorio}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="inherit"
        centered
      >
        <Tab label="ED1-CC1"/>
        <Tab label="ED1-CC2" />
        <Tab label="ED1-CC3" />
        <Tab label="ED1-REDES" />
        <Tab label="ED1-HARDWARE" />
        <Tab label="AI1" />
        <Tab label="AI2" />
      </Tabs>
    </Paper>
  );
}

