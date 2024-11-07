import './Footer/Footer.css'
import './app/App.css';
import './Header/Header.css';
import './сharacter/CharacterPage.css'
import './Render/CharsUsers.css'
import './user/Userpage.css'
import './Pagination/Pagination.css'
import './Windows/Popup.css'

import Header from './Header/Header.jsx'
import Footer from './Footer/Footer.jsx'


function MyApp({ Component, pageProps }) {
    return (
        <>
            <Header />
            <Component {...pageProps} />
            <Footer />
        </>
    );
}

export default MyApp;