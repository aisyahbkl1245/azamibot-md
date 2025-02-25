import { promises } from 'fs'
import { join } from 'path'
import fs from 'fs'

function ranNumb(min, max = null) {
	if (max !== null) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		return Math.floor(Math.random() * min) + 1
	}
}

function padLead(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
}

let tagstextpro = {
	'search': 'Make Text Effect',
}
const defaultMenu = {
	before: `
━ ━ *[ 🎨 Text Pro Me ]* ━ ━
`.trimStart(),
	header: '╭─「 %category 」',
	body: '│ • %cmd',
	footer: '╰────\n',
}
let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
	try {
		let nais = fs.readFileSync('./media/textpro.jpg')
		let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
		let menutextpro = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
			return {
				menutextpro: Array.isArray(plugin.tagstextpro) ? plugin.menutextpro : [plugin.menutextpro],
				tagstextpro: Array.isArray(plugin.tagstextpro) ? plugin.tagstextpro : [plugin.tagstextpro],
				prefix: 'customPrefix' in plugin,
				enabled: !plugin.disabled,
			}
		})
		for (let plugin of menutextpro)
			if (plugin && 'tagstextpro' in plugin)
				for (let tag of plugin.tagstextpro)
					if (!(tag in tagstextpro) && tag) tagstextpro[tag] = tag
		conn.textpromenu = conn.textpromenu ? conn.textpromenu : {}
		let before = conn.textpromenu.before || defaultMenu.before
		let header = conn.textpromenu.header || defaultMenu.header
		let body = conn.textpromenu.body || defaultMenu.body
		let footer = conn.textpromenu.footer || defaultMenu.footer
		let _text = [
			before,
			...Object.keys(tagstextpro).map(tag => {
				return header.replace(/%category/g, tagstextpro[tag]) + '\n' + [
					...menutextpro.filter(textpromenu => textpromenu.tagstextpro && textpromenu.tagstextpro.includes(tag) && textpromenu.menutextpro).map(textpromenu => {
						return textpromenu.menutextpro.map(menutextpro => {
							return body.replace(/%cmd/g, textpromenu.prefix ? menutextpro : '%p' + menutextpro)
								.trim()
						}).join('\n')
					}),
					footer
				].join('\n')
			})
		].join('\n')
		let text = typeof conn.textpromenu == 'string' ? conn.textpromenu : typeof conn.textpromenu == 'object' ? _text : ''
		let replace = {
			p: _p,
			'%': '%',
			readmore: readMore
		}
		text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
		const pp = await conn.profilePictureUrl(conn.user.jid).catch(_ => './src/avatar_contact.png')
		/*conn.sendHydrated(m.chat, text.replace(`summer <text>`, `summer <text>${readMore}`).trim(), packname + ' - ' + author, nais, 'https://cutt.ly/azamilaifuu', 'Minimalist ツ Sweet', null, null, [
			['Premium', '/premium'],
			['Speed', '/ping'],
			['Owner', '/owner']
		], m)*/
		conn.sendButton(m.chat, text.replace(`summer <text>`, `summer <text>${readMore}`).trim(), packname + ' - ' + author, nais, [
			[`👥 Owner`, `.owner`],
			[`🪡 Ping`, `.ping`]
		], m)
	} catch (e) {
		conn.reply(m.chat, 'Maaf, menutextpro sedang error', m)
		throw e
	}
}
handler.help = ['menutextpro']
handler.tags = ['submenu']
handler.command = /^(textprom(enu)?|m(enu)?textpro)$/i

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)