import { getToken, checkToken} from "../Windows/Auth.js";

const fetchFavorites = async (setFavList, id) => {
    const token = getToken();
    const url = process.env.NEXT_PUBLIC_API_URL;

    if (!token || !id) return [];

    try {
        const response = await fetch(`${url}/marv-chars/fav-list/${id}`, {
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