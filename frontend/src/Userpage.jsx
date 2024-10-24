import {useNavigate, useParams} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getToken, checkToken } from "./Auth.js";
import fetchFavorites from "./FetchFavorites.js";
import usePopup from "./UsePopup.jsx";
import renderItems from "./RenderItems.jsx";

import './App.css'
import './Userpage.css'
import Popup from "./Popup.jsx";

const UserPage = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(getToken());
    const navigate = useNavigate();
    const [favList, setFavList] = useState([]);
    const [marvList, setMarvList] = useState([]);
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
        const fetchUserData = async () => {
            await checkToken();
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
                // console.log (data);
                setUserData(data);
                fetchFavorites(setFavList);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Error fetching user data');
                setLoading(false);
            }
        };

        fetchUserData();
        fetchFavorites(setFavList);

        console.log(favList);

    }, [id]);

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
                console.log(response);
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
        checkToken();
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>No user data found</div>;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(getToken());
        navigate('/1');
    }

    return (
        <main>
            <div id="user-line">
                <div id="user-icon">
                    <img src="../includes/User%20Default_Cover.svg" alt="userPhoto"/>
                </div>
                <div id="user-data">
                    <div id="login-block">
                        {userData[0].login}
                        <button
                            id="change-login"

                        >
                            <img src="../includes/Edit.svg" alt="Change Username"/>
                        </button>
                    </div>
                    <div id="password-block">
                        <button
                            id="change-password"

                        >
                            Change password
                            <img src="../includes/Password%20Arrow.svg" alt="Change Password"/>
                        </button>
                    </div>
                </div>
                <button
                    id="logout"
                    onClick={handleLogout}
                >
                    Logout
                    <img src="../includes/Log%20out.svg" alt="Log out"/>
                </button>
            </div>
            <div id="favorites">
                Favorite heroes
                <div id="heroes-user">
                    {renderItems(
                        marvList,
                        favList,
                        setFavList,
                        openPopup,
                        navigate
                    )}
                </div>
                <button
                    id="show-more-user"
                >
                    Show More
                    <img src="../includes/Down_arrow.svg" alt="Show More"/>
                </button>
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