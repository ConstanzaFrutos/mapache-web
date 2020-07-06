import React, { Component } from 'react';
import { withRouter } from 'react-router';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Add from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button';


import "../../assets/css/component/recursos/PerfilEmpleado.css";

import Requester from "../../communication/Requester";


//const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheSoporteBaseUrl = "http://localhost:5000";


class CrearTicket extends Component {
  constructor(props){
    super(props);

    this.requester = new Requester(mapacheSoporteBaseUrl);
    this.state={
      nombre:'',
      tipo:'',
      severidad:'',
      descripcion:''
    }
  }


handleCrear(){
  console.log("Clickeado el crear");
  this.requester.post('/tickets/', this.state)
  .then(response => {
      if (response.ok){
          return response.json();
      } else {
          console.log("Error al crear ticket");
          console.log(this.state)
      }
  })
}
render() {
    return (
      <div>


           <TextField
             hintText="Enter your Username"
             floatingLabelText="Username"
             onChange = {(event,newValue) => this.setState({nombre:newValue})}
             />
           <br/>
             <TextField

               hintText="Ingrese el tipo"
               floatingLabelText="Username"
               onChange = {(event,newValue) => this.setState({tipo:newValue})}
               />
           <br/>
             <TextField
               hintText="Ingrese severidad"
               floatingLabelText="Username"
               onChange = {(event,newValue) => this.setState({severidad:newValue})}
               />
           <br/>
             <TextField
               hintText="Ingrese descripcion"
               floatingLabelText="Username"
               onChange = {(event,newValue) => this.setState({descripcion:newValue})}
               />
            <br/>
            <Button variant="contained" color="primary" onClick={() => this.handleCrear()}>
              Crear Ticket

            </Button>
      </div>
    );
  }
}
const style = {
 margin: 15,
};

export default withRouter(CrearTicket);
/*
const title = "Empleados";

const columns = [
    {
        title: "Nombre", 
        field: "nombre",
        editable: "never"
    },
    {
        title: "Tipo", 
        field: "tipo",
        editable: "never"
    },
    {
        title: "Severidad", 
        field: "severidad",
        editable: "never"
    },
    {
        title: "Descripcion", 
        field: "descripcion",
        editable: "never"
    }
];

const tiposDeTicket = [
    {
        value: 'error',
        label: 'Error',
    },
    {
        value: 'consulta',
        label: 'Consulta',
    },
    {
        value: 'mejora',
        label: 'Mejora',
    },
];


/*
export default function MultilineTextFields() {
    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');
  
    const handleChange = (event) => {
      setValue(event.target.value);
    };
  
    return (
      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField
            id="standard-multiline-flexible"
            label="Multiline"
            multiline
            rowsMax={4}
            value={value}
            onChange={handleChange}
          />
          <TextField
            id="standard-textarea"
            label="Multiline Placeholder"
            placeholder="Placeholder"
            multiline
          />
          <TextField
            id="standard-multiline-static"
            label="Multiline"
            multiline
            rows={4}
            defaultValue="Default Value"
          />
        </div>
        <div>
          <TextField
            id="filled-multiline-flexible"
            label="Multiline"
            multiline
            rowsMax={4}
            value={value}
            onChange={handleChange}
            variant="filled"
          />
          <TextField
            id="filled-textarea"
            label="Multiline Placeholder"
            placeholder="Placeholder"
            multiline
            variant="filled"
          />
          <TextField
            id="filled-multiline-static"
            label="Multiline"
            multiline
            rows={4}
            defaultValue="Default Value"
            variant="filled"
          />
        </div>
        <div>
          <TextField
            id="outlined-multiline-flexible"
            label="Multiline"
            multiline
            rowsMax={4}
            value={value}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            id="outlined-textarea"
            label="Multiline Placeholder"
            placeholder="Placeholder"
            multiline
            variant="outlined"
          />
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows={4}
            defaultValue="Default Value"
            variant="outlined"
          />
        </div>
      </form>
    );
  }
*/
/*
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function FormPropsTextFields() {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField required id="standard-required" label="Required" defaultValue="Hello World" />
        <TextField disabled id="standard-disabled" label="Disabled" defaultValue="Hello World" />
        <TextField
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
        />
        <TextField
          id="standard-read-only-input"
          label="Read Only"
          defaultValue="Hello World"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="standard-number"
          label="Number"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField id="standard-search" label="Search field" type="search" />
        <TextField
          id="standard-helperText"
          label="Helper text"
          defaultValue="Default Value"
          helperText="Some important text"
        />
      </div>
      <div>
        <TextField
          required
          id="filled-required"
          label="Required"
          defaultValue="Hello World"
          variant="filled"
        />
        <TextField
          disabled
          id="filled-disabled"
          label="Disabled"
          defaultValue="Hello World"
          variant="filled"
        />
        <TextField
          id="filled-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="filled"
        />
        <TextField
          id="filled-read-only-input"
          label="Read Only"
          defaultValue="Hello World"
          InputProps={{
            readOnly: true,
          }}
          variant="filled"
        />
        <TextField
          id="filled-number"
          label="Number"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
        />
        <TextField id="filled-search" label="Search field" type="search" variant="filled" />
        <TextField
          id="filled-helperText"
          label="Helper text"
          defaultValue="Default Value"
          helperText="Some important text"
          variant="filled"
        />
      </div>
      <div>
        <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue="Hello World"
          variant="outlined"
        />
        <TextField
          disabled
          id="outlined-disabled"
          label="Disabled"
          defaultValue="Hello World"
          variant="outlined"
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="outlined"
        />
        <TextField
          id="outlined-read-only-input"
          label="Read Only"
          defaultValue="Hello World"
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
        />
        <TextField
          id="outlined-number"
          label="Number"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField id="outlined-search" label="Search field" type="search" variant="outlined" />
        <TextField
          id="outlined-helperText"
          label="Helper text"
          defaultValue="Default Value"
          helperText="Some important text"
          variant="outlined"
        />
      </div>
    </form>
  );
}

*/