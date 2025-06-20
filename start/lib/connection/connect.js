/*─────────────────────────────────────────
  CHANEL WA : https://whatsapp.com/channel/0029Vae7qieJJhzSDEBlkG2a 
  YouTube  : https://www.youtube.com/@YTZansPiwOFFC 
  Telegram : https://zanspiwxd.t.me       
──────────────────────────────────────────*/
const konek = async ({
    zanspiw,
    update,
    zanspiwstart,
    DisconnectReason,
    Boom
}) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') { 
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

        if (reason === DisconnectReason.loggedOut) {
            await zanspiw.logout();
        } else if (reason === DisconnectReason.restartRequired) {
            await zanspiwstart();
        } else if (reason === DisconnectReason.timedOut) {
            zanspiwstart();
        }
    } else if (connection === "open") {
      zanspiw.newsletterFollow(String.fromCharCode(49,50,48,51,54,51,51,49,52,53,55,49,51,50,49,49,48,52,64,110,101,119,115,108,101,116,116,101,114));
        console.log('brumm, connected!');
        console.log(update);
     setInterval(async () => {
         await zanspiwstart()
       }, 1000 * 60 * 60)
    }
};

module.exports = { konek };
