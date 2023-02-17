import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    marginTop: 10,
    minWidth: 250,
    width: '100%',
  },
}));

export default function InputText(props) {
  const [labelWidth, setLabelWidth] = React.useState(0);
  const [name, setName] = React.useState('');
  const labelRef = React.useRef(null);
  const classes = useStyles();

  React.useEffect(() => {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);

  const handleChange = event => {
    setName(event.target.value);
    props.callback({name:props.name,val:event.target.value});
  };

  return (
      <FormControl className={classes.formControl} variant="outlined">
        <InputLabel ref={labelRef} htmlFor="component-outlined">{props.title}</InputLabel>
        <OutlinedInput
          id={name + "_Agregar_reserv"}
          value={name}
          onChange={handleChange}
          labelWidth={labelWidth}
        />
      </FormControl>
  );
}