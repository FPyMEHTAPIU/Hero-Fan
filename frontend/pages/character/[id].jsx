import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { getToken, checkToken } from "@/components/Windows/Auth";
import usePopup from "../../components/Windows/usePopup.js";
import ToggleButton from "../../components/FavoritesHandling/ToggleButton.jsx";
import Popup from "../../components/Windows/Popup.jsx";
import fetchFavorites from "@/components/FavoritesHandling/FetchFavorites";

const url = process.env.NEXT_PUBLIC_API_URL;

const CharacterPage = ({ initialCharData, initialFavList, initialLikeCount, initialDislikeCount, initialIsLike, initialIsDislike }) => {
    const router = useRouter();
    const { id } = router.query;
    console.log(router.query);

    const [charData, setCharData] = useState(initialCharData || []);
    const [favList, setFavList] = useState(initialFavList || []);
    const [isLike, setIsLike] = useState(initialIsLike);
    const [isDislike, setIsDislike] = useState(initialIsDislike);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);
    const [token, setToken] = useState(getToken());

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
        const loadToken = async () => {
            const tokenData = await checkToken();
            setToken(tokenData);
        }
        loadToken();
    }, []);

    useEffect(() => {
        fetchFavorites(setFavList, token ? token.id : 0);
    }, [token]);

    useEffect(() => {
        setCharData(initialCharData);
    }, [initialCharData]);

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
                            charPage={true}
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
    const { id } = context.params;
    const token = getToken();
    let userId;

    if (token)
        userId = token.id;
    const url = process.env.NEXT_PUBLIC_API_URL;

    console.log(`Fetching data for character ID: ${id}`);

    try {
        const [charResponse, likeCountResponse, dislikeCountResponse] = await Promise.all([
            fetch(`${url}/marv-chars/${id}`),
            fetch(`${url}/char-likes/${id}`),
            fetch(`${url}/char-dislikes/${id}`)
        ]);

        if (!charResponse.ok || !likeCountResponse.ok || !dislikeCountResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        let favListResponse, isLikeResponse, isDislikeResponse;
        if (token) {
            [ favListResponse, isLikeResponse, isDislikeResponse ] = await Promise.all([
                fetch(`${url}/marv-chars/fav-list/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
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
            ])

            if (!favListResponse.ok || !isLikeResponse.ok || !isDislikeResponse.ok) {
                throw new Error('Failed to fetch personal data');
            }
        }

        let favList, isLike, isDislike;
        if (favListResponse && isLikeResponse && isDislikeResponse) {
            favList = await favListResponse.json();
            isLike = await isLikeResponse.json();
            isDislike = await isDislikeResponse.json();
        }
        const charData = await charResponse.json();
        const likeCount = await likeCountResponse.json();
        const dislikeCount = await dislikeCountResponse.json();

        return {
            props: {
                initialCharData: charData,
                initialFavList: favList ? favList : [],
                initialLikeCount: likeCount,
                initialDislikeCount: dislikeCount,
                initialIsLike: isLike ? isLike : false,
                initialIsDislike: isDislike ? isDislike : false,
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
