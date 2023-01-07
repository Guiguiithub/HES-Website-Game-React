import data from '../../resources/json/levels.json' assert {type:'json'} ;

//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Images management
    //Instanciating images variables
    let asteroidImage, asteroidExplosion1, asteroidExplosion2, asteroidExplosion3;
    //Calling the function that loads images from the files
    loadImages();

/**
 * Class that defines an asteroid object
 */
class Asteroid
{
    constructor(x, y, speed, height, width, image, spawner, lane)
    {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.height = height;
        this.width = width;
        this.image = image;
        this.spawner = spawner;
        this.lane = lane;
        this.fpsAdapt = 2;
    }

    explosion = false;
    ctrExplosion = 0;
    lane;

    update()
    {
        this.x -= this.speed*this.fpsAdapt;

        if(this.explosion)
        {
            if (this.ctrExplosion<4/this.fpsAdapt){this.image=asteroidExplosion1;}
            else if (this.ctrExplosion<8/this.fpsAdapt){this.image=asteroidExplosion2;}
            else if (this.ctrExplosion<12/this.fpsAdapt){this.image=asteroidExplosion3;}
            else if (this.ctrExplosion>14/this.fpsAdapt)
            {
                this.spawner.asteroidArray.splice(this.spawner.asteroidArray.indexOf(this),1) ;
            }
            this.ctrExplosion++;    
        }
    }

    draw()
    {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

/**
 * Class that manages all of the asteroids
 */
export default class Spawner 
{
    constructor(bossSetup)
    {
        this.bossSetup = bossSetup ;
    }

    //Array containing all asteroids currently on screen
    asteroidArray = [];
    counter = 0;
    asteroWidth = 150;
    asteroHeight = 150;
    alignY = (this.asteroHeight - 100)/2; //Difference between player height and asteroid height

    currentLevel = 0;

    jsonRead = 0;
    parseCtr ;
    parseLine ;
    timerEndJson = 0;
    //This function will add in the array the new asteroid
    add()
    {
        this.parseCtr = data.levels[this.currentLevel][this.jsonRead].ctr;
        if(this.counter == this.parseCtr)
        {
            if(this.jsonRead==data.levels[this.currentLevel].length-1)
            {
                this.timerEndJson++;
                this.counter--;
                if(this.timerEndJson>100){
                    this.bossSetup() ;
                }
            }
            else
            {
                this.asteroidArray.push(new Asteroid(830,this.gameLine(data.levels[this.currentLevel][this.jsonRead].lane) - this.alignY,5, 150, 150, asteroidImage, this, data.levels[this.currentLevel][this.jsonRead].lane));
                this.jsonRead++;
                this.counter = 0;
            }
            
        }
        this.counter++;
    }

    //This function will delete the asteroid inside the array when his position hit a number (here <0)
    delete()
    {
        for(let i = 0; i<this.asteroidArray.length; i++)
        {
            if(this.asteroidArray[i].x + this.asteroidArray[i].width < 0)
            {
                this.asteroidArray.splice(i,1) ;
            }
        }
    }

    update()
    {
        this.add() ;
        this.delete() ;
    }
    
    //This function will update and draw the full array
    draw()
    {
        for(let i = 0; i<this.asteroidArray.length; i++){
            this.asteroidArray[i].update() ;
            if(this.asteroidArray[i] != null)
            {
                this.asteroidArray[i].draw() ;
            }  
        }
    }
 
     // We can add a variable that will represent the number of lines and replace it by the 4
     gameLine(x)
     {
         
         if(x == 'a')
         {
             return 80 ;
         }
         else if(x == 's')
         {
             return 180 ;
         }
         else if(x == 'd')
         {
             return 280 ;
         }
         else
         {
             return 380 ;
         }
     }
}
/**
 * Function that loads all spawner related images from the files
 */
function loadImages()
{
    asteroidImage = document.createElement("img");
    asteroidImage.src = "resources/images/game_image/enemy_image/Asteroid1.png";

    asteroidExplosion1 = document.createElement("img");
    asteroidExplosion1.src = "resources/images/game_image/enemy_image/Asteroid2.png";
    asteroidExplosion2 = document.createElement("img");
    asteroidExplosion2.src = "resources/images/game_image/enemy_image/Asteroid3.png";
    asteroidExplosion3 = document.createElement("img");
    asteroidExplosion3.src = "resources/images/game_image/enemy_image/Asteroid4.png";
}