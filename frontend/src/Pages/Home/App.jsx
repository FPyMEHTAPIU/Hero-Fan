import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import { getToken, checkToken} from "../../Windows/Auth.js";
import Popup from "../../Windows/Popup.jsx";
import usePopup from "../../Windows/usePopup.js";
import Pagination from "../../Pagination/Pagination.jsx";
import UserPage from "../User/Userpage.jsx";
import Header from "../../Header/Header.jsx";
import CharacterPage from "../Character/CharacterPage.jsx";
import renderItems from "../../Render/RenderItems.jsx";
import fetchFavorites from "../../FavoritesHandling/FetchFavorites.js";
import Footer from "../../Footer/Footer.jsx";
import Search from "../../Header/Search/Search.jsx";

import './App.css';
import '../../Render/CharsUsers.css'

const App = () => {
    const [marvList, setMarvList] = useState([]);
    const [favList, setFavList] = useState([]);
    const charactersOnPage = 16;
    const navigate = useNavigate();
    const { page } = useParams();
    const currentPage = parseInt(page) || 1;
    const token = getToken();
    const [isSortClicked, setIsSortClicked] = useState(false);
    const [ascOrder, setAscOrder] = useState(false);

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
        const fetchData = async () => {
            await refreshList();

            const tokenData = await checkToken();
            if (tokenData)
            {
                const id = tokenData.id;
                await fetchFavorites(setFavList, id);
            }
        };

        fetchData();
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
    const [currentCharacters, setCurrentCharacters] = useState([]);

    const fetchOrderedCharacters = async () => {
        try {
            const response = await fetch(`/api/marv-chars-db/sorted`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order: ascOrder
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch ordered characters!');
            }
            const data = await response.json();
            setMarvList(data);
        } catch (error) {
            console.error({error: 'Failed to fetch ordered characters!'});
        }
    };

    const handleChangeOrder = () => {
        setAscOrder(!ascOrder);
        setIsSortClicked(true);
        fetchOrderedCharacters();
    };

    useEffect(() => {
        setCurrentCharacters(marvList.slice(firstCharIndex, lastCharIndex));
    }, [marvList, currentPage]);

    return (
        <main>
            <h1>Choose your hero!</h1>
            <h2>Page {currentPage}</h2>
            <button
                id="sort"
                onClick={handleChangeOrder}
            >
                {isSortClicked ?
                    (ascOrder ? <p>Sort Z to A</p> : <p>Sort A to Z</p>)
                    : <p>Sort A to Z</p>
                }
                <img src="/Sort.svg" alt="Sort"/>
            </button>
            <div className="heroes">
                {currentCharacters && renderItems(
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
                <Route path="/search/char/:name" element={<Search />} />
                <Route path="/search/user/:name" element={<Search />} />
                <Route exact path="/" element={<App page="1" />} />
            </Routes>
            <Footer />
        </Router>
    );
};
export default RoutingApp;