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
                <img src="../includes/HERO%20FAN.svg" alt="Logo" />
            </div>
            <div id="search">
                <img src="../includes/Search Type=Default.svg" alt="Search" />
            </div>
            <button id="userblock" onClick={openPopup}>
                <img src="../includes/User%20Default_Cover.svg" className="avatar" alt="User Avatar" />
                <p className="username">Log in</p>
            </button>
            {isWindowShown && <Popup
                winType={windowType} onChange={changeWindowType} onClose={closePopup}
                password={password} setPassword={setPassword}
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            />}
        </header>
    );
};

const Popup = ({ winType, onChange, onClose,
               password, setPassword, confirmPassword, setConfirmPassword }) => {
    return ( createPortal(
    <div className="popup-overlay">
        <div className="popup">
            <h2>{winType}</h2>
            <button className="cross-button" onClick={onClose}>
                <img src="../includes/cross.svg" alt="Close"/>
            </button>
            <div className="popup-content">
                <p className="input-name">Login</p>
                <input name="login input"/>
                <p className="input-name">Password</p>
                <input
                    name="password input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {winType === 'Register' && (
                    <>
                        <p className="input-name">Confirm Password</p>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </>
                )}
            </div>
            <button className="switch" onClick={onChange}>
                <p>Don't have an account? Create the new one!</p>
            </button>
            <button className="confirm-button">{winType}</button>
        </div>
    </div>, document.body)
    );
};

export default Header;
