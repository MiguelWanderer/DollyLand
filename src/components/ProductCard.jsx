import React from 'react';

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  const handleOrder = () => {
    const message = `Hola Dollyland! Me interesa cotizar la figura: ${product.title}`;
    // Reemplaza con el número de WhatsApp de tu tía
    const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.title} style={styles.image} />
      <div style={styles.info}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.title}>{product.title}</h3>
        <p style={styles.description}>{product.description}</p>
        <p style={styles.price}>{formatPrice(product.price)}</p>
        <button onClick={handleOrder} style={styles.button}>
          Cotizar por WhatsApp
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'sans-serif'
  },
  image: {
    width: '100%',
    height: '280px',
    objectFit: 'cover'
  },
  info: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  category: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: '4px'
  },
  title: {
    fontSize: '18px',
    margin: '0 0 8px 0',
    color: '#333'
  },
  description: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 12px 0',
    lineHeight: '1.4'
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e91e63', // Un tono rosado/pastel característico de este rubro
    margin: 'auto 0 12px 0'
  },
  button: {
    backgroundColor: '#25D366', // Color corporativo de WhatsApp
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    textAlign: 'center'
  }
};