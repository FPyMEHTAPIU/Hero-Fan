import { useState } from 'react';

const usePopup = () => {
    const [isWindowShown, setIsWindowShown] = useState(false);
    const [windowType, setWindowType] = useState('Log in');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const changeWindowType = () => {
        setWindowType(windowType === 'Log in' ? 'Register' : 'Log in');
    };

    const changeWindowTypeMan = (newType) => {
        setWindowType(newType);
    };

    const openPopup = () => {
        setIsWindowShown(true);
    };

    const closePopup = () => {
        setIsWindowShown(false);
    };

    return {
        isWindowShown,
        windowType,
        password,
        confirmPassword,
        setPassword,
        setConfirmPassword,
        changeWindowType,
        changeWindowTypeMan,
        openPopup,
        closePopup,
    };
};

export default usePopup;
