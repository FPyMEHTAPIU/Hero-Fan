import React, { useEffect, useState } from 'react';
import renderItems from "../../components/Render/RenderItems.js";
import usePopup from "../../components/Windows/usePopup.js";
import Popup from "../../components/Windows/Popup.jsx";
import renderUsers from "../../components/Render/RenderUsers.js";
import { useRouter } from "next/router";

const Search = () => {
    const [marvList, setMarvList] = useState([]);
    const router = useRouter();
    const { name: charName } = router.query;
    const isUserSelected = router.query.isUser === 'true'
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
                console.error({ error: `Failed to search ${isUserSelected ? 'user' : 'hero'}!` });
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
                <div className="heroes" style={{ marginTop: "50px", marginBottom: "50px" }}>
                    {renderItems(marvList, openPopup, false)}
                </div>
                :
                <div id="user-block">
                    {renderUsers(marvList, router)}
                </div>
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
