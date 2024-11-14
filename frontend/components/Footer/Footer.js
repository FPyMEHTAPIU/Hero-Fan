import { useRouter } from "next/router";
import { getToken } from '@/components/Utils/Auth'
import usePopup from '@/components/Popup/usePopup'
import Popup from "@/components/Popup/Popup";
import React from "react";

const Footer = () => {
    const router = useRouter();
    const id = 16;
    const {
        isWindowShown,
        windowType,
        password,
        confirmPassword,
        setPassword,
        setConfirmPassword,
        changeWindowType,
        openPopup,
        closePopup
    } = usePopup();

    const handleProfileClick = () => {
        const token = getToken();
        if (token)
            router.push(`/user/${id}`)
        else
            openPopup();
    }

    return (
        <footer>
            <div id="footer-content">
                <div className="buttons">
                    <button
                        className="button"
                        onClick={() => router.push('/1')}
                    >
                        Home
                    </button>
                    <button
                        className="button"
                        onClick={handleProfileClick}
                    >
                        Profile
                    </button>
                </div>
                <div className="buttons social">
                    <button
                        className="button"
                        onClick={() => window.open('https://github.com/FPyMEHTAPIU', '_blank')}
                    >
                        <img src="/github.svg" alt="GitHub"/>
                    </button>
                    <button
                        className="button"
                        onClick={() => window.open('https://www.linkedin.com/in/mykolasaveliev/', '_blank')}
                    >
                        <img src="/linkedin.svg" alt="LinkedIn"/>
                    </button>
                    <button
                        className="button"
                        onClick={() => window.open('mailto:kolya59264@gmail.com', '_blank')}
                    >
                        <img src="/gmail.svg" alt="Gmail"/>
                    </button>
                </div>
            </div>
            <div id="credits">
                Nick Saveliev, 2024
            </div>

            {isWindowShown && (
                <Popup
                    winType={windowType}
                    onChange={changeWindowType}
                    onClose={closePopup}
                    password={password}
                    setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                />
            )}
        </footer>
    )
};

export default Footer;
