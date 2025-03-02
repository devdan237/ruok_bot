const { ruok } = require('../framework/ruok');
const traduire = require('../framework/traduction');

ruok({ nomCom: 'citation', categorie: 'Fun' }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe, arg } = commandeOptions;
  if (!verifGroupe) {
    repondre('Commande réservée au groupe uniquement');
    return;
  }

  if (!arg[0]) {
    try {
      fetch('https://animechan.xyz/api/random')
        .then((response) => response.json())
        .then(async (quote) => {
          repondre(`╔══════════════════════════╗
║   Ruok V1.0             ║
╚══════════════════════════╝

🎬 Anime: ${quote.anime}
👤 Personnage: ${quote.character}
💬 Citation: ${await traduire(quote.quote, { to: 'fr' })}

Propulsé par Ruok V1.0);
        });
    } catch (e) {
      repondre('Erreur lors de la génération de la citation : ' + e.message);
    }
  } else {
    const query = arg.join(' ');

    try {
      fetch('https://animechan.xyz/api/random/character?name=' + query)
        .then((response) => response.json())
        .then(async (quote) => {
          repondre(`╔══════════════════════════╗
║   Ruok V1.0               ║
╚══════════════════════════╝

🎬 Anime: ${quote.anime}
👤 Personnage: ${quote.character}
💬 Citation: ${await traduire(quote.quote, { to: 'fr' })}

Propulsé par Ruok V1.0`);
        });
    } catch (e) {
      repondre('Erreur lors de la génération de la citation : ' + e.message);
    }
  }
});
