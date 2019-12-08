import React, {useState, useEffect, Fragment} from 'react'
import Menu from '../core/Menu'
import {Input, Label} from 'reactstrap';
import {isAuthenticated} from '../auth'
import {singlePost, editPost} from '.';

const UpdatePost = ({match}) => {

    const [values, setValues] = useState({
        error:'',
        success:'',
        body:'',
        formData:'',
        photo:''
    })

    const {error, success, body, formData} = values

    // use api call to get one post
    const loadPost = async (postId) => {
        try {
            const data = await singlePost(postId);
            if(data.error) {
                return setValues(data.error)
            } else {
               return setValues({...values, body: data.body, formData: new FormData() });
            }
        }
        catch (err) {
            console.log(err);
        }   
    }

    // load the post and initialize the form when the component mount
    useEffect(() => {
        loadPost(match.params.postId)
        setValues({...values, formData: new FormData()});
    // eslint-disable-next-line 
    }, []);

    // handle the form change
    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: '' });
    };

    // make the first letter capital
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // get user information and token from localstorage
    const {user, token} = isAuthenticated();

    // use api call to update a post
    const update = async (e) => {
        e.preventDefault();
        const data = await editPost(formData, token, match.params.postId, user._id);
        if (data.error) {
            setValues({ ...values, error: data.error });
        } else {
            setValues({ ...values, body: data.body, success: `Le message a bien été modifié` });
        }
    };

    // display a message if error
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    // display a message if error
    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            {success}
        </div>
    );

    // show the form
    const newPostForm = () => ( 
        <Fragment>
            <div className="row bootstrap mt-3 snippets">
                <div className="col-md-12 col-md-offset-2 col-sm-12">
                    <div className="comment-wrapper container">
                        <div className="panel panel-info">
                            <div className="panel-body">
                                <textarea type="text" onChange={handleChange('body')} name="body" value={capitalize(body)} class="form-control" rows="3"></textarea>
                                <br></br>
                                <Label className="btn btn-outline-info">
                                    Modifier l'image
                                    <Input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                                </Label>
                                <br></br>
                                <button onClick={update} type="button" className="btn btn-info pull-right">Publier</button>
                                <div class="clearfix"></div>
                                <hr></hr>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

    return (
        <Fragment>
            <Menu/>
            {showError()}
            {showSuccess()}
            {newPostForm()}
        </Fragment> 
    );
}

export default UpdatePost;