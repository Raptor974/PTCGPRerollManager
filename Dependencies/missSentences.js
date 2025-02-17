import {
    localize,
    getRandomStringFromArray,
} from './utils.js';

var emoji_Copium = "";
var emoji_Bedge = "";
var emoji_KEKW = "";
var emoji_KEKWait = "";
var emoji_OkaygeBusiness = "";
var emoji_PeepoClown = "";
var emoji_Prayge = "";
var emoji_Sadge = "";

function findEmoji( myClient, name){

    const emoji = myClient.emojis.cache.find(emoji => emoji.name == name)

    if (emoji == undefined){
        return "";
    }

    return emoji
}

function initEmojis( client ){
    emoji_Copium = findEmoji(client, 'Copium');
    emoji_Bedge = findEmoji(client, 'Bedge');
    emoji_KEKW = findEmoji(client, 'KEKW');
    emoji_KEKWait = findEmoji(client, 'KEKWait');
    emoji_OkaygeBusiness = findEmoji(client, 'OkaygeBusiness');
    emoji_PeepoClown = findEmoji(client, 'PeepoClown');
    emoji_Prayge = findEmoji(client, 'Prayge');
    emoji_Sadge = findEmoji(client, 'Sadge');
}

function text_lowTension(client){

    initEmojis(client);

    return localize(
    getRandomStringFromArray([
        `Tranquille c\'est le début, on y croit`,
        `C\'est rien c\'est rien il arrive après le GP`,
        `C\'est que le début`,
        `10% c\'est 100% ${emoji_Bedge}`,
        `T\'as pas le droit de nous faire perdre espoir comme ca...`,
        `MAIS C\'ÉTAIT SUR EN FAIT, C\'ÉTAIT SUUUUR`,
        `Y\'a R ${emoji_Copium}`]),
    getRandomStringFromArray([
        `It\'s fine, we just started`,
        `10% = 100% ${emoji_Bedge}`,
        `Nah we\'re good, the gp is on his way ${emoji_Copium}`])
    );
}
function text_mediumTension(client){

    initEmojis(client);

    return localize(
    getRandomStringFromArray([
        `Il commence à y avoir une petite odeur la non ${emoji_KEKWait}?`,
        `C\'est terrible ce qui se passe ${emoji_Sadge}`,
        `Petit ${emoji_Prayge} et ca passe tranquille`,
        `Plus rien ne va... ${emoji_Sadge}`,
        `Si c\'est vraiment dead on vire l\'host en même temps que son pack ${emoji_KEKW}`,
        `Qu\'est-ce qu\'on t\'a fait pour mériter ça ${emoji_KEKWait}`,
        `Moi j\'y crois encore tkt ${emoji_Copium}`]),
    getRandomStringFromArray([
        `Forget about it, next one is GP ${emoji_Prayge}`,
        `Damn that stinks for sure`])
    );
} 
function text_highTension(client){

    initEmojis(client);

    return localize(
    getRandomStringFromArray([
        `OOF ${emoji_Sadge}`,
        `UUUUUUUUUUUUUUUUUUSTRE`,
        `Un GP de moins ici c\'est du karma en plus ${emoji_OkaygeBusiness}`,
        `Ca fait beaucoup là, non... ?`,
        `TU ES TILTÉ BOUBOU ! TU AS BESOIN DE BOL ! ${emoji_KEKW}`,
        "It was at this moment that he knew... The gp was fucked up",
        "C'est ciao.",
        `Rentrons il commence à pleuvoir...`]),
    getRandomStringFromArray([
        `EMOTIONAL DAMAGE`,
        `ALRIGHT EVERYBODY WAKE UP IT\'S NOT DEAD I PROMISE, RNJESUS TOLD ME ${emoji_Copium}`,
        `Let\'s just forget about it...`])
    );
}

export{
    text_lowTension,
    text_mediumTension,
    text_highTension,
}