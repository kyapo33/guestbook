import React ,{useState}from 'react'
import Menu from '../core/Menu'
import {Redirect} from 'react-router-dom'
import {signin, authenticate, isAuthenticated} from '../auth'
import {FormText, Button, Form, FormGroup, Input} from 'reactstrap';
import SocialLogin from "./SocialLogin";

const Signin = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        loading: false,
        redirectToReferrer: false
    })

    const { name, email, password, loading, error, redirectToReferrer} = values
    const {user} = isAuthenticated();

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value})
    };

    const clickSubmit = async (event) => {
        event.preventDefault();
        setValues({...values, error : false, loading: true})
        try {
            const data = await signin({name: name, email : email, password : password})
            if (data.error) {
                return setValues({...values, error: data.error, loading: false})    
            } else {
                authenticate (data, ()=> {
                    return setValues({
                        ...values,
                        redirectToReferrer: true
                    });
                });    
            }   
        }
        catch (err) {
            console.log(err);
        }   
    };
   
    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    )
    
    const showLoading = () => ( 
        loading && (
        <div className="alert alert-info">
            <h2>Chargement...</h2>  
        </div>
        )
    )

    const redirectUser = () => {
        if (redirectToReferrer) {
            if(user) {
                return <Redirect to = '/' />
            }
        }
        if(isAuthenticated()) {
            return <Redirect to = '/'/>
        }
    }

    const signInForm = () => (
        <div className="signup">
            <Form className="signupform">
            {showError()}
            {showLoading()}   
                <SocialLogin />
                <FormGroup>
                    <Input onChange={handleChange('email')} type="email" name="email" id="exampleEmail" placeholder="Email" value={email} />
                </FormGroup>
                <FormGroup>
                    <Input onChange={handleChange('password')} type="password" name="password" id="examplePassword" placeholder="Mot de passe" value={password} />
                    <FormText>Le Mot de passe doit être de minimun 8 lettres et doit contenir au moins un chiffre</FormText>
                </FormGroup>
                <Button onClick={clickSubmit} color="info">Se connecter</Button>
            </Form>
        </div>   
    );
    
    return (
        <div>
            <Menu/>
            {signInForm()}
            {redirectUser()}
        </div>       
    );
}

export default Signin;