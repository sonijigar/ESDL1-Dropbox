import React, {Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

class Welcome extends Component {

    static propTypes = {
        firstname: PropTypes.string.isRequired,
        isLoggedIn: PropTypes.string.isRequired
    };

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
                    {this.props.isLoggedIn && (
                        <div className="alert alert-warning" role="alert">
                            {this.props.isLoggedIn}, welcome to my App..!!
                        </div>
                    )}
                    <Link to="/login">Logout</Link>
                </div>
            </div>
        )
    }
}

export default withRouter(Welcome);