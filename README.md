Play Zone
Description
Play Zone is a website that contains a collection of small and fun browser games that users can play after creating an account. The idea behind the website is to create a simple gaming platform where people can log in and play quick games in one place without needing to download anything.
The website includes a login and signup system, so each user has their own account. After logging in, users can access different games and play them directly in the browser.
This project is built using HTML, CSS, and JavaScript for the frontend, while the backend uses Node.js and Express. The user data is stored in a SQL3 database, which handles things like account creation and login authentication.
Games
Tic Tac Toe
A two player game where players take turns placing X and O on a 3×3 board. The goal is to get three in a row.
Quiz Game
A game where players answer multiple choice questions. The player’s score increases when they choose the correct answer.
Guess the Number
The computer generates a random number, and the player tries to guess it. The game tells the player whether their guess is too high or too low.
Reaction Speed Game
This game tests how fast the player reacts when the screen changes color. The faster the reaction, the better the score.
Memory Match
A card matching game where players flip cards and try to find pairs. The goal is to match all pairs with the fewest moves.

Frontend
•	HTML
•	CSS
•	JavaScript
Backend
•	Node.js
•	Express.js
Database
•	SQL3
Security
•	bcrypt for password hashing
•	express session for login sessions

Week 1 – Homepage, Login, and Signup---done
What to do:
•	Set up the project folders --- done
•	Set up Node.js, Express, EJS, and SQLite3 --- done
•	Create the homepage
•	Design and finish the homepage layout
•	Add the Play Zone title, intro, and buttons/cards for the games
•	Create the login page
•	Create the signup page
•	Style both pages so they match the homepage
•	Make sure all navigation between these pages works properly
Goal for the week:
By the end of Week 1, the homepage, login page, and signup page should all be finished visually and connected together.

Week 2 – Database and Authentication---done
This week is about making login and signup actually work, not just look good.
What to do:
•	Set up the SQLite3 database
•	Create the users table
•	Connect the database to the Node.js app
•	Make the signup form save users into the database
•	Make the login form check user details
•	Add password hashing
•	Add sessions so users stay logged in
•	Add logout
•	Protect the homepage and game pages so only logged-in users can access them
Goal for the week:
By the end of Week 2, users should be able to create an account, log in, stay logged in, and log out properly.

Week 3 – Game Pages and Website Structure---done
This week is about building the rest of the website pages and making the platform feel complete.
What to do:
•	Create all 5 game pages
•	Tic Tac Toe page
•	Quiz page
•	Guess the Number page
•	Reaction Speed page
•	Memory Match page
•	Add navigation links
•	Add back buttons
•	Make all pages match the same design
•	Test the layout on different screen sizes
Goal for the week:
By the end of Week 3, all game pages should exist and the whole website structure should be complete.

Week 4 – First 3 Games---done
This week is about building the easier games first.
What to do:
•	Finish Guess the Number
•	Finish Quiz
•	Finish Reaction Speed
•	Test all three games
•	Fix bugs and improve gameplay
Goal for the week:
By the end of Week 4, three games should be fully working.


Easter break ideas
add 3 more games
Update security 
Add a score board
Encryption
add an ai to genetare qustions for the quiz game


Week 5 – Last 2 Games and Final Fixes
This week is for the harder games and final polishing.
What to do:
•	Finish Tic Tac Toe
•	Finish Memory Match
•	Test the full website
•	Fix any errors or broken parts
•	Improve design if needed
•	Clean up the code
•	Do the css





Not for teacher

Play Zone – Daily Development Plan
Week 1 — Base Website (Homepage + Login + Signup) ---done
Day 1 --done
Set up the project.
Tasks:
•	Create the Play Zone project folder---done
•	Initialize Node.js (npm init)---done
•	Install packages:---done
o	express---done
o	ejs---done
o	sqlite3---done
o	bcrypt---done
o	express-session---done
•	Create basic folder structure:---done
o	routes---done
o	views---done
o	public---done
•	Create app.js server---done
•	Run the server and confirm it works---done
Goal:
Server runs and the project structure is ready.---done

Day 2---done
Set up the database.---done
Tasks:
•	Create the SQLite3 database---done
•	Create the users table---done
•	Create database connection file---done
•	Test inserting a user manually---done
•	Make sure Node can connect to SQLite---done
Goal:
Database working with the server.---done

Day 3---done
Build the homepage.---done
Tasks:---done
•	Create index.ejs---done
•	Add Play Zone title---done
•	Add short description---done
•	Add game cards for the 5 games---done
•	Add navigation bar---done
•	Add basic CSS styling---done
Goal:
Homepage layout finished.---done

Day 4---done
Create login page.---done
Tasks:
•	Create login.ejs---done
•	Add email + password fields---done
•	Add login button---done
•	Add link to signup page---done
•	Style the login page---done
Goal:
Login page visually complete.---done

Day 5---done
Create signup page.---done
Tasks:
•	Create signup.ejs---done
•	Add username, email, password fields---done
•	Add submit button---done
•	Add link back to login---done
•	Style the signup page---done
Goal:
Signup page visually complete.---done

Day 6
Connect signup to the database.---done
Tasks:
•	Create signup route---done
•	Save new users in SQLite---done
•	Hash passwords with bcrypt---done
•	Test creating accounts---done
Goal:
Users can register successfully.---done

Day 7
Finish login system.---done
Tasks:
•	Create login route---done
•	Check password with bcrypt---done
•	Create user sessions---done
•	Add logout route---done
•	Protect homepage route---done
Goal:
Users can log in and stay logged in.---done

Week 2 — Website Structure---done
Day 8---done
Improve homepage.---done
Tasks:
•	Add user welcome message---done
•	Add logout button---done
•	Improve styling---done
•	Make layout cleaner---done

Day 9---done
Create game pages.---done
Tasks:
Create empty pages for:---done
•	Tic Tac Toe---done
•	Quiz---done
•	Guess the Number---done
•	Reaction Speed---done
•	Memory Match---done
Just structure, no game logic yet.---done

Day 10---done
Navigation and layout.---done
Tasks:
•	Add back button---done
•	Connect homepage to game pages---done
•	Make sure routes work---done
•	Test page navigation---done

Day 11---done
Style the game pages.---done
Tasks:
•	Create shared CSS---done
•	Make pages consistent---done
•	Fix spacing and layout---done

Day 12---done
Test authentication.---done
Tasks:
•	Test signup---done
•	Test login---done
•	Test logout---done
•	Test protected routes---done
Fix any bugs.---done

Day 13---done
Clean code.---done
Tasks:
•	Organize files---done
•	Remove unused code---done
•	Add comments---done

Day 14---done
Small improvements.---done
Tasks:
•	Make the UI nicer---done
•	Fix design issues---done
•	Prepare for building games---done

Week 3 — First Games---done
Day 15---done
Build Guess the Number game.---done
Tasks:
•	Random number logic---done
•	Input field---done
•	Hint system---done

Day 16---done
Improve Guess the Number.---done
Tasks:
•	Add attempt counter---done
•	Reset button---done
•	Improve UI---done

Day 17---done
Build Quiz Game.---done
Tasks:
•	Add question array---done
•	Display answers---done
•	Add score counter---done

Day 18---done
Improve Quiz Game.---done
Tasks:
•	Add next question logic---done
•	End screen---done
•	Score display---done

Day 19---done
Build Reaction Speed game.---done
Tasks:
•	Random delay---done
•	Color change---done
•	Reaction timer---done

Day 20---done
Improve Reaction Game.---done
Tasks:
•	Fix timing bugs---done
•	Improve UI---done

Day 21---done
Testing.---done
Tasks:
•	Test all three games---done
•	Fix issues---done

Week 4 — Harder Games
Day 22
Build Tic Tac Toe board.
Tasks:
•	Create 3×3 grid
•	Player turns

Day 23
Finish Tic Tac Toe.
Tasks:
•	Win detection
•	Reset game
•	UI improvements

Day 24
Start Memory Match.
Tasks:
•	Create card grid
•	Shuffle cards
•	Flip cards

Day 25
Finish Memory Match.
Tasks:
•	Matching logic
•	Flip back logic

Day 26
Improve Memory Match.
Tasks:
•	Add move counter
•	Add reset button

Day 27
Testing all games.
Tasks:
•	Play every game
•	Fix bugs

Day 28
UI improvements.
Tasks:
•	Improve animations
•	Fix spacing
•	Clean styles

Week 5 — Final polish
Day 29
Final testing.
Tasks:
•	Test login
•	Test all games
•	Test navigation

Day 30
Finish the project.
Tasks:
•	Clean code
•	Add comments
•	Prepare project submission
Goal:
Play Zone is fully finished.
.

