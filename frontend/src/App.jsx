import { useState, useEffect } from 'react';
import Popup from "./Popup.jsx";
import usePopup from "./UsePopup.jsx";
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import Pagination from "./Pagination.jsx";
import './App.css'

const App = () => {
    const [marvList, setMarvList] = useState([]);
    const charactersOnPage = 16;
    const navigate = useNavigate();
    const {page} = useParams();
    const currentPage = parseInt(page) || 1;

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

    const ToggleButton = ({characterName}) => {
        const [isClicked, setIsClicked] = useState(false);
        const token = localStorage.getItem('token');

        const handleClickStar = async () => {
            if (!token) {
                openPopup();
            } else {
                try {
                    const addToFavRes = await fetch('/api/marv-chars/fav', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            name: characterName
                        })
                    });
                    const response = await addToFavRes.json();
                    console.log(response);
                    setIsClicked(!isClicked);
                } catch (error) {
                    console.error('Error adding to favorites:', error);
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
        )
    }

    useEffect(() => {
        refreshList();
    }, []);

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
            <div className="hero" key={character.id}>
                <a href={character.charPage}>
                    <img src={character.image} alt={character.name} className="hero-image" />
                </a>
                <ToggleButton characterName={character.name} />
                <div className="char-name">
                    <p className="char-name">{character.name}</p>
                </div>
            </div>
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
            <Routes>
                <Route path="/:page" element={<App />} />
                <Route exact path="/" element={<App page="1" />} />
            </Routes>
        </Router>
    );
};

export default RoutingApp;
