import React, { useState, useEffect } from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import renderItems from "./RenderItems.jsx";
import './App.css';
import usePopup from "./UsePopup.jsx";
import Popup from "./Popup.jsx";

const Search = () => {
    const [marvList, setMarvList] = useState([]);
    const { name: charName } = useParams();
    const location = useLocation();
    const [isUserSelected, setIsUserSelected] = useState(false);
    const [favList, setFavList] = useState([]);
    const navigate = useNavigate();

    const {
        isWindowShown,
        windowType,
        password,
        confirmPassword,
        setPassword,
        setConfirmPassword,
        changeWindowType,
        changeWindowTypeMan,
        openPopup,
        closePopup
    } = usePopup();

    useEffect(() => {
        if (location.pathname.includes("/search/user")) {
            setIsUserSelected(true);
        } else {
            setIsUserSelected(false);
        }

        const searchData = async () => {
            try {
                const response = await fetch(`/api/search/${charName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        isUser: isUserSelected
                    })
                });

                const data = await response.json();
                setMarvList(data);
                console.log(data);
                if (!response.ok) {
                    throw new Error(`Failed to search ${isUserSelected ? 'user' : 'hero'}!`);
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (charName) {
            searchData();
        }
    }, [charName, isUserSelected, location.pathname]);

    return (
        <main>
            <h2>Searching results of: '{charName}'</h2>
            <div className="heroes">
                {renderItems(
                    marvList,
                    favList,
                    setFavList,
                    openPopup,
                    navigate
                )}
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
        </main>
    );
};

export default Search;
