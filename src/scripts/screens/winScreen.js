//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Images management
    //Instanciating images variables
    let selectionBackground, restartGame, fullscreenLogo;
    //Calling the function that loads images from the files
    loadImages();
export default class WinScreen
{
    constructor(keydown, mouseInteractions, mainSetup, player)
    {
        this.keydown = keydown;
        this.mouseInteractions = mouseInteractions;
        this.mainSetup = mainSetup;
        this.player = player;
    }

    x = 0;
    y = 0;
    width=canvas.width;
    height=canvas.height;
    background = selectionBackground;

    restartWidth = 360;
    restartHeight = 50;
    restartX = (this.width - this.restartWidth)/2;
    restartY = this.height/2+this.height/4;

    counterYou = 0;
    counterWin = 750;
    scoreY = this.height/2;
    highScoreY = this.height/1.7;

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
        //Background
        ctx.drawImage(this.background, this.x, this.y);

        let dif = 2;
        ctx.fillStyle = "black";
        ctx.fillRect(this.restartX, this.restartY, this.restartWidth, this.restartHeight);
        ctx.fillStyle = "red";
        ctx.fillRect(this.restartX + dif, this.restartY + dif, this.restartWidth-dif*2, this.restartHeight-dif*2);
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
        ctx.fillRect(this.restartX + dif, this.restartY + dif, this.restartWidth-dif*2, this.restartHeight-dif*2);
        ctx.font = "italic 28px Galac";
        ctx.textAlign = "center";
        ctx.fillStyle = "purple";
        ctx.fillText("Restart Game", this.width/2 + 2, this.restartY + 2 + this.restartHeight/1.5 + 4);
        ctx.fillStyle = "cyan";
        ctx.fillText("Restart Game", this.width/2, this.restartY + this.restartHeight/1.5 + 4);

        //Draw win
        ctx.font = "italic 80px Galac"
        ctx.fillStyle = "lightblue";
        this.movingYouWin();

        //Draw score
        ctx.font = "italic 26px Galac";
        ctx.fillStyle = "magenta";
        ctx.fillText("Score " + this.player.score, this.width/2 +2, this.scoreY);
        ctx.fillStyle = "lime";
        ctx.fillText("Highscore "+localStorage.getItem("score"), this.width/2,this.highScoreY);

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

    movingYouWin()
    {
        if(this.counterYou>this.width/2-118){
            ctx.fillText("You", this.counterYou, 150);
            if(this.counterWin<this.width/2+122){
                ctx.fillText("win", this.counterWin, 150);
            }
            else{
                ctx.fillText("win", this.counterWin-=8, 150);
            }
        }
        else{
            ctx.fillText("You", this.counterYou+=8, 150);
        }
    }

    /*
    * Display the highscore
    */
    highScore(){
        if(localStorage.getItem("score")==null){
            localStorage.setItem("score", this.player.score);
        }
        else if(localStorage.getItem("score")<this.player.score){
            localStorage.setItem("score", this.player.score);
        }
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

function loadImages()
    {
        selectionBackground = document.createElement("img");
        selectionBackground.src = "resources/images/game_image/background_image/selectionBackground.png";
        restartGame = document.createElement("img") ;
        restartGame.src = "resources/images/game_image/restartGame.png";

        fullscreenLogo = document.createElement("img");
        fullscreenLogo.src = "resources/images/game_image/logo_image/fullscreen.png";
    }
