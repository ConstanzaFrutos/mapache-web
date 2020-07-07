import React, { Component } from 'react';
import { withRouter } from 'react-router';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import "../../assets/css/component/recursos/PerfilEmpleado.css";
import Requester from "../../communication/Requester";

//const mapacheSoporteBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheSoporteBaseUrl = "http://localhost:5000";

const tipos = [
    {
      value: "Error",
      label: "Error"
    },
    {
      value: "Consulta",
      label: "Consulta"
    },
    {
      value: "Mejora",
      label: "Mejora"
    }
  ]
  
const severidades = [
    {
      value: "Alta",
      label: "Alta"
    },
    {
      value: "Media",
      label: "Media"
    },
    {
      value: "Baja",
      label: "Baja"
    }
  ]

  const clientes = [
    {
      value: -1,
      label: "Ninguno"
    },  
    {
      value: 1,
      label: "VGC"
    },
    {
      value: 1,
      label: "VGC"
    },
    {
      value: 1,
      label: "VGC"
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

const estados = [
    {
        value: 'Nuevo',
        label: 'Nuevo'
    },
    {
        value: 'En Progreso',
        label: 'En Progreso'
    },
    {
        value: 'Esperando informacion del cliente',
        label: 'Esperando informacion del cliente'
    },
    {
        value: 'Cerrado',
        label: 'Cerrado'
    }
]

class VisualizarTicket extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheSoporteBaseUrl);

        this.state = {
            "cliente": {
                "id": 1,
                "nombre": "VGC"
            },
            "descripcion": "",
            "estado": "",
            "fecha_creacion": "",
            "fecha_finalizacion": null,
            "fecha_limite": "",
            "fecha_ultima_actualizacion": "",
            "id": "",
            "nombre": "",
            "pasos": "",
            "id_responsable": "",
            "severidad": "",
            "tipo": ""
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
        this.setState({ cliente: {"id": event.target.value, "nombre": event.target.label} });
      }
      handleChangeResponsable = event => {
        this.setState({ responsable: {"id": event.target.value, "nombre": event.target.label} });
      }
      handleChangeEstado = event => {
        this.setState({ estado: {"id": event.target.value, "nombre": event.target.label} });
      }


      handleSubmit = event => {
        event.preventDefault();
    
        this.requester.put('/tickets/' + this.state.id, this.state)
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
        let id_ticket = this.props.match.params.id_ticket;
        console.log("Params: ", this.props);
        console.log(`id_ticket: ${id_ticket}`);
        
        //this.requester.get('/tickets/' + id_ticket)
        this.requester.get('/tickets')
            .then(response => {
                if (response.ok){
                    //return response.json();
                    return {
                        "cliente": {"id": -1, "nombre": null},
                        "descripcion": "Este ticket se creo con motivo de arreglar la consulta",
                        "estado": "Nuevo",
                        "fecha_creacion": "2020-07-06 22:50:34",
                        "fecha_finalizacion": null,
                        "fecha_limite": "2020-07-13 22:50:34",
                        "fecha_ultima_actualizacion": "2020-07-06 22:50:34",
                        "id": 1,
                        "nombre": "Ticket consulta",
                        "pasos": null,
                        "id_responsable": null,
                        "severidad": "Alta",
                        "tipo": "Consulta"
                    }
                } else {
                    console.log("Error al consultar ticket con id: ");
                }
            })
            .then(response => {
                console.log(response);
                if (response) {
                    this.setState({
                            "cliente": {"id": -1, "nombre": null},
                            "descripcion": "Este ticket se creo con motivo de arreglar la consulta",
                            "estado": "Nuevo",
                            "fecha_creacion": "2020-07-06 22:50:34",
                            "fecha_finalizacion": null,
                            "fecha_limite": "2020-07-13 22:50:34",
                            "fecha_ultima_actualizacion": "2020-07-06 22:50:34",
                            "id": 1,
                            "nombre": "Ticket consulta",
                            "pasos": null,
                            "id_responsable": -1,
                            "severidad": "Alta",
                            "tipo": "Consulta"
                    });
                }
            });
    }

    render() {

        console.log('STATE', this.state.severidad)

        return (
            <div class='form-crear-ticket'>
            <h2>Editar Ticket</h2>
            <br/>
            <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
             <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
                <Grid item lg={12} xl={12}>
                    <TextField id="nombre" value={this.state.nombre} variant="outlined" name="nombre" label="Nombre" onChange={this.handleChangeNombre}/>
                </Grid>
                <Grid item sm={6} md={6} xl={6} lg={4} xs={6}>
                    <TextField id="tipo" name="tipo" variant="outlined" select label="Tipo" value={this.state.tipo} onChange={this.handleChangeTipo}>
                    {tipos.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item sm={6} md={6} xl={6} lg={4} xs={6}>
                    <TextField id="estado" name="estado" variant="outlined" select label="Estado" value={this.state.estado} onChange={this.handleChangeEstado}>
                    {estados.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                    </TextField>
                </Grid>                

                <Grid item sm={6} md={6} xl={6} lg={4} xs={6}>
                    <TextField id="severidad" name="severidad" label="Severidad" variant="outlined" select value={this.state.severidad} onChange={this.handleChangeSeveridad}>
                    {severidades.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                    </TextField>
                </Grid>
                
                <Grid item sm={4} md={4} xl={4} lg={4} xs={4}>
                    <TextField id="cliente" name="cliente" variant="outlined" select label="Cliente" value={this.state.cliente.id} onChange={this.handleChangeCliente}>
                    {clientes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                    </TextField>
                </Grid>
                
                <Grid item sm={6} md={6} xl={6} lg={6} xs={6}>
                    <TextField id="responsable" name="responsable" variant="outlined" select label="Responsable" value={this.state.id_responsable} onChange={this.handleChangeResponsable}>
                    {responsables.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item sm={4} md={4} xl={4} lg={4} xs={4}>
                    <TextField id="fecha_creacion" disabled value={this.state.fecha_creacion} variant="outlined" name="fecha_creacion" label="Fecha de creación" />
                    &nbsp;
                    &nbsp;
                    <TextField id="fecha_limite" disabled value={this.state.fecha_limite} variant="outlined" name="fecha_limite" label="Fecha límite"/>
                </Grid>
                
                <Grid item sm={4} md={4} xl={4} lg={4} xs={4}>
                    <TextField id="fecha_ultima_actualizacion" disabled value={this.state.fecha_ultima_actualizacion} variant="outlined" name="fecha_ultima_actualizacion" label="Fecha de última actualización"/>
                </Grid>
                
                {this.state.fecha_finalizacion!==null
                    ?<Grid item sm={6} md={6} xl={6} lg={6} xs={6}>
                    <TextField id="fecha_finalizacion" disabled value={this.state.fecha_finalizacion} variant="outlined" name="fecha_finalizacion" label="Fecha de finalización"/>
                    </Grid>
                : null}

                {this.state.tipo==='Error'
                    ?<Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                    <TextField id="pasos" variant="outlined" label="Pasos" name="pasos" value={this.state.pasos} style={{width: '600px'}} multiline rows={6} onChange={this.handleChangePasos}/>
                    </Grid>
                : null}

                <Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                    <TextField id="descripcion" label="Descripcion" style={{width: '600px'}} value={this.state.descripcion} name="descripcion" multiline rows={8} variant="outlined" onChange={this.handleChangeDescripcion}/>
                </Grid>
                
                <Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                <Button variant="contained" color="primary" type="submit">
                    Guardar
                </Button>
                </Grid>
                
              </Grid>
              </form>
            </div>
        )
    }

}

export default withRouter(VisualizarTicket);