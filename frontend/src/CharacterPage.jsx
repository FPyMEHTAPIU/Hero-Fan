import {useNavigate, useParams} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getToken, checkToken } from "./Auth.js";
import './CharacterPage.css'
import ToggleButton from "./ToggleButton.jsx";

const CharacterPage = () => {
    const { id } = useParams();
    const [charData, setCharData] = useState(null);
    const [error, setError] = useState(null);
    const token = getToken();
    const navigate = useNavigate();
    const [favList, setFavList] = useState([]);

    useEffect(() => {
        checkToken();
        fetchFavorites();
    }, [token]);

    const fetchFavorites = async () => {
        if (!token) return;

        try {
            const response = await fetch(`/api/marv-chars/fav-list/${id}`, {
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

    useEffect(() => {
        const fetchCharData = async () => {
            await checkToken();
            try {
                const response = await fetch(`/api/marv-chars/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch character data!');
                }
                const data = await response.json();
                console.log (data);
                setCharData(data);
            } catch (error) {
                console.error(error);
                setError('Error fetching character data');
            }
        };

        fetchCharData();
        console.log(charData);
    }, [id]);

    return (
        <main id="char-main">
            {charData && (
                <div id="char-content">
                    <img id="char-image" src={charData[0].image} alt="Character"/>
                    <div id="text-info">
                        <div id="main-info">
                            <h2 id="char-name">{charData[0].name}</h2>
                            <p>
                                {charData[0].description !== '' ? charData[0].description :
                                    'Can\'t say much about this character yet, but who knows what their story will be...'}
                            </p>
                        </div>
                        <div id="events">
                            <p>{charData[0].name} appeared in these movies:</p>
                            <ul>
                                <li><p>some fetched info</p></li>
                            </ul>
                            <button id="show-more">
                                Show more
                                <img src="../includes/Down_arrow.svg" alt="Show more"/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div id="actions">
                <div id="star">
                    {charData &&
                        <ToggleButton
                            characterName={charData[0].name}
                            favList={favList}
                            setFavList={setFavList}
                        />
                    }
                </div>
                <div id="likes">
                    <button className="like">
                        <img src="../includes/Like_empty.svg" alt="Like"/>
                    </button>
                    <button className="like dislike">
                        <img src="../includes/Dislike_empty.svg" alt="Dislike"/>
                    </button>
                </div>
            </div>
        </main>
    )
}

export default CharacterPage;