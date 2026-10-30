import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CatalogPage } from './pages/CatalogPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { CartPage } from './pages/CartPage';
import { LibraryPage } from './pages/LibraryPage';
import PlayPage from './pages/PlayPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App = () => (
  <BrowserRouter>
    <StoreProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/game/:id" element={<GameDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/play/:id" element={<PlayPage />} />
            <Route path="/inicio" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </StoreProvider>
  </BrowserRouter>
);

export default App;
