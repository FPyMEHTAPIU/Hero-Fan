import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {getToken, checkToken } from "@/components/Utils/Auth.js";
import handleBeforeInput from "@/components/Utils/InputCheck.js";
import Cookies from "js-cookie";

const Popup = ({
                   winType, onChange, onClose,
                   password, setPassword, confirmPassword, setConfirmPassword
               }) => {
    const [login, setLogin] = useState('');
    const [loginError, setLoginError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const url = process.env.NEXT_PUBLIC_API_URL;

    const attemptLogin = async (username, password, setErrorMessage) => {
        try {
            const loginResponse = await fetch(`${url}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: username,
                    password: password
                })
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok && loginData.token) {
                Cookies.set('token', loginData.token, { expires: 1 });
                Cookies.set('login', username, { expires: 1 });

                window.location.href = '/1';
            } else {
                setErrorMessage(loginData.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during login process:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    const handleRegister = async () => {
        await registerUser(login, password);
    };

    const registerUser = async (username, password) => {
        try {
            const registerResponse = await fetch(`${url}/new-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: username,
                    password: password
                })
            });

            if (registerResponse.status === 409) {
                throw new Error('That username already exists. Please try another one!');
            }
            else if (registerResponse.ok) {
                setSuccessMessage("You've successfully created your account! Redirecting to the Home page...");
                setTimeout(() => {
                    setSuccessMessage('');
                    onClose();
                }, 3000);
            } else {
                setErrorMessage('Registration error. Please try again.');
            }
        } catch (error) {
            console.log(error);
            if (error.toString().includes('That username already exists. Please try another one!')) {
                console.error(error);
                setErrorMessage('That username already exists. Please try another one!');
            }
            else {
                console.error(error);
                setErrorMessage('An error occurred. Please try again later.');
            }
        }
    };

    const handleLogin = async () => {
        await attemptLogin(login, password, setErrorMessage);
    };

    const changeLogin = async () => {
        const token = await checkToken();
        const userId = token.id;

        try {
            const response = await fetch(`${url}/marv-users/login/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: login,
                    password: password
                })
            });

            if (!response.ok) {
                setErrorMessage('Failed to update username!');
                throw new Error('Failed to update username!');
            }
            console.log('successfully');
            Cookies.remove('login');
            Cookies.set('login', login, { expires: 1 });
            onChange();
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeLogin = async () => {
         await changeLogin();
    };

    const changePassword = async () => {
        const token = await checkToken();
        const userId = token.id;

        try {
            const response = await fetch(`${url}/marv-users/password/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: login,
                    newPassword: password
                })
            });

            if (!response.ok) {
                setErrorMessage('Failed to update password!');
                throw new Error('Failed to update password!');
            }
            console.log('successfully');
            onChange();
            onClose();
        } catch (error) {
            console.error(error);
        }
    }

    const handleChangePassword = async () => {
        await changePassword();
    }

    return createPortal(
        <div className="popup-overlay">
            <h2 id="popup-header">{winType}</h2>
            <div className="popup">
                <button className="cross-button" onClick={onClose}>
                    <img src="/Cross.svg" alt="Close"/>
                </button>
                <div className="popup-content">
                    <div className="input-div">
                        {winType === 'Change login' ? <p className="input-name">New Username</p> :
                            (winType === 'Change password' ?
                                <p className="input-name">Old Password</p> :
                                <p className="input-name">Username</p>)
                        }
                        <input
                            id="login-field"
                            name="login input"
                            value={login}
                            onChange={(e) => {
                                setLogin(e.target.value);
                                setErrorMessage('');
                            }}
                            onBeforeInput={(e) => handleBeforeInput(e, setLoginError)}
                            type={winType === 'Change password' ? 'password' : 'text'}
                        />
                        {loginError && <p id="login-message" className="error-message">{loginError}</p>}
                    </div>
                    <div className="input-div">
                        <p className="input-name">Password</p>
                        <input
                            id="password-field"
                            name="password input"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrorMessage('');
                            }}
                        />
                    </div>
                    {(winType === 'Register' || winType === 'Change password') && (
                        <>
                            <div className="input-div">
                                <p className="input-name">Confirm Password</p>
                                <input
                                    id="confirm-field"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setErrorMessage('');
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>

                {winType === 'Log in' || winType === 'Register' ?
                    <button id="switch" onClick={onChange}>
                        <p>{winType === 'Log in'
                            ? 'Don\'t have an account? Create the new one!'
                            : 'Already have an account? Go to the log in page!'}
                        </p>
                    </button>
                    : <></>
                }
                {errorMessage && <div className="big-message error-message">{errorMessage}</div>}
                {successMessage && <div className="big-message success-message">{successMessage}</div>}
                <button
                    className="confirm-button"
                    onClick={() => {
                        if (winType === 'Log in') {
                            handleLogin();
                        } else if (winType === 'Register') {
                            if (password !== confirmPassword)
                                setErrorMessage('Passwords don\'t match');
                            else
                                handleRegister();
                        } else if (winType === 'Change login') {
                            handleChangeLogin();
                        } else if (winType === 'Change password') {
                            if (login === password) {
                                setErrorMessage('New and old passwords are equal!');
                            }
                            else if (password !== confirmPassword)
                                setErrorMessage('New passwords don\'t match');
                            else
                                handleChangePassword();
                    }}
                    }
                >
                    {winType}
                </button>
            </div>
        </div>,
        document.body
    );
};

export default Popup;