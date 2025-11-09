import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BoardContext from './component/DashBoard_files/contextContent/BoardContext.jsx'
import { CartProvider } from './component/UI/website/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BoardContext>
      <CartProvider>
      <App />
      </CartProvider>
    </BoardContext>
  </StrictMode>,
)
