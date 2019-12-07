import React, {useState, useEffect, Fragment} from 'react'
import Menu from './Menu'
import {insertComment} from '../core'
import { isAuthenticated } from "../auth";
import {Button, Form, FormGroup, Input } from 'reactstrap';
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

    const {text, error} = values

    const loadPost = async (postId) => {
        try {
            const data = await singlePost(postId);
            if(data.error) {
                return console.log(data.error)
            } else {
               return setPost({body: data.body, user: data.postedBy.name, photo: data._id, date: data.created, comment: data.comments});
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
           {JSON.stringify(post)}   
            <div className="card gedf-card mt-3">
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
                    <img className="img img-fluid" style={{maxHeight: '150px', width:'auto'}} src={`${API_URL}/photo/${post.photo}`}/>
                    <p className="card-text">
                        {post.body}
                    </p>
                </div>
                <Form className="" onSubmit={addComment}>
                    <FormGroup>
                        <Input type="text" onChange={handleChange('text')} name="body" value={capitalize(text)} />
                    </FormGroup>
                    <Button color="info">Publier</Button>
                </Form>  
            </div>
            {post.comment && post.comment.map((c,i) => (
            <div className="row" key={i}>
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
            ))}        
        </Fragment>     
    )
}

export default Comment;