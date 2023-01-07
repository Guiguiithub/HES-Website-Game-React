import data from '../../resources/json/characters.json' assert {type:'json'} ;
//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Images management
    //Instanciating images variables
    let reactorIdle1, reactorIdle2, reactorIdle3;
    //Calling the function that loads images from the files
    loadImages();

/**
 * Class that defines only the spaceship displayed in the selection screen
 */
export default class Spaceship
{
    constructor()
    {
        this.shipArray = [];
        this.loadShips();
        this.shipImage = this.shipArray[0];
        this.fpsAdapt = 2;
    }
    x = 210;
    y = 100;
    width = 300;
    height = 300;
    reactor = reactorIdle1;
    ctrLeftRight = 0;
    ctrReactors = 0;
    

    update()
    {
        //Non static player mouvement
        if (this.ctrLeftRight < 60/this.fpsAdapt){this.x -= 0.1*this.fpsAdapt;}
        else {this.x += 0.1*this.fpsAdapt;}
        if (this.ctrLeftRight >= 118/this.fpsAdapt){this.ctrLeftRight = 0;}
        this.ctrLeftRight++;

        //Reactors animations
        if(this.ctrReactors < 9/this.fpsAdapt){this.reactor = reactorIdle1;}
        else if(this.ctrReactors < 18/this.fpsAdapt){this.reactor = reactorIdle2;}
        else if(this.ctrReactors < 27/this.fpsAdapt){this.reactor = reactorIdle3;}
        else{this.ctrReactors = 0;}
        this.ctrReactors++;
    }

    //Rotates the whole spaceship and draws it since the images are the player ones
    draw()
    {
        // Store the current context state (i.e. rotation, translation etc..)
        ctx.save();

        //90 degrees in radian 
        let rad = (-90) * Math.PI / 180;

        //Set the origin to the center of the image
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        //Rotate the canvas around the origin
        ctx.rotate(rad);

        //Draw the image
        ctx.drawImage(this.shipImage, this.width/2*(-1), this.height/2*(-1)-40, this.width, this.height);
        ctx.drawImage(this.reactor, this.width/2*(-1), this.height/2*(-1)-40, this.width, this.height);

        //Restore canvas state as saved from above
        ctx.restore();
    }

    loadShips()
    {
        for (let i = 0; i < data.Captain.length; i++)
        {
            this.shipArray[i] = document.createElement("img");
            this.shipArray[i].src = data.Captain[i].spaceShip;
        }
    }
}

/**
 * Function that loads all spaceship related images from the files
 */
function loadImages()
{
    reactorIdle1 = document.createElement("img");
    reactorIdle1.src = "resources/images/game_image/spaceship_image/reactorIdle1.png";
    reactorIdle2 = document.createElement("img");
    reactorIdle2.src = "resources/images/game_image/spaceship_image/reactorIdle2.png";
    reactorIdle3 = document.createElement("img");
    reactorIdle3.src = "resources/images/game_image/spaceship_image/reactorIdle3.png";
}
