import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './AdminPanel.css'

const formatPrice = (price) => `$${price.toLocaleString('es-CL')}`

function AdminPanel({ onClose }) {
  const [session, setSession] = useState(null)
  const [orders, setOrders] = useState([])
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    const loadOrders = async () => {
      setLoading(true)
      const { data, error: ordersError } = await supabase.from('orders').select('*, order_items(*)').neq('status', 'cancelled').order('created_at', { ascending: false })
      if (ordersError) setError(ordersError.message)
      else setOrders(data || [])
      setLoading(false)
    }
    loadOrders()
  }, [session])

  const signIn = async (event) => {
    event.preventDefault()
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword(credentials)
    if (signInError) setError('Correo o contraseña incorrectos.')
  }

  const updateStatus = async (orderId, status) => {
    const { error: updateError } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (updateError) setError(updateError.message)
    else {
      setOrders((current) => status === 'cancelled' ? current.filter((order) => order.id !== orderId) : current.map((order) => order.id === orderId ? { ...order, status } : order))
      setError('')
    }
  }

  return (
    <div className="admin-overlay" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="admin-panel" aria-label="Panel privado de pedidos">
        <button className="close-cart" type="button" onClick={onClose} aria-label="Cerrar panel">×</button>
        {!session ? <><p className="eyebrow">Acceso privado</p><h2>Pedidos <em>Dollyland.</em></h2><p className="admin-intro">Ingresa para consultar y gestionar las solicitudes de tus clientas.</p><form className="order-form" onSubmit={signIn}><label>Correo electrónico<input required type="email" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} /></label><label>Contraseña<input required type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} /></label><button className="primary-button order-button" type="submit">Iniciar sesión <span>↗</span></button></form></> : <><div className="admin-heading"><div><p className="eyebrow">Panel de control</p><h2>Tus <em>pedidos.</em></h2></div><button className="admin-logout" type="button" onClick={() => supabase.auth.signOut()}>Cerrar sesión</button></div>{error && <p className="order-error">{error}</p>}{loading && <p>Cargando pedidos...</p>}{!loading && orders.length === 0 && <p className="empty-cart">Todavía no hay pedidos registrados.</p>}<div className="orders-list">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-card-top"><div><strong>{order.order_number}</strong><p>{new Date(order.created_at).toLocaleString('es-CL')}</p></div><select value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)} aria-label={`Estado del pedido ${order.order_number}`}><option value="pending">Pendiente</option><option value="confirmed">Confirmado</option><option value="completed">Completado</option><option value="cancelled">Cancelado</option></select></div><h3>{order.customer_name}</h3><p>{order.customer_email} · {order.customer_phone}</p><ul>{order.order_items?.map((item) => <li key={item.id}>{item.product_name} × {item.quantity} <span>{formatPrice(item.unit_price * item.quantity)}</span></li>)}</ul><div className="order-card-bottom"><span>{order.personalization_details || 'Sin detalles adicionales'}</span><strong>{formatPrice(order.total)}</strong></div></article>)}</div></>}
      </section>
    </div>
  )
}

export default AdminPanel
