//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Images management
    //Instanciating images variables
    let shootImage;
    //Calling the function that loads images from the files
    loadImages();

/**
 * Class that defines a projectile shot by the player
 */
class Shoot
{
    constructor(x, y, width, height, lane)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.lane = lane;
        this.fpsAdapt = 2;
    }
    speed = 15;
    image = shootImage;

    update()
    {
        this.x+=this.speed*this.fpsAdapt;
    }

    draw()
    {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

/**
 * Class that manages all the projectiles shot
 */
export default class ShootHandler 
{
    constructor(player, gameScreen)
    {
        this.player = player;
        this.shootWidth = this.player.width/4;
        this.shootHeight = this.player.height/4;
        this.gameScreen = gameScreen;
        this.fpsAdapt = 2;

    }
    shootArray = [];
    //Counter that increments each frame
    shootCtr = 0;
    //Number the counter needs to reach to allow the player to shoot again
    coolDown = 10;
    //piou = new Audio("resources/music/Piou.mp3");
    //scpt = new Audio("resources/music/scpt.mp3");
    
    shootGame()
    {
        if(this.shootCtr > this.coolDown/this.fpsAdapt)
        {
            let y = this.player.y + (this.player.height - this.shootHeight)/2;
            //Adding a projectile to the shootArray
            this.shootArray.push(new Shoot(220, y, this.shootWidth, this.shootHeight, this.player.lane));
            //Putting the cooldown counter back to 0
            this.shootCtr = 0;
           
        }
        
    }
    shootBoss()
    {
        if(this.shootCtr > this.coolDown/this.fpsAdapt)
        {
            let y = this.player.y + (this.player.height - this.shootHeight)/2;
            this.shootArray.push(new Shoot(this.player.x + this.player.width/4*3, y, this.shootWidth, this.shootHeight, this.player.lane)); 
            this.shootCtr = 0;
        } 
    }

    delete()
    {
        for(let i = 0; i<this.shootArray.length; i++)
        {
            if(this.shootArray[i].x > 700)
            {
                this.shootArray.splice(i,1) ;
            }
        }
    }

    update()
    {
        this.shootCtr++;
        this.delete() ;
    }
    
    //This function will update and draw the full array
    draw()
    {
        for(let i = 0; i<this.shootArray.length; i++)
        {
            this.shootArray[i].update() ;
            this.shootArray[i].draw() ;
        }
    }
}

/**
 * Function that loads all shootHandler related images from the files
 */
function loadImages()
{
    shootImage = document.createElement("img");
    shootImage.src = "resources/images/game_image/spaceship_image/shoot1.png";
}