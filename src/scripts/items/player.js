import data from '../../resources/json/characters.json' assert {type:'json'};
import ShootHandler from "./shootHandler.js";

//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d', { alpha: false });

//Images management
    //Instanciating images variables
    let reactorIdle1, reactorIdle2, reactorIdle3,
    reactorPowering1, reactorPowering2, reactorPowering3,
    explosionSimple1, explosionSimple2, explosionSimple3, explosionSimple4, explosionSimple5,
    shootImage;
    //Calling the function that loads images from the files
    loadImages();

/**
 * Class that defines the character (the spaceship) controlled by the player
 */
export default class Player
{
    //Passing deadSetup because deadSetup is called here after the last frame of the player exploding when it dies
    constructor(deadSetup) 
    {
        this.deadSetup = deadSetup;

        this.shipArray = [];
        this.loadShips();
        this.image = this.shipArray[0];
        this.fpsAdapt = 2;
    }

    //Array containing all the ship designs so they can be used
    speed = 6;
    x = 50;
    y = 80;
    width = 100;
    height = 100;
    reactor = reactorIdle1;
    powering = false;
    ctrUpDown = 0;
    ctrReactors = 0;
    ctrExplosion = 0;
    ctrInvincibility = 0;
    hit = false;
    life = 3;
    invincibility = false;
    score = 0;
    dead = false;
    //Class that will manage all the shooting mechanics
    shootHandler = new ShootHandler(this);
    //Lane in which the player is on the screen
    lane = 'a';

    update()
    {
        //Non static player mouvement
        if (this.ctrUpDown < 60/this.fpsAdapt){this.y -= 0.1*this.fpsAdapt;}
        else {this.y += 0.1*this.fpsAdapt;}
        if (this.ctrUpDown >= 118/this.fpsAdapt){this.ctrUpDown = 0;}
        this.ctrUpDown++;

        //Reactors animations
        if(this.powering)
        {
            if(this.ctrReactors < 9/this.fpsAdapt){this.reactor = reactorPowering1}
            else if(this.ctrReactors < 18/this.fpsAdapt){this.reactor = reactorPowering2}
            else if(this.ctrReactors < 27/this.fpsAdapt){this.reactor = reactorPowering3}
            else{this.ctrReactors = 0;}
        }
        else
        {
            if(this.ctrReactors < 9/this.fpsAdapt){this.reactor = reactorIdle1;}
            else if(this.ctrReactors < 18/this.fpsAdapt){this.reactor = reactorIdle2;}
            else if(this.ctrReactors < 27/this.fpsAdapt){this.reactor = reactorIdle3;}
            else{this.ctrReactors = 0;}
            
        }
        this.ctrReactors++;

        //Invicibility
        if(this.invincibility)
        {
            this.ctrInvincibility++;
            if(this.ctrInvincibility > 100)
            {
                this.invincibility = false;
                this.ctrInvincibility = 0;
            }
        }

        //Score
       
    }

    draw()
    {
        if (this.dead)
        {
            if (this.ctrExplosion<9/this.fpsAdapt){this.image=explosionSimple1;}
            else if (this.ctrExplosion<18/this.fpsAdapt){this.image=explosionSimple2;}
            else if (this.ctrExplosion<27/this.fpsAdapt){this.image=explosionSimple3;}
            else if (this.ctrExplosion<36/this.fpsAdapt){this.image=explosionSimple4;}
            else if (this.ctrExplosion<45/this.fpsAdapt){this.image=explosionSimple5;}
            else if (this.ctrExplosion>45/this.fpsAdapt)
            {
                this.deadSetup();
            }
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            this.ctrExplosion++;
        }
        else
        {
            if(this.invincibility)
            {
                ctx.filter = 'invert(100%)';
            }

            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.reactor, this.x, this.y, this.width, this.height);

            ctx.filter = 'invert(0%)';
        }
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
 * Function that loads all player related images from the files
 */
function loadImages()
{
    reactorIdle1 = document.createElement("img");
    reactorIdle1.src = "resources/images/game_image/spaceship_image/reactorIdle1.png";
    reactorIdle2 = document.createElement("img");
    reactorIdle2.src = "resources/images/game_image/spaceship_image/reactorIdle2.png";
    reactorIdle3 = document.createElement("img");
    reactorIdle3.src = "resources/images/game_image/spaceship_image/reactorIdle3.png";

    reactorPowering1 = document.createElement("img");
    reactorPowering1.src = "resources/images/game_image/spaceship_image/reactorPowering1.png";
    reactorPowering2 = document.createElement("img");
    reactorPowering2.src = "resources/images/game_image/spaceship_image/reactorPowering2.png";
    reactorPowering3 = document.createElement("img");
    reactorPowering3.src = "resources/images/game_image/spaceship_image/reactorPowering3.png";

    explosionSimple1 = document.createElement("img");
    explosionSimple1.src = "resources/images/game_image/spaceship_image/explosionSimple1.png";
    explosionSimple2 = document.createElement("img");
    explosionSimple2.src = "resources/images/game_image/spaceship_image/explosionSimple2.png";
    explosionSimple3 = document.createElement("img");
    explosionSimple3.src = "resources/images/game_image/spaceship_image/explosionSimple3.png";
    explosionSimple4 = document.createElement("img");
    explosionSimple4.src = "resources/images/game_image/spaceship_image/explosionSimple4.png";
    explosionSimple5 = document.createElement("img");
    explosionSimple5.src = "resources/images/game_image/spaceship_image/explosionSimple5.png";

    shootImage = document.createElement("img");
    shootImage.src = "resources/images/game_image/spaceship_image/shoot.png";
}
