import React, {Component} from 'react';
//import './App.css';
import FileName from "./FileName"
import PropTypes from 'prop-types';
//import * as API from './api/API';
//import FileGridList from "./FileGridList";
//import TextField from 'material-ui/TextField';
//import Typography from 'material-ui/Typography';

class Files extends Component{
    static propTypes = {
        showFiles: PropTypes.func.isRequired
    };
    // constructor(props) {
    //     super(props);
    //     this.state = {files: []};
    // }

    // componentWillMount() {
    //     this.setState({files: response.entity._embedded.employees});
    // }

    render(){
        var files = this.props.files.map(file =>
            <FileName file={file}/>
        );
        var length = this.props.files.length
         var dirs = this.props.files[length-1].map(file =>
             <FileName file={file} />
         );
        return(
        <div>
            {/*{this.props.files.map(file=> {<FileName file = {File}/>})}*/}
            {console.log(length)}
            {files}
            Dirs
            {dirs}
        </div>
            )
    }
        // var files = this.props.files.map(file=>
        // //<FileName.js name = {file.name} type={file.type}  time={file.time_stamp}/>
        // <File file={file}>

}

export default Files;