import React, { Component } from 'react';

import MaterialTable from 'material-table';
import Search from '@material-ui/icons/Search'
import SaveAlt from '@material-ui/icons/SaveAlt'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Add from '@material-ui/icons/Add'
import Check from '@material-ui/icons/Check'
import FilterList from '@material-ui/icons/FilterList'
import Remove from '@material-ui/icons/Remove'
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

import "../../assets/css/component/Tabla.css";

export class Tabla extends Component {

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
        
        return (
            <div className="tabla">
                <MaterialTable
                    icons={{ 
                        Add: Add,
                        Edit: Edit,
                        Delete: Delete,
                        Check: Check,
                        DetailPanel: ChevronRight,
                        Export: SaveAlt,
                        Filter: FilterList,
                        FirstPage: FirstPage,
                        LastPage: LastPage,
                        NextPage: ChevronRight,
                        PreviousPage: ChevronLeft,
                        Search: Search,
                        ThirdStateCheck: Remove,
                    }}
                    style={ {width:"auto"} }
                    title={ this.props.title }
                    columns={ this.props.columns }
                    data={ this.props.data }
                    editable={{
                        onRowAdd: (newData) =>
                          new Promise((resolve) => {
                            resolve();
                            this.props.handleAdd(newData);  
                          }),
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve) => {
                            resolve();
                            if (oldData) {
                                this.props.handleEdit(newData);
                            }
                          }),
                        onRowDelete: (oldData) =>
                          new Promise((resolve) => {
                            resolve();
                            this.props.handleDelete(oldData);
                          }),
                      }}
                >
                </MaterialTable>
            </div>
        )
    }

}
