import React, {useState, useEffect, Fragment} from 'react'
import Menu from '../core/Menu'
import {Input, Label} from 'reactstrap';
import {isAuthenticated} from '../auth'
import {createPost} from '.';

const AddPost = () => {

    const [values, setValues] = useState({
        error:'',
        success:'',
        body:'',
        formData:'',
        photo:''
    })

    const {error, success, body, formData} = values

    // initialize values when the component mount
    useEffect(() => {
        setValues({...values, formData: new FormData()});
    // eslint-disable-next-line 
    }, []);

    // handle form change
    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: '' });
    };

    // get user and token form localstorage
    const {user, token} = isAuthenticated();

    // use api call to post
    const publish = async (e) => {
        e.preventDefault();
        try {
            const data = await createPost(token, user._id, formData); 
            if (data.error) {
                return setValues({ ...values, error: data.error });
            } else {
                return setValues({ ...values, body:'', error: '', success: `Le message a bien été posté` });
            } 
        }
        catch (err) {
            return console.log(err);
        }
    };

    // display a message if error
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    // display a message if success
    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            {success}
        </div>
    );
    
    // make first letter capital
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // display the form and remove it if success
    const newPostForm = () => {
        if(!success) {
            return (
                <Fragment>
                    <div className="row bootstrap mt-3 snippets">
                        <div className="col-md-12 col-md-offset-2 col-sm-12">
                            <div className="comment-wrapper container">
                                <div className="panel panel-info">
                                    <div className="panel-body">
                                        <textarea type="text" onChange={handleChange('body')} name="body" value={capitalize(body)} class="form-control" placeholder="Ajouter un message..." rows="3"></textarea>
                                        <br></br>
                                        <Label className="btn btn-outline-info">
                                            Ajouter une image
                                            <Input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                                        </Label>
                                        <br></br>
                                        <button onClick={publish} type="button" className="btn btn-info pull-right">Publier</button>
                                        <div class="clearfix"></div>
                                        <hr></hr>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        }   
    }

    return (
        <div>
            <Menu/>
            {showError()}
            {showSuccess()}
            {newPostForm()}
        </div> 
    );
}
export default AddPost;