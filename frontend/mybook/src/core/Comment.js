import React, {useState, useEffect, Fragment} from 'react'
import Menu from './Menu'
import {insertComment} from '../core'
import { isAuthenticated } from "../auth";
import {singlePost} from '../user';
import moment from 'moment'
import 'moment/locale/fr';
import { API_URL } from "../Config"

const Comment = ({match}) => {

    const [post, setPost] = useState('')
    const [values, setValues] = useState({
        text: '',
        error: '',
    })

    const {text} = values

    const loadPost = async (postId) => {
        try {
            const data = await singlePost(postId);
            if(data.error) {
                return console.log(data.error)
            } else {
               return setPost({body: data.body, user: data.postedBy.name, ifImg: data.checkimg, photo: data._id, date: data.created, comment: data.comments});
            }
        }
        catch (err) {
            console.log(err);
        }   
    }

    useEffect(() => {
        loadPost(match.params.postId)
    // eslint-disable-next-line 
    }, []);

    const user = isAuthenticated().user
    const token = isAuthenticated().token 

    const addComment = async (e) => {
        e.preventDefault();
        setValues({...values, error : false})
        try {
            const data = await insertComment(user._id, token, match.params.postId, {text: text});
            if (data.error) {
                return setValues({...values, error: data.error})
            } else {
                setValues({...values, text:''})
                return loadPost(match.params.postId)
            }
        }
        catch (err) {
            return console.log(err);
        }
    };

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value})
    };

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    return (
        <Fragment>
           <Menu/>   
            <div className=" mt-3 container">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="ml-2">
                                <div className="h5 m-0">{post.user}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="text-muted h7 mb-2">{moment(post.date).fromNow()}</div>
                    {post.ifImg === true ? <img className="img img-fluid" style={{maxHeight: '150px', width:'auto'}} src={`${API_URL}/photo/${post.photo}`} alt="post"/> : ''}
                    <p className="card-text">
                        {post.body}
                    </p>
                </div>   
            </div>
            <div className="row bootstrap snippets">
                <div className="col-md-12 col-md-offset-2 col-sm-12">
                    <div className="comment-wrapper container">
                        <div className="panel panel-info">
                            <div className="panel-body">
                                <textarea type="text" onChange={handleChange('text')} name="body" value={capitalize(text)} class="form-control" placeholder="Ajouter un commentaire..." rows="3"></textarea>
                                <br></br>
                                <button type="button" onClick={addComment} style={{display: text.length > 0 ? '' : 'none'}} class="btn btn-info pull-right">Publier</button>
                                <div className="clearfix"></div>
                                <hr></hr>
                                {post.comment && post.comment.map((c,i) => (
                                <ul className="media-list">
                                    <li className="media">
                                        <div className="media-body">
                                            <strong className="text-info">{c.postedBy.name}</strong>
                                            <span className="text-muted pull-right">
                                                <small className="text-muted ml-2">{moment(c.created).fromNow()}</small>
                                            </span>
                                            <p>
                                                {c.text}
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                                ))}    
                            </div>
                        </div>
                    </div>
                </div>
            </div>        
        </Fragment>     
    )
}

export default Comment;