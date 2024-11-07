import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { getToken, checkToken } from "../../components/Windows/Auth.js";
import usePopup from "../../components/Windows/usePopup.js";
import ToggleButton from "../../components/FavoritesHandling/ToggleButton.jsx";
import Popup from "../../components/Windows/Popup.jsx";

const url = process.env.NEXT_PUBLIC_API_URL;

const CharacterPage = ({ initialCharData, initialFavList, initialLikeCount, initialDislikeCount, initialIsLike, initialIsDislike }) => {
    const router = useRouter();
    const { id } = router.query;

    const [charData, setCharData] = useState(initialCharData);
    const [favList, setFavList] = useState(initialFavList);
    const [isLike, setIsLike] = useState(initialIsLike);
    const [isDislike, setIsDislike] = useState(initialIsDislike);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);
    const [error, setError] = useState(null);

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

    const token = getToken();

    useEffect(() => {
        checkToken();
        fetchFavorites();
    }, [token]);

    const fetchFavorites = async () => {
        const userId = (await checkToken()).id;
        if (!token) return;

        try {
            const response = await fetch(`${url}/marv-chars/fav-list/${userId}`, {
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

    const doLike = async () => {
        try {
            const response = await fetch(`${url}/likes`, {
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

    const doDislike = async () => {
        try {
            const response = await fetch(`${url}/dislikes`, {
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
                throw new Error('Failed to fetch dislikes data!');
            }
            const data = await response.json();
            setIsDislike(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLike = async () => {
        if (!token)
            openPopup();
        else {
            await doLike();
            setIsDislike(false);
        }
    };

    const handleDislike = async () => {
        if (!token)
            openPopup();
        else {
            await doDislike();
            setIsLike(false);
        }
    };

    return (
        <main id="char-main">
            {charData && (
                <div id="char-content">
                    <img id="char-image" src={charData[0].image} alt="Character"/>
                    <div id="text-info">
                        <div id="main-info">
                            <h2 id="char-name">{charData[0].name}</h2>
                            <p>
                                {charData[0].description || 'Can\'t say much about this character yet.'}
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
                    <button className="like" onClick={handleLike}>
                        <img src={isLike ? "/Like_filled.svg" : "/Like_empty.svg"} alt="Like"/>
                        <p className="counter">{likeCount}</p>
                    </button>
                    <button className="like dislike" onClick={handleDislike}>
                        <img src={isDislike ? "/Dislike_filled.svg" : "/Dislike_empty.svg"} alt="Dislike"/>
                        <p className="counter">{dislikeCount}</p>
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
    );
};

export default CharacterPage;

export async function getServerSideProps(context) {
    const { id } = context.params.id;
    console.log(id);
    const [userId, setUserId] = useState(0);
    const token = getToken();
    console.log(id);
    if (token)
        setUserId(token.id);
    const url = process.env.NEXT_PUBLIC_API_URL;

    console.log(`Fetching data for character ID: ${id}`);

    try {
        const [charResponse, favListResponse, likeCountResponse, dislikeCountResponse, isLikeResponse, isDislikeResponse] = await Promise.all([
            fetch(`${url}/marv-chars/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch(`${url}/marv-chars/fav-list/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch(`${url}/char-likes/${id}`),
            fetch(`${url}/char-dislikes/${id}`),
            fetch(`${url}/is-liked`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ charId: id })
            }),
            fetch(`${url}/is-disliked`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ charId: id })
            })
        ]);

        if (!charResponse.ok || !favListResponse.ok || !likeCountResponse.ok || !dislikeCountResponse.ok || !isLikeResponse.ok || !isDislikeResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        const charData = await charResponse.json();
        const favList = await favListResponse.json();
        const likeCount = await likeCountResponse.json();
        const dislikeCount = await dislikeCountResponse.json();
        const isLike = await isLikeResponse.json();
        const isDislike = await isDislikeResponse.json();

        return {
            props: {
                initialCharData: charData,
                initialFavList: favList,
                initialLikeCount: likeCount,
                initialDislikeCount: dislikeCount,
                initialIsLike: isLike,
                initialIsDislike: isDislike,
            }
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                initialCharData: null,
                initialFavList: [],
                initialLikeCount: 0,
                initialDislikeCount: 0,
                initialIsLike: false,
                initialIsDislike: false,
                error: 'Error fetching character data',
            }
        };
    }
}
