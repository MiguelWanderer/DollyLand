import { useState } from 'react'
import dollMatrona from './assets/dolly-matrona.jpeg'
import dollCollection from './assets/dolly-collection.jpeg'
import dollLaunch from './assets/dolly-launch.jpeg'
import './App.css'

const products = [
  { name: 'Matrona personalizada', price: '$48.900', type: 'Muñecas', tone: 'lilac', badge: 'Favorita', image: dollMatrona },
  { name: 'Dolly, a tu estilo', price: '$54.900', type: 'Ediciones especiales', tone: 'peach', badge: 'Nuevo', image: dollCollection },
  { name: 'Colección profesional', price: '$52.900', type: 'Muñecas', tone: 'butter', badge: 'Clásica', image: dollLaunch },
]

function App() {
  const [cart, setCart] = useState(0)
  const [activeCategory, setActiveCategory] = useState('Todo')
  const visibleProducts = activeCategory === 'Todo' ? products : products.filter((product) => product.type === activeCategory)

  return (
    <main>
      <div className="announcement">Envío a toda la región <span>·</span> Tu muñeca, tus detalles</div>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Dollyland inicio">dolly<span>land</span></a>
        <nav aria-label="Navegación principal"><a href="#coleccion">Colección</a><a href="#historia">Nuestra historia</a></nav>
        <button className="cart-button" type="button" aria-label={`Carrito con ${cart} productos`}>Carrito <span>{cart}</span></button>
      </header>

      <section className="hero-section" id="inicio">
        <div className="hero-copy"><p className="eyebrow">Muñecas hechas para parecerse a ti</p><h1>Una muñeca <em>única.</em><br />Como tú.</h1><p className="hero-description">Diseñamos muñecas personalizadas con rasgos, colores y detalles que cuentan tu historia.</p><a className="primary-button" href="#coleccion">Descubre las muñecas <span>↗</span></a></div>
          <div className="doll-portrait"><img src={dollMatrona} alt="Muñeca personalizada Matrona de Dollyland" /></div>
      </section>

      <section className="collection" id="coleccion"><div className="section-heading"><div><p className="eyebrow">Encuentra tu Dolly</p><h2>Detalles que la hacen <em>tuya.</em></h2></div><p>Cada muñeca se crea con cuidado para celebrar tu estilo y tu personalidad.</p></div><div className="category-tabs" role="tablist" aria-label="Categorías">{['Todo', 'Muñecas', 'Ediciones especiales'].map((category) => <button key={category} className={activeCategory === category ? 'active' : ''} type="button" onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.name}><div className={`product-image ${product.tone}`}><img src={product.image} alt={product.name} /><span className="product-badge">{product.badge}</span></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.type}</p></div><strong>{product.price}</strong></div><button className="add-button" type="button" onClick={() => setCart((current) => current + 1)}>Agregar al carrito <span>+</span></button></article>)}</div></section>

      <section className="story" id="historia"><div className="story-mark">DL</div><div><p className="eyebrow">Hecho especialmente para ti</p><h2>Una muñeca con alma de <em>recuerdo.</em></h2><p>En Dollyland creemos que una muñeca puede guardar una historia. Elegimos cada rasgo, color y acabado para crear una pieza tan especial como la persona que la recibe.</p><a className="text-link" href="#coleccion">Conoce Dollyland <span>↗</span></a></div><div className="stamp">Diseñada<br />con cariño</div></section>
      <footer><a className="wordmark" href="#inicio">dolly<span>land</span></a><p>Muñecas personalizadas para historias únicas.</p><p>© 2026 Dollyland</p></footer>
    </main>
  )
}

export default App
