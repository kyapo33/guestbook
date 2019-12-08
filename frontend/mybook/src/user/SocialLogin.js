import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { socialLog, authenticate } from "../auth";
 
class SocialLogin extends Component {
    constructor() {
        super();
        this.state = {
            redirectToReferrer: false
        };
    }
    
    // get google response
    responseGoogle = async response => {
        console.log(response);
        const { googleId, name, email, imageUrl } = response.profileObj;
        const user = {
            password: googleId,
            name: name,
            email: email,
            imageUrl: imageUrl
        };
        // api call to log with google
        try {
            const data = await socialLog(user)
            if (data.error) {
                console.log("Erreur d'authentification...");
            } else {
                authenticate(data, () => {
                    return this.setState({ redirectToReferrer: true });
                });
            }
        }
        catch (err) {
            console.log(err);
        }  
    };
 
    render() {
        // redirect if login is succesfull
        const { redirectToReferrer } = this.state;
        if (redirectToReferrer) {
            return <Redirect to="/" />;
        }
 
        return (
            // google oauth parameters
            <GoogleLogin
                clientId='819303239393-o9ou82osqvn57vodo3n8agua4stiv6k2.apps.googleusercontent.com'
                buttonText="S'identifier avec Google"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
            />
        );
    }
}
 
export default SocialLogin;