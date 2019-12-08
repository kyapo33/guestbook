import { API_URL } from "../Config"

// api call register
export const signup = async user => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        return response.json();
    }
    catch (err) {
        console.log(err);
    }
};

// api call login
export const signin = async user => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        return response.json();
    }
    catch (err) {
        console.log(err);
    }
};

// store user information in localstorage
export const authenticate = (data, next) => {
    if(typeof window !== 'undefined') {
        localStorage.setItem ('jwt', JSON.stringify(data))
        next();   
    }
};

// api call logout
export const signout = async (next) => {
    if(typeof window !== 'undefined') {
        localStorage.removeItem ('jwt')
        next(); 
        try {
            const response = await fetch(`${API_URL}/logout/`, {
                method: "GET",
            });
            console.log('signout', response);
        }
        catch (err) {
            return console.log(err);
        }
    }   
};

// check if user information are in localstorage
export const isAuthenticated = () => {
    if(typeof window == 'undefined') {
        return false    
    } 
    if(localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'))
    } else {
        return false;
    }
}

// api call social login
export const socialLog = async (user)=> {
    try {
        const response = await fetch(`${API_URL}/social-login/`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user) 
        });
        console.log("signin response: ", response);
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }   
};