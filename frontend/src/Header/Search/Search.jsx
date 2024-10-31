import React, { useState, useEffect } from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import renderItems from "../../Render/RenderItems.jsx";
import usePopup from "../../Windows/usePopup.js";
import Popup from "../../Windows/Popup.jsx";
import renderUsers from "../../Render/RenderUsers.jsx";

import '../../Pages/Home/App.css';

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
                if (!response.ok) {
                    throw new Error(`Failed to search ${isUserSelected ? 'user' : 'hero'}!`);
                }
            } catch (error) {
                console.error({error: `Failed to search ${isUserSelected ? 'user' : 'hero'}!`});
            }
        };

        if (charName) {
            searchData();
        }
    }, [charName, isUserSelected, location.pathname]);

    return (
        <main>
            <h2>Searching results of: '{charName}'</h2>
            {!isUserSelected ?
                <>
                    <div className="heroes" style={{marginTop: "50px", marginBottom: "50px"}}>
                        {renderItems(
                            marvList,
                            favList,
                            setFavList,
                            openPopup,
                            navigate
                        )}
                    </div>
                </>
                :
                <>
                    <div id="user-block">
                        {renderUsers(
                            marvList,
                            navigate
                        )}
                    </div>
                </>
            }
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
