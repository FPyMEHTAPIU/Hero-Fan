import {useNavigate, useParams} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getToken, checkToken } from "./Auth.js";
import usePopup from "./UsePopup.jsx";
import ToggleButton from "./ToggleButton.jsx";
import Popup from "./Popup.jsx";

import './CharacterPage.css'
import './CharsUsers.css'

const CharacterPage = () => {
    const { id } = useParams();
    const [charData, setCharData] = useState(null);
    const [error, setError] = useState(null);
    const token = getToken();
    const navigate = useNavigate();
    const [favList, setFavList] = useState([]);
    const [isLike, setIsLike] = useState(false);
    const [isDislike, setIsDislike] = useState(false);

    const {
        isWindowShown,
        windowType,
        password,
        confirmPassword,
        setPassword,
        setConfirmPassword,
        changeWindowType,
        openPopup,
        closePopup
    } = usePopup();

    useEffect(() => {
        checkToken();
        fetchFavorites();
    }, [token]);

    const fetchFavorites = async () => {
        const userId = (await checkToken()).id;
        if (!token) return;

        try {
            const response = await fetch(`/api/marv-chars/fav-list/${userId}`, {
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
        const checkIsLiked = async () => {
            if (!token) return;
            try {
                const response = await fetch(`/api/is-liked`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        charId: id ? id : 0
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch likes data!');
                }
                const data = await response.json();
                console.log(data);
                setIsLike(data);
            } catch (error) {
                console.error("Error fetching like status:", error);
            }
        };

        checkIsLiked();
    }, [token, id]);

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

                setCharData(data);
            } catch (error) {
                console.error(error);
                setError('Error fetching character data');
            }
        };

        fetchCharData();
    }, [id]);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await fetch(`/api/char-likes/${id}`, {
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



    }, [token]);

    const doLike = async () => {
        try {
            const response = await fetch(`/api/likes`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    charId: id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch likes data!');
            }
            const data = await response.json();
            setIsLike(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLike = async () => {
        if (!token)
            openPopup();
        else {
            await doLike();
        }
    }

    const handleDislike = () => {
        if (!token)
            openPopup();
    }

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
                            onClick={(e) => e.stopPropagation()}
                            openPopup={openPopup}
                        />
                    }
                </div>
                <div id="likes">
                    <button
                        className="like"
                        onClick={handleLike}
                    >
                        <img src={isLike ? "/Like_filled.svg" : "/Like_empty.svg"} alt="Like"/>
                    </button>
                    <button
                        className="like dislike"
                        onClick={handleDislike}
                    >
                        <img src={isDislike ? "/Dislike_filled.svg" : "/Dislike_empty.svg"} alt="Dislike"/>
                    </button>
                </div>
            </div>
            {isWindowShown && (
                <Popup
                    winType={windowType}
                    onChange={changeWindowType}
                    onClose={closePopup}
                    password={password}
                    setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                />
            )}
        </main>
    )
}

export default CharacterPage;