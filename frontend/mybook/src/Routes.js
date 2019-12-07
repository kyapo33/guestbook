import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from './core/Home'
import Signup from './user/Signup'
import Signin from './user/Signin'
import PrivateRoute from './auth/PrivateRoute'
import Dashboard from './user/UserDashboard'
import AddPost from './user/AddPost'
import UpdatePost from './user/UpdatePost'
import Comment from './core/Comment'

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path = "/" exact component= {Home}/> 
                <Route path = "/signup" exact component= {Signup}/>
                <Route path = "/signin" exact component= {Signin}/>
                <PrivateRoute path = "/user/dashboard" exact component= {Dashboard}/>
                <PrivateRoute path = "/addpost" exact component= {AddPost}/>
                <PrivateRoute path = "/edit/post/:postId" exact component= {UpdatePost}/>
                <PrivateRoute path = "/post/:postId" exact component= {Comment}/>
            </Switch>
        </BrowserRouter>
    );     
    
};

export default Routes;