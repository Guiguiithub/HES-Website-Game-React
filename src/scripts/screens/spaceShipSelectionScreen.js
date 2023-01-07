import data from '../../resources/json/characters.json' assert {type:'json'} ;
//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Images management
    //Instanciating images variables
    let selectionBackground, fullscreenLogo;
    //Calling the function that loads images from the files
    loadImages();

/**
 * Screen displayed at the beginning to select the ship you will be playing with
 */
export default class SpaceshipSelectionScreen
{
    //Passing keydown to get keyboard input for selecting the ship, player to apply the ship chosen to the class used in game, gameSetup because we call it when the ship has been selected and mouseInteractions to ensure no false click detection on the following screen
    constructor(keydown, player, ui, uiBoss, gameSetup, mouseInteractions)
    {
        this.keydown = keydown;
        this.player = player;
        this.ui = ui;
        this.uiBoss = uiBoss;
        this.gameSetup = gameSetup;
        this.mouseInteractions = mouseInteractions;

        this.captainArray = [];
        this.loreArray = [];
        this.nameArray = [];
        this.loadCaptainInfo();

        this.fpsAdapt = 2;
    }
    x = 0;
    y = 0;
    width = canvas.width;
    height = canvas.height;
    background = selectionBackground;
    spaceshipSpeed = 15;
    //Design of the spaceship currently selected
    currentSpaceship = 0;
    //Design of the second spaceship element used for the animations
    nextSpaceship = 0;
    //Array that will contain our 2 spaceships (added in game.js)
    elements = [];  //elements[0] = currentSpaceship, elements[1] = nextSpaceship
    //True if an animation to the left is happening
    animatingLeft = false;
    //True if an animation to the right is happening
    animatingRight = false;
    fontSize = 36;
    fontY = 440;
    //Music that should be playing on this screen
    music = new Audio('resources/music/startMusic/WelcomeSpaceTraveler.mp3');

    //Index of the spaceship we are currently displaying the infos of. Initialy used "currentSpaceship" but it doesn't get updated until the end of an animation
    dataIndexToDisplay = 0;
    
    captainX = 60;
    captainY = 40;
    captainWidth = 150;
    captainHeight = 150;
    captainOpacity = 100;

    nameX = 480;
    nameY = 80;

    loreX = 480;
    loreY = 100;
    loreWidth = 200;
    loreHeight = 250;
    loreTextOpacity = 100;

    fullscreenImage = fullscreenLogo;
    fullscreenLogoOpacity = 50;
    fullscreenX = 650;
    fullscreenY = 400;
    fullscreenWidth = 50;
    fullscreenHeight = 50;
    firstInputP = true;
 
    add(object)
    {
         this.elements.push(object);
    }

    remove(object)
    {
        for (let i in this.elements)
        {
            if (this.elements[i]==object)
            {
                this.elements.splice(i,1);
            }
        }
    }

    update()
    {
        for (let i in this.elements)
        {
            this.elements[i].update();
        }

        if(this.animatingLeft)
        {
            if (this.elements[1].x<0)
            {
                this.captainOpacity-=20*this.fpsAdapt;
                this.loreHeight-=35*this.fpsAdapt;
                this.loreTextOpacity-=35*this.fpsAdapt;
            }
            else
            {
                this.dataIndexToDisplay =this.nextSpaceship;
                this.captainOpacity+=10*this.fpsAdapt;
                this.loreHeight+=14*this.fpsAdapt;
                if (this.elements[1].x>150)
                {
                    this.loreTextOpacity+=15*this.fpsAdapt;
                }
            }

            //As the two spaceships are not in their final positions, elements go right, 15 by 15
            if(this.elements[0].x<730)
            {
                this.elements[0].x+=this.spaceshipSpeed*this.fpsAdapt;
            }
            if(this.elements[1].x<210)
            {
                this.elements[1].x+=this.spaceshipSpeed*this.fpsAdapt;
            }
            //When they get to their final positions :
            if(this.elements[0].x>=730 && this.elements[1].x>=210)
            {
                this.loreHeight=250;
                this.loreTextOpacity=100;
                //We put the nextSpaceship (ship actually in the middle of the screen) design to currentSpaceship (ship actually off-screen)
                this.currentSpaceship=this.nextSpaceship;
                //We apply the image we just changed to the currentSpaceship element
                this.elements[0].shipImage=this.elements[0].shipArray[this.currentSpaceship];
                //We move currentSpaceship exactly on nextSpaceship (in the middle of the screen)
                this.elements[0].x=this.elements[1].x;
                //We move nextSpaceship off-screen. Now the ship in the middle is once again currentSpaceship
                this.elements[1].x=-250;
                //We stop the animation
                this.animatingLeft=false;
            }
        }

        if(this.animatingRight)
        {
            if (this.elements[1].x>480)
            {
                this.captainOpacity-=20*this.fpsAdapt;
                this.loreHeight-=35*this.fpsAdapt;
                this.loreTextOpacity-=35*this.fpsAdapt;
            }
            else
            {
                this.dataIndexToDisplay =this.nextSpaceship;
                this.captainOpacity+=10*this.fpsAdapt;
                this.loreHeight+=14*this.fpsAdapt;
                if(this.elements[1].x<320)
                {
                    this.loreTextOpacity+=15*this.fpsAdapt;
                }
            }
            //As the two spaceships are not in their final positions, elements go left, 15 by 15
            if(this.elements[0].x>-250)
            {
                this.elements[0].x-=this.spaceshipSpeed*this.fpsAdapt;
            }
            if(this.elements[1].x>210)
            {
                this.elements[1].x-=this.spaceshipSpeed*this.fpsAdapt;
            }
            //When they get to their final positions :
            if(this.elements[0].x<=-250 && this.elements[1].x<=210)
            {
                this.loreHeight = 250;
                this.loreTextOpacity=100;
                //We put the nextSpaceship (ship actually in the middle of the screen) design to currentSpaceship (ship actually off-screen)
                this.currentSpaceship=this.nextSpaceship;
                //We apply the image we just changed to the currentSpaceship element
                this.elements[0].shipImage=this.elements[0].shipArray[this.currentSpaceship];
                //We move currentSpaceship exactly on nextSpaceship (in the middle of the screen)
                this.elements[0].x=this.elements[1].x;
                //We move nextSpaceship off-screen. Now the ship in the middle is once again currentSpaceship
                this.elements[1].x=-250;
                //We stop the animation
                this.animatingRight=false;
            }
        }

        if(this.loreTextOpacity<0)
        {
            this.loreTextOpacity=0;
        }
        if (this.captainOpacity<0)
        {
            this.captainOpacity=0;
        }
        if (this.loreHeight<0)
        {
            this.loreHeight=0;
        }
        this.checkInput();
        this.draw();
    }

    draw()
    {
        ctx.drawImage(this.background, this.x, this.y);
        for (let i in this.elements)
        {
            this.elements[i].draw();
        }

        ctx.textAlign = "center";
        ctx.font = '26px serif';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText("MISSION CAPTAIN", this.captainX+this.captainWidth/2, this.captainY-10);
        ctx.fillStyle = 'white';
        ctx.fillText("MISSION CAPTAIN", this.captainX+this.captainWidth/2, this.captainY-10);
        ctx.filter = 'opacity('+this.captainOpacity+'%)';
        ctx.drawImage(this.captainArray[this.dataIndexToDisplay], this.captainX, this.captainY, this.captainWidth, this.captainHeight);
        ctx.filter = 'opacity(100%)';

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText("Captain "+this.nameArray[this.dataIndexToDisplay], this.nameX+this.loreWidth/2, this.nameY);
        ctx.fillStyle = 'white';
        ctx.fillText("Captain "+this.nameArray[this.dataIndexToDisplay], this.nameX+this.loreWidth/2, this.nameY);
        
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.roundRect(this.loreX, this.loreY, this.loreWidth, this.loreHeight, 10);
        ctx.fill();
        
        ctx.font = '14px serif';
        ctx.fillStyle = 'white';
        ctx.filter = 'opacity('+this.loreTextOpacity+'%)';
        let lines = this.getLines(this.loreArray[this.dataIndexToDisplay], this.loreWidth-10);
        ctx.textAlign = "left";
        for (let i in lines)
        {
            ctx.fillText(lines[i], this.loreX+5, this.loreY+35+25*i);
        }
        ctx.filter = 'opacity(100%)';
        
        ctx.font = this.fontSize+"px Obitron";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText("Space to confirm your choice", this.width/2, this.fontY);

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
        if (this.mouseInteractions[2]==1)
        {
            this.mouseInteractions[2]=0;
            if (this.mouseInteractions[1] > this.fullscreenY && this.mouseInteractions[1] < this.fullscreenY+this.fullscreenHeight && this.mouseInteractions[0] > this.fullscreenX && this.mouseInteractions[0] < this.fullscreenX+this.fullscreenWidth)
            {
                this.toggleFullScreen();
            }
        }
        if(32 in this.keydown) //space
        {
            if(!this.animatingLeft && !this.animatingRight)
            {
                //Applying the current choice to the player element
                this.player.image=this.player.shipArray[this.currentSpaceship];
                this.ui.lifeDisplayed = this.ui.lifeIconArray[this.currentSpaceship];
                this.uiBoss.lifeDisplayed = this.uiBoss.lifeIconArray[this.currentSpaceship];
                //Launching the game
                this.gameSetup();
            }
        }
        if (37 in this.keydown) //left
        {
            if(!this.animatingLeft && !this.animatingRight)
            {
                //Getting to the previous element in the ship array
                this.nextSpaceship = this.currentSpaceship-1;
                if(this.nextSpaceship<0)
                {
                    this.nextSpaceship=this.elements[0].shipArray.length-1;
                }
                //Ensuring the nextSpaceship is on the left of the screen
                this.elements[1].x=-250;
                //Ensuring both elements have the correct image for the animation
                this.elements[0].shipImage=this.elements[0].shipArray[this.currentSpaceship];
                this.elements[1].shipImage=this.elements[1].shipArray[this.nextSpaceship];
                //Starting animation
                this.animatingLeft=true;
            }
        }
        if (39 in this.keydown) //right
        {
            if(!this.animatingLeft && !this.animatingRight)
            {
                //Getting to the next element in the ship array
                this.nextSpaceship=this.currentSpaceship+1;
                if(this.nextSpaceship>this.elements[0].shipArray.length-1)
                {
                    this.nextSpaceship=0;
                }
                //Ensuring the nextSpaceship is on the right of the screen
                this.elements[1].x=730;
                //Ensuring both elements have the correct image for the animation
                this.elements[0].shipImage=this.elements[0].shipArray[this.currentSpaceship];
                this.elements[1].shipImage=this.elements[1].shipArray[this.nextSpaceship];
                //Starting animation
                this.animatingRight=true;
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

    //Get an array of lines based on the width a text can have
    getLines(text, maxWidth)
    {
        let words = text.split(" ");
        let lines = [];
        let currentLine = words[0];
    
        for (let i = 1; i < words.length; i++)
        {
            let word = words[i];
            let width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth)
            {
                currentLine += " " + word;
            }
            else
            {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
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

    loadCaptainInfo()
    {
        for(let i = 0; i<data.Captain.length; i++)
        {
            this.captainArray[i] = document.createElement("img");
            this.captainArray[i].src = data.Captain[i].head;

            this.loreArray[i] = data.Captain[i].lore;

            this.nameArray[i] = data.Captain[i].name;
        }
    }
}

/**
 * Function that loads all spaceshipSelectionScreen related images from the files
 */
function loadImages()
{
   
    selectionBackground = document.createElement("img");
    selectionBackground.src = "resources/images/game_image/background_image/selectionBackground.png";

    fullscreenLogo = document.createElement("img");
    fullscreenLogo.src = "resources/images/game_image/logo_image/fullscreen.png";
   
}