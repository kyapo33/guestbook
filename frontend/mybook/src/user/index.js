import { API_URL } from "../Config"

export const read = async (userId, token) => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};

export const singlePost = async (postId) => {
    try {
        const response = await fetch(`${API_URL}/post/${postId}`, {
            method: "GET",
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};


export const createPost = async (token, userId, post ) => {
    try {
        const response = await fetch(`${API_URL}/create/post/${userId}`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: post
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};

export const getPostsByUser = async (userId, token) => {
    try {
        const response = await fetch(`${API_URL}/post/user/${userId}`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};

export const deletePost = async (postId, userId, token) => {
    try {
        const response = await fetch(`${API_URL}/post/${postId}/${userId}`, {
            method: "DELETE",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};

export const editPost = async (post, token, postId, userId) => {
    try {
        const response = await fetch(`${API_URL}/edit/${postId}/${userId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: post
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};