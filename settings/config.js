
/*─────────────────────────────────────────
  new   
  
  POWERED BY ZANSPIW
  https://www.youtube.com/@YTZansPiwOFFC
  UPDATE?👇
  https://whatsapp.com/
  channel/0029Vae7qieJJhzSDEBlkG2a
  
  //SCRIPT FREE DILARANG DI JUAL
  
──────────────────────────────────────────*/

const fs = require('fs')
//============[ GROUP AND SALURAN]=============\\
global.linkch = "https://whatsapp.com/channel/0029Vae7qieJJhzSDEBlkG2a"
global.idch = '120363211868027307@newsletter'
//============[ BOT SETTING]=============\\
global.status = true
global.welcome = true
global.mess = {
    owner: "no, this is for owners only",
    group: "this is for groups only",
    private: "this is specifically for private chat"
}
//============[ PAYMENT SETTING]=============\\
global.dana = "0874928262829" // ISI NO DANA LU
global.ovo = "0874928262829" //ISI NO OVO LU
global.qris = "https://cdn.alands.xyz/files/683817b1963cd4572f75b5cc?&filename=1748506544899.jpeg" // ISI LINK TOURL QRIS
global.gopay = "0874928262829"
//============[ BOT SETTING]=============\\
global.pengembang = "6285850213046"
global.owner = ["6283849149928", "6283123405940", "6285850213046", "6283899858313"]
global.botname = "𝘋𝘖𝘕𝘎`𝘌𝘙 𝘔𝘜𝘓𝘛𝘐 𝘋𝘌𝘝𝘐𝘊𝘌"
global.packname = 'Zanspiw'
global.author = 'Hzanspiw woila'
global.pairing = "ZANSPIWW"
global.elevenlabs = "GET APIKEY elevenlabs.io"
//============[ SETTING CPANEL]=============\\
global.host = ""//isi domain
global.application = {
  api_key: "", //isi plta
  c_api_key: ""// isi pltc
}
global.eggs = '15' // id eggs yang dipakai kalo id nya 5 biarin aja ini jangan di ubah by telegram 
global.location = '1' // id location by telegram 
global.serverCreate = {
  nestId: "6", //Nest Id panel lu
    eggId: "16", //Egg Id panel lu
  limits: {
    db: "1", //Mending ga usah diganti
    backups: "1", //Mending ga usah diganti

    allocation: "0" //Mending ga usah diganti
  },
  eggs: {
    environment: {
      "CMD_RUN": "npm start", //Sesuaiin sama eggs lu
      "GIT_ADDRESS": "",
      "BRANCH": "",
      "USERNAME": "",
      "ACCESS_TOKEN": ""

    }

  }

}
//============[ SETTING CPANELV2]=============\\
global.host2 = ""//isi domain
global.application = {
  api_key2: "",//isi plta 
  c_api_key: ""//isi pltc

}
global.eggs = '15' // id eggs yang dipakai kalo id nya 5 biarin aja ini jangan di ubah by telegram 
global.location = '1' // id location by telegram 
global.serverCreate = {
  nestId: "6", //Nest Id panel lu
    eggId: "17", //Egg Id panel lu
  limits: {
    db: "1", //Mending ga usah diganti
    backups: "1", //Mending ga usah diganti

    allocation: "0" //Mending ga usah diganti
  },
  eggs: {
    environment: {
      "CMD_RUN": "npm start", //Sesuaiin sama eggs lu
      "GIT_ADDRESS": "",
      "BRANCH": "",
      "USERNAME": "",
      "ACCESS_TOKEN": ""

    }

  }

}
let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
