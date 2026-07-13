import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <div style={styles.logo}>
          <Link to="/" style={styles.logoLink}>Dollyland</Link>
        </div>
        <ul style={styles.navLinks}>
          <li style={styles.navItem}><Link to="/" style={styles.link}>Inicio</Link></li>
          <li style={styles.navItem}><Link to="/historia" style={styles.link}>Historia</Link></li>
          <li style={styles.navItem}><Link to="/catalogo" style={styles.link}>Catálogo</Link></li>
          <li style={styles.navItem}><Link to="/contacto" style={styles.link}>Contacto</Link></li>
        </ul>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f0f0f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '15px 20px'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '0.5px'
  },
  logoLink: {
    color: '#e91e63',
    textDecoration: 'none',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
    padding: 0
  },
  navItem: {
    fontSize: '15px'
  },
  link: {
    color: '#555',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s'
  }
};