import React, { Component } from 'react';
import { withRouter } from 'react-router';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';
import BackspaceIcon from '@material-ui/icons/Backspace';

import Requester from "../../communication/Requester";

import "../../assets/css/component/soporte/Cliente.css";


const mapacheSoporteBaseUrl = "https://psa-api-support.herokuapp.com";

const estados = [
  {
    value: 'activo',
    label: 'Activo'
  },
  {
    value: 'inactivo',
    label: 'Inactivo'
  }
]

class InfoCliente extends Component {

  constructor(props) {
    super(props);

    this.requester = new Requester(mapacheSoporteBaseUrl);

    this.state = {
      razon_social: '',
      CUIT: '',
      estado: '',
      descripcion: '',
      fecha_desde_que_es_cliente: '',
      page: '',
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

    if (this.state.page !== '/clientes/nuevo') {
      this.requester.put('/clientes/' + this.state.id, this.state)
        .then(response => {
            if (response.ok) {
                this.props.history.push({
                    pathname: `/clientes/`
                });
            } else {
                console.log("al crear el ticket");
            }
        });
    } else {
      this.requester.post('/clientes', this.state)
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
  }



  componentDidMount() {
        console.log('asdasdas');
        console.log(this.props.history.location.pathname);
        this.setState({ page: this.props.history.location.pathname })
        if (this.props.history.location.pathname !== '/clientes/nuevo') {
          let id_cliente = this.props.match.params.id_cliente;
          this.requester.get(`/clientes/${id_cliente}`)
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
                    this.setState(response);
                }
            });
        }
    }

render() {
    return (
        <div>
            <div class='form-cliente'>
                <h2 class="centrado">Crear Cliente</h2>
                <br/>
                <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
                        <Grid item lg={6} xl={6}>
                            <TextField id="razon_social" fullWidth value={this.state.razon_social} variant="outlined" name="razon_social" label="Razon social" onChange={this.handleChangeRazonSocial}/>
                        </Grid>
                        {this.state.page !== '/clientes/nuevo'?
                        <Grid item sm={6} md={6} xl={6} lg={6} xs={6}>
                                <TextField id="estado" name="estado" fullWidth variant="outlined" select label="Estado" value={this.state.estado} onChange={this.handleChangeEstado}>
                                {estados.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                                ))}
                                </TextField>
                        </Grid>
                        : null}
                        <Grid item lg={6} xl={6}>
                            <TextField id="CUIT" value={this.state.CUIT} fullWidth variant="outlined" name="CUIT" label="CUIT" onChange={this.handleChangeCUIT}/>
                        </Grid>

                        {this.state.page !== '/clientes/nuevo'?
                                <Grid item sm={6} md={6} xl={6} lg={6} xs={6}>
                                <TextField id="fecha_desde_que_es_cliente" fullWidth disabled value={this.state.fecha_desde_que_es_cliente} variant="outlined" name="fecha_desde_que_es_cliente" label="Fecha de creación"/>
                                </Grid>
                        : null}
                        <Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                            <TextField id="descripcion" label="Descripcion" fullWidth value={this.state.descripcion} name="descripcion" multiline rows={8} variant="outlined" onChange={this.handleChangeDescripcion}/>
                        </Grid>
                        <Grid
                        container
                        direction="row"
                        justify="space-evenly"
                        alignItems="center">
                            {(this.state.page !== '/clientes/nuevo') ?
                            <Button variant="contained" color="primary" type="submit" startIcon={<SaveIcon />}>
                                Guardar
                            </Button>
                            :
                            <Button variant="contained" color="primary" type="submit" startIcon={<SaveIcon />}>
                                Crear
                            </Button>}
                            <Button variant="contained" onClick={() => {this.props.history.push({ pathname: `/clientes` })}} startIcon={<BackspaceIcon />}>
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </div>
    )
}

}

export default withRouter(InfoCliente);
