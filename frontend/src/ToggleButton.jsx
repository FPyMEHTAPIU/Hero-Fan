import React, { useState, useEffect } from 'react';
import { checkToken, getToken } from './Auth.js';

const ToggleButton = ({ characterName, favList, setFavList, onClick, openPopup }) => {
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        setIsClicked(favList.includes(characterName));
    }, [favList, characterName]);

    const handleClickStar = async (e) => {
        e.stopPropagation();

        await checkToken();

        const currentToken = getToken();

        if (!currentToken) {
            openPopup();
            return;
        }

        try {
            const response = await fetch('/api/marv-chars/fav', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`,
                },
                body: JSON.stringify({
                    name: characterName
                })
            });

            if (response.ok) {
                setFavList(prevFavList => {
                    if (isClicked) {
                        return prevFavList.filter(fav => fav !== characterName);
                    } else {
                        return [...prevFavList, characterName];
                    }
                });
            } else {
                console.error('Failed to update favorites:', response.statusText); // Обработка ошибок
            }
        } catch (error) {
            console.error('Error adding/removing from favorites:', error);
        }
    };

    return (
        <button
            onClick={(e) => {
                if (onClick) onClick(e);
                handleClickStar(e);
            }}
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
