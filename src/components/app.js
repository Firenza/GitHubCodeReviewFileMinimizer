import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import uuidv4 from 'uuid/v4';
import * as _ from 'lodash';

import FileDiffToCollapseRegexes from './fileDiffCollapseRegexes'
import NavBar from './navBar'

const paperStyle = {
    width: '400px'
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
            let fileDiffCollapseSettings = items[fillDiffCollapseSettingsStorageKey];

            if (fileDiffCollapseSettings === undefined) {
                this.addNewFileDiffCollapseSetting("Contains", ".sln");
                this.addNewFileDiffCollapseSetting("Contains", ".csproj");
                this.addNewFileDiffCollapseSetting("Contains", ".vbproj");
                this.addNewFileDiffCollapseSetting("Contains", ".dbproj");
                this.addNewFileDiffCollapseSetting("Contains", "packages.config");
            }

            this.setState({
                fileDiffCollapseSettings: fileDiffCollapseSettings
            });
        });
    }

    updateFileDiffCollapseSetting = (updatedSetting) => {
        let index = _.findIndex(this.state.fileDiffCollapseSettings, (setting) => {
            return setting.id === updatedSetting.id
        })

        this.state.fileDiffCollapseSettings.splice(index, 1, updatedSetting);

        this.persistFileDiffCollapseSettingsToChromeStorage();
    }

    deleteFileDiffCollapseSetting = (id) => {

        _.remove(this.state.fileDiffCollapseSettings, (setting) => {
            return setting.id === id;
        });

        this.setState({
            fileDiffCollapseSettings: this.state.fileDiffCollapseSettings
        });

        this.persistFileDiffCollapseSettingsToChromeStorage();
    }

    addNewFileDiffCollapseSetting = (matchType, matchString) => {
        let newFileDiffCollapseSetting = {
            // generated a new guid for the id
            id: uuidv4(),
            matchType: matchType || "Contains",
            matchString: matchString || ""
        }

        this.state.fileDiffCollapseSettings.push(newFileDiffCollapseSetting);

        this.persistFileDiffCollapseSettingsToChromeStorage();

        // Let react know it needs to re-render child components
        this.setState({
            fileDiffCollapseSettings: this.state.fileDiffCollapseSettings
        });
    }

    persistFileDiffCollapseSettingsToChromeStorage = () => {
        // Clone the settings so we don't run into weird reference issues
        var changedFileDiffCollapseSettings = Object.assign([], this.state.fileDiffCollapseSettings);

        var items = {};
        items[fillDiffCollapseSettingsStorageKey] = changedFileDiffCollapseSettings;

        chrome.storage.sync.set(items, function () { });
    }

    render() {
        return (
            <Paper style={paperStyle} >
                <NavBar />
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