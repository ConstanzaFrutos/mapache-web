import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';

export class TabPanel extends Component {
    constructor(props) {
        super(props);
    }   

    render() {
        return (
            <div className="tab-panel">
                <AppBar position="static" color="default">
                    <Tabs 
                        value={ [] }
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"    
                    >
                        <Tab label="Información" icon={<PhoneIcon />} />
                    </Tabs>
                    <TabPanel value={[]} index={0}>
                        Información
                    </TabPanel>
                </AppBar>
            </div>
        )
    }

}
