import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Popup from "../components/Popup/Popup.jsx";
import usePopup from "../components/Popup/usePopup.js";
import Pagination from "../components/Pagination/Pagination.js";
import renderItems from "../components/Render/RenderItems.js";
import fetchFavorites from "../components/FavoritesHandling/FetchFavorites.js";
import { getToken, checkToken } from "@/components/Utils/Auth";

const url = process.env.NEXT_PUBLIC_API_URL;

const Index = ({ initialCharacters }) => {
    const [marvList, setMarvList] = useState(initialCharacters || []);
    const [favList, setFavList] = useState([]);
    const [currentCharacters, setCurrentCharacters] = useState([]);
    const [isSortClicked, setIsSortClicked] = useState(false);
    const [ascOrder, setAscOrder] = useState(false);
    const charactersOnPage = 16;
    const router = useRouter();
    const currentPage = Number(router.query.index) || 1;

    const { isWindowShown, windowType, openPopup, closePopup } = usePopup();

    useEffect(() => {
        const verifyTokenAndFetchFavorites = async () => {
            const tokenData = await checkToken();
            if (tokenData) {
                await fetchFavorites(setFavList, tokenData.id);
            }
        };
        verifyTokenAndFetchFavorites();
    }, []);

    useEffect(() => {
        const lastCharIndex = currentPage * charactersOnPage;
        const firstCharIndex = lastCharIndex - charactersOnPage;
        setCurrentCharacters(marvList.slice(firstCharIndex, lastCharIndex));
    }, [marvList, currentPage, favList]);

    const handleChangeOrder = async () => {
        setAscOrder(!ascOrder);
        setIsSortClicked(true);
        await fetchOrderedCharacters();
    };

    const fetchOrderedCharacters = async () => {
        try {
            const response = await fetch(`${url}/marv-chars-db/sorted`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: ascOrder })
            });
            if (!response.ok) throw new Error('Failed to fetch ordered characters!');
            const data = await response.json();
            setMarvList(data);
        } catch (error) {
            console.error('Failed to fetch ordered characters!', error);
        }
    };

    const totalPages = Math.ceil(marvList.length / charactersOnPage);

    return (
        <main>
            <h1>Choose your hero!</h1>
            <h2>Page {currentPage}</h2>
            <button id="sort" onClick={handleChangeOrder}>
                {isSortClicked ? (ascOrder ? <p>Sort Z to A</p> : <p>Sort A to Z</p>) : <p>Sort A to Z</p>}
                <img src="/Sort.svg" alt="Sort"/>
            </button>
            <div className="heroes">
                {currentCharacters && renderItems(currentCharacters, favList, setFavList, openPopup, false)}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => router.push(`/${page}`)}
            />
            {isWindowShown && <Popup winType={windowType} onClose={closePopup} />}
        </main>
    );
};

export async function getServerSideProps(context) {
    const charactersOnPage = 16;
    const { index } = context.params;

    try {
        const res = await fetch(`${url}/marv-chars-db`);
        const initialCharacters = await res.json();
        const totalPages = Math.ceil(initialCharacters.length / charactersOnPage);
        if (index < 1 || index > totalPages) {
            return {
                notFound: true,
            }
        }
        return {
            props: {
                initialCharacters
            }
        };
    } catch (error) {
        console.error('Error fetching data in getServerSideProps:', error);
        return { props: { initialCharacters: [] } };
    }
}

export default Index;