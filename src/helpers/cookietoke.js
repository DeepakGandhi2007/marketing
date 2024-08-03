import axios from 'axios';
import jwt from 'jsonwebtoken';

// Function to fetch and decode a cookie
export async function fetchAndDecodeCookie(cookieEndpoint) {
    try {
        const response = await axios.get(cookieEndpoint);
        const decoded = jwt.decode(response.data.token.value);
        return decoded;
    } catch (error) {
        console.error('Error fetching cookie:', error);
        return null;
    }
}
