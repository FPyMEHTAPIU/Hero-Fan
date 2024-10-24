import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import { getToken, checkToken} from "./Auth.js";
import Popup from "./Popup.jsx";
import usePopup from "./UsePopup.jsx";
import Pagination from "./Pagination.jsx";
import UserPage from "./Userpage.jsx";
import Header from "./Header.jsx";
import CharacterPage from "./CharacterPage.jsx";

import './App.css';

const App = () => {
    const [marvList, setMarvList] = useState([]);
    const [favList, setFavList] = useState([]);
    const charactersOnPage = 16;
    const navigate = useNavigate();
    const { page } = useParams();
    const currentPage = parseInt(page) || 1;
    const token = getToken();

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

    const fetchFavorites = async () => {
        if (!token) return;

        try {
            const response = await fetch('/api/marv-chars/fav-list', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setFavList(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    useEffect(() => {
        checkToken();
        refreshList();
        fetchFavorites();
    }, [token]);

    const ToggleButton = ({ characterName }) => {
        const [isClicked, setIsClicked] = useState(false);

        useEffect(() => {
            setIsClicked(favList.includes(characterName));
        }, [favList, characterName]);

        const handleClickStar = async () => {
            await checkToken();

            if (!token) {
                openPopup();
            } else {
                try {
                    const response = await fetch('/api/marv-chars/fav', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            name: characterName
                        })
                    });

                    const result = await response.json();
                    if (response.ok) {
                        setFavList(prevFavList => {
                            if (isClicked) {
                                return prevFavList.filter(fav => fav !== characterName);
                            } else {
                                return [...prevFavList, characterName];
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error adding/removing from favorites:', error);
                }
            }
        };

        return (
            <button
                onClick={handleClickStar}
                className={isClicked ? 'star-filled' : 'star'}
            >
                <img
                    src={isClicked ? "../includes/Star%20Filled.svg" : "../includes/Star%20Empty.svg"}
                    alt="Star icon"
                />
            </button>
        );
    };

    const refreshList = () => {
        fetch('/api/marv-chars-db')
            .then((response) => response.json())
            .then((data) => {
                setMarvList(data);
            })
            .catch((error) => console.error('Error fetching characters', error));
    };

    const totalPages = Math.ceil(marvList.length / charactersOnPage);
    const lastCharIndex = currentPage * charactersOnPage;
    const firstCharIndex = lastCharIndex - charactersOnPage;
    const currentCharacters = marvList.slice(firstCharIndex, lastCharIndex);

    const renderItems = (currentCharacters) => {
        return currentCharacters.map((character) => (
            <button
                className="hero" key={character.id}
                onClick={() => navigate(`/character/${character.id}`)}
            >
                <img src={character.image} alt={character.name} className="hero-image"/>

                <ToggleButton characterName={character.name}/>
                <div className="char-name">
                    <p className="char-name">{character.name}</p>
                </div>
            </button>
        ));
    };

    return (
        <main>
            <h1>Choose your hero!</h1>
            <h2>Page {currentPage}</h2>
            <div className="heroes">{renderItems(currentCharacters)}</div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => navigate(`/${page}`)}
            />
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

const RoutingApp = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/:page" element={<App />} />
                <Route path="/user/:id" element={<UserPage />} />
                <Route path="/character/:id" element={<CharacterPage />} />
                <Route exact path="/" element={<App page="1" />} />
            </Routes>
        </Router>
    );
};
export default RoutingApp;
