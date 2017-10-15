import React, {Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import * as API from '../api/API';
import PropTypes from 'prop-types';

//import PropTypes from 'prop-types';

class Welcome extends Component {

    state = {
        firstname:this.props.firstname,
        uid:this.props.userid
    }
    showFiles = (userdata) => {
        API.showFiles(userdata)
            .then((response)=>{
                console.log("here");
                this.setState({
                    files:response
                });
                //this.props.history.push("/files");
            })
    }
    // state = {
    //     firstname : '',
    //     isLoggedIn:''
    // };
    //
    // componentWillMount(){
    //     this.setState({
    //         firstname : this.props.firstname,
    //         isLoggedIn:this.props.isLoggedIn
    //     });
    //     //document.title = `Welcome, ${this.state.username} !!`;
    // }
    //
    // componentDidMount(){
    //     document.title = `Welcome, ${this.state.firstname} !!`;
    // }

    render() {
        return (

            <div className="row justify-content-md-center">
                <div className="col-md-3">
                    {/*{this.props.isLoggedIn && (*/}
                        {/*<div className="alert alert-warning" role="alert">*/}
                            {/*{this.props.isLoggedIn}, welcome to my App..!!*/}
                        {/*</div>*/}
                    {/*)}*/}
                    Welcome {this.props.firstname}<br/>

                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={
                            () =>{this.props.showFiles(this.state)}}>
                        Submit
                    </button>

                    <Link to="/Files">ShowFiles</Link><br/>
                    <Link to="/login">Logout</Link>
                </div>
            </div>
        )
    }
}

export default withRouter(Welcome);