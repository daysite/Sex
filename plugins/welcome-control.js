let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return conn.reply(m.chat, '> *📚 Solo grupos*', m)
  if (!isAdmin) return conn.reply(m.chat, '> *👑 Solo admins*', m)

  const action = (m.text || '').toLowerCase().split(' ')[1]
  const jid = m.chat

  try {
    const { setWelcomeState, isWelcomeEnabled } = await import('../lib/welcome.js')

    if (action === 'on') {
      setWelcomeState(jid, true)
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      return conn.reply(m.chat, '> ✅ *Welcome activado*', m)
    } 
    else if (action === 'off') {
      setWelcomeState(jid, false)
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return conn.reply(m.chat, '> ☑️ *Welcome desactivado*', m)
    }
    else if (action === 'status') {
      const status = isWelcomeEnabled(jid) ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
      return conn.reply(m.chat, `> 📊 *Estado:* ${status}`, m)
    }
    else {
      return conn.reply(m.chat, 
        `> *🏷 *Opciones:*\n` +
        `> • ${usedPrefix}welcome on\n` +
        `> • ${usedPrefix}welcome off\n` +
        `> • ${usedPrefix}welcome status`, 
      m)
    }
  } catch (error) {
    console.error('Error:', error)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    return conn.reply(m.chat, '> ❌ *Error al cargar welcome*', m)
  }
}

handler.help = ['welcome']
handler.tags = ['group']
handler.command = ['welcome']
handler.admin = true
handler.group = true

export default handler