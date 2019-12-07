import React, {useState, useEffect, Fragment} from 'react'
import Menu from './Menu'
import {getPosts} from '../core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import 'moment/locale/fr';
import { API_URL } from "../Config"

const Home = () => {

    const [posts, setPosts] = useState('')

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
            {JSON.stringify(posts)}
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
                    <span className="card-link"><FontAwesomeIcon icon={faComment}/> Comment</span>
                </div>
            </div>
            ))}
        </Fragment>     
    )
}

export default Home;