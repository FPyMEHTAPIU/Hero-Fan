import { useState } from 'react';
import './Header.css';

const Header = () => {
    const [isWindowShown, setIsWindowShown] = useState(false);

    const openPopup = () => {
        setIsWindowShown(true);
    };

    const closePopup = () => {
        setIsWindowShown(false);
    };

    return (
        <header>
            <div id="logo">
                <img src="../includes/HERO%20FAN.svg" alt="Logo" />
            </div>
            <div id="search">
                <img src="../includes/Search Type=Default.svg" alt="Search" />
            </div>
            <button id="userblock" onClick={openPopup}>
                <img src="../includes/User%20Default_Cover.svg" className="avatar" alt="User Avatar" />
                <p className="username">Log in</p>
            </button>
            {isWindowShown && <Popup onClose={closePopup} />}
        </header>
    );
};

const Popup = ({ onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <h2>Sign in</h2>
                <button className="cross-button" onClick={onClose}>
                    <img src="../includes/cross.svg" alt="Close" />
                </button>
                <div className="popup-content">
                    <p className="input-name">Login</p>
                    <input name="login input" />
                    <p className="input-name">Password</p>
                    <input name="password input" />
                </div>
                <button className="confirm-button">Log in</button>
            </div>
        </div>
    );
};

export default Header;
