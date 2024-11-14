import React, { useState, useEffect, useRef } from 'react';
import Popup from "../Popup/Popup.jsx";
import usePopup from "../Popup/usePopup.js";
import { getToken, checkToken } from "@/components/Utils/Auth.js";
import { useRouter } from "next/router";
import handleBeforeInput from "@/components/Utils/InputCheck.js";
import Cookies from "js-cookie";

const Header = () => {
    const [token, setToken] = useState(getToken());
    const [username, setUsername] = useState('Log in');
    const router = useRouter();
    const [charName, setCharName] = useState('');
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [isUserSelected, setUserSelected] = useState(false);
    const [isCharSelected, setCharSelected] = useState(true);
    const inputRef = useRef(null);

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
        const username = token ? Cookies.get('login') : 'Log in';
        setUsername(username);
    }

    useEffect(() => {
        handleChangeUsername();
    }, [token, router.asPath]);

    const openUserProfile = async () => {
        const newToken = await checkToken();
        if (!newToken) {
            await handleChangeUsername();
            return;
        }
        const userId = newToken.id;
        router.push(`/user/${userId}`);
    };

    const handeUserBlock = async () => {
        const newToken = getToken();
        if (newToken) {
            openUserProfile();
        } else {
            openPopup();
        }
    };

    const handleSearchClick = () => {
        setIsSearchClicked(true);
    };

    useEffect(() => {
        if (isSearchClicked && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchClicked]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!charName) return;

        if (isUserSelected && token) {
            router.push({
                pathname: `/search/${charName}`,
                query: { isUser: 'true' }
            });
        }

        else if (!isUserSelected) {
            router.push({
                pathname: `/search/${charName}`,
                query: { isUser: 'false' }
            });
        } else {
            openPopup();
        }
    };

    const handleClear = () => {
        setCharName('');
    }

    const chooseUser = () => {
        if (!isUserSelected) setCharSelected(false);
        else if (isUserSelected) setCharSelected(true);
        setUserSelected(!isUserSelected);
    }

    const chooseChar = () => {
        if (!isCharSelected) {
            setUserSelected(false);
            setCharSelected(true);
        }
        else setCharSelected(true);
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
                            >
                                <div id="search-back" style={{ marginRight: '0px' }}>
                                    <img src="/Search.svg" alt="Search" />
                                </div>
                            </button>
                            <div id="search-line">
                                <input
                                    id={charName.length === 0 ? "search-empty" : "search-typing"}
                                    ref={inputRef}
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