const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] || character)

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderNumber, customer, items, total } = await request.json()
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const orderEmail = Deno.env.get('ORDER_EMAIL')
    const fromEmail = Deno.env.get('FROM_EMAIL')

    if (!resendApiKey || !orderEmail || !fromEmail) {
      throw new Error('Faltan secretos de correo en Supabase.')
    }

    const itemRows = items.map((item: { name: string; quantity: number; price: number }) => `<li>${escapeHtml(item.name)} x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-CL')}</li>`).join('')
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [orderEmail],
        reply_to: customer.email,
        subject: `Nuevo pedido ${orderNumber} - Dollyland`,
        html: `<h2>Nuevo pedido ${escapeHtml(orderNumber)}</h2><p><strong>Cliente:</strong> ${escapeHtml(customer.name)}</p><p><strong>Correo:</strong> ${escapeHtml(customer.email)}</p><p><strong>Teléfono:</strong> ${escapeHtml(customer.phone)}</p><h3>Muñecas solicitadas</h3><ul>${itemRows}</ul><p><strong>Total estimado:</strong> $${total.toLocaleString('es-CL')}</p><p><strong>Detalles de personalización:</strong><br />${escapeHtml(customer.details || 'Sin detalles adicionales')}</p>`,
      }),
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    return new Response(JSON.stringify({ sent: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Error al enviar correo' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
