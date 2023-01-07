//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Images management
    //Instanciating images variables
    let titleBackground, gameLogo, fullscreenLogo;
    //Calling the function that loads images from the files
    loadImages();

/**
 * First screen appearing when loading the game, sort of Title Screen
 */
export default class StartScreen
{
    //Passing keydown and mouseInteractions to know when to switch screens and spaceshipSetup because we call it when something is pressed
    constructor(keydown, mouseInteractions, spaceshipSetup, gameToBossSetup)
    {
        this.keydown = keydown;
        this.mouseInteractions = mouseInteractions;
        this.spaceshipSetup = spaceshipSetup;
        this.gameToBossSetup=gameToBossSetup;

        this.fpsAdapt = 2;
    }

    //Background
    x = 0;
    y = 0;
    width=canvas.width;
    height=canvas.height;
    background = titleBackground;

    //NSE Logo
    logoWidth = 400;
    logoHeight = 186;
    logo = gameLogo;
    logoX = (canvas.width-this.logo.width)/2; // logo will always be centered but it must be resized in constructor
    logoY = 40;

    //Text
    fontSize = 20;
    fontY = 380;

    //Fullscreen
    fullscreenImage = fullscreenLogo;
    fullscreenLogoOpacity = 50;
    fullscreenX = 650;
    fullscreenY = 400;
    fullscreenWidth = 50;
    fullscreenHeight = 50;
    firstInputP = true;

    counter=0;
 
    update()
    {
        //Text getting big and small
        if(this.counter < 120/this.fpsAdapt)
        {
            this.fontSize += 0.1*this.fpsAdapt;
        }
        else
        {
            this.fontSize -= 0.1*this.fpsAdapt;
        }
        if(this.counter >= 238/this.fpsAdapt)
        {
            this.counter = 0;
        }
        this.counter++;

        this.checkInput();
        this.draw();
    }

    draw()
    {
        let x = (canvas.width-this.logoWidth)/2;
        //Background
            ctx.drawImage(this.background, this.x, this.y);
        //NSE Logo
            ctx.drawImage(this.logo, x, this.logoY, this.logoWidth, this.logoHeight);
        //"Neutron Star Explorer" text
            ctx.font = "italic 36px Galac";
            ctx.textAlign = "center";
            //Drop shadow
            ctx.fillStyle = "purple";
            ctx.fillText("Neutron Star Explorer", this.width/2 + 3, 280 + 3);
            //Actual text
            ctx.fillStyle = "cyan";
            ctx.fillText("Neutron Star Explorer", this.width/2, 280);
        //"Press A to start" text
            ctx.font = this.fontSize+"px Obitron";
            ctx.fillStyle = "white";
            ctx.fillText("Press A to start", this.width/2, this.fontY);
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

    checkInput()
    {
        if(65 in this.keydown) //A
        {
            this.spaceshipSetup();
        }
        if(87 in this.keydown) //W
        {
            this.gameToBossSetup();
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

        if(this.mouseInteractions[2]==1) //Mouse click on the canvas screen
        {
            this.mouseInteractions[2]=0;
            if (this.mouseInteractions[1] > this.fullscreenY && this.mouseInteractions[1] < this.fullscreenY+this.fullscreenHeight && this.mouseInteractions[0] > this.fullscreenX && this.mouseInteractions[0] < this.fullscreenX+this.fullscreenWidth)
            {
                this.toggleFullScreen();
            }
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
 * Function that loads all startScreen related images from the files
 */
function loadImages()
{
    titleBackground = document.createElement("img");
    titleBackground.src = "resources/images/game_image/background_image/titleBackground.png";
    gameLogo = document.createElement("img");
    gameLogo.src = "resources/images/game_image/logo_image/gameLogo.png";
    fullscreenLogo = document.createElement("img");
    fullscreenLogo.src = "resources/images/game_image/logo_image/fullscreen.png";
}