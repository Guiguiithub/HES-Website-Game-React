//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Images management
    //Instanciating images variables
    let selectionBackground, restartGame, gameOver, fullscreenLogo;
    //Calling the function that loads images from the files
    loadImages();

/**
 * "Game over" screen displayed when the player died
 */
export default class DeadScreen
{
    //Passing mouseInteractions because we need to know when the player clicks the restart button and mainSetup because we call it when the player clicks
    constructor(keydown, mouseInteractions, mainSetup, player)
    {
        this.keydown = keydown;
        this.mouseInteractions = mouseInteractions;
        this.mainSetup = mainSetup;
        this.player = player ;
    }

    //Background related variables
    x = 0;
    y = 0;
    width=canvas.width;
    height=canvas.height;
    background = selectionBackground;

    //Restart button related variables
    restartWidth = 380;
    restartHeight = 60;
    restartX = (this.width - this.restartWidth)/2;
    restartY = this.height/2;

    //"Game Over" logo related variables
    gameOverWidth = this.width;
    gemaOverHeight = this.height;
    gameOverX = (this.width - this.gameOverWidth)/2;
    gameOverY = -100;

    //Moving score appereance
    counter = 0;
    counter2 = 0;

    //Fullscreen
    fullscreenImage = fullscreenLogo;
    fullscreenLogoOpacity = 50;
    fullscreenX = 650;
    fullscreenY = 400;
    fullscreenWidth = 50;
    fullscreenHeight = 50;
    firstInputP = true;

    update()
    {
        this.checkInput();
        this.highScore();
        this.draw();
    }
    draw()
    {
        ctx.beginPath();
        //Background
        ctx.drawImage(this.background, this.x, this.y);
        //"Game Over" logo
        ctx.drawImage(gameOver, this.gameOverX, this.gameOverY, this.gameOverWidth, this.gemaOverHeight);
        //Restart button
            //Set the characteristics of the button
            let dif = 2;
            ctx.fillStyle = "black";
            ctx.roundRect(this.restartX, this.restartY, this.restartWidth, this.restartHeight, 10);
            ctx.fill();

            ctx.fillStyle = "red";
            ctx.roundRect(this.restartX + dif, this.restartY + dif, this.restartWidth-dif*2, this.restartHeight-dif*2, 10);
            ctx.fill();

            dif += 2;
            //Hover management
            if (this.mouseInteractions[1] > this.restartY && this.mouseInteractions[1] < this.restartY + this.restartHeight && this.mouseInteractions[0] > this.restartX && this.mouseInteractions[0] < this.restartX + this.restartWidth)
            {
                ctx.fillStyle = "red";
            }
            else
            {
                ctx.fillStyle = "black";
            }
            //Draw the button
            ctx.roundRect(this.restartX + dif, this.restartY + dif, this.restartWidth-dif*2, this.restartHeight-dif*2, 10);
            ctx.fill();
            ctx.font = "italic 36px Galac";
            ctx.textAlign = "center";
            ctx.fillStyle = "purple";
            ctx.fillText("Restart Game", this.width/2 + 2, this.restartY + 2 + this.restartHeight/1.5 + 4);
            ctx.fillStyle = "cyan";
            ctx.fillText("Restart Game", this.width/2, this.restartY + this.restartHeight/1.5 + 4);
        ctx.fillText("Your shame", 350, 350);
        this.moveScore();

        //Fullscreen logo
            if (this.mouseInteractions[1] > this.fullscreenY && this.mouseInteractions[1] < this.fullscreenY+this.fullscreenHeight && this.mouseInteractions[0] > this.fullscreenX && this.mouseInteractions[0] < this.fullscreenX+this.fullscreenWidth)
            {
                this.fullscreenLogoOpacity = 100;
            }
            else
            {
                this.fullscreenLogoOpacity = 50;
            }
            ctx.filter = 'opacity('+this.fullscreenLogoOpacity+'%)';
            ctx.drawImage(this.fullscreenImage, this.fullscreenX, this.fullscreenY, this.fullscreenWidth, this.fullscreenHeight);
            ctx.filter = 'opacity(100%)';
    }

    highScore(){
        if(localStorage.getItem("score")==null){
            localStorage.setItem("score", this.player.score);
        }
        else if(localStorage.getItem("score")<this.player.score){
            localStorage.setItem("score", this.player.score);
        }
    }
    moveScore(){
        if(this.counter<800)
            ctx.fillText(localStorage.getItem("score"), this.counter+=4, 400);
        else
            ctx.fillText(localStorage.getItem("score"), 350, this.increaseCounter());
    }
    increaseCounter(){
        if(this.counter2==400)
            return this.counter2
        else
            return this.counter2+=4
    }

    //If the mouse is clicked and its position is within the button coordinates, then we call mainSetup
    checkInput()
    {
        if(this.mouseInteractions[2]==1)
        {
            this.mouseInteractions[2]=0;
            if (this.mouseInteractions[1] > this.restartY && this.mouseInteractions[1] < this.restartY + this.restartHeight && this.mouseInteractions[0] > this.restartX && this.mouseInteractions[0] < this.restartX + this.restartWidth)
            {
                this.mainSetup();
            }
            if (this.mouseInteractions[1] > this.fullscreenY && this.mouseInteractions[1] < this.fullscreenY+this.fullscreenHeight && this.mouseInteractions[0] > this.fullscreenX && this.mouseInteractions[0] < this.fullscreenX+this.fullscreenWidth)
            {
                this.toggleFullScreen();
            }
        }

        if(80 in this.keydown) //P
        {
            if (this.firstInputP)
            {
                this.toggleFullScreen();
                this.firstInputP = false;
            }
        }
        else
        {
            this.firstInputP = true;
        }
    }

    toggleFullScreen()
    {
        if (this.mouseInteractions[3])
        {
            if (document.exitFullscreen)
            {
                document.exitFullscreen();
            }
            else if (document.webkitExitFullscreen)
            { /* Safari */
                document.webkitExitFullscreen();
            }
            else if (document.msExitFullscreen)
            { /* IE11 */
                document.msExitFullscreen();
            }
        }
        else
        {
            if (canvas.requestFullscreen)
            {
                canvas.requestFullscreen();
            }
            else if (canvas.webkitRequestFullscreen)
            { /* Safari */
                canvas.webkitRequestFullscreen();
            }
            else if (canvas.msRequestFullscreen)
            { /* IE11 */
                canvas.msRequestFullscreen();
            }
        }
    }
}

/**
 * Function that loads all deadScreen related images from the files
 */
function loadImages()
{
    selectionBackground = document.createElement("img");
    selectionBackground.src = "resources/images/game_image/background_image/selectionBackground.png";

    gameOver = document.createElement("img") ;
    gameOver.src = "resources/images/game_image/logo_image/gameOver.png";
    restartGame = document.createElement("img") ;
    restartGame.src = "resources/images/game_image/restartGame.png";

    fullscreenLogo = document.createElement("img");
    fullscreenLogo.src = "resources/images/game_image/logo_image/fullscreen.png";
}