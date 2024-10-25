import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RoutingApp from "./App.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoutingApp />
  </StrictMode>,
)
