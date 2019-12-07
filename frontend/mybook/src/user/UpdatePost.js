import React, {useState, useEffect, Fragment} from 'react'
import Menu from '../core/Menu'
import {Button, Form, FormGroup, Input, Label} from 'reactstrap';
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

    useEffect(() => {
        loadPost(match.params.postId)
        setValues({...values, formData: new FormData()});
    // eslint-disable-next-line 
    }, []);

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: '' });
    };

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const {user, token} = isAuthenticated();

    const update = async (e) => {
        e.preventDefault();
        const data = await editPost(formData, token, match.params.postId, user._id);
        if (data.error) {
            setValues({ ...values, error: data.error });
        } else {
            setValues({ ...values, body: data.body, success: `Le message a bien été modifié` });
        }
    };

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            {success}
        </div>
    );

    const newPostForm = () => ( 
        <Fragment>
            <Form className="" onSubmit={update}>
                <FormGroup>
                    <Input type="text" onChange={handleChange('body')} name="body" value={capitalize(body)} />
                </FormGroup>
                <FormGroup>
                    <Label className="btn btn-outline-info">
                        Ajouter une image
                        <Input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                    </Label>
                </FormGroup>
                <Button color="info">Publier</Button>
            </Form>
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