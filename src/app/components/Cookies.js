import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const TokenDecoder = () => {
    const [decodedToken, setDecodedToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('/api/cookie');
                const decoded = jwt.decode(response.data.token.value);
                setDecodedToken(decoded);
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };

        fetchToken();
    }, []);

    return decodedToken;
};

export default TokenDecoder;
