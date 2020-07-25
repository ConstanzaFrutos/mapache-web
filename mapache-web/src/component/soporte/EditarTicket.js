import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SaveIcon from '@material-ui/icons/Save';
import BackspaceIcon from '@material-ui/icons/Backspace';

import Requester from "../../communication/Requester";

import "../../assets/css/component/recursos/PerfilEmpleado.css";


const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com"
const mapacheProyectosBaseUrl = "https://mapache-proyectos.herokuapp.com"
const mapacheSoporteBaseUrl = "https://psa-api-support.herokuapp.com";
//const mapacheSoporteBaseUrl = "http://localhost:5000"

const tipos = [
    {
      value: "error",
      label: "Error"
    },
    {
      value: "consulta",
      label: "Consulta"
    },
    {
      value: "mejora",
      label: "Mejora"
    }
  ]

const severidades = [
    {
      value: "alta",
      label: "Alta"
    },
    {
      value: "media",
      label: "Media"
    },
    {
      value: "baja",
      label: "Baja"
    }
  ]


const estados = [
    {
        value: 'nuevo',
        label: 'Nuevo'
    },
    {
        value: 'en progreso',
        label: 'En Progreso'
    },
    {
        value: 'esperando informacion',
        label: 'Esperando informacion'
    },
    {
        value: 'cerrado',
        label: 'Cerrado'
    }
]
/*
const estados_tareas = [
  {
      value: 'Por hacer',
      label: 'Por hacer'
  },
  {
      value: 'En progreso',
      label: 'En Progreso'
  },
  {
      value: 'Bloqueada',
      label: 'Bloqueada'
  },
  {
      value: 'Finalizada',
      label: 'Finalizada'
  }
]
*/
class VisualizarTicket extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheSoporteBaseUrl);
        this.requesterRecursos = new Requester(mapacheRecursosBaseUrl);
        this.requesterProyectos = new Requester(mapacheProyectosBaseUrl)

        this.state = {
            "clientes": [],
            "proyectos": [],
            "tarea": {
              "nombre": "",
              "id_proyecto": "",
              "prioridad": "",
              "descripcion": ""
            },
            "responsables": [{"legajo": "-1", "nombre": "Ninguno", "apellido": ""}],
            "modal": false,
            "modal_tareas": false,
            "ticket": {
              "cliente": {
                "id": -1,
                "razon_social": ""
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
              "legajo_responsable": -1,
              "severidad": "",
              "tipo": "",
              "tareas": []
            }
        }

    }

    handleChangeNombre = event => {
        let tk = this.state.ticket
        tk.nombre = event.target.value
        this.setState({ ticket: tk });
      }
      handleChangeTipo = event => {
        let tk = this.state.ticket
        tk.tipo = event.target.value
        this.setState({ ticket: tk });
      }
      handleChangeSeveridad = event => {
        let tk = this.state.ticket
        tk.severidad = event.target.value
        this.setState({ ticket: tk });
      }
      handleChangeDescripcion = event => {
        let tk = this.state.ticket
        tk.descripcion = event.target.value
        this.setState({ ticket: tk });
      }
      handleChangePasos = event => {
        let tk = this.state.ticket
        tk.pasos = event.target.value
        this.setState({ ticket: tk });
      }
      handleChangeCliente = event => {
        let tk = this.state.ticket
        tk.cliente = {"id": event.target.value, "razon_social": event.target.label}
        this.setState({ ticket: tk });
      }
      handleChangeResponsable = event => {
        let tk = this.state.ticket
        tk.legajo_responsable = event.target.value
        this.setState({ ticket: tk });
      }
      handleChangeEstado = event => {
        let tk = this.state.ticket
        tk.estado = event.target.value
        this.setState({ ticket: tk });
      }

      handleChangeNombreTarea = event => {
        let tarea = this.state.tarea
        tarea.nombre = event.target.value
        this.setState({ tarea: tarea })
      }

      handleChangePrioridad = event => {
        let tarea = this.state.tarea
        tarea.prioridad = event.target.value
        this.setState({ tarea: tarea })
      }


      handleChangeDescripcionTarea = event => {
        let tarea = this.state.tarea
        tarea.descripcion = event.target.value
        this.setState({ tarea: tarea })
      }


      handleChangeProyecto = event => {
        let tarea = this.state.tarea
        tarea.id_proyecto = event.target.value
        this.setState({ tarea: tarea })
      }


      verTareas = event => {
        this.setState({modal_tareas: true});
      }

      crearTarea = event => {
        this.setState({modal: true});

        this.requesterProyectos.get('/proyectos')
            .then(response => {
              if (response.ok){
                  return response.json();
              } else {
                  console.log("Error al consultar ticket con id: ");
              }
            })
            .then(response => {
                if (response) {
                    this.setState({proyectos: response})
                }
            });

      }

      handleClose = event => {
        this.setState({modal: false});
      }

      handleCloseTareas = event => {
        this.setState({modal_tareas: false});
      }

      handleSubmit = event => {
        event.preventDefault();
        this.requester.put('/tickets/' + this.state.ticket.id, this.state.ticket)
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

      submitTarea = event => {
        event.preventDefault();
        // Le pego a proyectos para crear una tarea asociada a este ticket
        this.requesterProyectos.post('/proyectos/' + this.state.tarea.id_proyecto + '/tareas', this.state.tarea)
        .then(response => {
            if (response.ok){
                return response.json()
            } else {
                console.log("Error al crear el ticket");
            }
        })
        .then(response => {
          if (response) {

            let relacion = {"id_tarea": response.id, "id_proyecto": this.state.tarea.id_proyecto}
            // le pego a soporte, para que cree la relacion entre ticket y tareas.
            this.requester.post('/tickets/' + this.state.ticket.id + '/tareas', relacion)
            .then(response => {
                if (response.ok){
                    console.log("OK")
                } else {
                    console.log("Error al crear el ticket");
                }
            })

            this.props.history.push({
              pathname: `/soporte`
              });
          }
      });
      }

    componentDidMount() {
        let id_ticket = this.props.match.params.id_ticket;

        this.requester.get('/clientes')
        .then(response => {
          if (response.ok){
              return response.json();
          } else {
              console.log("Error al consultar ticket con id: ");
          }
        })
        .then(response => {
            if (response) {
                this.setState({clientes: response})
            }
        });

        this.requesterRecursos.get('/empleados/')
            .then(response => {
              if (response.ok){
                  return response.json();
              } else {
                  console.log("Error al consultar ticket con id: ");
              }
            })
            .then(response => {
                if (response) {
                    this.setState({responsables: [...this.state.responsables, ...response]})
                }
            });

        this.requester.get('/tickets/' + id_ticket)
        //this.requester.get('/tickets')
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    console.log("Error al consultar ticket con id: ");
                }
            })
            .then(response => {
                if (response) {
                    if (response.cliente==null) {
                      response.cliente = {"id": -1, "razon_social": ""}
                    }
                    if (response.legajo_responsable==null) {
                      response.legajo_responsable = -1
                    }
                    this.setState({ticket: response});
                }
            });
    }

    obtenerTareas() {
      var tareas = [];
      var url = 'https://mapache-web.herokuapp.com'
      for (var i=0; i<this.state.ticket.tareas.length; i++) {
        tareas.push(<div><Button href={url + "/proyectos/" + this.state.ticket.tareas[i].id_proyecto + "/tareas/" + this.state.ticket.tareas[i].id_tarea}> {this.state.ticket.tareas[i].nombre} </Button></div>)
      }
      return tareas;
    }

    render() {
        
        return (
            <div class='form-crear-ticket'>
            <div class="centrado">
              <h2>Editar Ticket</h2>
            </div>
            <br/>
            <form autoComplete="off" onSubmit={this.handleSubmit}>
                <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
                    <Grid item lg={8} xl={8}>
                        <TextField id="nombre" fullWidth value={this.state.ticket.nombre} variant="outlined" name="nombre" label="Nombre"
                        disabled={this.isFormDisabled()} onChange={this.handleChangeNombre}/>
                    </Grid>
                    <Grid item lg={4} xl={4}>
                        <Button variant="contained" color="secondary" onClick={this.verTareas} startIcon={<AssignmentIcon />}>
                            Ver Tareas
                        </Button>
                    </Grid>
                    <Grid item sm={6} md={6} xl={6} lg={4} xs={6}>
                        <TextField id="tipo" fullWidth name="tipo" variant="outlined" select label="Tipo" value={this.state.ticket.tipo} disabled={this.isFormDisabled()} onChange={this.handleChangeTipo}>
                        {tipos.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                        ))}
                        </TextField>
                    </Grid>
                    <Grid item sm={6} md={6} xl={6} lg={4} xs={6}>
                        <TextField id="estado" fullWidth  name="estado" variant="outlined" select label="Estado" value={this.state.ticket.estado} disabled={this.isFormDisabled()} onChange={this.handleChangeEstado}>
                        {estados.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                        ))}
                        </TextField>
                    </Grid>

                    <Grid item sm={6} md={6} xl={6} lg={4} xs={6}>
                        <TextField id="severidad" fullWidth name="severidad" label="Severidad" variant="outlined" select value={this.state.ticket.severidad} disabled={this.isFormDisabled()} onChange={this.handleChangeSeveridad}>
                        {severidades.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                        ))}
                        </TextField>
                    </Grid>

                    <Grid item sm={6} md={6} xl={6} lg={6} xs={6}>
                        <TextField id="cliente" fullWidth name="cliente" variant="outlined" select label="Cliente" value={this.state.ticket.cliente.id} disabled={this.isFormDisabled()} onChange={this.handleChangeCliente}>
                        {this.state.clientes.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.razon_social}
                        </MenuItem>
                        ))}
                        </TextField>
                    </Grid>

                    <Grid item sm={6} md={6} xl={6} lg={6} xs={6}>
                        <TextField id="responsable" fullWidth name="responsable" variant="outlined" select label="Responsable" value={this.state.ticket.legajo_responsable} disabled={this.isFormDisabled()} onChange={this.handleChangeResponsable}>
                        {this.state.responsables.map((option) => (
                        <MenuItem key={option.legajo} value={option.legajo}>
                            {option.nombre + " " + option.apellido}
                        </MenuItem>
                        ))}
                        </TextField>
                    </Grid>
                    <Grid item sm={6} md={6} xl={6} lg={6} xs={6}>
                        <TextField id="fecha_creacion" fullWidth disabled value={this.state.ticket.fecha_creacion} variant="outlined" name="fecha_creacion" label="Fecha de creación" />
                    </Grid>

                    <Grid item sm={6} md={6} xl={6} lg={6} xs={6}>
                        <TextField id="fecha_ultima_actualizacion" fullWidth disabled value={this.state.ticket.fecha_ultima_actualizacion} variant="outlined" name="fecha_ultima_actualizacion" label="Fecha de última actualización"/>
                    </Grid>

                    <Grid item xl={12} lg={12}>
                    <TextField id="fecha_limite" disabled fullWidth value={this.state.ticket.fecha_limite} variant="outlined" name="fecha_limite" label="Fecha límite"/>
                    </Grid>

                    {this.state.ticket.fecha_finalizacion!==null
                        ?<Grid item sm={6} md={6} xl={6} lg={6} xs={6}>
                        <TextField id="fecha_finalizacion" fullWidth disabled value={this.state.ticket.fecha_finalizacion} variant="outlined" name="fecha_finalizacion" label="Fecha de finalización"/>
                        </Grid>
                    : null}

                    {this.state.ticket.tipo==='error'
                        ?<Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                        <TextField id="pasos" variant="outlined" fullWidth label="Pasos" name="pasos" value={this.state.ticket.pasos} multiline rows={6} onChange={this.handleChangePasos}/>
                        </Grid>
                    : ''}

                    <Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                        <TextField id="descripcion" label="Descripcion" fullWidth value={this.state.ticket.descripcion} name="descripcion" multiline rows={8} variant="outlined" disabled={this.isFormDisabled()} onChange={this.handleChangeDescripcion}/>
                    </Grid>

                    <Grid
                        container
                        direction="row"
                        justify="space-evenly"
                        alignItems="center">
                        <Button variant="contained"color="secondary" disabled={this.isFormDisabled()} onClick={this.crearTarea} startIcon={<AssignmentIcon />}>
                            Crear Tarea
                        </Button>
                        <Button variant="contained" color="primary" type="submit" disabled={this.isFormDisabled()} startIcon={<SaveIcon />}>
                            Guardar
                        </Button>
                        <Button variant="contained" onClick={() => {this.props.history.push({ pathname: `/soporte` })}} startIcon={<BackspaceIcon />}>
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>
              </form>
              <Dialog open={this.state.modal} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"> <h2 class="centrado"> Crear tarea </h2></DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Se creara una tarea de tipo bug en el proyecto indicado.
                  </DialogContentText>
                  <form noValidate autoComplete="off" onSubmit={this.submitTarea}>
                    <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
                      <Grid item lg={12} xl={12} sm={12} md={12} xs={12}>
                        <TextField id="nombre" fullWidth value={this.state.tarea.nombre} variant="outlined" name="nombre" label="Nombre" onChange={this.handleChangeNombreTarea}/>
                      </Grid>
                      <Grid item lg={6} xl={6} sm={6} md={6} xs={6}>
                        <TextField id="prioridad" fullWidth value={this.state.tarea.prioridad} variant="outlined" name="prioridad" label="Prioridad" onChange={this.handleChangePrioridad}/>
                      </Grid>
                      <Grid item sm={6} md={6} xl={6} lg={6} xs={6}>
                          <TextField id="proyecto" fullWidth name="proyecto" variant="outlined" select label="Proyecto" value={this.state.tarea.id_proyecto} onChange={this.handleChangeProyecto}>
                          {this.state.proyectos.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.nombre}
                            </MenuItem>
                          ))}
                          </TextField>
                      </Grid>
                      {/*
                      <Grid item sm={6} md={6} xl={6} lg={4} xs={6}>
                        <TextField id="estado_tarea" fullWidth  name="estado_tarea" variant="outlined" select label="Estado" value={this.state.tarea.estado} onChange={this.handleChangeEstado}>
                        {estados_tareas.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                              {option.label}
                          </MenuItem>
                        ))}
                        </TextField>
                      </Grid>
                      */}
                      <Grid item sm={12} md={12} xl={12} lg={12} xs={12}>
                        <TextField id="descripcion" label="Descripcion" fullWidth value={this.state.tarea.descripcion} name="descripcion" multiline rows={8} variant="outlined" onChange={this.handleChangeDescripcionTarea}/>
                      </Grid>
                  </Grid>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button  variant="contained" type="submit" onClick={this.submitTarea} color="primary">
                    Crear
                  </Button>
                  <Button variant="contained" onClick={this.handleClose} color="primary">
                    Cancelar
                  </Button>
                </DialogActions>
              </Dialog>



              <Dialog open={this.state.modal_tareas} onClose={this.handleCloseTareas} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"> <h2 class="centrado"> Tareas asociadas </h2></DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {this.obtenerTareas()}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" onClick={this.handleCloseTareas} color="primary" startIcon={<BackspaceIcon />}>
                  </Button>
                </DialogActions>
              </Dialog>

            </div>

        )
    }


    isFormDisabled() {
        return this.state.ticket.estado === "cerrado";
    }
}

export default withRouter(VisualizarTicket);