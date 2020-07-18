import React, { Component } from 'react';
import { withRouter } from 'react-router';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Requester from "../../communication/Requester";
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import "../../assets/css/component/soporte/Cliente.css";

//const mapacheSoporteBaseUrl = "https://psa-api-support.herokuapp.com";
const mapacheSoporteBaseUrl = "http://localhost:5000";

const estados = [
  {
    value: 'Activo',
    label: 'activo'
  },
  {
    value: 'Inactivo',
    label: 'inactivo'
  }
]

class CrearCliente extends Component {
  
  constructor(props){
    super(props);

    this.requester = new Requester(mapacheSoporteBaseUrl);

    this.state = {
      razon_social:'',
      CUIT:'',
      estado:'',
      descripcion:'',
      fecha_desde_que_es_cliente:'',
      page:''
    }
  }


  handleChangeRazonSocial = event => {
    this.setState({ razon_social: event.target.value });
  }
  handleChangeEstado = event => {
    this.setState({ estado: event.target.value });
  }
  handleChangeCUIT = event => {
    this.setState({ CUIT: event.target.value });
  }
  handleChangeDescripcion = event => {
    this.setState({ descripcion: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();

    const cliente = {
      razon_social: this.state.razon_social,
      descripcion: this.state.descripcion,
      estado: this.state.estado,
      CUIT: this.state.CUIT
    };

    this.requester.post('/clientes', cliente)
    .then(response => {
        if (response.ok){

            this.props.history.push({
                pathname: `/clientes`
            });
        } else {
            console.log("al crear el ticket");
        }
    });
  }



  componentDidMount() {
        console.log('asdasdas');
        console.log(this.props.history.location.pathname);
        this.setState({ page: this.props.history.location.pathname })
    }

render() {
    return (
      <div>
      {this.state.page == '/clientes/nuevo'?
        <div class='form-cliente'>
        <h2>Crear Cliente</h2>
        <br/>
        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
         <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
            <Grid item lg={12} xl={12}>
                <TextField id="razon_social" value={this.state.razon_social} variant="outlined" name="razon_social" label="Razon social" onChange={this.handleChangeRazonSocial}/>
            </Grid>
            <Grid item lg={12} xl={12}>
                <TextField id="CUIT" value={this.state.CUIT} variant="outlined" name="CUIT" label="CUIT" onChange={this.handleChangeCUIT}/>
            </Grid>
            <Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                <TextField id="descripcion" label="Descripcion" style={{width: '600px'}} value={this.state.descripcion} name="descripcion" multiline rows={8} variant="outlined" onChange={this.handleChangeDescripcion}/>
            </Grid>
            <Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Agregar
              </Button>
            </Grid>
          </Grid>
          </form>
        </div>


      : <div></div>}
      </div>
    )
}

}


export default withRouter(CrearCliente);
