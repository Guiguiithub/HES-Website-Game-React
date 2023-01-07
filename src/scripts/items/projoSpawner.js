/**
 * Get canvas element and 2d context
 */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let projectileImage,projectileImage1, projectileImage2, projectileImage3, projectileImage4, 
projectileImage5, projectileImage6, projectileImage7, projectileImage8, projectileImage9, projectileImage10;

loadImages();

export default class ProjoSpawner
{
    
    array = [];
    cpt = 0;

    update()
    {
        this.draw();
        this.delete();
    }

    //Create a new projectile and adds it to this.array
    shoot(x, y, speedX, speedY)
    { 
        this.array.push(new  Projectile(x, y, speedX, speedY));
    }
    bossShoot(x, y, speedX, speedY)
    { 
        this.array.push(new  ProjectileBoss(x, y, speedX, speedY));
    }

    //This function will delete the projo inside the array when his position hit a number (here <0)
    delete()
    {
        for(let i = 0; i<this.array.length; i++)
        {
            if(this.array[i].x < 0)
            {
                this.array.splice(i, 1) ;
            }
        }
    }

    //This function will update and draw all projectiles in this.array
    draw()
    {
        for(let i = 0; i<this.array.length; i++)
        {
            this.array[i].update() ;
            this.array[i].draw() ;
        }
    }
}



class Projectile
{
    constructor(x, y, speedX, speedY)
    {
        this.x = x;
        this.y = y; 
        this.speedX = speedX;
        this.speedY = speedY;
        this.fpsAdapt = 2;
    }
    /*
    constructor(x, y, speedY)
    {
        this.x = x;
        this.y = y;
        this.speedY = speedY;  
    }
    */
    speedX = 2; //To change to implement different projectile speed
    speedY = 0;
    cpt = 0;
    gifSpeed = 4;
    image = projectileImage;
    width = 20;
    height = 20;

    update()
    {
        this.x -= this.speedX*this.fpsAdapt;
        this.y -= this.speedY*this.fpsAdapt;
        if(this.cpt <= this.gifSpeed*1/this.fpsAdapt){this.image = projectileImage1}
        else if(this.cpt <= this.gifSpeed*2/this.fpsAdapt){this.image = projectileImage2}
        else if(this.cpt <= this.gifSpeed*3/this.fpsAdapt){this.image = projectileImage3}
        else if(this.cpt <= this.gifSpeed*4/this.fpsAdapt){this.image = projectileImage4}
        else if(this.cpt <= this.gifSpeed*5/this.fpsAdapt){this.image = projectileImage5}
        else if(this.cpt <= this.gifSpeed*6/this.fpsAdapt){this.image = projectileImage6}
        else if(this.cpt <= this.gifSpeed*7/this.fpsAdapt){this.image = projectileImage7}
        else if(this.cpt <= this.gifSpeed*8/this.fpsAdapt){this.image = projectileImage8}
        else if(this.cpt <= this.gifSpeed*9/this.fpsAdapt){this.image = projectileImage9}
        else if(this.cpt <= this.gifSpeed*10/this.fpsAdapt){this.image = projectileImage10}
        this.cpt++;
        if(this.cpt >= this.gifSpeed * 10/this.fpsAdapt){this.cpt = 0}
    }
    
    draw()
    {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class ProjectileBoss
{
    constructor(x, y, speedX, speedY)
    {
        this.x = x;
        this.y = y; 
        this.speedX = speedX;
        this.speedY = speedY;
        this.fpsAdapt = 2;
    }
    /*
    constructor(x, y, speedY)
    {
        this.x = x;
        this.y = y;
        this.speedY = speedY;  
    }
    */
    speedX = 2; //To change to implement different projectile speed
    speedY = 0;
    cpt = 0;
    gifSpeed = 8;
    image = projectileImage;
    width = 60;
    height = 60;

    update()
    {
        this.x -= this.speedX*this.fpsAdapt;
        this.y -= this.speedY*this.fpsAdapt;
        if(this.cpt <= this.gifSpeed*1/this.fpsAdapt){this.image = projectileImage1}
        else if(this.cpt <= this.gifSpeed*2/this.fpsAdapt){this.image = projectileImage2}
        else if(this.cpt <= this.gifSpeed*3/this.fpsAdapt){this.image = projectileImage3}
        else if(this.cpt <= this.gifSpeed*4/this.fpsAdapt){this.image = projectileImage4}
        else if(this.cpt <= this.gifSpeed*5/this.fpsAdapt){this.image = projectileImage5}
        else if(this.cpt <= this.gifSpeed*6/this.fpsAdapt){this.image = projectileImage6}
        else if(this.cpt <= this.gifSpeed*7/this.fpsAdapt){this.image = projectileImage7}
        else if(this.cpt <= this.gifSpeed*8/this.fpsAdapt){this.image = projectileImage8}
        else if(this.cpt <= this.gifSpeed*9/this.fpsAdapt){this.image = projectileImage9}
        else if(this.cpt <= this.gifSpeed*10/this.fpsAdapt){this.image = projectileImage10}
        this.cpt++;
        if(this.cpt >= this.gifSpeed * 10/this.fpsAdapt){this.cpt = 0}
    }
    
    draw()
    {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
//DEBUG        
        ctx.rect(this.x, this.y, this.width, this.height);
    }
}












function loadImages()
{
    projectileImage = document.createElement("img");
    projectileImage.src = "resources/images/game_image/boss_image/projectile.png";

    projectileImage1 = document.createElement("img");
    projectileImage1.src = "resources/images/game_image/boss_image/projectile1.png";
    projectileImage2 = document.createElement("img");
    projectileImage2.src = "resources/images/game_image/boss_image/projectile2.png";
    projectileImage3 = document.createElement("img");
    projectileImage3.src = "resources/images/game_image/boss_image/projectile3.png";
    projectileImage4 = document.createElement("img");
    projectileImage4.src = "resources/images/game_image/boss_image/projectile4.png";
    projectileImage5 = document.createElement("img");
    projectileImage5.src = "resources/images/game_image/boss_image/projectile5.png";
    projectileImage6 = document.createElement("img");
    projectileImage6.src = "resources/images/game_image/boss_image/projectile6.png";
    projectileImage7 = document.createElement("img");
    projectileImage7.src = "resources/images/game_image/boss_image/projectile7.png";
    projectileImage8 = document.createElement("img");
    projectileImage8.src = "resources/images/game_image/boss_image/projectile8.png";
    projectileImage9 = document.createElement("img");
    projectileImage9.src = "resources/images/game_image/boss_image/projectile9.png";
    projectileImage10 = document.createElement("img");
    projectileImage10.src = "resources/images/game_image/boss_image/projectile10.png";
}

