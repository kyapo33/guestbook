import { API_URL } from "../Config"

export const getPosts = async () => {
    try {
        const response = await fetch(`${API_URL}/post`, {
            method: "GET",
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
}

export const insertComment = async (userId, token, postId, comment) => {
    try {
        const response = await fetch(`${API_URL}/post/comment`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId, postId, comment })
        });
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};