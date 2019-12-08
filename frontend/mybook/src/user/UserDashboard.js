import React, { useState, useEffect, Fragment } from 'react';
import Menu from '../core/Menu';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom'
import {getPostsByUser, deletePost} from '.';
import moment from 'moment';
import 'moment/locale/fr';
import { API_URL } from "../Config"

const Dashboard = () => {

    const [showPosts, setShowPosts] = useState(false); 
    const [posts, setPosts] = useState([])

    const { user: { _id, name} } = isAuthenticated();

    const token = isAuthenticated().token

    const loadPostsByUser = async (userId, token) => {
        try {
            const data = await getPostsByUser(userId, token);
            if(data.error) {
                console.log(data.error)
            } else {
                setPosts(data)
            }
        }
        catch (err) {
            console.log(err);
        }     
    }

    const user = isAuthenticated().user

    const removePost = async (postId) => {
        try {
            const data = await deletePost(postId, user._id, token);
            if(data.error) {
                console.log(data.error)
            } else {
                loadPostsByUser(_id, token)
            }
        }
        catch (err) {
            console.log(err);
        }     
    }

    useEffect(() => {
        loadPostsByUser(_id, token)
    }, [_id, token])

    const deleteConfirm = postId => {
        let answer = window.confirm('voulez vous supprimer ce message ?');
        if (answer) {
            removePost(postId);
        }
    };

    const userLinks = () => {
        return (
            <div className = "card card-links mb-3">
                <h4 className="card-header">Bonjour, {name}</h4>
            </div> 
        )
    };

    const userPosts = () => {
        return (
            <div className="card card-order">
                <table className="table table-order table-hover ">
                    <tbody>
                        <tr>
                            <td><h4>Mes Publications</h4></td>
                        </tr> 
                    </tbody>
                </table> 
                {posts && posts.map((p,i) => (
                    <div className="card gedf-card mt-3" key={i}>
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="ml-2">
                                        <div className="h5 m-0">{p.postedBy.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="text-muted h7 mb-2">{moment(p.created).fromNow()}</div>
                            <img className="img img-fluid" style={{maxHeight: '150px', width:'auto'}} src={`${API_URL}/photo/${p._id}`}/>
                            <p className="card-text">
                                {p.body}
                            </p>
                        </div>
                        <div className="card-footer">
                            <Link to={`/edit/post/${p._id}`}><button className="btn btn-info">Modifier</button></Link>
                            <button onClick={() => deleteConfirm(p._id)} className="btn btn-danger ml-2">Supprimer</button>
                        </div>
                    </div>
                ))}   
            </div>
        )
    };
    
    return (
        <Fragment>
            <Menu />
            <div className="container">
                <div>
                    <div className="row">
                        <div className="col-lg-12">
                            {userLinks()}
                            {userPosts()}
                        </div>
                        
                    </div>
                </div>
            </div>
        </Fragment>
    )  

}

export default Dashboard;