import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import Switch from 'material-ui/Switch';
import uuidv4 from 'uuid/v4';
import * as _ from 'lodash';

import FileDiffToCollapseRegexes from './fileDiffCollapseRegexes'

const paperStyle = {
    width: '400px',
    height: '400px'
};

const fillDiffCollapseSettingsStorageKey = "fileDiffToCollapseSettings";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fileDiffCollapseSettings: []
        };
    }

    componentDidMount() {
        chrome.storage.sync.get(fillDiffCollapseSettingsStorageKey, (items) => {
            this.setState({
                fileDiffCollapseSettings : items[fillDiffCollapseSettingsStorageKey]
            });
        });
    }

    updateFileDiffCollapseSetting = (updatedSetting) => {
        console.log("Saving updated setting %O", updatedSetting);
        
        let index = _.findIndex(this.state.fileDiffCollapseSettings, (setting) => {
            setting.id === updatedSetting.id
        })

        this.state.fileDiffCollapseSettings.splice(index, 1, updatedSetting);

        this.persistFileDiffCollapseSettingsToChromeStorage();
    }

    deleteFileDiffCollapseSetting = (id) => {

        _.remove(this.state.fileDiffCollapseSettings, (setting) => {
            return setting.id === id;
        });

        this.setState({
            fileDiffCollapseSettings : this.state.fileDiffCollapseSettings
        });

        this.persistFileDiffCollapseSettingsToChromeStorage();
    }

    addNewFileDiffCollapseSetting = () => {
        console.log("adding new setting");
        
        let newFileDiffCollapseSetting = {
            // generated a new guid for the id
            id: uuidv4(),
            matchType : "Contains",
            matchString : ""
        }

        this.state.fileDiffCollapseSettings.push(newFileDiffCollapseSetting);
        
        this.persistFileDiffCollapseSettingsToChromeStorage();

        // Let react know it needs to re-render child components
        this.setState({
            fileDiffCollapseSettings : this.state.fileDiffCollapseSettings
        });
    }

    persistFileDiffCollapseSettingsToChromeStorage = ()=> {
        var items = {};
        items[fillDiffCollapseSettingsStorageKey] = this.state.fileDiffCollapseSettings;
    
        chrome.storage.sync.set(items, function () {});
    }

    render() {
        return (
            <Paper style={paperStyle} >
                <AppBar position="static" color="default" >
                    <Toolbar>
                        <Typography type="title" color="inherit" >
                            GitHub Pull Request Helper
                        </Typography>
                    </Toolbar>
                </AppBar>
                <FileDiffToCollapseRegexes 
                    addNewFileDiffCollapseSetting={this.addNewFileDiffCollapseSetting}
                    deleteFileDiffCollapseSetting={this.deleteFileDiffCollapseSetting}
                    updateFileDiffCollapseSetting={this.updateFileDiffCollapseSetting}
                    fileDiffCollapseSettings={this.state.fileDiffCollapseSettings} 
                />
            </Paper>
        );
    }
}