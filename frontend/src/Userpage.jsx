import React from "react";
import {useState, useEffect} from "react";
import './App.css'

// TODO: show user's id in URL like '/user/1'
const UserPage = () => {
    return (
        <main>
            <div id="user-line">
                <img src="../includes/userIcon.svg" alt="userPhoto" />
                <div id="user-data">
                    <div id="login-block">
                        <p>Username</p>
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