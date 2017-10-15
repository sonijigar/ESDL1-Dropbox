import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Login extends Component {

    static propTypes = {
        handleSubmit: PropTypes.func.isRequired
    };

    state = {
        email: '',
        password: ''
    };

    componentWillMount(){
        this.setState({
            email: '',
            password: ''
        });
    }

    render() {
        return (
            <div className="row justify-content-md-center">
                <div className="col-md-3">
                    <form>
                        <div className="form-group">
                            <h1>Login</h1>
                        </div>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                label="Username"
                                placeholder="Enter email-id"
                                value={this.state.username}
                                onChange={(event) => {
                                    this.setState({
                                        email: event.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                className="form-control"
                                type="password"
                                label="password"
                                placeholder="Enter Password"
                                value={this.state.password}
                                onChange={(event) => {
                                    this.setState({
                                        password: event.target.value
                                    });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() =>this.props.handleSubmit(this.state)}>
                                 Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;