import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import RoutingApp from "./App.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoutingApp />
    <Footer />
  </StrictMode>,
)
