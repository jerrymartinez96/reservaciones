import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';



export default function SelectOutline(props) {
    const [valueSelect, setValueSelect] = React.useState(props.value ? props.value: "");

    const useStyles = makeStyles(() => ({
        formControl: {
            width: props.with,
            marginTop: 15,
            float: 'right',
            marginRight: 0,
            background: !props.disabled ? "#d8d8d8" : "",
        },
    }));

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const handleChange = event => {
        setValueSelect(event.target.value);
        props.callback({name:props.estado,val:event.target.value});
    };
    return (
        <FormControl variant="outlined" className={useStyles().formControl}>
            <InputLabel ref={inputLabel} id="select-outlined-label">{props.name}</InputLabel>
            <Select 
                labelId="select-outlined-label" 
                id="select-outlined" 
                value={!props.disabled ? "" : valueSelect} 
                onChange={handleChange} 
                labelWidth={labelWidth}
                disabled={!props.disabled}
            >
                {props.items.map((item) => {
                    return(<MenuItem value={item.val} key={item.val}>{item.title}</MenuItem>);
                    // return(console.log(item));
                })}
            </Select>
        </FormControl>
    );
}
