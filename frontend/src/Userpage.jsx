import { useParams } from 'react-router-dom';
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

    useEffect(() => {
        const fetchUserData = async () => {
            await checkToken();
            if (!token)
                return;
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
                <div id="user-data">
                    <img src="../includes/userIcon.svg" alt="userPhoto"/>
                    <div id="login-block">
                        <p>{userData[0].login}</p>
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
                            <p>Change password</p>
                            <img src="../includes/Right_arrow.svg" alt="Change Password"/>
                        </button>
                    </div>
                </div>
                <button
                    id="logout"
                >
                    Logout
                    <img src="../includes/Exit.svg" alt="Log out"/>
                </button>
            </div>
            <div id="favorites">
                <p>Favorite heroes</p>
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