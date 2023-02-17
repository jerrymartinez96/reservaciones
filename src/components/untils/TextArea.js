import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            // margin: theme.spacing(1),
            width: '100%',
            marginTop: 15,
            float: 'right',
            marginRight: 0,
        },
    },
}));

export default function TextArea(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(props.value);

    const handleChange = (event) => {
        setValue(event.target.value);
        props.callback({ name: props.name, val: event.target.value });
    };

    return (
        <form className={classes.root} noValidate autoComplete="off">
                <TextField
                    id={"form-textarea-" + props.name}
                    label={props.label}
                    multiline
                    rows={4}
                    variant="outlined"
                    value={value}
                    onChange={handleChange}
                />
        </form>
    );
}