const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "Y28j0awL#NAWK6UT9DHcyCPXJqmHScJ-GblA1tbaR0RcNQl7l2qE",
MONGODB: process.env.MONGODB || "mongodb+srv://Maher:Zubair@sigma-male.ggwx4gc.mongodb.net/?retryWrites=true&w=majority",
  MODE :  process.env.MODE || "", // PUT PUBLIC OR PRIVATE
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/x5v8x1.jpg",
ALIVE_MSG: process.env.ALIVE_MSG || "Hi 👋, I am RUOK V1.0 and i am alive 🥺. Thanks for supporting my developer 💦.",
};
