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

const allowedPattern = /^[a-zA-Z0-9_@$%!^&*]+$/;

const Popup = ({
                   winType, onChange, onClose,
                   password, setPassword, confirmPassword, setConfirmPassword
               }) => {
    const [login, setLogin] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    const handleBeforeInput = (e, setMessage) => {
        const char = e.data;

        if (char && !allowedPattern.test(char)) {
            setMessage('Only allowed characters: a-z, A-Z, 0-9, _@$%!^&*');
            e.preventDefault();
        } else {
            setMessage('');
        }
    };

    return createPortal(
        <div className="popup-overlay">
            <div className="popup">
                <h2>{winType}</h2>
                <button className="cross-button" onClick={onClose}>
                    <img src="../includes/cross.svg" alt="Close" />
                </button>
                <div className="popup-content">
                    <p className="input-name">Login</p>
                    <input
                        id="login-field"
                        name="login input"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        onBeforeInput={(e) => handleBeforeInput(e, setLoginMessage)}
                    />
                    {loginMessage && <p id="login-message" style={{ color: 'red' }}>{loginMessage}</p>}

                    <p className="input-name">Password</p>
                    <input
                        id="password-field"
                        name="password input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBeforeInput={(e) => handleBeforeInput(e, setLoginMessage)}
                    />

                    {winType === 'Register' && (
                        <>
                            <p className="input-name">Confirm Password</p>
                            <input
                                id="confirm-field"
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBeforeInput={(e) => handleBeforeInput(e, setLoginMessage)}
                            />
                        </>
                    )}
                </div>

                <button className="switch" onClick={onChange}>
                    <p>Don't have an account? Create a new one!</p>
                </button>
                <button className="confirm-button">{winType}</button>
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
