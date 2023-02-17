// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import FormControl from '@material-ui/core/FormControl';
// import InputLabel from '@material-ui/core/InputLabel';
// import OutlinedInput from '@material-ui/core/OutlinedInput';

// const useStyles = makeStyles(theme => ({
//   container: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   formControl: {
//     marginTop: 10,
//     minWidth: 250,
//     width: '100%',
//   },
// }));

// export default function InputEdit(props) {
//   const [labelWidth, setLabelWidth] = React.useState(0);
//   const [name, setName] = React.useState(props.value);
//   const labelRef = React.useRef(null);
//   const classes = useStyles();

//   React.useEffect(() => {
//     setLabelWidth(labelRef.current.offsetWidth);
//   }, []);

//   const handleChange = event => {
//     setName(event.target.value);
//     props.callback({name:props.name,val:event.target.value});
//   };

//   return (
//     <FormControl className={classes.formControl} variant="filled">
//         <InputLabel ref={labelRef} htmlFor={"component-outlined_" + props.name}>{props.title}</InputLabel>
//         <OutlinedInput
//           id={"component-outlined_" + props.name}
//           value={name}
//           onChange={handleChange}
//           labelWidth={labelWidth}
//         />
//       </FormControl>
//   );
// }


import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: 10,
      width: '100%',
    },
  },
}));

export default function InputEdit(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.value);

  const handleChange = event => {
    setValue(event.target.value);
    props.callback({name:props.name,val:event.target.value});
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField 
        id={"component-outlined_" + props.name} 
        label={props.title}
        variant="outlined" 
        value={value}
        onChange={handleChange}
      />
    </form>
  );
}
