import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RoutingApp from "../index.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoutingApp />
  </StrictMode>,
)