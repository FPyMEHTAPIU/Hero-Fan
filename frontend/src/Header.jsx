import React, { useState } from 'react';
import Popup from "./Popup.jsx";
import usePopup from "./UsePopup.jsx";
import './Header.css';

const Header = () => {
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

    return (
        <header>
            <a href="/1" id="logo">
                <img src="../includes/HERO%20FAN.svg" alt="Logo"/>
            </a>
            <div id="search">
                <img src="../includes/Search.svg" alt="Search"/>
                <p className="username">Search</p>
            </div>
            <button id="userblock" onClick={openPopup}>
                <img src="../includes/User%20Default_Cover.svg" className="avatar" alt="User Avatar"/>
                <p className="username">Log in</p>
            </button>

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

            <button id="DANGER" onClick={createByAPI}>
                <p>DANGER!!!</p>
            </button>
            <button id="UPDATER" onClick={updateByAPI}>
                <p>UPDATE DB!!!</p>
            </button>
        </header>
    );
};

const createByAPI = () => {
    fetch('/api/marv-chars-api')
        .then((response) => response.json())
        .catch((error) => console.error('Error fetching characters', error));
}

const updateByAPI = () => {
    fetch('/api/marv-update-chars-db')
        .then((response) => response.json())
        .catch((error) => console.error('Error fetching characters', error));
}

export default Header;
