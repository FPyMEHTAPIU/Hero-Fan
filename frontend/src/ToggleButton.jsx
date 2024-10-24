import React, { useState, useEffect } from 'react';
import { checkToken, getToken } from './Auth.js';
import usePopup from './UsePopup.jsx';

const ToggleButton = ({ characterName, favList, setFavList }) => {
    const token = getToken();
    const [isClicked, setIsClicked] = useState(false);
    const { openPopup } = usePopup();

    useEffect(() => {
        setIsClicked(favList.includes(characterName));
    }, [favList, characterName]);

    const handleClickStar = async () => {
        await checkToken();

        if (!token) {
            openPopup();
        } else {
            try {
                const response = await fetch('/api/marv-chars/fav', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: characterName
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    setFavList(prevFavList => {
                        if (isClicked) {
                            return prevFavList.filter(fav => fav !== characterName);
                        } else {
                            return [...prevFavList, characterName];
                        }
                    });
                }
            } catch (error) {
                console.error('Error adding/removing from favorites:', error);
            }
        }
    };

    return (
        <button
            onClick={handleClickStar}
            className={isClicked ? 'star-filled' : 'star'}
        >
            <img
                src={isClicked ? "../includes/Star%20Filled.svg" : "../includes/Star%20Empty.svg"}
                alt="Star icon"
            />
        </button>
    );
};

export default ToggleButton;