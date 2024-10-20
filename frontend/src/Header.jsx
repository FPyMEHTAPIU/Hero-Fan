import { useState, useEffect } from 'react';

const Header = () => {
    const [isWindowShown, setIsWindowShown] = useState(false);

    const openPopup = () => {
        setIsWindowShown(true);
    }

    const closePopup = () => {
        setIsWindowShown(false);
    }

    return (
        <header>
            <div id="logo">
                <img src="includes/HERO%20FAN.svg"/>
            </div>
            <div id="search">
                <img src="includes/Search Type=Default.svg"/>
            </div>
            <button id="userblock" onClick={openPopup}>
                <img src="includes/User%20Default_Cover.svg" className="avatar"/>
                <p className="username">Log in</p>
            </button>
        </header>
    )

};

export default Header;
