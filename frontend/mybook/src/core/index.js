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