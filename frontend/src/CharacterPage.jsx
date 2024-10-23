import {useNavigate, useParams} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getToken, checkToken } from "./Auth.js";
import './CharacterPage.css'

const CharacterPage = () => {
    const { id } = useParams();
    const [charData, setCharData] = useState(null);
    const [error, setError] = useState(null);
    const token = getToken();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchСharData = async () => {
            await checkToken();
            if (!token) {
                navigate('/1');
                return;
            }
            try {
                const response = await fetch(`/api/marv-users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data!');
                }
                const data = await response.json();
                // console.log (data);
                setCharData(data);
            } catch (error) {
                console.error(error);
                setError('Error fetching user data');
            }
        };

        fetchСharData();
        console.log(charData);
    }, [id]);

    return (
        <main>
            <div id="char-content">
                <img src={charData[0].image}/>
                <div className="text-info">
                    <div id="main-info">
                        <p id="char-name">{charData[0].name}</p>
                        <p>
                            {charData[0].description ? charData[0].description :
                                'Can\'t say much about this character yet, but who knows what their story will be...'}
                        </p>
                    </div>
                    <div id="events">
                        <p>{charData[0].name} appeared in these movies:</p>
                        <p>some fetched info</p>
                        <button id="show-more">
                            Show more
                            <img src="../includes/Down_arrow.svg" alt="Show more"/>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CharacterPage;