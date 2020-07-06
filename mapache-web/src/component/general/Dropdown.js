import React, { Component } from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import "../../assets/css/component/general/Dropdown.css";

export class Dropdown extends Component {

    render() {
        let page = null;

        if (this.props.renderDropdown) {
            page =  <FormControl className="form-control">
                        <InputLabel id="demo-simple-select-label">
                            { this.props.label}
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={ this.props.value }
                            onChange={ this.props.handleChange }
                        >
                            { 
                                this.props.values.map((value) => {
                                    return <MenuItem value={ value }
                                            >
                                                { value }
                                            </MenuItem>
                                }) 
                            }
                        </Select>
                    </FormControl>
        }

        return (
            <div className="dropdown">
                { page }
            </div>
        )
    }

}