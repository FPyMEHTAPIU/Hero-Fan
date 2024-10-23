import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './Popup.css'

const allowedPattern = /^[a-zA-Z0-9_@$%!^&*]+$/;

const Popup = ({
                   winType, onChange, onClose,
                   password, setPassword, confirmPassword, setConfirmPassword
               }) => {
    const [login, setLogin] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleBeforeInput = (e, setMessage) => {
        const char = e.data;

        if (char && !allowedPattern.test(char)) {
            setMessage('Only allowed characters: a-z, A-Z, 0-9, _@$%!^&*');
            e.preventDefault();
        } else {
            setMessage('');
        }
    };

    const attemptLogin = async (username, password, setErrorMessage) => {
        try {
            const loginResponse = await fetch('/api/login', {
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
                localStorage.setItem('token', loginData.token);
                localStorage.setItem('login', username);

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
            const registerResponse = await fetch('/api/new-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: username,
                    password: password
                })
            });

            const responseData = await registerResponse.json();
            if (registerResponse.ok) {
                console.log('You\'ve successfully created your account!');
            } else {
                setErrorMessage('Registration error. Please try again.');
            }
        } catch (error) {
            console.error('Error during login process:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    const handleLogin = async () => {
        await attemptLogin(login, password, setErrorMessage);
    };

    return createPortal(
        <div className="popup-overlay">
            <h2 id="popup-header">{winType}</h2>
            <div className="popup">
                <button className="cross-button" onClick={onClose}>
                    <img src="../includes/Cross.svg" alt="Close"/>
                </button>
                <div className="popup-content">
                    <div className="input-div">
                        <p className="input-name">Username</p>
                        <input
                            id="login-field"
                            name="login input"
                            value={login}
                            onChange={(e) => {
                                setLogin(e.target.value);
                                setErrorMessage('');
                            }}
                            onBeforeInput={(e) => handleBeforeInput(e, setLoginError)}
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
                            onBeforeInput={(e) => handleBeforeInput(e, setPasswordError)}
                        />
                        {passwordError && <p id="password-message" className="error-message">{passwordError}</p>}
                    </div>

                    {winType === 'Register' && (
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
                                    onBeforeInput={(e) => handleBeforeInput(e, setConfirmPasswordError)}
                                />
                                {confirmPasswordError && (
                                    <p id="confirm-message" className="error-message">{confirmPasswordError}</p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <button id="switch" onClick={onChange}>
                    <p>{winType === 'Log in'
                        ? 'Don\'t have an account? Create the new one!'
                        : 'Already have an account? Go to the log in page!'}
                    </p>
                </button>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button
                    className="confirm-button"
                    onClick={() => {
                        if (winType === 'Log in') {
                            handleLogin();
                        } else {
                            handleRegister();
                        }
                    }}
                >{winType}
                </button>
            </div>
        </div>,
        document.body
    );
};

export default Popup;