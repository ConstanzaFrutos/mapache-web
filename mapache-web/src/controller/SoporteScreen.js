import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Add from '@material-ui/icons/Add'
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import { TablaAdministracion } from "../component/general/TablaAdministracion";
import Requester from "../communication/Requester";
import "../assets/css/controller/SoporteScreen.css";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';


am4core.useTheme(am4themes_animated);


const mapacheSoporteBaseUrl = "https://psa-api-support.herokuapp.com";
//const mapacheSoporteBaseUrl = "http://localhost:5000"
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
            value: 0,
            empleados: []
        }

        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChangeValue = this.handleChangeValue.bind(this);
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
            if (response.ok){
                this.componentDidMount();
            } else {
                console.log("Error al borrar tickets");
            }
        });
    }

    handleChangeValue = (event, data) => {
        this.setState({value: data});
        if (data === 1)
            this.getCharts()
    }


    
    createSeries(chart, s, name, series_data) {
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = s;
        series.dataFields.dateX = "fecha";
        series.name = name;
    
        var segment = series.segments.template;
        segment.interactionsEnabled = true;
    
        var hoverState = segment.states.create("hover");
        hoverState.properties.strokeWidth = 3;
    
        var dimmed = segment.states.create("dimmed");
        dimmed.properties.stroke = am4core.color("#dadada");

        // Necesito un json del tipo: 
        // [{"date": "20-05-2020", "tickets": 250}, etc..]

        /*
        {
        "tickets_cerrados": [
            {
                "date": "20-05-2020", "numero": 400
            },
            {
                "date": "20-05-2020", "numero": 400
            }
        ]
        "tickets_abiertos": [
            {
                "date": "20-05-2020", "numero": 400
            },
            {
                "date": "20-05-2020", "numero": 400
            }
        ]
        }

        */
        /*
        var data = [{}];
        var value = Math.round(Math.random() * 100) + 100;
        for (var i = 1; i < 100; i++) {
            value += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 30 + i / 5);
            var dataItem = { date: new Date(2018, 0, i) };
            dataItem["value" + s] = value;
            data.push(dataItem);
        }
        */

        for (var i = 1; i < series.length; i++){
            let datetime = series[i].fecha.split('-')
            series[i].fecha = new Date(datetime[0], datetime[1], datetime[2])
        }


        series.data = series_data;
        // series.data = this.drawLineGraph(data);;
        series.tooltipText = "{valueY.value}";
        return series;
    }


    drawLineGraph(chart_title, x_label, y_label, div_name, series) {

        let chart = am4core.create(div_name, am4charts.XYChart);
        let title = chart.titles.create();
        title.text = chart_title;
        title.fontSize = 25;
        title.marginBottom = 0;

        chart.paddingRight = 20;

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;

        for (let i=0; i<series.length; i++){
            this.createSeries(chart, "cantidad", series[i].label, series[i].data)
        }

        chart.legend = new am4charts.Legend();
        chart.legend.position = "right";
        chart.legend.scrollable = true;
        
        chart.cursor = new am4charts.XYCursor();

        let scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX = scrollbarX;

        return chart
    }


    getCharts() {
        this.requester.get('/tickets/data_diaria')
        .then(response => {
            if (response.ok){
                return response.json();
            } else {
                console.log("Error al consultar tickets");
            }
        })
        .then(response => {
            if (response) {
                let chart1 = this.drawLineGraph('Tickets diarios', '', '', 'chartdiv', [{label: "Tickets cerrados", data: response.tickets_cerrados}, {label: "Tickets abiertos", data: response.tickets_abiertos}]);
                this.chart1 = chart1
            }
        });
        
        this.requester.get('/tickets/data_acumulada')
        .then(response => {
            if (response.ok){
                return response.json();
            } else {
                console.log("Error al consultar tickets");
            }
        })
        .then(response => {
            if (response) {
                let chart2 = this.drawLineGraph('Tickets acumulados', '', '', 'chartdiv_2', [{label: "Tickets cerrados", data: response}]);
                this.chart2 = chart2
            }
        });
    }

    
    componentDidMount() {
        this.recursosRequester.get('/empleados/')
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Error al consultar empleados");
            }
        })
        .then((recursos) => {
            this.setState({ empleados: recursos })
            this.requester.get('/tickets')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error("Error al consultar tickets");
                }
            })
            .then(tickets => {
                if (tickets) {
                    tickets.forEach((ticket) => {
                        if (ticket.legajo_responsable >0) {
                            let empleado = this.state.empleados.find((empleado) => parseInt(empleado.legajo) === ticket.legajo_responsable);
                            ticket.responsable = `${empleado.nombre} ${empleado.apellido}`;
                        } else {
                            ticket.responsable = "-";
                        }
                    });
                    this.setState({ tickets: tickets });
                }
            });
        });
        
        this.getCharts()
        

        //this.drawLineGraph('Tickets diarios', '', '', 'chartdiv', '', [{label: "Tickets cerrados", data: ""}, {label: "Tickets abiertos", data: ""}]);
        //this.drawLineGraph('Tickets acumulados', '', '', 'chartdiv_2', '', [{label: "Tickets cerrados", data: ""}]);
        
    }

    componentWillUnmount() {
        if (this.chart) {
          this.chart.dispose();
        }
    }

    render() {
        
        return (
            <div>
                <div className={useStyles}>
                    <AppBar style={{background: '#3497c4'}}  position="static">
                        <Tabs value={this.state.value} onChange={this.handleChangeValue} aria-label="simple tabs example">
                            <Tab label="Tickets" {...a11yProps(0)}/>
                            <Tab label="Estadísticas" {...a11yProps(1)}/>
                        </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.value} index={0}>
                        <div className="tickets-screen-div">
                            <TablaAdministracion
                                title={ title }
                                columns={ columns }
                                data={ this.state.tickets }
                                handleAdd={ this.handleAdd }
                                handleEdit={ this.handleEdit }
                                //handleDelete={ this.handleDelete }
                                editIcon={ editIcon }
                                /*
                                editable={{
                                    onRowDelete: (oldData) =>
                                    new Promise((resolve) => {
                                        resolve();

                                        this.handleDelete(oldData);

                                    }),
                                }}
                                */
                                editable = { null }
                                actions={[
                                    {
                                    icon: Add,
                                    tooltip: "Create ticket",
                                    position: "toolbar",
                                    onClick: () => {
                                        this.handleAdd()
                                    }},
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
        </div>
        )
    }
}


export default withRouter(SoporteScreen);

const title = "Tickets";

const columns = [
    {
        title: "Titulo",
        field: "nombre"
    },
    {
        title: "Tipo",
        field: "tipo"
    },
    {
        title: "Estado",
        field: "estado"
    },
    {
        title: "Severidad",
        field: "severidad"
    },
    {
        title: "Cliente",
        field: "cliente.razon_social"
    },
    {
        title: "Responsable",
        field: "responsable"
    }
]

const editIcon = InfoOutlined;