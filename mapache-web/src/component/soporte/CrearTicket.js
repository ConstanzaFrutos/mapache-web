import React, { Component } from 'react';
import { withRouter } from 'react-router';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Requester from "../../communication/Requester";

import "../../assets/css/component/soporte/Ticket.css";

//const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheSoporteBaseUrl = "http://localhost:5000";

const tipos = [
  {
    value: 'Error',
    label: 'Error'
  },
  {
    value: 'Consulta',
    label: 'Consulta'
  },
  {
    value: 'Mejora',
    label: 'Mejora'
  }
]

const severidades = [
  {
    value: 'Alta',
    label: 'Alta'
  },
  {
    value: 'Media',
    label: 'Media'
  },
  {
    value: 'Baja',
    label: 'Baja'
  }
]


class CrearTicket extends Component {
  
  constructor(props){
    super(props);

    this.requester = new Requester(mapacheSoporteBaseUrl);
    this.state={
      nombre:'',
      tipo:'Error',
      severidad:'Baja',
      descripcion:''
    }
  }


  handleChangeNombre = event => {
    this.setState({ nombre: event.target.value });
  }
  handleChangeTipo = event => {
    this.setState({ tipo: event.target.value });
  }
  handleChangeSeveridad = event => {
    this.setState({ severidad: event.target.value });
  }
  handleChangeDescripcion = event => {
    this.setState({ descripcion: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();

    const ticket = {
      nombre: this.state.nombre,
      descripcion: this.state.descripcion,
      tipo: this.state.tipo,
      severidad: this.state.severidad,
    };

    this.requester.post('/tickets', ticket)
    .then(response => {
        if (response.ok){

            this.props.history.push({
                pathname: `/soporte/`
            });
        } else {
            console.log("al crear el ticket");
        }
    });
  }

/*
          <label>
            tipo:
            <input type="text" name="tipo" onChange={this.handleChangeTipo} />
          </label>
*/

render() {
    return (  
      <div class='form-crear-ticket'>
        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
          <div>
            <TextField id="nombre" variant="outlined" name="nombre" label="Nombre" onChange={this.handleChangeNombre}/>
          </div>
          <br/>
          <div>
            <TextField id="tipo" name="tipo" variant="outlined" select label="Tipo" value={this.state.tipo} onChange={this.handleChangeTipo}>
            {tipos.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          </div>
          <br/>
          <div>
            <TextField id="severidad" name="severidad" variant="outlined" select label="Severidad" value={this.state.severidad} onChange={this.handleChangeSeveridad}>
            {severidades.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
            </TextField>
          </div>
          <br />
          <div>
            <TextField id="descripcion" style={{width: '600px'}} name="descripcion" label="Descripcion" multiline rows={8} variant="outlined" onChange={this.handleChangeDescripcion}/>
          </div>
          <br />
          <Button variant="contained" color="primary" type="submit">
            Agregar
          </Button>
        </form>
      </div>
    );
  }
}


export default withRouter(CrearTicket);
/*

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
*/