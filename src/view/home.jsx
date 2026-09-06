import React from 'react';
import ProductCard from '../components/ProductCard';
import { productsData } from '../data/products';

export default function Home() {
  return (
    <div style={styles.container}>
      {/* Banner de Anuncios */}
      <div style={styles.announcementBanner}>
        ✨ ¡APROVECHA EL ENVÍO GRATIS EN CHILE! 🇨🇱 ✨
      </div>

      {/* Header / Hero */}
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>Dollyland</h1>
        <p style={styles.heroSubtitle}>Muñecos y figuras personalizadas hechas con amor a mano</p>
      </header>

      {/* Grid de Productos */}
      <main style={styles.main}>
        <h2 style={styles.sectionTitle}>Nuestro Catálogo</h2>
        <div style={styles.grid}>
          {productsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fbcfe8', // Fondo sutil o neutro según el estilo visual deseado
    minHeight: '100vh',
    fontFamily: 'sans-serif'
  },
  announcementBanner: {
    backgroundColor: '#000',
    color: '#fff',
    textAlign: 'center',
    padding: '8px 0',
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  hero: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eaeaea'
  },
  heroTitle: {
    fontSize: '42px',
    margin: '0 0 10px 0',
    color: '#e91e63'
  },
  heroSubtitle: {
    fontSize: '16px',
    color: '#777',
    margin: 0
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '30px',
    color: '#333'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '30px'
  }
};