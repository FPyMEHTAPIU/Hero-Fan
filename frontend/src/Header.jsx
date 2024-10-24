import React, { useState, useEffect } from 'react';
import Popup from "./Popup.jsx";
import usePopup from "./UsePopup.jsx";
import { getToken, checkToken} from "./Auth.js";
import { useNavigate, useLocation } from "react-router-dom";
import handleBeforeInput from "./InputCheck.js";

import './Header.css';

const Header = () => {
    const [token, setToken] = useState(getToken());
    const [username, setUsername] = useState('Log in');
    const navigate = useNavigate();
    const location = useLocation();
    const [charName, setCharName] = useState('')
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [searchError, setSearchError] = useState('');

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

    const handleChangeUsername = async () => {
        const token = getToken();
        const username = token ? localStorage.getItem('login') : 'Log in';
        setUsername(username);
    }

    useEffect(() => {
        handleChangeUsername();
    }, [token, location]);

    const openUserProfile = async () => {
        const newToken = await checkToken();
        if (!newToken) {
            await handleChangeUsername();
            return ;
        }

        const userId = newToken.id;
        //console.log(userId);
        navigate(`/user/${userId}`);
    };

    const handeUserBlock = async () => {
        const newToken = getToken();

        if (newToken) {
            openUserProfile();
        }
        else {
            openPopup();
        }
    };

    const handleSearchClick = () => {
        setIsSearchClicked(true)
    };

    const search = async () => {

    }

    const handleSearch = async () => {
        await search();
    }

    return (
        <header>
            <a href="/1" id="logo">
                <img src="../includes/HERO%20FAN.svg" alt="Logo"/>
            </a>
            { !isSearchClicked &&
                <button
                    className="search"
                    onClick={handleSearchClick}
                >
                    <div id="search-back">
                        <img src="../includes/Search.svg" alt="Search"/>
                    </div>
                    <p className="username">Search</p>
                </button>
            }
            {isSearchClicked &&
                <div className="search blue-back">
                    <button
                        className="search-button"
                        onClick={handleSearch}
                    >
                        <div id="search-back" style={{ marginRight: '0px'}}>
                            <img src="../includes/Search.svg" alt="Search"/>
                        </div>
                    </button>
                    <div id="search-line">
                        <input
                            id={charName.length === 0 ? "search-empty" : "search-typing"}
                            name="search input"
                            value={charName}
                            onChange={(e) => {
                                setCharName(e.target.value);
                            }}
                            onBeforeInput={(e) => handleBeforeInput(e, setSearchError)}
                        />
                        <button id="clear-cross"
                                onClick={charName.length > 0 ? handleClear : {}}
                        >
                            <img
                                src="../includes/Cross.svg" alt="Clear"
                                style={charName.length === 0 ? {visibility: 'hidden'} : {visibility: 'visible'}}
                            />
                        </button>
                    </div>
                </div>}
            <button
                id="userblock"
                onClick={handeUserBlock}
            >
                <img src="../includes/User%20Default_Cover.svg" className="avatar" alt="User Avatar"/>
                <p className="username">{username}</p>
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
        </header>
    );
};

/*

<button id="DANGER" onClick={createByAPI}>
                <p>DANGER!!!</p>
            </button>
            <button id="UPDATER" onClick={updateByAPI}>
                <p>UPDATE DB!!!</p>
            </button>

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
*/


export default Header;
