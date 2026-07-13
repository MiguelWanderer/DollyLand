import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Nabvar';
import Home from './view/home';

// Componentes temporales (luego los moveremos a la carpeta views)
function Historia() {
  return <div style={{ padding: '40px', textAlign: 'center' }}><h2>Nuestra Historia</h2><p>Aquí contaremos cómo nació Dollyland...</p></div>;
}
function Catalogo() {
  return <div style={{ padding: '40px', textAlign: 'center' }}><h2>Catálogo Completo</h2><p>Aquí mostraremos todas las muñecas...</p></div>;
}
function Contacto() {
  return <div style={{ padding: '40px', textAlign: 'center' }}><h2>Contacto</h2><p>Formulario y redes sociales...</p></div>;
}

function Footer() {
  return (
    <footer style={{ backgroundColor: '#111', color: '#fff', textAlign: 'center', padding: '30px 20px', marginTop: 'auto' }}>
      <p>&copy; {new Date().getFullYear()} Dollyland. Hecho a mano con amor.</p>
    </footer>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* El Navbar siempre estará visible arriba */}
        <Navbar />
        
        {/* Aquí es donde cambia el contenido según el link que clickees */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </div>
        
        {/* El Footer siempre estará visible abajo */}
        <Footer />

      </div>
    </HashRouter>
  );
}