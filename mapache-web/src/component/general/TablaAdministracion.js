import React, { Component } from 'react';
import { forwardRef } from 'react';

import MaterialTable from 'material-table';

import Search from '@material-ui/icons/Search'
import SaveAlt from '@material-ui/icons/SaveAlt'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Add from '@material-ui/icons/Add'
import Check from '@material-ui/icons/Check'
import Clear from '@material-ui/icons/Clear'
import Close from '@material-ui/icons/Close';
import FilterList from '@material-ui/icons/FilterList'
import Remove from '@material-ui/icons/Remove'
import Delete from '@material-ui/icons/Delete';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

import "../../assets/css/component/Tabla.css";

export class TablaAdministracion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [],
            data: []
        }
    }

    componentDidMount() {
        this.setState = {
            columns: this.props.columns,
            data: this.props.data
        }
    }

    render() {
        let tabla = null;

        let icons = {
            Add: Add,
            Edit: this.props.editIcon,
            Delete: Delete,
            Check: Check,
            Clear: Clear,
            Close: Close,
            DetailPanel: ChevronRight,
            Export: SaveAlt,
            Filter: FilterList,
            FirstPage: FirstPage,
            LastPage: LastPage,
            NextPage: ChevronRight,
            PreviousPage: ChevronLeft,
            Search: Search,
            ResetSearch: Clear,
            SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
            ThirdStateCheck: Remove,
        };

        /* console.log('acciones');
        console.log(this.props.editable);
        console.log(this.props.editable === undefined); */

        tabla = <MaterialTable
            icons={icons}
            style={{ width: "auto" }}
            title={this.props.title}
            columns={this.props.columns}
            data={this.props.data}
            editable={this.props.editable === undefined ? ({
                onRowAdd: (newData) =>
                    new Promise((resolve) => {
                        resolve();
                        this.props.handleAdd(newData);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                        resolve();
                        if (oldData) {
                            this.props.handleEdit(oldData);
                        }
                    }),
                onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                        resolve();
                        this.props.handleDelete(oldData);
                    })
            }) : (this.props.editable)}
            options={{
                filtering: this.props.filtering,
                actionsColumnIndex: -1
            }}
            actions={this.props.actions}
            localization={{
                body: {
                    emptyDataSourceMessage: 'No hay ningún registro para mostrar'
                },
                header: {
                    actions: "Acciones"
                },
                toolbar: {
                    searchPlaceholder: 'Buscar...'
                },
                pagination: {
                    labelRowsSelect: 'registros',
                    labelDisplayedRows: '{count} de {from}-{to}',
                    firstTooltip: 'Primera página',
                    previousTooltip: 'Página anterior',
                    nextTooltip: 'Página siguiente',
                    lastTooltip: 'Última página'
                }
            }}
        >
        </MaterialTable>

        return (
            <div class="center-v">
                <div className="tabla">
                    {tabla}
                </div>
            </div>
        )
    }
}
