"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ruok } = require("../framework/ruok");
zokou({ nomCom: "test", reaction: "😌", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
    console.log("Commande saisie !!!s");
    let z = 'Salut je m\'appelle *Ruok V1.0* \n\n ' + 'je suis un bot Whatsapp Multi-tâche ';
    let d = ' developpé par *Devdan237*';
    let varmess = z + d;
    var img = 'https://files.catbox.moe/y3a923.jpg';
    await zk.sendMessage(dest, { image: { url: img }, caption: varmess });
    //console.log("montest")
});
console.log("mon test");
/*module.exports.commande = () => {
  var nomCom = ["test","t"]
  var reaction="☺️"
  return { nomCom, execute,reaction }
};

async function  execute  (origineMessage,zok) {
  console.log("Commande saisie !!!s")
   let z ='Salut je m\'appelle *Ruok V1.0* \n\n '+'je suis un bot Whatsapp Multi-appareil '
      let d =' developpé par *Devdan237*'
      let varmess=z+d
      var img='https://files.catbox.moe/y3a923.jpg'
await  zok.sendMessage(origineMessage,  { image:{url:img},caption:varmess});
}  */ 
