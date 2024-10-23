import {useNavigate, useParams} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css'
import './Userpage.css'
import { getToken, checkToken } from "./Auth.js";

// TODO: show user's id in URL like '/user/1'
const UserPage = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = getToken();
    const navigate = useNavigate();

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
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Error fetching user data');
                setLoading(false);
            }
        };

        fetchUserData();
        console.log(userData);
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>No user data found</div>;
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
                >
                    Logout
                    <img src="../includes/Log%20out.svg" alt="Log out"/>
                </button>
            </div>
            <div id="favorites">
                Favorite heroes
                <div className="heroes">

                </div>
                <button
                    id="show-more"
                >
                    Show More
                    <img src="../includes/Down_arrow.svg" alt="Show More"/>
                </button>
            </div>
        </main>
    )
}

export default UserPage;