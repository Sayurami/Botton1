  const listitem = [
  "sword", "bow", "medkit", "tong", "ikan",
  "wizard-staff", "super-medkit", "sampah"
];
const weapon = ["sword", "bow", "wizard-staff"]
const monsterData = {
  kerangka: { damage: 10, damager: [10, 20, 30, 10, 10], health: 50, s: true },
  kerangka_wizard: { damage: 40, damager: [40, 30, 40, 50, 60], health: 40, s: true },
  bos_elite: { damage: 100, damager: [100, 120, 150, 130, 140], health: 500, s: true, item_value: [1000, 5000] },
  bos_super_elite: { damage: 150, damager: [150, 180, 200, 190, 210], health: 800, s: true, item_value: [3000, 7000] },
  tidak_ada: { s: false }
};

async function createLobby(users, name) {
  if (global.db.data.game.dungeon[users]?.lobby) return "Kamu sudah ada lobby";
  global.db.data.game.dungeon[users].lobby = {
    profile: { nama: name, exp: global.db.data.users[users].exp, gold: global.db.data.users[users].gold },
    keepinventory: {}
  };
  return "Berhasil membuat lobby";
}

async function mulai(users) {
  if (!global.db.data.game.dungeon[users]?.lobby) return "Kamu belum buat lobby";
  if (global.db.data.game.dungeon[users]?.starts) return "Kamu sudah ada di dalam dungeon";
  
  global.db.data.game.dungeon[users].starts = true;
  global.db.data.game.dungeon[users].inventory = global.db.data.game.dungeon[users].inventory || { gold: 1000, medkit: 5 };
  global.db.data.game.dungeon[users].base = global.db.data.game.dungeon[users].base || { damage: [20, 30, 40, 10, 10], health: 100, kill: 0, stamina: 50, recoveryhealth: 30 };
  global.db.data.game.dungeon[users].monster = { nama: "", damage: 0, health: 0, item: "" };
  return "Kamu telah masuk ke dalam dungeon...";
}

async function cariItem(users) {
  if (!global.db.data.game.dungeon[users]?.lobby) return "Kamu belum membuat sebuah lobby, ketik .dungeon-create-profile nama";
  if (!global.db.data.game.dungeon[users]?.starts) return "Kamu belum pergi ke dungeon";
  
  let monster = getMonster();
  let tt = monsterData[monster];
  let item = pickRandom(listitem);
  let enemy = tt.s;
  
  if (enemy) {
    global.db.data.game.dungeon[users].monster = { ...tt, nama: monster, item };
    return `Ada monster di depan! Monster: ${monster}, Item: ${item}`;
  }
  
  global.db.data.game.dungeon[users].inventory[item] = (global.db.data.game.dungeon[users].inventory[item] || 0) + pickRandom([1, 2, 3, 4, 5]);
  return `Kamu mendapatkan ${item}, cek inventory dengan .inventory`;
}
  async function defense(users) {
    if (!global.db.data.game.dungeon[users].starts) return "kamu belum.memulai dungeon"
    if (!global.db.data.game.dungeon[users].monster) return "tidak ada monster, tidak ada alasan untuk lari dan mencuri item"
    if (global.db.data.game.dungeon[users].base.health < global.db.data.game.dungeon[users].monster.damage) return "darah kamu sangat sedikit di saran kan untuk memakai medkit terlebih dahulu"
    let item = global.db.data.game.dungeon[users].monster.item
    delete global.db.data.game.dungeon[users].monster 
    if (!(item in global.db.data.game.dungeon[users].inventory )) global.db.data.game.dungeon[users].inventory[item] = pickRandom([1,2,3,4,5]);
   global.db.data.game.dungeon[users].inventory[item] += pickRandom([1,2,3,4,5]); 
    return "kamu lari dari monster dan kamu berhasil mencuri " + item 
  }
  async function run(users) {
    if (!global.db.data.game.dungeon[users].starts) return "kamu belum.memulai dungeon"
    if (!global.db.data.game.dungeon[users].monster) return "tidak ada monster, tidak ada alasan untuk lari"
    
    delete global.db.data.game.dungeon[users].monster 
  
    return "kamu lari dari monster"
  }
async function attack(users) {
  if (!global.db.data.game.dungeon[users]?.starts) return "Kamu belum berada di dungeon.";
  let player = global.db.data.game.dungeon[users].base;
  let monster = global.db.data.game.dungeon[users].monster;
  
  if (!monster.nama) return "Tidak ada monster untuk diserang.";
  
  let playerDamage = pickRandom(player.damage);
  let monsterDamage = pickRandom(monster.damager);
  
  monster.health -= playerDamage;
  player.health -= monsterDamage;
  
  if (monster.health <= 0) {
    player.kill += 1;
    global.db.data.game.dungeon[users].monster = { nama: "", damage: 0, health: 0, item: "" };
    return `Kamu berhasil mengalahkan ${monster.nama}!`;
  }
  
  if (player.health <= 0) {
    delete global.db.data.game.dungeon[users];
    return "Kamu telah dikalahkan dan keluar dari dungeon.";
  }
  
  return `Kamu menyerang ${monster.nama} dengan ${playerDamage} damage! Monster menyerang balik dengan ${monsterDamage} damage.`;
}
  async function inventory(users) {
    if (!global.db.data.game.dungeon[users].lobby) return "kamu belum buat lobby ketik .dungeon-create-profile"
    if (!global.db.data.game.dungeon[users].inventory) return "kamu tidak ada item sama sekali"
    return global.db.data.game.dungeon[users].inventory
  }
async function lobby (users) {
  if (!global.db.data.game.dungeon[users].lobby) return "kamu belum punya lobby ketik .dungeon-create-profile"
  return global.db.data.game.dungeon[users].lobby
}
async function saveitem(users) {
  if (!global.db.data.game.dungeon[users].lobby) return "kamu belum punya lobby ketik .dungeon-create-profile"
  if (!global.db.data.game.dungeon[users].inventory) return "tidak ada item yang bisa di simpan"
let filtered = Object.fromEntries(
  Object.entries(global.db.data.game.dungeon[users].inventory).filter(
    ([, value]) => !["medkit", "sword", "bow", "wizard-staff", "super-medkit"].includes(value)
  )
);
let inventoryKeys = Object.keys(global.db.data.game.dungeon[users].inventory);
let filteredKeys = Object.keys(filtered);

inventoryKeys.forEach(key => {
  if (!filteredKeys.includes(key)) {
    delete global.db.data.game.dungeon[users].inventory[key];
  }
});
if (!global.db.data.game.dungeon[users].lobby.keepinventory) {
  global.db.data.game.dungeon[users].lobby.keepinventory = {
    ...filtered
  }
  return `berhasil menyimpan ${(Object.keys(filtered)).join(", ")} item cek .lobby-inventory`
}
global.db.data.game.dungeon[users].lobby.keepinventory = { ...global.db.data.game.dungeon[users].lobby.keepinventory, ...filtered };
return `berhasil menyimpan ${(Object.keys(filtered)).join(", ")} item cek .lobby-invemtory`
}
async function use(users, item, value) {
  if (!(global.db.data.game.dungeon[users].inventory[item] || global.db.data.game.dungeon[users].lobby.keepinventory[item])) {
    return "Tidak ada item tersebut di inventory manapun";
  }

  
  if (weapon.includes(item)) {
    if (global.db.data.game.dungeon[users].inventory[item] < value && global.db.data.game.dungeon[users].lobby.keepinventory[item] < value) {
      return "Item habis atau jumlah tidak cukup";
    }

    let damageIncrease = 40 * value;
    global.db.data.game.dungeon[users].base.damage.push(damageIncrease);
    global.db.data.game.dungeon[users].inventory[item] -= value;

    if (global.db.data.game.dungeon[users].inventory[item] <= 0) {
      delete global.db.data.game.dungeon[users].inventory[item];
    }

    return `Senjata ${item} digunakan. Damage meningkat +${damageIncrease}. Jumlah item sekarang: ${global.db.data.game.dungeon[users].inventory[item] || 0}`;
  } 

  if (item === "medkit") {
    if (global.db.data.game.dungeon[users].inventory[item] < value && global.db.data.game.dungeon[users].lobby.keepinventory[item] < value) {
      return "Item habis atau jumlah tidak cukup";
    }

    let healthIncrease = 50 * value;
    global.db.data.game.dungeon[users].base.health = (global.db.data.game.dungeon[users].base.health || 0) + healthIncrease;
    global.db.data.game.dungeon[users].inventory[item] -= value;

    if (global.db.data.game.dungeon[users].inventory[item] <= 0) {
      delete global.db.data.game.dungeon[users].inventory[item];
    }

    return `Medkit digunakan. Darah bertambah +${healthIncrease}. Jumlah medkit sekarang: ${global.db.data.game.dungeon[users].inventory[item] || 0}`;
  } 

  if (item === "super-medkit") {
    if (global.db.data.game.dungeon[users].inventory[item] < value && global.db.data.game.dungeon[users].lobby.keepinventory[item] < value) {
      return "Item habis atau jumlah tidak cukup";
    }

    let healthIncrease = 100 * value;
    global.db.data.game.dungeon[users].base.health = (global.db.data.game.dungeon[users].base.health || 0) + healthIncrease;
    global.db.data.game.dungeon[users].inventory[item] -= value;

    if (global.db.data.game.dungeon[users].inventory[item] <= 0) {
      delete global.db.data.game.dungeon[users].inventory[item];
    }

    return `Super Medkit digunakan. Darah bertambah +${healthIncrease}. Jumlah super-medkit sekarang: ${global.db.data.game.dungeon[users].inventory[item] || 0}`;
  }

  return "Item tidak dikenali";
}



async function dungeon_sell(users, barang, setuju) {
  if (!(global.db.data.game.dungeon[users].inventory[barang] || global.db.data.game.dungeon[users].lobby.keepinventory[barang])) {
    return "Tidak ada item tersebut di inventory manapun";
  }

  let harga = [200, 300, 200, 100, 100, 100, 200, 500];
  let tawaran = pickRandom(harga);

  if (!global.db.data.game.dungeon[users].lobby.jual) {
    global.db.data.game.dungeon[users].lobby.jual = {};
  }

  if (!global.db.data.game.dungeon[users].lobby.jual[barang]) {
    global.db.data.game.dungeon[users].lobby.jual[barang] = { harga: tawaran };
    return `Item kamu ditawar ${tawaran} oleh pedagang. Yakin? Ketik .dungeon-sell ${barang} setuju`;
  }

  if (setuju === "batal") {
    delete global.db.data.game.dungeon[users].lobby.jual[barang];
    return "Berhasil membatalkan tawaran";
  }

  if (setuju === "setuju") {
    let hargaJual = global.db.data.game.dungeon[users].lobby.jual[barang].harga;

    if (global.db.data.game.dungeon[users].inventory[barang]) {
      delete global.db.data.game.dungeon[users].inventory[barang];
    } else {
      delete global.db.data.game.dungeon[users].lobby.keepinventory[barang];
    }

    global.db.data.users[users].gold = (global.db.data.users[users].gold || 0) + hargaJual;

    delete global.db.data.game.dungeon[users].lobby.jual[barang];

    return `Kamu mendapat gold +${hargaJual}`;
  }

  return "Gunakan perintah dengan benar: .dungeon-sell namabarang setuju/batal";
}


function getMonster() {
  let monsters = Object.keys(monsterData);
  return pickRandom(monsters);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
module.exports = {
  mulai,
  createLobby,
  cariItem,
  attack,
  defense,
  lobby,
  inventory,
  saveitem,
  run,
  dungeon_sell,
  use
}