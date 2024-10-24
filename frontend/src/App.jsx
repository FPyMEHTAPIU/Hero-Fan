import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import { getToken, checkToken} from "./Auth.js";
import Popup from "./Popup.jsx";
import usePopup from "./UsePopup.jsx";
import Pagination from "./Pagination.jsx";
import UserPage from "./Userpage.jsx";
import Header from "./Header.jsx";
import CharacterPage from "./CharacterPage.jsx";
import renderItems from "./RenderItems.jsx";
import fetchFavorites from "./FetchFavorites.js";

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

    useEffect(() => {
        checkToken();
        refreshList();
        fetchFavorites(setFavList);
    }, [token]);

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

    return (
        <main>
            <h1>Choose your hero!</h1>
            <h2>Page {currentPage}</h2>
            <div className="heroes">
                {renderItems(
                    currentCharacters,
                    favList,
                    setFavList,
                    openPopup,
                    navigate
                )}
            </div>
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
