import { useState, useEffect } from 'react';
import './App.css'

const App = () => {
    const [marvList, setMarvList] = useState([]);

    // TODO:
    // replace isClicked by isInFavorites and check it from DB
    const ToggleButton = () => {
        const [isClicked, setIsClicked] = useState(false);

        const handleClickStar = () => {
            const token = localStorage.getItem('token');

            if (!token) {

            }
            setIsClicked(!isClicked);
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
                console.log(data);
                setMarvList(data);
            })
            .catch((error) => console.error('Error fetching characters', error));
    };

    const renderItems = (marvList) => {
        const heroList = marvList.map((character) => (
            <div className="hero" key={character.id}>
                <a href={character.charPage}>
                    <img src={character.image} alt={character.name} className="hero-image" />
                </a>
                <ToggleButton />
                <div className="char-name">
                    <p className="char-name">{character.name}</p>
                </div>
            </div>
        ));
        return (
            <main>
                <h1>Choose your hero!</h1>
                <h2>Page 1</h2>
                <div className="heroes">{heroList}</div>
                <div className="pagination">
                    <a href="" className="page-button page-button-left"><img src="includes/Left_arrow.svg"/></a>
                    <div className="divider"></div>
                    <a href="" className="page-button">1</a>
                    <div className="divider"></div>
                    <a href="" className="page-button">2</a>
                    <div className="divider"></div>
                    <a href="" className="page-button">3</a>
                    <div className="divider"></div>
                    <a href="" className="page-button">4</a>
                    <div className="divider"></div>
                    <a href="" className="page-button">5</a>
                    <div className="divider"></div>
                    <a href="" className="page-button page-button-right"><img src="includes/Right_arrow.svg"/></a>
                </div>
            </main>
        );
    };

    return renderItems(marvList);
};

export default App;
