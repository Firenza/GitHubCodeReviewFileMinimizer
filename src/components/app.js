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
        // Create our tracker
        ga('create', 'UA-36364890-2', 'auto');
        // Disable this check so requests from the chrome-extension:// host get sent
        ga('set', 'checkProtocolTask', function(){ /* nothing */ });
        // Log that someone opened the extension UIs
        ga('send', 'pageview', '/index.html');

        chrome.storage.sync.get(fillDiffCollapseSettingsStorageKey, (items) => {
            let fileDiffCollapseSettings = items[fillDiffCollapseSettingsStorageKey];

            if (fileDiffCollapseSettings !== undefined) {
                this.setState({
                    fileDiffCollapseSettings: fileDiffCollapseSettings
                });
            } 
            else{
                // Set some default info if there is no existing data
                this.addNewFileDiffCollapseSetting("Contains", ".sln");
                this.addNewFileDiffCollapseSetting("Contains", ".csproj");
                this.addNewFileDiffCollapseSetting("Contains", ".vbproj");
                this.addNewFileDiffCollapseSetting("Contains", ".dbproj");
                this.addNewFileDiffCollapseSetting("Contains", "packages.config");
            }
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

        let diffToDelete = _.find(this.state.fileDiffCollapseSettings, (dif) => { return dif.id === id});

        ga('send', 'event', {
            eventCategory: 'File Diff Interaction',
            eventAction: 'delete condition click',
            eventLabel: diffToDelete.matchType + ' | ' + diffToDelete.matchString,
            dimension1: diffToDelete.matchtype,
            dimension2: diffToDelete.matchString
        });

        _.remove(this.state.fileDiffCollapseSettings, (setting) => {
            return setting.id === id;
        });

        this.setState({
            fileDiffCollapseSettings: this.state.fileDiffCollapseSettings
        });

        this.persistFileDiffCollapseSettingsToChromeStorage();
    }

    addNewFileDiffCollapseSetting = (matchType, matchString) => {

        ga('send', 'event', {
            eventCategory: 'File Diff Interaction',
            eventAction: 'add new condition click'
        });
        
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

    navigateToGitHubRepo = () => {
        let repoUrl = "https://github.com/Firenza/GitHubPullRequestEnhancer";

        ga('send', 'event', {
            eventCategory: 'Outbound Link',
            eventAction: 'click',
            eventLabel: repoUrl,
            // Only open the new tab after the analytics even has been sent as the extension js code stop executing as soon as chrome
            // opens the new tab
            hitCallback: () => {
                chrome.tabs.create({ url: "https://github.com/Firenza/GitHubPullRequestEnhancer" });
            }

        });
    }

    render() {
        return (
            <Paper style={paperStyle} >
                <NavBar navigateToGitHubRepo={this.navigateToGitHubRepo}/>
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