# Pong Scoreboard Application

#### Video Demo: (https://youtu.be/Y9SwkZUaGhM)

#### Description:
Pong is a web app I created to enhance the experience of playing the traditional Korean card game Pong, which a friend introduced to me. I often found it challenging to keep track of the scores while playing, so I built this app to make the game more enjoyable and organized.

## Features

- **Game Sessions**: Players can create unique game sessions with automatically generated codes. These codes allow multiple devices to join the same session or lobby.
- **Real-Time Score Updates**: Scores update instantly without the need to refresh the page, thanks to AJAX integration with the backend.
- **Player Management**: Players can be added, renamed, and managed during the game, making the scoreboard adaptable to any game scenario.
- **Responsive Design**: Built with vanilla CSS, the app looks great and works smoothly across all devices, from desktops to mobile phones.
- **Login System**: Users can create an account or log in to access features like viewing their game history (currently a work in progress).

## Files and Their Roles

### Files and Their Roles

1. **`app.py`**:
   The main backend script built using Flask. It manages game session creation, player management, and score updates. Additionally, it defines the routes for serving HTML templates and handling API requests.

2. **`templates/index.html`**:
   The primary HTML file providing the app's structure. When logged in, it displays the username on the homepage and serves as a gateway to all other features.

3. **`templates/`**:
   A directory storing all images, including custom cards, logos, and visual elements created specifically for the application.

4. **`templates/error.html`**:
   A dedicated page to redirect users when issues arise, such as incorrect login credentials or attempting to create a lobby without the required setup.

5. **`templates/help.html`**:
   A guide outlining the rules of Pong with visual examples of card combinations to assist users in understanding the game.

6. **`templates/game.html`**:
   A page featuring tools to either create or join a game/lobby. It includes two forms:
   - One for creating a game by specifying the number of players.
   - Another for joining a game using a game code generated during the creation process.

7. **`templates/history.html`** *(Work in Progress)*:
   This page will eventually display the history of past games, enabling users to revisit and continue them.

8. **`templates/layout.html`**:
   A base template containing persistent elements like the navigation bar. Other pages extend this layout using Jinja blocks.

9. **`templates/login.html`**:
   A login page for users with existing accounts.

10. **`templates/play.html` / `player_view.html`**:
    These pages handle the scoreboard functionality.
    - **`play.html`**: Used for game creation and accessed by players with edit privileges.
    - **`player_view.html`**: Used by viewers who can only observe the scores without making changes.

    Key features include:
    - **Scoreboard**: Allows users to add players, rename them, and adjust scores. Changes are validated and stored in the database to ensure persistence even after page reloads or browser closures.
    - **Podium**: Displays the top 3 players, updating automatically with score changes.
    - **Custom URLs**: Each game session generates a unique URL tied to its game code, enabling users to rejoin their session by revisiting the same URL.

11. **`templates/signup.html`**:
    A signup form for new users. It includes both server-side and client-side validation for fields like passwords and features a button to toggle password visibility.

12. **`static/css/styles.css`**:
    The custom CSS file for the application's styling. It defines the layout, color scheme, and overall visual design.

13. **`static/js/script.js`**:
    A JavaScript file that adds interactivity to the application. It handles real-time updates using AJAX requests to communicate with the Flask backend and provides dynamic elements for the user interface.

14. **`pong.db`**:
    An SQLite database used to store session codes, player information, and scores for persistent data management.

## Design Choices

Initially, I used a white theme, but it felt harsh on the eyes, so I switched to a dark theme, which is easier to look at for long periods. Designing the scoreboard was the most significant challenge—balancing functionality, aesthetics, and usability required several iterations to get it right.

## Challenges and Solutions

- **Real-Time Score Updates**: Early versions required page refreshes to see updates. Learning and implementing AJAX allowed for seamless, real-time updates.
- **Session Management**: Creating unique, persistent session codes involved generating random strings and validating them against the database to avoid duplicates.
- **Responsive Design**: Making the layout work well on mobile devices and desktops took multiple rounds of CSS adjustments and testing, but the app now runs even better on mobile.

## Conclusion

Building this app was a fantastic learning experience in full-stack web development. It taught me how to design user-friendly interfaces, integrate a Flask backend with a database, and solve real-world challenges like session management and responsiveness.

The app is functional, visually appealing, and has room for expansion. In the future, I’d like to add features like player stats and integration with external APIs. Overall, I’m proud of what I’ve accomplished and feel it showcases my technical and creative skills in web development.


