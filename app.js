const https = require('https'); //importing the https module to make HTTPS requests
const readline = require('readline'); //importing the readline module as readline to get input from the console
const querystring = require('querystring'); //importing the querystring module to format query strings

const interface = readline.createInterface({ //creating the interface of our readline module for user interaction
    input: process.stdin,
    output: process.stdout
});

//Spotify API credentials
const clientId = '05d0de8821794ac582c1ba3f6d80ccc4';
const clientSecret = '99f1d50eee094b49a15abef88ba15aa2';

function displayMenu() {
    console.log("-----WELCOME TO THE SPOTIFY LOOKUP MENU-----"); //menu title
    console.log("1. Lookup song details from Spotify"); //option 1
    console.log("2. Exit the application"); //option 2
}

//function for getting the user's choice from the console
function getMenuChoice() {
    interface.question("Please enter your choice ('1' OR '2'): ", (option) => { //prompting the user for their choice and awaiting their input
        switch (option) {
                case '1':
                    getInput(); //calling the getInput function if the user selected option 1 to get the song they wish to lookup
                    break;

                case '2':
                    console.log("Exiting the program...");
                    interface.close(); //closing the interface therefore completing the program and exiting it
                    break;

                default:
                    console.log("Invalid choice entered. Please enter a valid option ('1' OR '2')."); //display an error for invalid input
                    getMenuChoice(); //ask the user to re-enter their option  
        }
    });
}

//function to get the name of the track the user wants to search
function getInput() {
    interface.question("Please enter the name of a song you want to lookup: ", (input) => {
        console.log(`You entered: "${input}". Here are the search results:`);
        main(input) //calls main method with user input as an argument to get info about the entered track
        .then(() => { //after track info is displayed, redisplays the menu
            console.log('-'.repeat(40)); //output a visual divider
            displayMenu(); //redisplay the menu
            getMenuChoice(); //ask again for what they want to do next
        });
    });
}

//function to get the access token from the Spotify API
function getAccessToken() {
  return new Promise((resolve, reject) => {
    const data = querystring.stringify({ grant_type: 'client_credentials' }); //formats the query string ofor the request
    const options = {
      hostname: 'accounts.spotify.com',
      path: '/api/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      }
    };

    //start of error handling for failure to get access token
    const req = https.request(options, res => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            if (res.statusCode === 200) {
                resolve(JSON.parse(body).access_token);
            } else {
                reject(new Error(`Failed to get access token: ${body}`));
            }
        });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
      
  });
  //end of error handling for failure to get access token
}

//function to search for track info on Spotify using the access token
function searchTrack(trackName, accessToken) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.spotify.com',
      path: `/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=1`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    //start of error handling for failure to search for track
    const req = https.request(options, res => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            if (res.statusCode === 200) {
                const tracks = JSON.parse(body).tracks.items;
                resolve(tracks.length ? tracks[0] : null);
            } else {
                reject(new Error(`Failed to search track: ${body}`));
            }
        });
    });

    req.on('error', reject);
    req.end();
    //end of error handling for failure to search for track 
  });
}

//main function to handle the business logic of the application
async function main(trackName) {
    try {
        const accessToken = await getAccessToken(); //gets the access token
        const track = await searchTrack(trackName, accessToken); //searches for the track info using the access token

        if (track) { //if the track exists then displays the track's info
            console.log(`Artist(s): ${track.artists.map(artist => artist.name).join(', ')}`);
            console.log(`Song: ${track.name}`);
            if (track.preview_url == null) {
                console.log("Preview Link: No Preview Avaliable")
            } else {
                console.log(`Preview Link: ${track.preview_url}`);       
            }
        
            console.log(`Album: ${track.album.name}`);
        } else {
            console.log('Track not found.'); //displays this message if the searched track is not found
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

displayMenu();
getMenuChoice();
