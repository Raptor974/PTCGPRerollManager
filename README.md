# Thobi's Pocket Reroll Manager - Discord Bot

![XlOCujH](https://github.com/user-attachments/assets/12eedef1-4237-4928-b175-288aea66d72f)

This repo is a Discord Bot written in javascript ES6 made to work with [Arturo PTCG Bot](https://github.com/Arturo-1212/PTCGPB) for the [PTCGP French Rerollers](https://discord.gg/pn6XSn42m6) community

# Features

## Automated IDs from Discord commands 
<img align="right" width="311" height="347" src="https://i.imgur.com/BamGht5.png">

Using **/SetPlayerID**, player are able to link their ID with their discord account

Once that's done, they can leave the pull by simply typing **/Add** or **/Remove** and it will **update a GitGist** that all players are linked with

As i'm using GitGist, the refresh time can be up to a maximum of 5 minutes

With **/SetAverageInstances**, players can also specify how many instances they are usually running and if the heartbeat is not received it will use this one waiting for the real number of instances
<br /> 
<br /> 
<br /> 
<br /> 

## Heartbeats implementation

<img align="right" width="375" height="507" src="https://i.imgur.com/goZDtl9.png">

You can ask your group to use heartbeat so everyone will know who's rerolling and who's not based on the webhook

It will auto update in a specific channel every 10 minutes and shows a lot of informations such as :
- Amount of Packs per minute for the session
- Total Amount of Packs
- Total Amount of Godpacks
- The GodPack average luck (which is a fun luck test)

Color means something for the username :
- ${\color{lightgreen}Green}$ : Heartbeat have been received in the last 30mn and the user is rerolling
- ${\color{yellow}Yellow}$ : Heartbeat have not been received in the last 30mn and active for < 30mn
- ${\color{red}Red}$ : Heartbeat have not been received in the last 30mn and active for > 30mn

You can also use **/addgpfound** and **/removegpfound** to fix false positive godpacks from arturo's bot
<br /> 
<br /> 
<br /> 

## Better GP management :

Instead of using only the webhook channel which is a nightmare to navigate, the bots generate automatically a thread in a forum channel with : 
- The Name and the Pack amount as title
- A **quote to all rerollers** that **were active** at the time of the GP pull
- The image and a link to the source (the webhook post)
In a forum post, peoples of your group can type **/Dead** or **/Verified** to change instantly the icon from ⌛ to 💀 or ✅

Moreover, you can type **/miss** and after a specific amount of miss based on packs ammount, it will automatically switch it as **/dead**. There's a thread on our discord if you have some ideas of funny sentences that the bot could say (As i also implemented a system that make the bot different things based on the % of miss)

![Auto Thread](https://i.imgur.com/iO4WDha.png)
<br /> 
<br /> 

## Usernames generator :

In order to know who's rerolling and who's not, the bot let you generate a list of usernames based on a suffix and keywords

Exemple : _/GenerateUsernames TOBI bae cute halp dang pwease noice UwU my that stoopid_

Will generate things like : "UwUstoopidTOBI", "pweasehalpTOBI", etc...

It helps tracking usernamers easily and brings joy to ppl in your group clearing their friendlist and seeing GP with funny names. With the arrival of the new Heartbeat system, it might become obsolete for presence check but it'll still be a small fun feature anyway
<br /> 
<br /> 

## Others features :

- The bot sentences can be switched from **English to French** only by changing a variable from ```true``` to ```false``` in config.json

- You'll have plenty of stuff to tweak in config.json include an **AutoKick inactive rerollers** which automatically exclude peoples that did /add more than 30mn ago and are not sending any heartbeat (disabled by default)

- There is also another command named **/lastactivity** which shows of list of all users in the database and how old was the last HeartBeat and another one named **/misscount** to show how often people contribute to check packs validity, showing their /miss per hour rerolling.

- If you wish to easily set up the bot for your server, i created a **Discord server template** based on our main server where we run the bot, here it is : https://discord.new/zXx8avYs85wk
<br /> 

# Install

- First, create your discord application (the bot), there's plenty of youtube videos explaining how to do [such as this one](https://www.youtube.com/watch?v=Oy5HGvrxM4o&t=134s)

Be sure to enable all Privileged Gateway Intents in the app settings

At this time you can either import the repo in a folder and run npm commands from here for updating it easier or create your bot and drop  the repo afterward. Be sure to reimport package.json if npm replaced it for you or it won't find the script where to begin with and will treat it as a commonJS file and not ES6 module js.

- Install Node.js 
- Ensure that your Windows Execution Policy is set to RemoteSigned or Unsigned
- Open VisualStudioCode > Terminal and run :
```
npm init -y
npm install discord.js octokit xml2js async-lock
npm update
```
- You're almost good to go, to make it start, run
```
node .
```
And press Ctrl+C to stop it. 

You can upload it on a server easily, I personnaly use discloud and it should work great once set up

Now place the repo in your project folder if you haven't alrdy done it and edit config.json

- *token* is you Discord App token
- *guildID* is your Server ID
- For all *channelID_NameOfTheChannel* variable, you can link them wherever you want

Only for those ones you need to set them in different channels both linked with Arturo's webhooks
- *channelID_Webhook* is the channel ID were your group have their gp webhook linked to
- *channelID_Heartbeat* is the channel ID were your group have their hearbeat webhook linked to

After that [create a new fine-grained token](https://github.com/settings/tokens) for your GitHub account, and make sure to only check to read/write your Gists

Then, [create a GitGist](https://gist.github.com/) and get it's ID (the numbers in the URL). Now you're ready to fill out the last two variables in config.js and **modify the GitGistName variable in index.mjs** with your gist file name

In Arturo's bot the url should be placed in Friend ID and look like this : "https://gist.githubusercontent.com/{YourUsername}/{YourGitGistID}/raw"
<br /> 
<br /> 

## Heartbeat Setup :

**For the heartbeat to work**, you need to tell your group to input their **Discord ID in the left field** in Arturo's bot

Heartbeat also supports users farming with multiples PCs, to know how to setup it up, [read the v1.4 patch note](https://github.com/TheThobi/PTCGPRerollManager/releases/tag/v1.4)
<br /> 
<br /> 

# Known Issues :

- If you have the error telling you **"Cannot find module"**, you might have dropped the repo in your project too fast, go to file Package.jon and replace ```index.js,``` with ```index.mjs,``` and add ```type:module,``` right after if you're missing it too.
<br /> 

# TODO :

- Wait for a better 2 star filter from Arturo'bot to create forum post in another or the same forum channel as for gp when a 2 Star appears in webhook

- Help to remove friends easily by exporting a list of all the GP account id you're eligible

- Make a command to remove you from the eligibles in a gp in case you were active but verifying gp at this time ( :'( dw it happened to all of us )

- Filter out all the potentiel banwords from the user generated list and remove then, at this time it only filters special characters

- Look for a way to let the possibility to create dynamically updating multiple subgroups to better optimize the number of packs per minute

- Any idea of yours ? feel free to [join the discord](https://discord.gg/pn6XSn42m6) and create a new forum post in "Bot-Suggestions" 
<br />

# Commands Spreadsheet :

- **/SetPlayerID** - _Use for automatic IDs_
- **/SetAverageInstances** - _Use if Heartbeats instances not received yet_
- **/Add /Remove** - _Change availability_
- **/Refresh** - _Refresh the IDs & upload (usefull when changing PlayerID)_
- **/ForceRefresh** - _Refresh the UserStats instantly_
- **/Verified /Dead** - _Change GP state_
- **/Miss** - _Increase GP miss counter on a GP verification post_
- **/MissCount** - _List of peoples miss per hour_
- **/LastActivity** - _List of how old the last Heartbeat was_
- **/GenerateUsernames** - _To generate cool account names_
- **/AddGPFound /RemoveGPFound** - _To correct false positives GP_


