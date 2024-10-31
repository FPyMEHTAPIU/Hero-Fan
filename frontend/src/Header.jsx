import React, { useState, useEffect } from 'react';
import Popup from "./Popup.jsx";
import usePopup from "./usePopup.js";
import { getToken, checkToken } from "./Auth.js";
import { useNavigate, useLocation } from "react-router-dom";
import handleBeforeInput from "./InputCheck.js";

import './Header.css';

const Header = () => {
    const [token, setToken] = useState(getToken());
    const [username, setUsername] = useState('Log in');
    const navigate = useNavigate();
    const location = useLocation();
    const [charName, setCharName] = useState('');
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [isUserSelected, setUserSelected] = useState(false);
    const [isCharSelected, setCharSelected] = useState(false);

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
            return;
        }

        const userId = newToken.id;
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
        setIsSearchClicked(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!charName) return;

        if (isUserSelected) {
            if (token) {
                navigate(`/search/user/${charName}`);
            } else {
                openPopup();
            }
        } else {
            navigate(`/search/char/${charName}`);
        }
    };

    const handleClear = () => {
        setCharName('');
    }

    const chooseUser = () => {
        if (!isUserSelected) setCharSelected(false);
        setUserSelected(!isUserSelected);
    }

    const chooseChar = () => {
        if (!isCharSelected) setUserSelected(false);
        setCharSelected(!isCharSelected);
    }

    return (
        <header>
            <a href="/1" id="logo">
                <img src="/HERO%20FAN.svg" alt="Logo" />
            </a>
            { !isSearchClicked &&
                <button
                    className="search"
                    onClick={handleSearchClick}
                >
                    <div id="search-back">
                        <img src="/Search.svg" alt="Search" />
                    </div>
                    <p className="username">Search</p>
                </button>
            }
            {isSearchClicked &&
                <>
                    <div id="main-search">
                        <div id="search-type">
                            <button
                                className={isUserSelected ? "chuser chuser-fill" : "chuser"}
                                onClick={chooseUser}
                            >
                                user
                            </button>
                            <button
                                className={isCharSelected ? "chuser chuser-fill" : "chuser"}
                                onClick={chooseChar}
                            >
                                hero
                            </button>
                        </div>
                        <form className="search blue-back" onSubmit={handleSearch}>
                            <button
                                className="search-button"
                                //onClick={handleSearch}
                            >
                                <div id="search-back" style={{ marginRight: '0px' }}>
                                    <img src="/Search.svg" alt="Search" />
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
                                <button id="clear-cross" type="button"
                                        onClick={charName.length > 0 ? handleClear : {}}
                                >
                                    <img
                                        src="/Cross.svg" alt="Clear"
                                        style={charName.length === 0 ? { visibility: 'hidden' } : { visibility: 'visible' }}
                                    />
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            }
            <button
                id="userblock"
                onClick={handeUserBlock}
            >
                <img src="/User%20Default_Cover.svg" className="avatar" alt="User Avatar" />
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

export default Header;
