import React, { useState, useEffect } from 'react';
import { checkToken, getToken } from '../Windows/Auth.js';

const ToggleButton = ({ characterName, favList, setFavList, onClick, openPopup, charPage }) => {
    const [isClicked, setIsClicked] = useState(false);
    const url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (favList)
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
            const response = await fetch(`${url}/marv-chars/fav`, {
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
                setFavList((prevFavList = []) => {
                    if (isClicked) {
                        return prevFavList.filter(fav => fav !== characterName);
                    } else {
                        return [...prevFavList, characterName];
                    }
                });
            } else {
                console.error('Failed to update favorites:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding/removing from favorites:', error);
        }
    };

    return (
        <div
            onClick={(e) => {
                if (onClick) onClick(e);
                handleClickStar(e);
            }}
            className={charPage ? 'star star-filled' :
                (isClicked ? 'star star-filled' : 'star')}
        >
            <img
                src={isClicked ? "/Star%20Filled.svg" : "/Star%20Empty.svg"}
                alt="Star icon"
            />
        </div>
    );
};

export default ToggleButton;
