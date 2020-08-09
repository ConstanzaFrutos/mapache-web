import React, { Component } from 'react';
import { withRouter } from 'react-router';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import SaveIcon from '@material-ui/icons/Save';
import BackspaceIcon from '@material-ui/icons/Backspace';

import { Alerta } from "../general/Alerta";

import Requester from "../../communication/Requester";

import "../../assets/css/component/soporte/Cliente.css";


const mapacheSoporteBaseUrl = "https://psa-api-support.herokuapp.com";
//const mapacheSoporteBaseUrl = "http://localhost:5000"

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
            alerta: {
                mostrar: false,
                tipo: "",
                mensaje: ""
            },
            formularioCerrado: false,
            error: false
        };

        this.mostrarAlerta = this.mostrarAlerta.bind(this);
        this.handleCloseAlerta = this.handleCloseAlerta.bind(this);
    }

    mostrarAlerta(mensaje, tipo, duracion = null) {
        this.setState({
            alerta: {
                mostrar: true,
                tipo: tipo,
                mensaje: mensaje,
                duracion: duracion
            }
        });
    }

    handleCloseAlerta() {
        this.setState({
            alerta: {
                mostrar: false
            }
        });
    }

    handleChangeRazonSocial = event => {
        this.setState({ razon_social: event.target.value });
    }

    handleChangeEstado = event => {
        this.setState({ estado: event.target.value });
    }

    handleChangeCUIT = event => {
        this.setState({ error: false });
        this.setState({ CUIT: event.target.value });
    }

    handleChangeDescripcion = event => {
        this.setState({ descripcion: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        let mensaje = "";
        let tipo = "";
        let duracion = null;

        if (!this.validateCuit(this.state.CUIT)) {
            this.setState({ error: true })
            return
        }

        if (this.state.page !== '/clientes/nuevo') {
            this.requester.put(`/clientes/${this.state.id}`, this.state)
                .then(response => {
                    if (response.ok) {
                        mensaje = "Cliente modificado exitosamente";
                        tipo = "success";
                        duracion = 7000;
                    } else {
                        mensaje = "Ocurrió un error al modificar el cliente"
                        tipo = "error";
                    }

                    this.props.history.push({
                        pathname: `/clientes/`,
                        state: {
                            mensaje: mensaje,
                            tipo: tipo,
                            duracion: duracion,
                        }
                    });
                });
        } else {
            this.requester.post('/clientes', this.state)
                .then(response => {
                    if (response.ok) {
                        mensaje = "Cliente creado exitosamente";
                        tipo = "success";
                        duracion = 7000
                    } else {
                        mensaje = "Ocurrió un error al crear el ticket"
                        tipo = "error";
                    }

                    this.props.history.push({
                        pathname: `/clientes`,
                        state: {
                            mensaje: mensaje,
                            tipo: tipo,
                            duracion: duracion,
                        }
                    });
                });
        }
    }

    componentDidMount() {
        this.setState({ page: this.props.history.location.pathname })

        if (this.props.history.location.pathname !== '/clientes/nuevo') {
            let id_cliente = this.props.match.params.id_cliente;
            this.requester.get(`/clientes/${id_cliente}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        let mensaje = "";

                        switch (response.status) {
                            case 400:
                                mensaje = `No se encontró el cliente id ${id_cliente}`
                                break;
                            default:
                                mensaje = `Ocurrió un error inesperado al consultar el cliente id ${id_cliente}`;
                                break;
                        }

                        this.mostrarAlerta(mensaje, "error");
                    }
                })
                .then(cliente => {
                    if (cliente) {
                        cliente.formularioCerrado = cliente.estado === "inactivo";
                        this.setState(cliente);
                    }
                });
        }
    }

    isFormDisabled() {
        return this.state.formularioCerrado;
    }

    validateCuit() {
        const regexCuit = /^(20|23|27|30|33)([0-9]{9}|-[0-9]{8}-[0-9]{1})$/g;
        return regexCuit.test(this.state.CUIT);
    }

    render() {
        let alerta = null;
        if (this.state.alerta.mostrar) {
            alerta = <Alerta
                open={true}
                mensaje={this.state.alerta.mensaje}
                tipo={this.state.alerta.tipo}
                handleClose={this.handleCloseAlerta}
            >
            </Alerta>
        }
        return (
            <div>
                {alerta}
                <div class='form-cliente'>
                    {this.state.page !== '/clientes/nuevo' ?
                        <h2 class="centrado">Editar Cliente</h2>
                        :
                        <h2 class="centrado">Crear Cliente</h2>
                    }
                    <br />
                    <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                        <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
                            <Grid item lg={6} xl={6}>
                                <TextField id="razon_social" fullWidth value={this.state.razon_social} variant="outlined" name="razon_social" label="Razón social"
                                    disabled={this.isFormDisabled()} onChange={this.handleChangeRazonSocial} />
                            </Grid>
                            {this.state.page !== '/clientes/nuevo' ?
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
                                <TextField error={this.state.error} helperText={this.state.error ? "CUIT Inválido" : ""} id="CUIT" value={this.state.CUIT} fullWidth variant="outlined" name="CUIT" label="CUIT"
                                    disabled={this.isFormDisabled()} onChange={this.handleChangeCUIT} />
                            </Grid>

                            {this.state.page !== '/clientes/nuevo' ?
                                <Grid item sm={6} md={6} xl={6} lg={6} xs={6}>
                                    <TextField id="fecha_desde_que_es_cliente" fullWidth disabled value={this.state.fecha_desde_que_es_cliente} variant="outlined" name="fecha_desde_que_es_cliente" label="Fecha de creación" />
                                </Grid>
                                : null}
                            <Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                                <TextField id="descripcion" label="Descripcion" fullWidth value={this.state.descripcion} name="descripcion" multiline rows={8} variant="outlined"
                                    disabled={this.isFormDisabled()} onChange={this.handleChangeDescripcion} />
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
                                <Button variant="contained" onClick={() => { this.props.history.push({ pathname: `/clientes` }) }} startIcon={<BackspaceIcon />}>
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
