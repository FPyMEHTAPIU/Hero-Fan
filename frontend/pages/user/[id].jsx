import React, { useState, useEffect } from 'react';
import { getToken, checkToken } from "@/components/Utils/Auth.js";
import fetchFavorites from "../../components/FavoritesHandling/FetchFavorites.js";
import usePopup from "../../components/Popup/usePopup.js";
import renderItems from "../../components/Render/RenderItems.js";
import Popup from "../../components/Popup/Popup.jsx";
import {useRouter} from "next/router";
import Cookies from "js-cookie";

const url = process.env.NEXT_PUBLIC_API_URL;

const UserPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(getToken());
    const [favList, setFavList] = useState([]);
    const [personalFavList, setPersonalFavList] = useState([]);
    const [marvList, setMarvList] = useState([]);
    const [userId, setUserId] = useState(0);
    const [login, setLogin] = useState(() => {
        return Cookies.get('login') || null;
    });

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

            setLogin(Cookies.get('login'))
            console.log(login);

            if (!token) {
                router.push('/1');
                return;
            }
            try {
                const response = await fetch(`${url}/marv-users/${id}`, {
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
        console.log(favList);

    }, [id, personalFavList, login]);

    useEffect(() => {
        const fetchCharData = async (favList) => {
            await checkToken();
            if (!token) {
                router.push('/1');
                return;
            }
            try {
                if (favList.length === 0)
                    return;
                const response = await fetch(`${url}/marv-chars-db/fav`, {
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
        Cookies.remove('token');
        setToken(getToken());
        router.push('/1');
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
                        {userData && userData[0] && userData[0].login}
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
                        false
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

export async function getServerSideProps(context) {
    const { id } = context.params;

    try {
        const response = await fetch(`${url}/marv-users/${id}`);
        console.log(response)
        if (!response.ok) {
            return {
                notFound: true,
            }
        }
        const userData = await response.json();
        return { props: { userData: userData }};
    } catch (error) {
        console.error('Error fetching data in getServerSideProps:', error);
        return { props: { userData: [] } };
    }
}

export default UserPage;