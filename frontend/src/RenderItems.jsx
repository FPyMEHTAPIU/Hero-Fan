import ToggleButton from "./ToggleButton.jsx";

const renderItems = (currentCharacters, favList, setFavList, openPopup, navigate ) => {


    return currentCharacters.map((character) => (
        <button
            className="hero" key={character.id}
            onClick={() => navigate(`/character/${character.id}`)}
        >
            <img src={character.image} alt={character.name} className="hero-image"/>

            <ToggleButton
                characterName={character.name}
                favList={favList}
                setFavList={setFavList}
                onClick={(e) => e.stopPropagation()}
                openPopup={openPopup}
            />
            <div className="user-name">
                <p className="user-name">{character.name}</p>
            </div>
        </button>
    ));
};

export default renderItems;