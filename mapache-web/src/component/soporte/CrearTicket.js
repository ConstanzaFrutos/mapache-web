import React, { Component } from 'react';
import { withRouter } from 'react-router';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Requester from "../../communication/Requester";

import "../../assets/css/component/soporte/Ticket.css";

const mapacheSoporteBaseUrl = "https://psa-api-support.herokuapp.com";
//const mapacheSoporteBaseUrl = "http://localhost:5000";

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

const responsables = [
  {
      value: -1,
      label: "Ninguno"
  },
  {
    value: 1,
    label: "Martin Perez"
  },
  {
    value: 2,
    label: "Joaquin Lapa"
  },
  {
    value: 3,
    label: "Roman Riquelme"
  }
]

class CrearTicket extends Component {
  
  constructor(props){
    super(props);

    this.requester = new Requester(mapacheSoporteBaseUrl);

    this.clientes = [{"id":-1, "razon_social": "Ninguno"}]

    this.state={
      nombre:'',
      tipo:'Consulta',
      severidad:'Baja',
      descripcion:'',
      pasos:'',
      cliente: {
        id: -1,
        razon_social: ""
      },
      id_responsable: -1
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
  handleChangePasos = event => {
    this.setState({ pasos: event.target.value });
  }
  handleChangeCliente = event => {
    this.setState({ cliente: {"id": event.target.value, "razon_social": event.target.label} });
  }
  handleChangeResponsable = event => {
    this.setState({ id_responsable: event.target.value});
  }

  handleSubmit = event => {
    event.preventDefault();

    const ticket = {
      nombre: this.state.nombre,
      descripcion: this.state.descripcion,
      tipo: this.state.tipo,
      severidad: this.state.severidad,
      pasos: this.state.pasos,
      cliente: this.state.cliente,
      id_responsable: this.state.id_responsable
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



  componentDidMount() {
        this.requester.get('/clientes')
        .then(response => {
          if (response.ok){
              return response.json();
          } else {
              console.log("Error al consultar ticket con id: ");
          }
        })
        .then(response => {
            console.log(response);
            if (response) {
                this.clientes = response
                this.setState({cliente: {'id': response[0].id, 'razon_social': response[0].razon_social}})
            }
        });
    }

render() {
    return (  
      <div class='form-crear-ticket'>
        <h2>Nuevo Ticket</h2>
        <br/>
        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
          <div>
            <TextField id="nombre" variant="outlined" name="nombre" label="Nombre" onChange={this.handleChangeNombre}/>
          </div>
          <br/>
          <div>
          <TextField id="cliente" name="cliente" variant="outlined" select label="Cliente" value={this.state.cliente.id} onChange={this.handleChangeCliente}>
                    {this.clientes.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.razon_social}
                    </MenuItem>
                    ))}
          </TextField>
          &nbsp;&nbsp;&nbsp;
          <TextField id="tipo" name="tipo" variant="outlined" select label="Tipo" value={this.state.tipo} onChange={this.handleChangeTipo}>
            {tipos.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          </div>

          <br/>
          {this.state.tipo==='Error'
            ?<div>
              <TextField id="pasos" variant="outlined" name="pasos" label="Pasos para reproducir" style={{width: '600px'}} multiline rows={6} onChange={this.handleChangePasos}/>
             </div>
          : null}
          <br/>
          <div>
            <TextField id="severidad" name="severidad" variant="outlined" select label="Severidad" value={this.state.severidad} onChange={this.handleChangeSeveridad}>
            {severidades.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
            </TextField>
            &nbsp;&nbsp;&nbsp;
            <TextField id="responsable" name="responsable" variant="outlined" select label="Responsable" value={this.state.id_responsable} onChange={this.handleChangeResponsable}>
                    {responsables.map((option) => (
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