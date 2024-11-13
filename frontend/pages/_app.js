import '../styles/Footer.css'
import '../styles/app.css';
import '../styles/Header.css';
import '../styles/characterPage.css'
import '../styles/CharsUsers.css'
import './user/Userpage.css'
import '../styles/Pagination.css'
import '../styles/Popup.css'

import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.js'
import Index from "@/pages/[index]";

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