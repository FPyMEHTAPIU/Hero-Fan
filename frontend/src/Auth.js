export const getToken = () => {
    return localStorage.getItem('token');
};

export const checkToken = async () => {
    const token = getToken();

    if (!token) {
        console.log('Token not found');
        return;
    }
    const isTokenValid = await fetch('/api/marv-user/check-token', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (isTokenValid.status === 403) {
        console.error('Invalid or expired token. Removing token...');
        localStorage.removeItem('token');
    }

    if (isTokenValid.status === 200) {
        const res = await isTokenValid.json();
        return (res.login);
    }
};