import ToggleButton from "../FavoritesHandling/ToggleButton.jsx";
import Link from "next/link";

const renderItems = (currentCharacters, favList, setFavList, openPopup, router) => {
    return currentCharacters.map((character) => (
        <Link
            className="hero" key={character.id}
            href={`/character/${character.id}`}
            passHref
        >
            <div className="hero">
                <img src={character.image} alt={character.name} className="hero-image" />
                <ToggleButton
                    characterName={character.name}
                    favList={favList}
                    setFavList={setFavList}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    openPopup={openPopup}
                />
                <div className="char-name">
                    <p className="char-name">{character.name}</p>
                </div>
            </div>
        </Link>
    ));
};

export default renderItems;