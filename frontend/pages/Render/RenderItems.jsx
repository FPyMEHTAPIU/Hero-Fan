import ToggleButton from "../FavoritesHandling/ToggleButton.jsx";

const renderItems = (currentCharacters, favList, setFavList, openPopup, router ) => {


    return currentCharacters.map((character) => (
        <button
            className="hero" key={character.id}
            onClick={() => router.push(`/character/${character.id}`)}
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
        </button>
    ));
};

export default renderItems;