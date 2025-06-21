/*this code created by alxzy*/
const data_set = async (m) => {
  let users = global.db.data.users
  let chats = global.db.data.chats
  let group = global.db.data.group
  let game = global.db.data.game
  try {
  if (users[m.sender]) {
    if (!("limit" in users[m.sender])) users[m.sender].limit = 1;
    if (!("exp" in users[m.sender])) users[m.sender].exp = 0;
    if (!("gold" in users[m.sender])) users[m.sender].gold = 0;
    if (!("lastclaim" in users[m.sender])) users[m.sender].lastclaim = -1
  } else {
    global.db.data.users[m.sender] = {
      limit: 1,
      exp: 0,
      gold: 0,
      lastclaim: -1
    }
  }
  if (!game) {
  game = {
    dungeon: {},
    tebak: {}
  }
  } else if (!game.dungeon) {
    game.dungeon = {}
  } else if (!game.tebak) {
    game.tebak = {}
  }
  if (!game.dungeon[m.sender]) {
    game.dungeon[m.sender] = {}
  }
if (!chats[m.chat]) {
  chats[m.chat] = {}; 
}

if (!("game" in chats[m.chat])) {
  chats[m.chat].game = true;
}

  } catch (error) {
    console.log(error)
  }
}
module.exports = { data_set }