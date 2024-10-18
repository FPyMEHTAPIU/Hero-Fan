import { useState, useEffect } from 'react'

const App = () => {
    const [marvList, setMarvList] = useState([])
    const [editingTodo, setEditingTodo] = useState(null)
    const [viewCompleted, setViewCompleted] = useState(false)
    const [editingText, setEditingText] = useState('')

    useEffect(() => {
        refreshList()
    }, [])

    const refreshList = () => {
        fetch(/marv-chars/)
            .then((response) => response.json())
            .then((data) => setMarvList(data))
            .catch((error) => console.error("Error fetching characters", error))
    }

    const renderItems = ({ items }) => {
        // fill each block from fetch by index and when reach and
        // add the last element into a block - fetch again incremented offset
        return (
        <div class="hero">
            <a src={items.charPage}><img src={items.image} class="hero"/></a>
            <button class="star">
                <img src="includes/Star%20Empty.svg"/>
            </button>
            <div class="char-name">
                <p class="char-name">Hulk</p>
            </div>
        </div>
        )
    }
    /*const fetchChars = async () => {
        try {
            const response = await fetch(/marv-chars/)
            const data = await response.json()
            console.log(data)
            return data
        } catch (error) {
            console.error("Error fetching characters", error)
        }
    }

    const displayChars = (chars) => {
        const container = document.getElementById('hero');
        container.innerHTML = '';

        chars.forEach(char => {
            const charDiv = document.createElement('div')
            charDiv.classList.add('hero')

            const charImage = document.createElement('img')
            charImage.src = char.image
            charDiv.appendChild(charImage)

            const charName = document.createElement('div')
            charName.classList.add('char-name')
            charName.textContent = char.name
            charDiv.appendChild(charName)

            container.appendChild(charDiv)
        })
    }

    const loadChars = async () => {
        const characters = fetchChars()
        displayChars(characters)
    }

    window.onload = loadChars*/
}

export default App
