import {useNavigate, useParams} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getToken, checkToken } from "../../Windows/Auth.js";
import fetchFavorites from "../../FavoritesHandling/FetchFavorites.js";
import usePopup from "../../Windows/usePopup.js";
import renderItems from "../../Render/RenderItems.jsx";
import Popup from "../../Windows/Popup.jsx";

import '../Home/App.css'
import './Userpage.css'
import '../../Render/CharsUsers.css'

const UserPage = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(getToken());
    const navigate = useNavigate();
    const [favList, setFavList] = useState([]);
    const [personalFavList, setPersonalFavList] = useState([]);
    const [marvList, setMarvList] = useState([]);
    const [userId, setUserId] = useState(0);
    const [login, setLogin] = useState(localStorage.getItem('login'));

    const {
        isWindowShown,
        windowType,
        password,
        confirmPassword,
        setPassword,
        setConfirmPassword,
        changeWindowType,
        changeWindowTypeMan,
        openPopup,
        closePopup
    } = usePopup();

    useEffect(() => {
        const fetchUserData = async () => {
            await checkToken();
            setLogin(localStorage.getItem('login'));
            console.log(login);

            if (!token) {
                navigate('/1');
                return;
            }
            try {
                const response = await fetch(`/api/marv-users/${id}`, {
                    headers: {
                    'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data!');
                }
                const data = await response.json();
                setUserData(data);
                fetchFavorites(setFavList, id);
            } catch (error) {
                console.error(error);
                setError('Error fetching user data');
            }
        };

        fetchUserData();
        fetchFavorites(setFavList, id);

        console.log(favList);

    }, [id, personalFavList, login]);

    useEffect(() => {
        const fetchCharData = async (favList) => {
            await checkToken();
            if (!token) {
                navigate('/1');
                return;
            }
            try {
                if (favList.length === 0)
                    return;
                const response = await fetch('/api/marv-chars-db/fav', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        names: favList
                    })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch char data!');
                }
                const data = await response.json();
                setMarvList(data);
            } catch (error) {
                console.error(error);
                setError('Error fetching char data');
            }
        };

        fetchCharData(favList);
        console.log(marvList);
    }, [favList])

    useEffect(() => {
        const fetchData = async () => {
            const tokenData = await checkToken();
            const userId = tokenData.id;

            setUserId(userId);
            await fetchFavorites(setPersonalFavList, userId);
        };

        fetchData();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(getToken());
        navigate('/1');
    }

    const handleChangeLogin = async () => {
        if (userId != id) {
            console.error('You can only change your username!');
            return;
        }

        changeWindowTypeMan('Change login');
        openPopup();
    };

    const handleChangePassword = async () => {
        if (userId != id) {
            console.error('You can only change your password!');
            return;
        }

        changeWindowTypeMan('Change password');
        openPopup();
    }

    return (
        <main>
            <div id="user-line">
                <div id="user-icon">
                    <img src="/User%20Default_Cover.svg" alt="userPhoto"/>
                </div>
                <div id="user-data">
                    <div id="login-block">
                        {userData && userData[0].login}
                        {id == userId ?
                        <button
                            id="change-login"
                            onClick={handleChangeLogin}
                        >
                            <img src="/Edit.svg" alt="Change Username"/>
                        </button> : <></>}
                    </div>
                    {id == userId ?
                    <div id="password-block">
                        <button
                            id="change-password"
                            onClick={handleChangePassword}
                        >
                            Change password
                            <img src="/Password%20Arrow.svg" alt="Change Password"/>
                        </button>
                    </div> : <></>}
                </div>
                {id == userId ?
                <button
                    id="logout"
                    onClick={handleLogout}
                >
                    Log out
                    <img src="/Log%20out.svg" alt="Log out"/>
                </button> : <></>}
            </div>
            <div id="favorites">
                Favorite heroes
                <div id="heroes-user">
                    {renderItems(
                        marvList,
                        personalFavList,
                        setPersonalFavList,
                        openPopup,
                        navigate
                    )}
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

export default UserPage;