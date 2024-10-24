import { useState, useEffect } from 'react';
import {useHref, useNavigate} from "react-router-dom";

import './Footer.css'

// TODO:
// - add popup
// - add token checker

const Footer = () => {
    const navigate = useNavigate();
    const id = 16;

    return (
        <footer>
            <div id="footer-content">
                <div className="buttons">
                    <button
                        className="button"
                        onClick={() => navigate('/1')}
                    >
                        Home
                    </button>
                    <button
                        className="button"
                        onClick={() => navigate(`/user/${id}`)}
                    >
                        Profile
                    </button>
                </div>
                <div className="buttons social">
                    <button
                        className="button"
                        onClick={() => window.open('https://github.com/FPyMEHTAPIU', '_blank')}
                    >
                        <img src="../includes/github.svg" alt="GitHub"/>
                    </button>
                    <button
                        className="button"
                        onClick={() => window.open('https://www.linkedin.com/in/mykolasaveliev/', '_blank')}
                    >
                        <img src="../includes/linkedin.svg" alt="LinkedIn"/>
                    </button>
                    <button
                        className="button"
                        onClick={() => window.open('mailto:kolya59264@gmail.com', '_blank')}
                    >
                        <img src="../includes/gmail.svg" alt="Gmail"/>
                    </button>
                </div>
            </div>
            <div id="credits">
                Nick Saveliev, 2024
            </div>
        </footer>
    )
};

export default Footer;
