import { useState } from 'react'
import dollMatrona from './assets/dolly-matrona.jpeg'
import dollCollection from './assets/dolly-collection.jpeg'
import dollLaunch from './assets/dolly-launch.jpeg'
import { supabase } from './lib/supabase'
import AdminPanel from './components/AdminPanel'
import './App.css'

const products = [
  { name: 'Matrona personalizada', price: 48900, type: 'Muñecas', tone: 'lilac', badge: 'Favorita', image: dollMatrona },
  { name: 'Dolly, a tu estilo', price: 54900, type: 'Ediciones especiales', tone: 'peach', badge: 'Nuevo', image: dollCollection },
  { name: 'Colección profesional', price: 52900, type: 'Muñecas', tone: 'butter', badge: 'Clásica', image: dollLaunch },
]

const formatPrice = (price) => `$${price.toLocaleString('es-CL')}`

function App() {
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('Todo')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [orderSent, setOrderSent] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', details: '' })
  const visibleProducts = activeCategory === 'Todo' ? products : products.filter((product) => product.type === activeCategory)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.name === product.name)
      if (existing) return current.map((item) => item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item)
      return [...current, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
    setOrderSent(false)
  }

  const changeQuantity = (name, amount) => {
    setCart((current) => current.flatMap((item) => {
      if (item.name !== name) return [item]
      const quantity = item.quantity + amount
      return quantity > 0 ? [{ ...item, quantity }] : []
    }))
  }

  const submitOrder = async (event) => {
    event.preventDefault()
    if (!supabase) {
      setOrderError('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para registrar pedidos.')
      return
    }
    const orderNumber = `DL-${crypto.randomUUID().split('-')[0].toUpperCase()}`
    const { data: orderId, error: orderErrorResponse } = await supabase.rpc('create_order', { p_order_number: orderNumber, p_customer_name: customer.name, p_customer_email: customer.email, p_customer_phone: customer.phone, p_personalization_details: customer.details || null, p_total: cartTotal, p_items: cart.map((item) => ({ product_name: item.name, unit_price: item.price, quantity: item.quantity })) })
    if (orderErrorResponse) {
      setOrderError(`No pudimos registrar el pedido: ${orderErrorResponse.message}`)
      return
    }
    const { error: emailError } = await supabase.functions.invoke('send-order-email', { body: { orderId, orderNumber, customer, items: cart, total: cartTotal } })
    if (emailError) {
      setOrderError(`Pedido guardado, pero no se pudo enviar el correo: ${emailError.message}`)
      return
    }
    setOrderSent(true)
    setOrderError('')
  }

  return (
    <main>
      <div className="announcement">Envío a toda la región <span>·</span> Tu muñeca, tus detalles</div>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Dollyland inicio">dolly<span>land</span></a>
        <nav aria-label="Navegación principal"><a href="#coleccion">Colección</a><a href="#historia">Nuestra historia</a></nav>
        <button className="cart-button" type="button" onClick={() => setIsCartOpen(true)} aria-label={`Carrito con ${cartCount} productos`}>Carrito <span>{cartCount}</span></button>
      </header>

      <section className="hero-section" id="inicio">
        <div className="hero-copy"><p className="eyebrow">Muñecas hechas para parecerse a ti</p><h1>Una muñeca <em>única.</em><br />Como tú.</h1><p className="hero-description">Diseñamos muñecas personalizadas con rasgos, colores y detalles que cuentan tu historia.</p><a className="primary-button" href="#coleccion">Descubre las muñecas <span>↗</span></a></div>
        <div className="doll-portrait"><img src={dollMatrona} alt="Muñeca personalizada Matrona de Dollyland" /></div>
      </section>

      <section className="collection" id="coleccion"><div className="section-heading"><div><p className="eyebrow">Encuentra tu Dolly</p><h2>Detalles que la hacen <em>tuya.</em></h2></div><p>Cada muñeca se crea con cuidado para celebrar tu estilo y tu personalidad.</p></div><div className="category-tabs" role="tablist" aria-label="Categorías">{['Todo', 'Muñecas', 'Ediciones especiales'].map((category) => <button key={category} className={activeCategory === category ? 'active' : ''} type="button" onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.name}><div className={`product-image ${product.tone}`}><img src={product.image} alt={product.name} /><span className="product-badge">{product.badge}</span></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.type}</p></div><strong>{formatPrice(product.price)}</strong></div><button className="add-button" type="button" onClick={() => addToCart(product)}>Agregar al carrito <span>+</span></button></article>)}</div></section>

      <section className="story" id="historia"><div className="story-mark">DL</div><div><p className="eyebrow">Hecho especialmente para ti</p><h2>Una muñeca con alma de <em>recuerdo.</em></h2><p>En Dollyland creemos que una muñeca puede guardar una historia. Elegimos cada rasgo, color y acabado para crear una pieza tan especial como la persona que la recibe.</p><a className="text-link" href="#coleccion">Conoce Dollyland <span>↗</span></a></div><div className="stamp">Diseñada<br />con cariño</div></section>
      <footer><a className="wordmark" href="#inicio">dolly<span>land</span></a><p>Muñecas personalizadas para historias únicas.</p><button className="admin-link" type="button" onClick={() => setIsAdminOpen(true)}>Panel de pedidos</button><p>© 2026 Dollyland</p></footer>

      {isCartOpen && <div className="cart-overlay" role="presentation" onClick={(event) => event.target === event.currentTarget && setIsCartOpen(false)}><aside className="cart-panel" aria-label="Carrito de compra"><button className="close-cart" type="button" onClick={() => setIsCartOpen(false)} aria-label="Cerrar carrito">×</button><p className="eyebrow">Tu selección</p><h2>Pedido <em>Dollyland.</em></h2>{cart.length === 0 && <p className="empty-cart">Aún no has seleccionado ninguna muñeca.</p>}{cart.length > 0 && <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.name}><img src={item.image} alt="" /><div><h3>{item.name}</h3><p>{formatPrice(item.price)}</p><div className="quantity"><button type="button" onClick={() => changeQuantity(item.name, -1)} aria-label={`Quitar una ${item.name}`}>−</button><span>{item.quantity}</span><button type="button" onClick={() => changeQuantity(item.name, 1)} aria-label={`Agregar otra ${item.name}`}>+</button></div></div></div>)}</div><div className="cart-total"><span>Total estimado</span><strong>{formatPrice(cartTotal)}</strong></div><form className="order-form" onSubmit={submitOrder}><label>Tu nombre<input required value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label><label>Correo electrónico<input required type="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label><label>Teléfono<input required type="tel" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label><label>¿Cómo quieres personalizarla?<textarea rows="3" value={customer.details} onChange={(event) => setCustomer({ ...customer, details: event.target.value })} placeholder="Colores, cabello, profesión o cualquier detalle especial" /></label><button className="primary-button order-button" type="submit">Enviar pedido por correo <span>↗</span></button></form>{orderError && <p className="order-error">{orderError}</p>}{orderSent && <p className="order-success">Pedido preparado. Se abrirá tu correo para enviarlo a Dollyland.</p>}</>}</aside></div>}
      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
    </main>
  )
}

export default App
