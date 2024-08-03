import { useEffect, useState } from 'react';
import axios from 'axios';

const LogoutInactiveUser = () => {
    const [lastActivity, setLastActivity] = useState(Date.now());

    const handleActivity = () => {
        setLastActivity(Date.now());
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        window.addEventListener('click', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
            window.removeEventListener('click', handleActivity);
        };
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            axios.post('/api/users/logout')
                .then(() => {
                    console.log('Logged out inactive user');
                    window.location.href = '/login';
                })
                .catch(error => {
                    console.error('Failed to logout inactive user:', error);
                });
        }, 300000);

        return () => clearTimeout(timeout);
    }, [lastActivity]);

    return null;
};

export default LogoutInactiveUser;
