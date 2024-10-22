import { useState } from 'react';
import { createPortal } from 'react-dom';
import './Header.css';

const Header = () => {
    const [isWindowShown, setIsWindowShown] = useState(false);
    const [windowType, setWindowType] = useState('Log in');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const changeWindowType = () => {
        if (windowType === 'Log in') {
            setWindowType('Register');
        }
        else {
            setWindowType('Log in');
        }
    }

    const openPopup = () => {
        setIsWindowShown(true);
    };

    const closePopup = () => {
        setIsWindowShown(false);
    };

    return (
        <header>
            <div id="logo">
                <img src="../includes/HERO%20FAN.svg" alt="Logo"/>
            </div>
            <div id="search">
                <img src="../includes/Search Type=Default.svg" alt="Search"/>
            </div>
            <button id="userblock" onClick={openPopup}>
                <img src="../includes/User%20Default_Cover.svg" className="avatar" alt="User Avatar"/>
                <p className="username">Log in</p>
            </button>
            {isWindowShown && <Popup
                winType={windowType} onChange={changeWindowType} onClose={closePopup}
                password={password} setPassword={setPassword}
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            />}
            <button id="DANGER" onClick={createByAPI}>
                <p>DANGER!!!</p>
            </button>
            <button id="UPDATER" onClick={updateByAPI}>
                <p>UPDATE DB!!!</p>
            </button>
        </header>
    );
};

const allowedPattern = /^[a-zA-Z0-9_@$%!^&*]+$/; // Разрешённые символы

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
            const loginResponse = await fetch(`/api/login/${username}`);
            const loginData = await loginResponse.json();

            if (loginResponse.ok && loginData.length > 0) {
                const passwordResponse = await fetch('/api/password', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password })
                });

                if (passwordResponse.ok) {
                    console.log('Login successful!');
                } else {
                    setErrorMessage('Incorrect password. Please try again.');
                }
            } else {
                setErrorMessage('User does not exist. Please register first.');
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
            console.log(registerResponse)
            console.log(responseData)
            if (registerResponse.ok) {
                console.log('You\'ve successfully created your account!');
            } else {
                setErrorMessage('Registration error. Please try again.');
            }
        } catch (error) {
            console.error('Error during login process:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    }

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
                        <p className="input-name">Login</p>
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
                        {passwordError && <p id="password-message" style={{color: 'red'}}>{passwordError}</p>}
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
                                {confirmPasswordError &&
                                    <p id="confirm-message" style={{color: 'red'}}>{confirmPasswordError}</p>}
                            </div>
                        </>
                    )}
                </div>

                <button id="switch" onClick={onChange}>
                    <p>{winType === 'Log in' ?
                        'Don\'t have an account? Create the new one!' :
                        'Already have an account? Go to the log in page!'}
                    </p>
                </button>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button
                    className="confirm-button"
                    onClick={() => {
                        if (winType === 'Log in') {
                            handleLogin()
                        } else {
                            handleRegister()
                        }
                    }}
                >{winType}
                </button>
            </div>
        </div>, document.body
    );
};

const createByAPI = () => {
    fetch('/api/marv-chars-api')
        .then((response) => response.json())
        .catch((error) => console.error('Error fetching characters', error));
}

const updateByAPI = () => {
    fetch('/api/marv-update-chars-db')
        .then((response) => response.json())
        .catch((error) => console.error('Error fetching characters', error));
}

export default Header;
