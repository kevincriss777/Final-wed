import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Eventos from './pages/Eventos';
import Participantes from './pages/Participantes';
import Inscripciones from './pages/Inscripciones';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/"               element={<Dashboard />} />
              <Route path="/eventos"        element={<Eventos />} />
              <Route path="/eventos/nuevo"  element={<Eventos />} />
              <Route path="/participantes"  element={<Participantes />} />
              <Route path="/inscripciones"  element={<Inscripciones />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="mt-12 border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-800 flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo-uc.png"
                    alt="UC"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const p = (e.target as HTMLImageElement).parentElement;
                      if (p) p.innerHTML = '<span class="text-white font-black text-xs">UC</span>';
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Universidad Continental</p>
                  <p className="text-xs text-gray-500">Sistema de Gestión de Eventos Académicos</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} Universidad Continental. Todos los derechos reservados.</p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
