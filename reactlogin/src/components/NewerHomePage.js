import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Login from "./Login";
import Message from "./Message";
import Welcome from "./Welcome";
import SignUp from "./SignUp";

class NewerHomePage extends Component {

    state = {
        isSignedUp: false,
        isLoggedIn: false,
        message: '',
        firstname:'',
        lastname:''

    };

    handleReg = (userdata) => {
        API.doSignUp(userdata)
            .then((status) => {
                if(status === 201){
                    this.setState({
                        isSignedUp:true,
                        isLoggedIn: true,
                        fristname:userdata.firstname
                    });
                    this.props.history.push("/welcome");
                }else if (status === 401){
                    this.setState({
                        isSignedUp: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };

    handleSubmit = (userdata) => {
        API.doLogin(userdata)
            .then((status) => {
                if (status === 201) {
                    this.setState({
                        isLoggedIn: true,
                        message: "Welcome to my App.!"
                    });

                    this.props.history.push("/welcome");
                } else if (status === 401) {
                    this.setState({
                        isLoggedIn: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };

    handleWelcome = (userdata) => {
        API.doWelcome(userdata)
            .then((status) => {
            if(status === 201){
                this.setState({
                    message: "welcome to welcome page",
                })
            }
            })
    }
    render() {
        return (
            <div className="container-fluid">
                <Route exact path="/" render={() => (
                    <div>
                        <Message message="You have landed on my App !!"/>
                        <button className="btn btn-success" onClick={() => {
                            this.props.history.push("/login");
                        }}>
                            Login
                        </button>

                        <button className="btn btn-success" onClick={() => {
                            this.props.history.push("/signup");
                        }}>
                            SignUp!
                        </button>
                    </div>
                )}/>

                <Route exact path="/signup" render={() => (
                    <div>
                    <SignUp handleReg = {this.handleReg}/>
                        <Message message = {this.state.message}/>

                    </div>
                    )}/>

                <Route exact path="/login" render={() => (
                    <div>
                        <Login handleSubmit={this.handleSubmit}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>
                <Route exact path="/welcome" render={() => (
                    <div>
                    <Welcome isLoggedin ={this.state.isLoggedIn}/>
                    <Message message={this.state.message}/>
                    </div>
                )}/>
            </div>
        );
    }
}

export default withRouter(NewerHomePage);