import ToggleButton from "../FavoritesHandling/ToggleButton.jsx";
import {getServerSideProps} from "../сharacter/[id].jsx";
import Link from "next/link.js";

const renderItems = (currentCharacters, favList, setFavList, openPopup, router) => {
    const handleCharacterClick = async (id) => {
        router.push(`/character/${id}`);
    };


    return currentCharacters.map((character) => (
        <Link
            className="hero" key={character.id}
            href={`/character/${character.id}`}
        >
            <img src={character.image} alt={character.name} className="hero-image"/>

            <ToggleButton
                characterName={character.name}
                favList={favList}
                setFavList={setFavList}
                onClick={(e) => e.stopPropagation()}
                openPopup={openPopup}
            />
            <div className="char-name">
                <p className="char-name">{character.name}</p>
            </div>
        </Link>
    ));
};

export default renderItems;