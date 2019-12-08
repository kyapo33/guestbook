import React, {useState, useEffect, Fragment} from 'react'
import Menu from './Menu'
import {getPosts} from '../core'
import moment from 'moment'
import 'moment/locale/fr';
import { API_URL } from "../Config"
import { Link } from 'react-router-dom'
import {isAuthenticated} from '../auth';
import {Button, Form} from 'reactstrap';

const Home = () => {

    const [posts, setPosts] = useState('')
    const [showComments, setShowComments] = useState(false); 

    const loadPosts = async () => {
        try {
            const data = await getPosts(); 
            if(data.error) {
                return console.log(data.error)
            } else {
                return setPosts(data)
            }
        }
        catch (err) {
            console.log(err);
        }  
    }

    useEffect(() => {
        loadPosts()
    }, []);
     
    return (
        <Fragment>
        <Menu/>
            {!isAuthenticated() && (
                <div><p className="alert alert-danger mt-2 ml-2" >Vous devez être connecter pour laisser un message ou pour commenter</p></div>
            )}
            {posts && posts.map((p,i) => (
                <div className=" mt-3 container" key={i}>
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
                <Link to={`/post/${p._id}`}><button className="card-link btn btn-info">Commenter</button></Link>
                <button onClick={() => setShowComments(showComments === p._id ? false : p._id)} style={{display: p.comments.length > 0 ? '' : 'none'}} className="card-link ml-2 btn btn-info">Voir les commentaires</button>  
                </div>
                {showComments  === p._id && p.comments && p.comments.map((c,i) => (
                    <div key={i}>
                        <div className="row mt-3">
                            <div className="comments-container">
                                <ul id="comments-list" className="comments-list">
                                    <li>
                                        <div className="comment-main-level">
                                            <div className="comment-box">
                                                <div className="comment-head">
                                                    <h6 className="comment-name mt-2">{c.postedBy.name}</h6>
                                                </div>
                                                <div className="comment-content">
                                                    <p>{c.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            ))}
        </Fragment>     
    )
}

export default Home;