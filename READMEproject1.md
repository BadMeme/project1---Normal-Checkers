- **A `README.md` file** with these sections:
    
    ☐ **<Your game's title>**: A description of your game. Background info of the game is a nice touch.
    
    ☐ **Screenshot(s):** Images of your actual game.
    
    ☐ **Technologies Used**: List of the technologies used, e.g., JavaScript, HTML, CSS...
    
    ☐ **Getting Started**: In this section include the link to your deployed game and any instructions you deem important.
    
    ☐ **Next Steps**: Planned future enhancements (icebox items).
    
    > Note: Don't underestimate the value of a well-crafted README.md. The README.md introduces your project to prospective employers and forms their first impression of your work!
    > 

Welcome to Normal Checkers

1. Screenshots
    a. gamestart
    b. midgame state with pieces selected
    c. endgame with king

2. Technologies used:
    Javascript
    HTML
    CSS

3. Getting Started
    (link to the game)

    We all know how to play normal checkers.

    A player turn consists of moving a piece, and then the turn passes to the next player.

    Pieces can only move 1 square diagonally into an empty square toward opposing player's end of the board.
    An oposing player's piece can be captured if: 
        1) The opposing piece is in a square your piece would normally be able to move and
        2) There is an empty square on the opposite side of the piece to land in
    If a piece manages to make it to the opposing player's border, that piece gets promoted to a King
    Kings can move diagonally forwards or backwards, but all the other movement rules still apply.

    Your turn ends after moving a piece. However, if you have just captured a piece, you may move that piece again but only if there is another available piece you could capture.
    
    The game ends when one player runs out of pieces to play with.
    The player who captures all their opponent's pieces wins.

    The active player's pieces will be highlighted with a green border.
    When a piece is selected, the game board will light up with that piece's valid moves. 
    Green squares indicate a legal move
    Red squares indicate a legal captureing move. 
    If followup moves are possible, the game will automatically highlight the valid available moves. 
    If there are none, it will pass the turn.
    If a piece is Kinged, it will gain a gold border, and will automatically highlight its new movement powers.
    If a piece is Kinged in the middle of a jump chain, it will still have the ability to continue jumping if the board state allows.

4. Next steps

    1) Using the framework provided by the existing code to import Chess rules as well, and allowing the user to toggle which game
        they would prefer before generating the board.
    2) Improved UI - the existing UI is responsive but undeveloped and could be improved. For example, some of the visual noise could be
        reduced by finding which pieces have valid moves, and only highlighting those that can move instead of every one of the player's pieces
    3) More player feedback. For example, a feed of the move history, a representation of how many pieces have been captured for each   
        player, etc.
    4) Custom styling for small screens.