import React, {useState} from 'react'
import Menu from '../core/Menu'
import {FormText, Button, Form, FormGroup, Input} from 'reactstrap';
import {signup} from '../auth'
import {isAuthenticated} from '../auth'
import {Redirect} from 'react-router-dom'
import SocialLogin from "./SocialLogin";

const Signup = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false,
    })

    const {name, email, password, success, error} = values

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value})
    };

    const clickSubmit = async (event) => {
        event.preventDefault();
        setValues({...values, error : false})
        try {
            const data = await signup({name : name, email : email, password : password}) 
            if (data.error) {
                return setValues({...values, error: data.error, success: false})    
            } else {
                return setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    success: true,
                })
            }   
        }
        catch (err) {
            console.log(err);
        } 
    }

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    )
    
    const showSuccess = () => ( 
        <div className="alert alert-success" style={{display: success ? '' : 'none'}}>
            <p>Votre compte a bien été crée. Vérifiez votre boîte mail pour vous connecter</p>  
        </div>
    )

    const redirectUser = () => {
        if(isAuthenticated()) {
            return <Redirect to = '/'/>
        }
      
    }

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const signUpForm = () => (
        <div className="signup">
            <Form className="signupform">
            {showSuccess()}
            {showError()}
                <SocialLogin />
                <FormGroup>
                    <Input onChange={handleChange('name')} type="text" name="nom" placeholder="Nom" value={capitalize(name)} />
                </FormGroup>
                <FormGroup>
                    <Input onChange={handleChange('email')} type="email" name="email" id="exampleEmail" placeholder="Email" value={email} />
                </FormGroup>
                <FormGroup>
                    <Input onChange={handleChange('password')} type="password" name="password" id="examplePassword" placeholder="Mot de passe" value={password} />
                    <FormText>Le Mot de passe doit être de minimun 8 lettres et doit contenir au moins un chiffre</FormText>
                </FormGroup>
                <Button onClick={clickSubmit} color="info">S'inscrire</Button>
            </Form>
        </div>
    );
    
    return (
        <div>
            <Menu/>
            {signUpForm()}
            {redirectUser()}
        </div> 
    );
}
export default Signup;