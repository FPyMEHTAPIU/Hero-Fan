import { getToken, checkToken} from "./Auth.js";

const fetchFavorites = async (setFavList) => {
    const token = getToken();

    if (!token) return;

    try {
        const response = await fetch('/api/marv-chars/fav-list', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        setFavList(data);
    } catch (error) {
        console.error('Error fetching favorites:', error);
    }
};

export default fetchFavorites;