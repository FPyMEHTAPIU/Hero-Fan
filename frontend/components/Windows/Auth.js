import Cookies from "js-cookie";

const url = process.env.NEXT_PUBLIC_API_URL;

export const getToken = () => {
    return Cookies.get('token') || null;
};

export const checkToken = async () => {
    const token = getToken();

    if (!token) {
        console.log('Token not found');
        return null;
    }

    try {
        const isTokenValid = await fetch(`${url}/marv-user/check-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (isTokenValid.status === 403) {
            console.error('Invalid or expired token. Removing token...');
            if (typeof window !== 'undefined') {
                Cookies.remove('token');
                //localStorage.removeItem('token');
            }
        }

        if (isTokenValid.status === 200) {
            return await isTokenValid.json();
        }
    } catch (error) {
        console.error('Error during token validation:', error);
    }
};