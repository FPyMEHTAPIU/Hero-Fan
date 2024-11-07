import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Popup from "../components/Windows/Popup.jsx";
import usePopup from "../components/Windows/usePopup.js";
import Pagination from "../components/Pagination/Pagination.js";
import renderItems from "../components/Render/RenderItems.js";
import fetchFavorites from "../components/FavoritesHandling/FetchFavorites.js";
import { getToken, checkToken } from "../components/Windows/Auth.js";

const url = process.env.NEXT_PUBLIC_API_URL;

const Index = ({ initialCharacters, initialFavList }) => {
    const [marvList, setMarvList] = useState(initialCharacters);
    const [favList, setFavList] = useState(initialFavList);
    const [currentCharacters, setCurrentCharacters] = useState([]);
    const [isSortClicked, setIsSortClicked] = useState(false);
    const [ascOrder, setAscOrder] = useState(false);
    const router = useRouter();
    const charactersOnPage = 16;

    const currentPage = Number(router.query.index) || 1;

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
        const fetchCharacters = async () => {
            const res = await fetch(`${url}/marv-chars-db`);
            const data = await res.json();
            setMarvList(data);
        };

        fetchCharacters();
    }, [currentPage]);

    useEffect(() => {
        const lastCharIndex = currentPage * charactersOnPage;
        const firstCharIndex = lastCharIndex - charactersOnPage;
        setCurrentCharacters(marvList.slice(firstCharIndex, lastCharIndex));
    }, [marvList, currentPage]);

    const fetchOrderedCharacters = async () => {
        try {
            const response = await fetch(`${url}/marv-chars-db/sorted`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order: ascOrder })
            });

            if (!response.ok) throw new Error('Failed to fetch ordered characters!');

            const data = await response.json();
            setMarvList(data);
        } catch (error) {
            console.error('Failed to fetch ordered characters!', error);
        }
    };

    const handleChangeOrder = () => {
        setAscOrder(!ascOrder);
        setIsSortClicked(true);
        fetchOrderedCharacters();
    };

    const totalPages = Math.ceil(marvList.length / charactersOnPage);

    return (
        <main>
            <h1>Choose your hero!</h1>
            <h2>Page {currentPage}</h2>
            <button
                id="sort"
                onClick={handleChangeOrder}
            >
                {isSortClicked ? (ascOrder ? <p>Sort Z to A</p> : <p>Sort A to Z</p>) : <p>Sort A to Z</p>}
                <img src="/Sort.svg" alt="Sort"/>
            </button>
            <div className="heroes">
                {currentCharacters && renderItems(
                    currentCharacters,
                    favList,
                    setFavList,
                    openPopup,
                    router
                )}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => router.push(`/${page}`)}
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

export async function getServerSideProps() {
    try {
        const res = await fetch(`${url}/marv-chars-db`);
        const initialCharacters = await res.json();

        const tokenData = await checkToken();
        let initialFavList = [];
        if (tokenData) {
            const userId = tokenData.id;
            initialFavList = await fetchFavorites(userId);
        }

        return {
            props: {
                initialCharacters,
                initialFavList
            }
        };
    } catch (error) {
        console.error('Error fetching data in getServerSideProps:', error);
        return { props: { initialCharacters: [], initialFavList: [] } };
    }
}

export default Index;