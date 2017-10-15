import React, {Component} from 'react';
//import './App.css';

class FileName extends Component{
    render() {
        return (
            <div>{console.log(this.props)}
            {this.props.file.name}    ||    {this.props.file.type}    ||      {this.props.file.time_stamp}
                <button>Delete</button> <button>Share</button>
            </div>
        )
    }
}


export default FileName;