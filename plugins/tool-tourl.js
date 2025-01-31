import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	if (/image/g.test(mime) && !/webp/g.test(mime)) {
		try {
			let img = await q.download?.()
			let out = await uploadImage(img)
			m.reply(`[ LINK ]\n${out}`)
		} catch (e) {
			console.log(e)
			m.reply(`Terjadi kesalahan, coba lagi nanti.`)
		}
	} else {
		m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim`)
	}
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^(to(url|link))$/i

handler.limit = true

export default handler