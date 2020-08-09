import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Add from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { TablaAdministracion } from "../component/general/TablaAdministracion";
import { Loader } from "../component/general/Loader.js";
import { Alerta } from "../component/general/Alerta.js";

import Requester from "../communication/Requester";

import "../assets/css/controller/SoporteScreen.css";
am4core.useTheme(am4themes_animated);

const mapacheSoporteBaseUrl = "https://psa-api-support.herokuapp.com"
// const mapacheSoporteBaseUrl = "http://localhost:5000";
const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));


class SoporteScreen extends Component {
    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheSoporteBaseUrl);
        this.recursosRequester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            tickets: [],
            notificacion: this.props.location.state,
            value: 0,
            empleados: [],
            loading: true,
            alerta: {
                mostrar: false,
                tipo: "",
                mensaje: "",
                duracion: null
            }
        }

        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChangeValue = this.handleChangeValue.bind(this);

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

    handleAdd() {
        this.props.history.push({
            pathname: `/soporte/tickets/nuevo`
        });
    }

    handleEdit(oldData) {
        // Esta funcion en el caso de los empleados
        // se usa para redirigir el perfil
        this.props.history.push({
            pathname: `/tickets/${oldData.id}`
        });
    }

    handleDelete(newData) {
        this.requester.delete('/tickets/' + newData.id)
            .then(response => {
                if (response.ok) {
                    this.componentDidMount();
                } else {
                    console.log("Error al borrar tickets");
                }
            });
    }

    handleChangeValue = (event, data) => {
        this.setState({ value: data });
        if (data === 1) {
            this.getCharts()
        }
    }

    createSeries(chart, s, name, series_data, color) {
        var series = chart.series.push(new am4charts.LineSeries());
        series.stroke = am4core.color(color);
        series.strokeWidth = 3; // 3px
        series.dataFields.valueY = s;
        series.dataFields.dateX = "fecha";
        series.name = name;

        var segment = series.segments.template;
        segment.interactionsEnabled = true;

        var hoverState = segment.states.create("hover");
        hoverState.properties.strokeWidth = 3;

        var dimmed = segment.states.create("dimmed");
        dimmed.properties.stroke = am4core.color("#dadada");

        for (var i = 1; i < series.length; i++) {
            let datetime = series[i].fecha.split('-')
            series[i].fecha = new Date(datetime[0], datetime[1], datetime[2])
        }

        series.data = series_data;
        series.tooltipText = "{valueY.value}";
        return series;
    }

    drawLineGraph(chart_title, div_name, series) {
        let chart = am4core.create(div_name, am4charts.XYChart);
        chart.paddingRight = 20;

        let title = chart.titles.create();
        title.text = chart_title;
        title.fontSize = 25;
        title.marginBottom = 0;

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;

        let colores = ["#f95d6a", "#003f5c"];
        for (let i = 0; i < series.length; i++) {
            this.createSeries(chart, "cantidad", series[i].label, series[i].data, colores[i])
        }

        chart.legend = new am4charts.Legend();
        chart.legend.position = "right";
        chart.legend.scrollable = true;

        chart.cursor = new am4charts.XYCursor();

        let scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX = scrollbarX;

        return chart;
    }

    getCharts() {
        this.requester.get('/tickets/data_diaria')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    this.mostrarAlerta("Ocurrió un error al obtener la estadística diaria", "error");
                }
            })
            .then(response => {
                if (response) {
                    let chart1 = this.drawLineGraph('Tickets Diarios', 'chartdiv',
                        [{ label: "Abiertos", data: response.tickets_abiertos },
                        { label: "Cerrados", data: response.tickets_cerrados }]);
                    this.chart1 = chart1
                }
            });

        this.requester.get('/tickets/data_acumulada')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    this.mostrarAlerta("Ocurrió un error al obtener la estadística acumulada", "error");
                }
            })
            .then(response => {
                if (response) {
                    let chart2 = this.drawLineGraph('Tickets Acumulados', 'chartdiv_2',
                        [{ label: "Abiertos", data: response }]);
                    this.chart2 = chart2
                }
            });
    }

    componentDidMount() {
        if (this.state.notificacion) {
            this.mostrarAlerta(this.state.notificacion.mensaje, this.state.notificacion.tipo, 2000)
        }

        let empleadosPromise = this.recursosRequester.get('/empleados/')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    Promise.reject("Ocurrió un error al consultar los empleados");
                }
            });

        let ticketsPromise = this.requester.get('/tickets')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    Promise.reject("Ocurrió un error al consultar los tickets");
                }
            });

        Promise.all([empleadosPromise, ticketsPromise])
            .then((response) => {
                let [empleados, tickets] = response;
                this.setState({ empleados: empleados });

                if (tickets) {
                    tickets.forEach((ticket) => {
                        if (ticket.legajo_responsable > 0) {
                            let empleado = this.state.empleados.find((empleado) => parseInt(empleado.legajo) === ticket.legajo_responsable);
                            ticket.responsable = `${empleado.nombre} ${empleado.apellido}`;
                        } else {
                            ticket.responsable = "-";
                        }
                    });
                    this.setState({ tickets: tickets });
                }
            }).catch((err) => {
                console.error(err);
                this.mostrarAlerta("Ocurrió un error al obtener los tickets", "error");
            }).finally(() => {
                this.setState({ loading: false });
            });

        this.getCharts();
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        let alerta = null;
        let contenido = null;

        if (this.state.alerta.mostrar) {
            alerta = <Alerta
                open={true}
                mensaje={this.state.alerta.mensaje}
                tipo={this.state.alerta.tipo}
                handleClose={this.handleCloseAlerta}
                duracion={this.state.alerta.duracion}
            >
            </Alerta>
        }

        if (this.state.loading) {
            contenido = <Loader></Loader>
        } else {
            contenido = <div className={useStyles}>
                <AppBar style={{ background: '#3497c4' }} position="static">
                    <Tabs value={this.state.value} onChange={this.handleChangeValue} aria-label="simple tabs example">
                        <Tab label="Tickets" {...a11yProps(0)} />
                        <Tab label="Estadísticas" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={this.state.value} index={0}>
                    <div className="tickets-screen-div">
                        <TablaAdministracion
                            title={title}
                            columns={columns}
                            filtering={true}
                            data={this.state.tickets}
                            handleAdd={this.handleAdd}
                            handleEdit={this.handleEdit}
                            //handleDelete={ this.handleDelete }
                            editIcon={editIcon}
                            /*
                            editable={{
                                onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    resolve();

                                    this.handleDelete(oldData);

                                }),
                            }}
                            */
                            editable={null}
                            actions={[
                                {
                                    icon: Add,
                                    tooltip: "Create ticket",
                                    position: "toolbar",
                                    onClick: () => {
                                        this.handleAdd()
                                    }
                                },
                                {
                                    icon: editIcon,
                                    tooltip: "Edit ticket",
                                    onClick: (event, rowData) => {
                                        this.handleEdit(rowData)
                                        console.log(rowData)
                                        console.log("PruebaEdit");
                                    }
                                }
                            ]}
                        ></TablaAdministracion>
                    </div>
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <div className="tickets-screen-div">
                        <div id="chartdiv" style={{ width: "80%", height: "500px" }}></div>
                        <div id="chartdiv_2" style={{ width: "80%", height: "500px" }}></div>
                    </div>
                </TabPanel>
            </div>
        }
        return (
            <div>
                {alerta}
                {contenido}
            </div>
        )
    }
}

export default withRouter(SoporteScreen);

const title = "Tickets";

const columns = [
    {
        title: "Numero",
        field: "id",
        filtering: false
    },
    {
        title: "Título",
        field: "nombre",
        filtering: false
    },
    {
        title: "Tipo",
        field: "tipo",
        lookup: {
            "error": "Error",
            "consulta": "Consulta",
            "mejora": "Mejora"
        }
    },
    {
        title: "Estado",
        field: "estado",
        defaultFilter: ["nuevo"],
        lookup: {
            "nuevo": "Nuevo",
            "en progreso": "En progreso",
            "esperando informacion": "Esperando información",
            "cerrado": "Cerrado"
        }
    },
    {
        title: "Severidad",
        field: "severidad",
        lookup: {
            "baja": "Baja",
            "media": "Media",
            "alta": "Alta"
        }
    },
    {
        title: "Cliente",
        field: "cliente.razon_social",
    },
    {
        title: "Responsable",
        field: "responsable"
    }
]

const editIcon = EditIcon;
