import React, { Component } from 'react';
import { withRouter } from 'react-router';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import SaveIcon from '@material-ui/icons/Save';
import BackspaceIcon from '@material-ui/icons/Backspace';

import Requester from "../../communication/Requester";

import "../../assets/css/component/soporte/Ticket.css";


const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheSoporteBaseUrl = "https://psa-api-support.herokuapp.com";

const tipos = [
    { value: 'Error', label: 'Error' },
    { value: 'Consulta', label: 'Consulta' },
    { value: 'Mejora', label: 'Mejora' }
];

const severidades = [
    { value: 'Alta', label: 'Alta' },
    { value: 'Media', label: 'Media' },
    { value: 'Baja', label: 'Baja' }
];

class CrearTicket extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheSoporteBaseUrl);
        this.requesterRecursos = new Requester(mapacheRecursosBaseUrl);

        this.clientes = [{ "id": -1, "razon_social": "Ninguno" }];
        this.responsables = [{ "legajo": -1, "nombre": "Ninguno", "apellido": "" }];

        this.state = {
            nombre: '',
            tipo: 'Consulta',
            severidad: 'Baja',
            descripcion: '',
            pasos: '',
            cliente: {
                id: -1,
                razon_social: ""
            },
            legajo_responsable: -1,
            alerta: {
                mostrar: false,
                tipo: "",
                mensaje: ""
            }
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
        this.setState({ cliente: { "id": event.target.value, "razon_social": event.target.label } });
    }

    handleChangeResponsable = event => {
        this.setState({ legajo_responsable: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();

        let mensaje = "";
        let tipo = "";
        let duracion = null;
        const ticket = {
            nombre: this.state.nombre,
            descripcion: this.state.descripcion,
            tipo: this.state.tipo,
            severidad: this.state.severidad,
            pasos: this.state.pasos,
            cliente: this.state.cliente,
            legajo_responsable: this.state.legajo_responsable
        };

        this.requester.post('/tickets', ticket)
            .then(response => {
                if (response.ok) {
                    mensaje = "Ticket creado exitosamente";
                    tipo = "success";
                    duracion = 7000;
                } else {
                    mensaje = "Ocurrió un error al crear el ticket"
                    tipo = "error";
                }

                this.props.history.push({
                    pathname: `/soporte/`,
                    state: {
                        mensaje: mensaje,
                        tipo: tipo,
                        duracion: duracion,
                    }
                });
            });
    }

    componentDidMount() {
        if (this.state.notificacion) {
            this.mostrarAlerta(this.state.notificacion.mensaje, this.state.notificacion.tipo, 2000)
        }

        this.requester.get('/clientes')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error("Error al consultar ticket con id: ");
                }
            })
            .then(response => {
                if (response) {
                    this.clientes = response.filter((cliente) => { return cliente.estado === "activo" });
                    this.setState({ cliente: { 'id': response[0].id, 'razon_social': response[0].razon_social } })
                }
            });

        this.requesterRecursos.get('/empleados/')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error("Error al consultar los emplados");
                }
            })
            .then(response => {
                if (response) {
                    this.responsables = this.responsables.concat(response);
                    this.setState({ responsable: { 'id': response[0].id, 'nombre': `${response[0].nombre} ${response[0].apellido}` } });
                }
            });
    }

    render() {
        return (
            <div class='form-crear-ticket'>
                <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
                        <Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                            <div class="centrado">
                                <h2>Nuevo Ticket</h2>
                            </div>
                        </Grid>
                        <Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                            <TextField id="nombre" fullWidth variant="outlined" name="nombre" label="Titulo" onChange={this.handleChangeNombre} />
                        </Grid>
                        <br />
                        <Grid item lg={6} xl={6}>
                            <TextField id="cliente" fullWidth name="cliente" variant="outlined" select label="Cliente"
                                value={this.state.cliente.id} onChange={this.handleChangeCliente}>
                                {this.clientes.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.razon_social}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item lg={6} xl={6}>
                            <TextField id="tipo" fullWidth name="tipo" variant="outlined" select label="Tipo" value={this.state.tipo} onChange={this.handleChangeTipo}>
                                {tipos.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {this.state.tipo === 'Error'
                            ?
                            <Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                                <TextField id="pasos" fullWidth variant="outlined" name="pasos" label="Pasos para reproducir" style={{ width: '600px' }} multiline rows={6} onChange={this.handleChangePasos} />
                            </Grid>
                            : null}

                        <br />
                        <Grid item lg={6} xl={6}>
                            <TextField id="severidad" fullWidth name="severidad" variant="outlined" select label="Severidad" value={this.state.severidad} onChange={this.handleChangeSeveridad}>
                                {severidades.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item lg={6} xl={6}>
                            <TextField id="responsable" fullWidth name="responsable" variant="outlined" select label="Responsable" value={this.state.legajo_responsable} onChange={this.handleChangeResponsable}>
                                {this.responsables.map((option) => (
                                    <MenuItem key={option.legajo} value={option.legajo}>
                                        {option.nombre + " " + option.apellido}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                            <TextField id="descripcion" name="descripcion" label="Descripcion" fullWidth multiline rows={8} variant="outlined" onChange={this.handleChangeDescripcion} />
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center">
                            <Button variant="contained" color="primary" type="submit" startIcon={<SaveIcon />}>
                                Agregar
                        </Button>
                            <Button variant="contained" onClick={() => { this.props.history.push({ pathname: `/soporte` }) }} startIcon={<BackspaceIcon />}>
                                Cancelar
                        </Button>
                        </Grid>
                    </Grid>
                </form>

            </div>
        );
    }
}


export default withRouter(CrearTicket);
