import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import Switch from 'material-ui/Switch';

import FileDiffToCollapseRegexes from './fileDiffCollapseRegexes'

const paperStyle = {
    width: '400px',
    height: '400px'
};

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { fileDiffCollapseRegexes: ["test1", "test2", "test3", "test4"] };
    }

    componentDidMount() {
        let key = "fileDiffToCollapseRegexes";

        var items = {};
        items[key] = ["1", "2", "3"];

        chrome.storage.sync.get(key, (items) => {
            let fileDifToCollapseRegexString = items[key];
            console.log(fileDifToCollapseRegexString);
        });
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
                <FileDiffToCollapseRegexes regexes={this.state.fileDiffCollapseRegexes}/>
                <Switch />
            </Paper>

        );
    }
}

App.defaultProps = {
    name: 'Mary'
};






// document.addEventListener('DOMContentLoaded', () => {

//   var input = document.getElementById('fileRegexInput');

//   input.addEventListener('change', () => {
//     var items = {};
//     items[key] = input.value;

//     chrome.storage.sync.set(items, function () {
//       console.log("fileDifRegex update stored");
//     });
//   });
// });