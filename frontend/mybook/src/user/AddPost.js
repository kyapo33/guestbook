import React, {useState, useEffect, Fragment} from 'react'
import Menu from '../core/Menu'
import {Button, Form, FormGroup, Input, Label} from 'reactstrap';
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

    useEffect(() => {
        setValues({...values, formData: new FormData()});
    // eslint-disable-next-line 
    }, []);

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: '' });
    };

    const {user, token} = isAuthenticated();

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

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const newPostForm = () => ( 
        <Fragment>
            <Form className="" onSubmit={publish}>
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
        <div>
            <Menu/>
            {showError()}
            {showSuccess()}
            {newPostForm()}
        </div> 
    );
}
export default AddPost;