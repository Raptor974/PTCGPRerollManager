import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import AsyncLock from 'async-lock';

const lock = new AsyncLock();

import {
    attrib_PocketID,
    attrib_Active,
    attrib_AverageInstances,
    attrib_HBInstances,
    attrib_RealInstances,
    attrib_SessionTime,
    attrib_TotalPacksOpened, 
    attrib_SessionPacksOpened,
    attrib_DiffPacksSinceLastHB,
    attrib_PacksPerMin,
    attrib_GodPackFound,
    attrib_LastActiveTime,
    attrib_LastHeartbeatTime,
    attrib_Subsystems,
    attrib_Subsystem,
} from './xmlConfig.js';

const __dirname = import.meta.dirname;
const pathUsersData = __dirname+'/../users/UsersData.xml';

function cleanString( inputString ){
    // Remove blank lines
    inputString = inputString.replaceAll(/^\s*\n/gm, "");
    // Remove start & end whitespaces
    inputString = inputString.replaceAll(/^\s+|\s+$/g, "");
    return inputString;
}

// Read the UserData.xml file
async function readFileAsync() {
    try {
        const data = await fs.promises.readFile(pathUsersData, 'utf8');
        return new Promise((resolve, reject) => {
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    } catch (err) {
        console.error('Error reading the XML file:', err);
    }
}

// Read if UserData.xml exists, otherwise create it with "content"
async function checkFileExistsOrCreate( content='' ) {
    if (!fs.existsSync(pathUsersData)) {
        const dir = path.dirname(pathUsersData);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // ==== ASYNC LOCK WRITE ==== //
        await lock.acquire('fileLock', async () => {
            try {
                await fs.promises.writeFile(pathUsersData, content);
            } catch (error) {
                console.log('===== ERROR TRYING TO WRITE FILESYNC WITH LOCK =====');
        }});
        ////////////////////////////////
    }
}

// Create the user profile because none was existing
async function createUserProfile( attribUserId, attribUserName ) {
    try {
        
        // ==== ASYNC LOCK READ ==== //
        var result = ""; 
        await lock.acquire('fileLock', async () => {
            try {
                result = await readFileAsync();
            } catch (error) {
                console.log('===== ERROR TRYING TO READ FILESYNC WITH LOCK =====');
        }});
        ////////////////////////////////

        // Check root existence
        if (!result.root) {
            result.root = {};
        }

        // Check if Element already exists
        if (!result.root.user) {
            result.root.user = [];
        }

        result.root.user.push({
            $: { username: attribUserName },
            _: attribUserId,
            // attrib_PocketID: "0000000000000000",
            [attrib_Active]: false,
            [attrib_AverageInstances]: 0,
            [attrib_HBInstances]: 0,
            [attrib_RealInstances]: 0,
            [attrib_SessionTime]: 0,
            [attrib_TotalPacksOpened]: 0,
            [attrib_SessionPacksOpened]: 0,
            [attrib_DiffPacksSinceLastHB]: 0,
            [attrib_PacksPerMin]: 0,
            [attrib_GodPackFound]: 0,
            [attrib_LastActiveTime]: new Date(),
            [attrib_LastHeartbeatTime]: new Date(),
        });

        const builder = new xml2js.Builder();
        const xmlOutput = builder.buildObject(result);

        console.log(`Created user profile "${attribUserName}"`);

        // ==== ASYNC LOCK WRITE ==== //
        await lock.acquire('fileLock', async () => {
            try {
                await fs.promises.writeFile(pathUsersData, xmlOutput, 'utf8');
            } catch (error) {
                console.log('===== ERROR TRYING TO WRITE FILESYNC WITH LOCK =====');
        }});
        ////////////////////////////////

    } catch (err) {
        console.error('Error modifying the XML file:', err);
    }
}

// Check if the profile exists, create it if not
async function doesUserProfileExists( attribUserId, attribUserName ) {

    // Default XML Structure
    const data = {
        root: {}
    };
    const builder = new xml2js.Builder();
    const xmlOutput = builder.buildObject(data);

    await checkFileExistsOrCreate(xmlOutput)

    // ==== ASYNC LOCK READ ==== //
    var result = "";
    await lock.acquire('fileLock', async () => {
        try {
            result = await readFileAsync();
        } catch (error) {
            console.log('===== ERROR TRYING TO READ FILESYNC WITH LOCK =====');
    }});
    ////////////////////////////////

    if (result.root && result.root.user) {
        if(result.root.user.find(user => cleanString(user._) === attribUserId)) {
            return true;
        } else {
            console.log(`User "${attribUserName}" does not exist`);
            return false;
        }
    }
    else{
        console.log(`No user at all, creating...`);
        return false;
    }
}






// Set the attrib value of an user
async function setUserAttribValue( attribUserId, attribUserName, subAttribName, subAttribValue ) {

    if( !await doesUserProfileExists( attribUserId, attribUserName )){
        await createUserProfile(attribUserId, attribUserName);
    }

    try {
        // ==== ASYNC LOCK READ ==== //
        var result = "";
        await lock.acquire('fileLock', async () => {
            try {
                result = await readFileAsync();
            } catch (error) {
                console.log('===== ERROR TRYING TO READ FILESYNC WITH LOCK =====');
        }});
        ////////////////////////////////

        const user = result.root.user.find(user => cleanString(user._) === attribUserId);

        if (user) {
            user[subAttribName] = subAttribValue;
            console.log(`Set ${subAttribName} to ${subAttribValue} for User ${attribUserName}`);
        } else {
            console.log(`User ${attribUserName} not found.`);
        }

        const builder = new xml2js.Builder();
        let xmlOutput = builder.buildObject(result);
        xmlOutput = cleanString(xmlOutput)

        // ==== ASYNC LOCK WRITE ==== //
        await lock.acquire('fileLock', async () => {
            try {
                await fs.promises.writeFile(pathUsersData, xmlOutput, 'utf8');
            } catch (error) {
                console.log('===== ERROR TRYING TO WRITE FILESYNC WITH LOCK =====');
        }});
        ////////////////////////////////

    } catch (err) {
        console.error('Error modifying the XML file:', err);
    }
}

// Get User attributes from ID and Name
async function getUserAttribValue( client, attribUserId, subAttribName, fallbackValue = undefined ) {

    const attribUsername = (await client.users.fetch(attribUserId)).username;

    if( !await doesUserProfileExists(attribUserId, attribUsername)){
        await createUserProfile(attribUserId, attribUsername);
    }

    try {
        // ==== ASYNC LOCK READ ==== //
        var result = "";
        await lock.acquire('fileLock', async () => {
            try {
                result = await readFileAsync();
            } catch (error) {
                console.log('===== ERROR TRYING TO READ FILESYNC WITH LOCK =====');
        }});
        ////////////////////////////////

        if (result.root && result.root.user && result.root.user.length > 0){
            const user = result.root.user.find(user => cleanString(user._) === attribUserId);

            if (user && user[subAttribName][0]) {
                const value = user[subAttribName][0];
                console.log(`Attribute ${subAttribName} found : ${value} for user ${attribUserId}`);
                return value;
            } else {
                console.log(`Attribute ${subAttribName} not found for the user ${attribUserId}`);
                return fallbackValue
            }
        }
    } catch (err) {
        console.log(`Try to get attribute ${subAttribName} but does not exist:`);
        return fallbackValue
    }
}






// Set the attrib value of an user
async function setUserSubsystemAttribValue( attribUserId, attribUserName, subSystemName, subAttribName, subAttribValue ) {

    try {
        // ==== ASYNC LOCK READ ==== //
        var result = "";
        await lock.acquire('fileLock', async () => {
            try {
                result = await readFileAsync();
            } catch (error) {
                console.log('===== ERROR TRYING TO READ FILESYNC WITH LOCK =====');
        }});
        ////////////////////////////////

        const user = result.root.user.find(user => cleanString(user._) === attribUserId);

        if (user) {

            // Create Systems + System if it doesn't exist
            if (!user[attrib_Subsystems]) {
                user[attrib_Subsystems] = [{ [attrib_Subsystem]: [] }];
            }

            // Create System if it doesn't exist
            var subSystem = user[attrib_Subsystems][0][attrib_Subsystem].find(sub => cleanString(sub._) === subSystemName);
            if (!subSystem) {
                user[attrib_Subsystems][0][attrib_Subsystem].push({
                    _: subSystemName,
                    [attrib_HBInstances]: 0,
                    [attrib_SessionTime]: 0,
                    [attrib_SessionPacksOpened]: 0,
                    [attrib_DiffPacksSinceLastHB]: 0,
                    [attrib_LastHeartbeatTime]: new Date(),
                });
                subSystem = user[attrib_Subsystems][0][attrib_Subsystem].find(sub => cleanString(sub._) === subSystemName);
            }
            
            subSystem[subAttribName] = subAttribValue;

            console.log(`Set ${subAttribName} to ${subAttribValue} for User ${attribUserName} on Subsystem ${subSystemName}`);
        } else {
            console.log(`User ${attribUserName} not found.`);
        }

        const builder = new xml2js.Builder();
        let xmlOutput = builder.buildObject(result);
        xmlOutput = cleanString(xmlOutput)

        // ==== ASYNC LOCK WRITE ==== //
        await lock.acquire('fileLock', async () => {
            try {
                await fs.promises.writeFile(pathUsersData, xmlOutput, 'utf8');
            } catch (error) {
                console.log('===== ERROR TRYING TO WRITE FILESYNC WITH LOCK =====');
        }});
        ////////////////////////////////

    } catch (err) {
        console.error('Error modifying the XML file:', err);
    }
}

// Get User attributes from ID and Name
async function getUserSubsystemAttribValue( client, attribUserId, subSystemName, subAttribName, fallbackValue = undefined ) {

    const attribUsername = (await client.users.fetch(attribUserId)).username;

    try {
        // ==== ASYNC LOCK READ ==== //
        var result = "";
        await lock.acquire('fileLock', async () => {
            try {
                result = await readFileAsync();
            } catch (error) {
                console.log('===== ERROR TRYING TO READ FILESYNC WITH LOCK =====');
        }});
        ////////////////////////////////

        if (result.root && result.root.user && result.root.user.length > 0){
            const user = result.root.user.find(user => cleanString(user._) === attribUserId);

            if (user[attrib_Subsystems]) {

                const subSystem = user[attrib_Subsystems][0][attrib_Subsystem].find(sub => cleanString(sub._) === subSystemName);

                if(!subSystem){
                    console.log(`Attribute ${subAttribName} not found for subsystem ${subSystemName} of user ${attribUserId}`);
                    return fallbackValue
                }

                const value = subSystem[subAttribName][0];
                console.log(`Attribute ${subAttribName} found : ${value} for user ${attribUserId}`);
                return value;

            } else {
                console.log(`Attribute ${subAttribName} not found for subsystem ${subSystemName} of user ${attribUserId}`);
                return fallbackValue
            }
        }
    } catch (err) {
        console.log(`Try to get attribute ${subAttribName} but does not exist:`);
        return fallbackValue
    }
}






async function getActiveUsers() {

    // ==== ASYNC LOCK READ ==== //
    var result = "";
    await lock.acquire('fileLock', async () => {
        try {
            result = await readFileAsync();
        } catch (error) {
            console.log('===== ERROR TRYING TO READ FILESYNC WITH LOCK =====');
    }});
    ////////////////////////////////

    if (result.root && result.root.user && result.root.user.length > 0){
        var ActiveUsers = result.root.user.filter(u => u.Active && u.Active[0] === 'true');
    }
    
    return ActiveUsers;
}

async function getAllUsers() {

    // ==== ASYNC LOCK READ ==== //
    var result = "";
    await lock.acquire('fileLock', async () => {
        try {
            result = await readFileAsync();
        } catch (error) {
            console.log('===== ERROR TRYING TO READ FILESYNC WITH LOCK =====');
    }});
    ////////////////////////////////

    if (result.root && result.root.user && result.root.user.length > 0){
        var ActiveUsers = result.root.user;
    }
    
    return ActiveUsers;
}

function getUsernameFromUsers( user ){
    return user.map(u => u.$.username);
}

function getUsernameFromUser( user ){
    return user.$.username;
}

function getIDFromUsers( user ){
    return user.map(u => cleanString(u._));
}

function getIDFromUser( user ){
    return cleanString(user._);
}

function getAttribValueFromUsers( user, attrib, fallbackValue = undefined ){
    try{
        return user.map(u => {
            if(u[attrib][0]){
                return u[attrib][0];
            }
        });
    } catch (err) {
        return fallbackValue;
    }
}

function getAttribValueFromUser( user, attrib, fallbackValue = undefined ){
    try{
        const value = user[attrib][0];
        return value;
    } catch (err) {
        return fallbackValue;
    }
}

function getAttribValueFromUserSubsystems( user, attrib, fallbackValue = undefined ){
    try{

        if(user[attrib_Subsystems] && user[attrib_Subsystems][0][attrib_Subsystem])
        {
            var arrayValue = [];

            user[attrib_Subsystems][0][attrib_Subsystem].forEach(subsystem => {

                if (subsystem[attrib][0]) {
                    arrayValue.push(subsystem[attrib]);
                }
            });

            return arrayValue;
        }
        else{
            return fallbackValue;
        }
    } catch (err) {
        console.log('===== ERROR GATHERING SUBSYSTEMS =====');
        return fallbackValue;
    }
}

export { 
    doesUserProfileExists, 
    setUserAttribValue, 
    getUserAttribValue, 
    setUserSubsystemAttribValue,
    getUserSubsystemAttribValue,
    getActiveUsers,
    getAllUsers,
    getUsernameFromUsers, 
    getUsernameFromUser, 
    getIDFromUsers, 
    getIDFromUser, 
    getAttribValueFromUsers, 
    getAttribValueFromUser, 
    getAttribValueFromUserSubsystems,
    cleanString,
}