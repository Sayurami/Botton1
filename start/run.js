
/*─────────────────────────────────────────
  GitHub   : https://github.com/kiuur    
  YouTube  : https://youtube.com/@kyuurzy
  Rest API : https://laurine.site        
  Telegram : https://kyuucode.t.me       
──────────────────────────────────────────*/

console.clear();
console.log('starting...');
require('../settings/config');
process.on("uncaughtException", console.error);

const { 
    default: makeWASocket, 
    prepareWAMessageMedia, 
    removeAuthState,
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeInMemoryStore, 
    generateWAMessageFromContent, 
    generateWAMessageContent, 
    generateWAMessage,
    jidDecode, 
    proto, 
    delay,
    relayWAMessage, 
    getContentType, 
    generateMessageTag,
    getAggregateVotesInPollMessage, 
    downloadContentFromMessage, 
    fetchLatestWaWebVersion, 
    InteractiveMessage, 
    makeCacheableSignalKeyStore, 
    Browsers, 
    generateForwardMessageContent, 
    MessageRetryMap 
} = require("@whiskeysockets/baileys");

const pino = require('pino');
const FileType = require('file-type');
const readline = require("readline");
const fs = require('fs');
const crypto = require("crypto")
const path = require("path")

const {
    spawn, 
    exec,
    execSync 
   } = require('child_process');

const { Boom } = require('@hapi/boom');
const { color } = require('./lib/color');

const {
    smsg,
    sleep,
    getBuffer
} = require('./lib/myfunction');

const { 
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid,
    addExif
} = require('./lib/exif')

const { Low, JSONFile } = require("lowdb-node");
const { chain } = require("lodash");
const { mongoDB } = require("./lib/mongoDB.js");
const { data_set } = require("./lib/database.js");
const usePairingCode = true;

const question = (text) => {
    const rl = readline.createInterface({ 
        input: process.stdin, 
        output: process.stdout 
    });
    return new Promise((resolve) => {
        rl.question(text, resolve) 
    });
}
if (!(fs.existsSync("./database.json"))) {
    fs.writeFileSync("./database.json", '{}');
   }
global.db = new Low(new JSONFile(`database.json`))

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    chats: {},
    group: {},
    bot: {},
    users: {},
    game: {},
    ...(global.db.data || {})
  }
  global.db.chain = chain(global.db.data)
}

loadDatabase()
async function zanspiwstart() {
	const {
		state,
		saveCreds
	} = await useMultiFileAuthState(`./session`)
	const zanspiw = makeWASocket({
		printQRInTerminal: !usePairingCode,
		syncFullHistory: true,
		markOnlineOnConnect: true,
		connectTimeoutMs: 60000,
		defaultQueryTimeoutMs: 0,
		keepAliveIntervalMs: 10000,
		generateHighQualityLinkPreview: true,
		patchMessageBeforeSending: (message) => {
			const requiresPatch = !!(
				message.buttonsMessage ||
				message.templateMessage ||
				message.listMessage
			);
			if (requiresPatch) {
				message = {
					viewOnceMessage: {
						message: {
							messageContextInfo: {
								deviceListMetadataVersion: 2,
								deviceListMetadata: {},
							},
							...message,
						},
					},
				};
			}

			return message;
		},
		version: (await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json()).version,
		browser: ["Ubuntu", "Chrome", "20.0.04"],
		logger: pino({
			level: 'fatal'
		}),
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, pino().child({
				level: 'silent',
				stream: 'store'
			})),
		}
	});
    
    if (usePairingCode && !zanspiw.authState.creds.registered) {
        const phoneNumber = await question('please enter your WhatsApp number, starting with 62:\n');
        const code = await zanspiw.requestPairingCode(phoneNumber, global.pairing);
        console.log(`your pairing code: ${code}`);
    }
    

    const store = makeInMemoryStore({
        logger: pino().child({ 
            level: 'silent',
            stream: 'store' 
        }) 
    });
    
    store.bind(zanspiw.ev);
    
    zanspiw.ev.on("messages.upsert", async (chatUpdate, msg) => {
        try {
mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
if (!zanspiw.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
if (mek.key.id.startsWith('BAE5') || (mek.key.id.startsWith('3EB0') && mek.key.id.length == 22)) return
            const m = await smsg(zanspiw, mek, store)
  if (global.db.data) await global.db.write()
await data_set(m)
            if (m.key.id.startsWith("KyuuRzy")) return 
            require("./system")(zanspiw, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    });

    zanspiw.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };

    zanspiw.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = zanspiw.decodeJid(contact.id);
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            };
        }
    });

    zanspiw.public = global.status
    
    zanspiw.ev.on('connection.update', (update) => {
        const { konek } = require('./lib/connection/connect')
        konek({ zanspiw, update, zanspiwstart, DisconnectReason, Boom })
    })
    
    zanspiw.ev.on('group-participants.update', async (anu) => {
       let data = JSON.parse(fs.readFileSync("./start/lib/database/wel-left.json", "utf-8")) || { welcome: true, left: true }
            console.log(anu)
        let botNumber = await zanspiw.decodeJid(zanspiw.user.id)
        if (anu.participants.includes(botNumber)) return
        try {
            let metadata = await zanspiw.groupMetadata(anu.id)
            let namagc = metadata.subject
            let participants = anu.participants
            for (let num of participants) {
      
let dat = await fs.readFileSync('./start/lib/database/welcome.json', 'utf8');
let datJson = JSON.parse(dat);
let welcomeText = datJson.text
  .replace('#user', `@${num.split('@')[0]}`)
  .replace('#grub', metadata.subject)
  .replace('#total', participants.length)
  .replace('#author', `@${anu.author.split("@")[0]}`);

let dats = await fs.readFileSync('./start/lib/database/left.json', 'utf8');
let leftJson = JSON.parse(dats);
let leftText = leftJson.text
  .replace('#user', `@${num.split('@')[0]}`)
  .replace('#grub', metadata.subject)
  .replace('#total', participants.length)
  .replace('#author', `@${anu.author.split("@")[0]}`);

let check = anu.author !== num && anu.author.length > 1;
let tag = check ? [anu.author, num] : [num];

let ppuser;
try {
  ppuser = await zanspiw.profilePictureUrl(num, 'image');
} catch {
  ppuser = 'https://telegra.ph/file/de7c8230aff02d7bd1a93.jpg';
}

if (data.welcome && anu.action === 'add') {
  await zanspiw.sendMessage(anu.id, {
    text: welcomeText || `Selamat datang @${num.split("@")[0]}`,
    contextInfo: {
      mentionedJid: tag,
      externalAdReply: {
        thumbnailUrl: "https://pomf2.lain.la/f/ic51evmj.jpg",
        title: '© Welcome Message',
        body: '',
        renderLargerThumbnail: true,
        sourceUrl: global.linkch,
        mediaType: 1
      }
    }
  });
}

if (data.left && anu.action === 'remove') {
  await zanspiw.sendMessage(anu.id, {
    text: leftText || `Selamat tinggal @${num.split("@")[0]}`,
    contextInfo: {
      mentionedJid: tag,
      externalAdReply: {
        thumbnailUrl: "https://pomf2.lain.la/f/7afhwfrz.jpg",
        title: '© Leaving Message',
        body: '',
        renderLargerThumbnail: true,
        sourceUrl: global.linkch,
        mediaType: 1
      }
    }
  });
}

                 if (anu.action == "promote") {
                     zanspiw.sendMessage(anu.id, {
                         text: `@${anu.author.split("@")[0]} has made @${num.split("@")[0]} as admin of this group`, 
                         contextInfo: {
                             mentionedJid: [...tag],
                             externalAdReply: {
                                 thumbnailUrl: "https://pomf2.lain.la/f/ibiu2td5.jpg",
                                 title: '© Promote Message', 
                                 body: '',
                                 renderLargerThumbnail: true,
                                 sourceUrl: global.linkch,
                                 mediaType: 1
                             }
                         }
                     }
                 )
             }
                if (anu.action == "demote") {
                    zanspiw.sendMessage(anu.id, {
                        text: `@${anu.author.split("@")[0]} has removed @${num.split("@")[0]} as admin of this group`, 
                        contextInfo: {
                            mentionedJid: [...tag],
                            externalAdReply: { 
                                thumbnailUrl: "https://pomf2.lain.la/f/papz9tat.jpg",
                                title: '© Demote Message', 
                                body: '', 
                                renderLargerThumbnail: true,
                                sourceUrl: global.linkch,
                                mediaType: 1
                            }
                        }
                    })
                }
            } 
        } catch (err) {
            console.log(err)
        }
      
    }
)
    
    zanspiw.deleteMessage = async (chatId, key) => {
        try {
            await zanspiw.sendMessage(chatId, { delete: key });
            console.log(`Pesan dihapus: ${key.id}`);
        } catch (error) {
            console.error('Gagal menghapus pesan:', error);
        }
    };

    zanspiw.sendText = async (jid, text, quoted = '', options) => {
        zanspiw.sendMessage(jid, {
            text: text,
            ...options
        },{ quoted });
    }
    
    zanspiw.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])}
        return buffer
    }

    zanspiw.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? 
            path : /^data:.*?\/.*?;base64,/i.test(path) ?
            Buffer.from(path.split`, `[1], 'base64') : /^https?:\/\//.test(path) ?
            await (await getBuffer(path)) : fs.existsSync(path) ? 
            fs.readFileSync(path) : Buffer.alloc(0);
        
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options);
        } else {
            buffer = await addExif(buff);
        }
        
        await zanspiw.sendMessage(jid, { 
            sticker: { url: buffer }, 
            ...options }, { quoted });
        return buffer;
    };
    
    zanspiw.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || "";
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, "") : mime.split("/")[0];

        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        let type = await FileType.fromBuffer(buffer);
        let trueFileName = attachExtension ? filename + "." + type.ext : filename;
        await fs.writeFileSync(trueFileName, buffer);
        
        return trueFileName;
    };

    zanspiw.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? 
            path : /^data:.*?\/.*?;base64,/i.test(path) ?
            Buffer.from(path.split`, `[1], 'base64') : /^https?:\/\//.test(path) ?
            await (await getBuffer(path)) : fs.existsSync(path) ? 
            fs.readFileSync(path) : Buffer.alloc(0);

        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options);
        } else {
            buffer = await videoToWebp(buff);
        }

        await zanspiw.sendMessage(jid, {
            sticker: { url: buffer }, 
            ...options }, { quoted });
        return buffer;
    };

    zanspiw.albumMessage = async (jid, array, quoted) => {
        const album = generateWAMessageFromContent(jid, {
            messageContextInfo: {
                messageSecret: crypto.randomBytes(32),
            },
            
            albumMessage: {
                expectedImageCount: array.filter((a) => a.hasOwnProperty("image")).length,
                expectedVideoCount: array.filter((a) => a.hasOwnProperty("video")).length,
            },
        }, {
            userJid: zanspiw.user.jid,
            quoted,
            upload: zanspiw.waUploadToServer
        });

        await zanspiw.relayMessage(jid, album.message, {
            messageId: album.key.id,
        });

        for (let content of array) {
            const img = await generateWAMessage(jid, content, {
                upload: zanspiw.waUploadToServer,
            });

            img.message.messageContextInfo = {
                messageSecret: crypto.randomBytes(32),
                messageAssociation: {
                    associationType: 1,
                    parentMessageKey: album.key,
                },    
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast",
                forwardingScore: 99999,
                isForwarded: true,
                mentionedJid: [jid],
                starred: true,
                labels: ["Y", "Important"],
                isHighlighted: true,
                businessMessageForwardInfo: {
                    businessOwnerJid: jid,
                },
                dataSharingContext: {
                    showMmDisclosure: true,
                },
            };

            img.message.forwardedNewsletterMessageInfo = {
                newsletterJid: "0@newsletter",
                serverMessageId: 1,
                newsletterName: `WhatsApp`,
                contentType: 1,
                timestamp: new Date().toISOString(),
                senderName: "✧ Dittsans",
                content: "Text Message",
                priority: "high",
                status: "sent",
            };

            img.message.disappearingMode = {
                initiator: 3,
                trigger: 4,
                initiatorDeviceJid: jid,
                initiatedByExternalService: true,
                initiatedByUserDevice: true,
                initiatedBySystem: true,
                initiatedByServer: true,
                initiatedByAdmin: true,
                initiatedByUser: true,
                initiatedByApp: true,
                initiatedByBot: true,
                initiatedByMe: true,
            };

            await zanspiw.relayMessage(jid, img.message, {
                messageId: img.key.id,
                quoted: {
                    key: {
                        remoteJid: album.key.remoteJid,
                        id: album.key.id,
                        fromMe: true,
                        participant: zanspiw.user.jid,
                    },
                    message: album.message,
                },
            });
        }
        return album;
    };
    
    zanspiw.getFile = async (PATH, returnAsFilename) => {
        let res, filename
        const data = Buffer.isBuffer(PATH) ?
              PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ?
              Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ?
              await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ?
              (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? 
              PATH : Buffer.alloc(0)
        if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        const type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        
        if (data && returnAsFilename && !filename)(filename = path.join(__dirname, './start/tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
        return {
            res,
            filename,
            ...type,
            data,
            deleteFile() {
                return filename && fs.promises.unlink(filename)
            }
        }
    }
    
    zanspiw.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await zanspiw.getFile(path, true)
        let { res, data: file, filename: pathFile } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try {
                throw { json: JSON.parse(file.toString()) } 
            } catch (e) { if (e.json) throw e.json }
        }
        
        let opt = { filename }
        if (quoted) opt.quoted = quoted
        if (!type) options.asDocument = true
        let mtype = '', mimetype = type.mime, convert
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime)) (
            convert = await (ptt ? toPTT : toAudio)(file, type.ext),
            file = convert.data,
            pathFile = convert.filename,
            mtype = 'audio',
            mimetype = 'audio/ogg; codecs=opus'
        )
        else mtype = 'document'
        if (options.asDocument) mtype = 'document'
        let message = {
            ...options,
            caption,
            ptt,
            [mtype]: { url: pathFile },
            mimetype
        }
        let m
        try {
            m = await zanspiw.sendMessage(jid, message, {
                ...opt,
                ...options
            })
        } catch (e) {
            console.error(e)
            m = null
        } finally {
            if (!m) m = await zanspiw.sendMessage(jid, {
                ...message,
                [mtype]: file
            }, {
                ...opt,
                ...options 
            })
            return m
        }
    }
    
    zanspiw.sendStatusMention = async (content, jids = []) => {
        let users;
        for (let id of jids) {
            let userId = await zanspiw.groupMetadata(id);
            users = await userId.participants.map(u => zanspiw.decodeJid(u.id));
        };

        let message = await zanspiw.sendMessage(
            "status@broadcast", content, {
                backgroundColor: "#000000",
                font: Math.floor(Math.random() * 9),
                statusJidList: users,
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: {},
                        content: [
                            {
                                tag: "mentioned_users",
                                attrs: {},
                                content: jids.map((jid) => ({
                                    tag: "to",
                                    attrs: { jid },
                                    content: undefined,
                                })),
                            },
                        ],
                    },
                ],
            }
        );

        jids.forEach(id => {
            zanspiw.relayMessage(id, {
                groupStatusMentionMessage: {
                    message: {
                        protocolMessage: {
                            key: message.key,
                            type: 25,
                        },
                    },
                },
            },
            {
                userJid: zanspiw.user.jid,
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: { is_status_mention: "true" },
                        content: undefined,
                    },
                ],
            });
            delay(2500);
        });
        return message;
    };
    
    zanspiw.ev.on('creds.update', saveCreds);
    return zanspiw;
    
}

zanspiwstart()

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
