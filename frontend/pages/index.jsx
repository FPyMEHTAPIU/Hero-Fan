import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import { getToken, checkToken} from "./src/Windows/Auth.js";
import Popup from "./src/Windows/Popup.jsx";
import usePopup from "./src/Windows/usePopup.js";
import Pagination from "./src/Pagination/Pagination.jsx";
import UserPage from "./src/Pages/User/Userpage.jsx";
import Header from "./src/Header/Header.jsx";
import CharacterPage from "./src/Pages/Character/CharacterPage.jsx";
import renderItems from "./src/Render/RenderItems.jsx";
import fetchFavorites from "./src/FavoritesHandling/FetchFavorites.js";
import Footer from "./src/Footer/Footer.jsx";
import Search from "./src/Header/Search/Search.jsx";

const Index = () => {
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
                <Route path="/:page" element={<Index />} />
                <Route path="/user/:id" element={<UserPage />} />
                <Route path="/character/:id" element={<CharacterPage />} />
                <Route path="/search/char/:name" element={<Search />} />
                <Route path="/search/user/:name" element={<Search />} />
                <Route exact path="/" element={<Index page="1" />} />
            </Routes>
            <Footer />
        </Router>
    );
};
export default RoutingApp;
