import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';


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
    
    axios.post(`http://localhost:5000/tickets`,  ticket )
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.props.history.push({
          pathname: `/soporte/`
      });
      }
    )

  }

render() {
    return (

      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Nombre:
            <input type="text" name="nombre" onChange={this.handleChangeNombre} />
          </label>
          <br />
          <label>
            tipo:
            <input type="text" name="tipo" onChange={this.handleChangeTipo} />
          </label>
          <br />
          <label>
            severidad:
            <input type="text" name="severidad" onChange={this.handleChangeSeveridad} />
          </label>
          <br />
          <label>
            descripcion:
            <input type="text" name="descripcion" onChange={this.handleChangeDescripcion} />
          </label>
          <br />
          <button type="submit">Add</button>
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