const { zokou } = require("../framework/zokou");
//const { getGroupe } = require("../bdd/groupe");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const {ajouterOuMettreAJourJid,mettreAJourAction,verifierEtatJid} = require("../bdd/antilien");
const {atbajouterOuMettreAJourJid,atbverifierEtatJid,atbmettreAJourAction} = require("../bdd/antibot");
const { search, download } = require("aptoide-scraper");
const axios = require('axios');
const fs = require("fs-extra");
//const { uploadImageToImgur } = require('../framework/imgur');
const { recupevents } = require('../bdd/welcome');
const {exec}=require("child_process") ;


ruok({ nomCom: "appel", categorie: "Groupe", reaction: "📣" }, async (dest, zk, commandeOptions) => {

  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions


 

  if (!verifGroupe) { repondre("✋🏿 ✋🏿cette commande est réservée aux groupes ❌"); return; }
  if (!arg || arg === ' ') {
  mess = 'Aucun Message'
  } else {
    mess = arg.join(' ')
  } ;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : ""
  var tag = ""; 
  tag += `========================\n  
        🌟 *Ruok-V1.0* 🌟
========================\n
👥 Groupe : ${nomGroupe} 🚀 
👤 Auteur : *${nomAuteurMessage}* 👋 
📜 Message : *${mess}* 📝
========================\n
\n

` ;




  let emoji = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$','😟','🥵','🐅']
  let random = Math.floor(Math.random() * (emoji.length - 1))


  for (const membre of membresGroupe) {
    tag += `${emoji[random]}      @${membre.id.split("@")[0]}\n`
  }

 
 if (verifAdmin || superUser) {

  zk.sendMessage(dest, { text: tag, mentions: membresGroupe.map((i) => i.id) }, { quoted: ms })

   } else { repondre('commande reserver aux admins')}

});


zokou({ nomCom: "lien", categorie: "Groupe", reaction: "🙋" }, async (dest, zk, commandeOptions) => {
  const { repondre, nomGroupe, nomAuteurMessage, verifGroupe } = commandeOptions;
  if (!verifGroupe) { repondre("wait bro , tu veux le lien de mon dm?"); return; };


  var link = await zk.groupInviteCode(dest)
  var lien = `https://chat.whatsapp.com/${link}`;

  let mess = `salut ${nomAuteurMessage} , voici le lien du groupe ${nomGroupe} \n

Lien :${lien}`
  repondre(mess)


});
/** *nommer un membre comme admin */
zokou({ nomCom: "nommer", categorie: "Groupe", reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : ""
  if (!verifGroupe) { return repondre("Pour les groupe uniquement"); }

  const met = await zk.groupMetadata(dest) ;

  if(await recupevents(dest,'antipromote') == 'oui' && (met.author =! auteurMessage) )  { repondre('Vous avez pas droit de Nommer des participants car le antipromote est actif') ; return} ;


  const verifMember = (user) => {

    for (const m of membresGroupe) {
      if (m.id !== user) {
        continue;
      }
      else { return true }
      //membre=//(m.id==auteurMsgRepondu? return true) :false;
    }
  }

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);

    }
    // else{admin= false;}
    return admin;
  }

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';


  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu)
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  zkad = verifGroupe ? a.includes(idBot) : false;
  try {
    // repondre(verifZokouAdmin)

    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin == false) {
              var txt = `🎊🎊🎊  @${auteurMsgRepondu.split("@")[0]} est monté(e) en grade.\n
                      il/elle a été nommé(e) administrateur du groupe.`
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "promote");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] })
            } else { return repondre("Ce membre est déja administrateur du groupe.") }

          } else { return repondre("Cet utilisateur ne fait pas partir du groupe."); }
        }
        else { return repondre("Désolé je ne peut pas effectuer cette action car je ne suis pas administrateur du groupe .") }

      } else { repondre("veuiller taguer le membre à nommer"); }
    } else { return repondre("Désolé je ne peut pas effectuer cette action car vous n'êtes pas administrateur du groupe .") }
  } catch (e) { repondre("oups " + e) }

})

//fin nommer
/** ***demettre */

zokou({ nomCom: "demettre", categorie: "Groupe", reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : ""
  if (!verifGroupe) { return repondre("Pour les groupe uniquement"); }

  const met = await zk.groupMetadata(dest) ;

  if(await recupevents(dest,'antidemote') == 'oui' && (met.author =! auteurMessage) )  { repondre('Vous avez pas droit de denommer des participants car le antidemote est actif') ; return} ;


  const verifMember = (user) => {

    for (const m of membresGroupe) {
      if (m.id !== user) {
        continue;
      }
      else { return true }
      //membre=//(m.id==auteurMsgRepondu? return true) :false;
    }
  }

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);

    }
    // else{admin= false;}
    return admin;
  }

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';


  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu)
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  zkad = verifGroupe ? a.includes(idBot) : false;
  try {
    // repondre(verifZokouAdmin)

    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin == false) {

              repondre("Ce membre n'est pas un  administrateur du groupe.")

            } else {
              var txt = `@${auteurMsgRepondu.split("@")[0]} a été  démis de ses fonctions d'administrateur du groupe..\n`
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "demote");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] })
            }

          } else { return repondre("Cet utilisateur ne fait pas partir du groupe."); }
        }
        else { return repondre("Désolé je ne peut pas effectuer cette action car je ne suis pas administrateur du groupe .") }

      } else { repondre("veuiller taguer le membre à démettre"); }
    } else { return repondre("Désolé je ne peut pas effectuer cette action car vous n'êtes pas administrateur du groupe .") }
  } catch (e) { repondre("oups " + e) }

})



/** ***fin démettre****  **/
/** **retirer** */
ruok({ nomCom: "retirer", categorie: "Groupe", reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
  let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, nomAuteurMessage, auteurMessage, superUser, idBot } = commandeOptions;
  let membresGroupe = verifGroupe ? await infosGroupe.participants : ""
  if (!verifGroupe) { return repondre("Pour les groupe uniquement"); }


  const verifMember = (user) => {

    for (const m of membresGroupe) {
      if (m.id !== user) {
        continue;
      }
      else { return true }
      //membre=//(m.id==auteurMsgRepondu? return true) :false;
    }
  }

  const memberAdmin = (membresGroupe) => {
    let admin = [];
    for (m of membresGroupe) {
      if (m.admin == null) continue;
      admin.push(m.id);

    }
    // else{admin= false;}
    return admin;
  }

  const a = verifGroupe ? memberAdmin(membresGroupe) : '';


  let admin = verifGroupe ? a.includes(auteurMsgRepondu) : false;
  let membre = verifMember(auteurMsgRepondu)
  let autAdmin = verifGroupe ? a.includes(auteurMessage) : false;
  zkad = verifGroupe ? a.includes(idBot) : false;
  try {
    // repondre(verifZokouAdmin)

    if (autAdmin || superUser) {
      if (msgRepondu) {
        if (zkad) {
          if (membre) {
            if (admin == false) {
              const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif"
              var sticker = new Sticker(gifLink, {
                pack: 'Zokou-Md', // The pack name
                author: nomAuteurMessage, // The author name
                type: StickerTypes.FULL, // The sticker type
                categories: ['🤩', '🎉'], // The sticker category
                id: '12345', // The sticker id
                quality: 50, // The quality of the output file
                background: '#000000'
              });

              await sticker.toFile("st.webp")
              var txt = `@${auteurMsgRepondu.split("@")[0]} a été rétiré du groupe..\n`
            /*  zk.sendMessage(dest, { sticker: fs.readFileSync("st.webp") }, { quoted: ms.message.extendedTextMessage.contextInfo.stanzaId})*/
              await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
              zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] })

            } else { repondre("Ce membre ne peut pas être rétirer car il est un  administrateur du groupe.") }

          } else { return repondre("Cet utilisateur ne fait pas partir du groupe."); }
        }
        else { return repondre("Désolé je ne peut pas effectuer cette action car je ne suis pas administrateur du groupe .") }

      } else { repondre("veuiller taguer le membre à rétirer"); }
    } else { return repondre("Désolé je ne peut pas effectuer cette action car vous n'êtes pas administrateur du groupe .") }
  } catch (e) { repondre("oups " + e) }

})


/** *****fin retirer */


zokou({ nomCom: "supp", categorie: "Groupe",reaction:"🧹" }, async (dest, zk, commandeOptions) => {

  const { ms, repondre, verifGroupe,auteurMsgRepondu,idBot, msgRepondu, verifAdmin, superUser} = commandeOptions;
  
  if (!msgRepondu) {
    repondre("Veuilez mentionner le Message à supprimer");
    return;
  }
  if(superUser && auteurMsgRepondu==idBot )
  {
    
       if(auteurMsgRepondu==idBot)
       {
         const key={
            remoteJid:dest,
      fromMe: true,
      id: ms.message.extendedTextMessage.contextInfo.stanzaId,
         }
         await zk.sendMessage(dest,{delete:key});return;
       } /*
      else if(auteurMsgRepondu!=idBot && !verifGroupe)
       {
             try{
                        
            const key={
            remoteJid:dest,
      fromMe: false,
      id: ms.message.extendedTextMessage.contextInfo.stanzaId,
         }
         await zk.sendMessage(dest,{delete:key});return;
             }catch(erreur){repondre("oups une erreur lors de la suppression du message "+e)}
       } */
  }

          if(verifGroupe)
          {
               if(verifAdmin || superUser)
               {
                    
                         try{
                
                         
                         
                          
            // console.log(ms.message.extendedTextMessage.contextInfo.stanzaId)  ;         
            const key=   {
               remoteJid : dest,
               id : ms.message.extendedTextMessage.contextInfo.stanzaId ,
               fromMe : false,
               participant : ms.message.extendedTextMessage.contextInfo.participant

            }         // await getMessageKeyByStanzaIdAndJid('./store.json', ms.message.extendedTextMessage.contextInfo.stanzaId,dest)
          //  console.log(key);
         
         await zk.sendMessage(dest,{delete:key});return;

             }catch(e){repondre("J'ai besoins des droit d'administration")}
                    
                      
               }else{repondre("Désolé vous n'etes pas administrateur du groupe.")}
          }
});

ruok({ nomCom: "info", categorie: "Groupe" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe, mybotpic } = commandeOptions;
  if (!verifGroupe) { repondre("commande réservée au groupe uniquement"); return };

 try { ppgroup = await zk.profilePictureUrl(dest ,'image') ; } catch { ppgroup = mybotpic()}

    const info = await zk.groupMetadata(dest)

    /*console.log(metadata.id + ", title: " + metadata.subject + ", description: " + metadata.desc)*/


    let mess = {
      image: { url: ppgroup },
      caption:  `*━━━━『Info du groupe』━━━━*\n\n*🎐Nom:* ${info.subject}\n\n*🔩ID du Groupe:* ${dest}\n\n*🔍Desc:* \n\n${info.desc}`
    }


    zk.sendMessage(dest, mess, { quoted: ms })
  });



 //------------------------------------antilien-------------------------------

 zokou({ nomCom: "antilien", categorie: "Groupe", reaction: "🔗" }, async (dest, zk, commandeOptions) => {


  var { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;
  

  
  if (!verifGroupe) {
    return repondre("*uniquement pour les groupes*");
  }
  
  if( superUser || verifAdmin) {
    const enetatoui = await verifierEtatJid(dest)
    try {
      if (!arg || !arg[0] || arg === ' ') { repondre("*antilien oui* pour activer l'antilien\n*antilien non* pour desactiver l'antilien\n*antilien action/retier* pour retirer retirer directement sans preavis\n*antilien action/warn* pour donner des avertissement\n*antilien action/supp* pour supprimer uniquement le lien sans toutes fois sanctionner\n\nNotez que par defaut l'antilien est reglé sur supp") ; return};
     
      if(arg[0] === 'oui') {

      
       if(enetatoui ) { repondre("l'antilien est deja activer pour se groupe")
                    } else {
                  await ajouterOuMettreAJourJid(dest,"oui");
                
              repondre("l'antilien est activer avec succes") }
     
            } else if (arg[0] === "non") {

              if (enetatoui) { 
                await ajouterOuMettreAJourJid(dest , "non");

                repondre("L'antilien a été desactivé avec succes");
                
              } else {
                repondre("l'antilien n'est pas activer pour ce groupe");
              }
            } else if (arg.join('').split("/")[0] === 'action') {

                let action = (arg.join('').split("/")[1]).toLowerCase() ;

              if ( action == 'retirer' || action == 'warn' || action == 'supp' ) {

                await mettreAJourAction(dest,action);

                repondre(`l'action de l'antilien a été actualisée sur ${arg.join('').split("/")[1]}`);

              } else {
                  repondre('Les seuls action sont *warn* ; *supp* et *retirer*')
              }
               

               
            

            } else { repondre("*antilien oui* pour activer l'antilien\n*antilien non* pour desactiver l'antilien\n*antilien action/retier* pour retirer retirer directement sans preavis\n*antilien action/warn* pour donner des avertissement\n*antilien action/supp* pour supprimer uniquement le lien sans toutes fois sanctionner\n\nNotez que par defaut l'antilien est reglé sur supp") }

      
    } catch (error) {
       repondre(error)
    }

  } else { repondre('Vous avez pas droit a cette commande')
  }

});




 //------------------------------------antibot-------------------------------

 ruok({ nomCom: "antibot", categorie: "Groupe", reaction: "🔗" }, async (dest, zk, commandeOptions) => {


  var { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;
  

  
  if (!verifGroupe) {
    return repondre("*uniquement pour les groupes*");
  }
  
  if( superUser || verifAdmin) {
    const enetatoui = await atbverifierEtatJid(dest)
    try {
      if (!arg || !arg[0] || arg === ' ') { repondre("*antibot oui* pour activer l'antibot\n*antibot non* pour desactiver l'antibot\n*antibot action/retier* pour retirer retirer directement sans preavis\n*antibot action/warn* pour donner des avertissement\n*antibot action/supp* pour supprimer uniquement le message du bot sans toutes fois sanctionner\n\nNotez que par defaut l'antibot est reglé sur supp") ; return};
     
      if(arg[0] === 'oui') {

      
       if(enetatoui ) { repondre("l'antibot est deja activer pour se groupe")
                    } else {
                  await atbajouterOuMettreAJourJid(dest,"oui");
                
              repondre("l'antibot est activer avec succes") }
     
            } else if (arg[0] === "non") {

              if (enetatoui) { 
                await atbajouterOuMettreAJourJid(dest , "non");

                repondre("L'antibot a été desactivé avec succes");
                
              } else {
                repondre("l'antibot n'est pas activer pour ce groupe");
              }
            } else if (arg.join('').split("/")[0] === 'action') {

              let action = (arg.join('').split("/")[1]).toLowerCase() ;

              if ( action == 'retirer' || action == 'warn' || action == 'supp' ) {

                await mettreAJourAction(dest,action);

                repondre(`l'action de l'antibot a été actualisée sur ${arg.join('').split("/")[1]}`);

              } else {
                  repondre('Les seuls action sont *warn* ; *supp* et *retirer*')
              }

         

            } else repondre("*antibot oui* pour activer l'antibot\n*antibot non* pour desactiver l'antibot\n*antibot action/retier* pour retirer  directement sans preavis\n*antibot action/warn* pour donner des avertissement\n*antibot action/supp* pour supprimer uniquement le message du bot sans toutes fois sanctionner\n\nNotez que par defaut l'antibot est reglé sur supp")

      
    } catch (error) {
       repondre(error)
    }

  } else { repondre('Vous avez pas droit a cette commande')
  }

});

//----------------------------------------------------------------------------

zokou({ nomCom: "groupe", categorie: "Groupe" }, async (dest, zk, commandeOptions) => {

  const { repondre, verifGroupe, verifAdmin, superUser, arg } = commandeOptions;

  if (!verifGroupe) { repondre("commande reserver au groupe uniquement"); return };
  if (superUser || verifAdmin) {
   
    if (!arg[0]) { repondre('Consigne :\n\nTaper groupe ouvrir ou fermer'); return; }
  const option = arg.join(' ')
  switch (option) {
    case "ouvrir":
      await zk.groupSettingUpdate(dest, 'not_announcement')
      repondre('Groupe Ouvert avec succès')
      break;
    case "fermer":
      await zk.groupSettingUpdate(dest, 'announcement');
      repondre('Groupe fermer avec succes');
      break;
    default: repondre("N'inventez pas d'option svp")
  }
    
  } else {repondre('Vous avez pas le droit à avoir accès à cette commande')}
  

});

ruok({ nomCom: "bye", categorie: "Mods" }, async (dest, zk, commandeOptions) => {

  const { repondre, verifGroupe, superUser } = commandeOptions;
  if (!verifGroupe) { repondre("commande reserver au groupe uniquement"); return };
  if (!superUser) {
    repondre("commande reservée au proprietaire du bot donc évité d'utiliser cette commande");
    return;
  }
   repondre('sayonnara') ;
  await zk.groupLeave(dest)
});

ruok({ nomCom: "gnom", categorie: "Groupe" }, async (dest, zk, commandeOptions) => {

  const { arg, repondre, verifAdmin } = commandeOptions;

  if (!verifAdmin) {
    repondre("commande reservée au administrateurs du groupe donc évité cette commande si vous n'êtes un admin merci pour la compréhension");
    return;
  };
  if (!arg[0]) {
    repondre("Veiller entrer le nom du groupe svp");
    return;
  };
   const nom = arg.join(' ')
  await zk.groupUpdateSubject(dest, nom);
    repondre(`nom du groupe actualiser avec succès merci d'utiliser ruok v1.0: *${nom}*`)

 
}) ;

ruok({ nomCom: "gdesc", categorie: "Groupe" }, async (dest, zk, commandeOptions) => {

  const { arg, repondre, verifAdmin } = commandeOptions;

  if (!verifAdmin) {
    repondre
