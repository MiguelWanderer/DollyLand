import React from 'react';
import ProductCard from '../components/ProductCard';
import { productsData } from '../data/products';

export default function Catalogo() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Catálogo de Dollyland</h1>
        <p style={styles.subtitle}>
          Explora todas nuestras opciones. Cada figura es única y hecha a mano.
        </p>
      </header>

      {/* Aquí podríamos agregar filtros en el futuro (ej: "Ver solo Profesiones") */}
      
      <div style={styles.grid}>
        {productsData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'system-ui, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '36px',
    color: '#333',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    margin: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '30px'
  }
};