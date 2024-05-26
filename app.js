const readline = require('readline'); //importing the readline module as readline to get input from the console

const interface = readline.createInterface({ //creating the interface of our readline module for user interaction
    input: process.stdin,
    output: process.stdout
});

function displayMenu() {
    console.log("-----WELCOME TO THE SPOTIFY LOOKUP MENU-----"); //menu title
    console.log("1. Lookup song details from Spotify"); //option 1
    console.log("2. Exit the application"); //option 2
}

//function for getting the user's choice from the console
function getMenuChoice() {
    interface.question("Please enter your choice ('1' OR '2'): ", (option) => {//prompting the user for their choice and awaiting their input
        if (option === '1') {
            getInput(); //calling the getInput function if the user selected option 1 to get the song they wish to lookup
        } else if (option === '2') {
            console.log("Exiting the program...");
            interface.close(); //closing the interface therefore completing the program and exiting it
        } else {
            console.log("Invalid choice entered. Please enter a valid option ('1' OR '2')."); //display an error for invalid input
            getMenuChoice();//ask the user to re-enter their option
        }
    });
}

function getInput() {
    interface.question("Please enter the name of a song you want to lookup: ", (input) => {
        console.log(`You entered: ${input}`);//Placeholder code for where the spotify API should be used!!
        console.log('-'.repeat(40)); //output a visual divider
        displayMenu(); //redisplay the menu
        getMenuChoice(); //ask again for what they want to do next
    });
}

displayMenu();
getMenuChoice();
