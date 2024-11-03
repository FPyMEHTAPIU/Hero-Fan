import React, { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import renderItems from "../Render/RenderItems.jsx";
import usePopup from "../Windows/usePopup.js";
import Popup from "../Windows/Popup.jsx";
import renderUsers from "../Render/RenderUsers.jsx";
import {useRouter} from "next/router";
require('dotenv').config();

const Search = () => {
    const [marvList, setMarvList] = useState([]);
    const { name: charName } = useParams();
    const router = useRouter();
    const [isUserSelected, setIsUserSelected] = useState(false);
    const [favList, setFavList] = useState([]);
    const url = process.env.NEXT_PUBLIC_API_URL;

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
        if (router.asPath.includes("/search/user")) {
            setIsUserSelected(true);
        } else {
            setIsUserSelected(false);
        }

        const searchData = async () => {
            try {
                const response = await fetch(`${url}/search/${charName}`, {
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
    }, [charName, isUserSelected, router.asPath]);

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
                            router
                        )}
                    </div>
                </>
                :
                <>
                    <div id="user-block">
                        {renderUsers(
                            marvList,
                            router
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
