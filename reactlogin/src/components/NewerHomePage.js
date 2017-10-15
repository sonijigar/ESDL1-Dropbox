import React, {Component} from 'react';
    import { Route, withRouter } from 'react-router-dom';
    import * as API from '../api/API';
import Login from "./Login";
import Message from "./Message";
import Welcome from "./Welcome";
import SignUp from "./SignUp";
import Files from "./Files";
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

    // handleSubmit = (userdata) => {
    //     //console.log(this.state);
    //     API.doLogin(userdata)
    //         .then((status) => {
    //             if (status.status === 201) {
    //                 console.log("in herqqe");
    //                 (status.json().then((ans) =>{
    //                     let b = ans.firstname;
    //                     console.log(b);
    //                     this.state = ans;
    //                     this.setState({
    //                         isLoggedIn: "true",
    //                         message: "Welcome to my App.!"
    //                     })
    //                     this.props.history.push("/welcome");
    //
    //                     console.log(this.state);
    //                     }
    //                 ));
    //
    //             } else if (status.status === 401) {
    //                 this.setState({
    //                     isLoggedIn: false,
    //                     message: "Wrong username or password. Try again..!!"
    //                 });
    //             }
    //         });
    // };
    showFiles = (userdata) => {
        API.showFiles(userdata)
            .then((response)=>{
                console.log(response);
                this.setState({
                    files:response
                });
                this.props.history.push("/files");
            })
    }

    handleSubmit = (userdata) => {
        console.log(this.state);
        API.doLogin(userdata)
            .then(response => {
                this.setState({
                    isLoggedIn:true,
                    resp: [response],
                    message:"hello "+ response.firstname
                });
                this.props.history.push("/welcome");
                console.log(this.state.resp[0].firstname);
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
                    <Welcome isLoggedin = {this.state.isLoggedIn} showFiles = {this.showFiles} firstname = {this.state.resp[0].firstname} userid = {this.state.resp[0].user_id}/>
                    {/*<Files showFiles = {this.showFiles}/>*/}
                        <Message message={this.state.message}/>
                    </div>
                )}/>

                <Route exact path="/files" render={()=>(
                    <div>
                    <Files files={this.state.files} showFiles = {this.showFiles}/>
                    </div>
                    )}/>
            </div>
        );
    }
}

export default withRouter(NewerHomePage);