import React, {Component} from 'react';
import PropTypes from 'prop-types';
//import './App.css';

class DirName extends Component{
    static propTypes = {
        showFiles: PropTypes.func.isRequired
    };
    render() {
        return (
            <div>{console.log(this.props)}
                {this.props.file.name}     ||      {this.props.file.time_stamp}
                <button>Delete</button> <button>Share</button>
                <button
                    onFocus={this.setState({dirId:this.props.file.dir_id})}
                    onMouseOver={this.setState({dirId:this.props.file.dir_id})}
                 onClick={()=> this.props.showFiles(this.state)}
                >Show</button>
            </div>
        )
    }
}


export default DirName;