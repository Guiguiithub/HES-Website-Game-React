//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Images management
    //Instanciating images variables
    let turretImage;
    let explosionSimple1, explosionSimple2, explosionSimple3, explosionSimple4, explosionSimple5;
    //Calling the function that loads images from the files
    loadImages();

/**
 * Class that defines a turret element attached to the boss
 */
export default class Turret
{
    constructor(boss, projoSpawner, offsetY)
    {
        this.boss = boss;
        this.projoSpawner = projoSpawner;
        this.offsetY = offsetY;
        //To if Turret Up or Turret Down
        if(offsetY>200)
        {
            this.orientation = 1;
            this.down = true;
        }
        else
        {
            this.orientation = -1;
            this.down = false;
        }
        this.fpsAdapt = 2;
        this.speed = 1*this.fpsAdapt;
    }
    x = 0;
    y = 0;
    image = turretImage;
    offsetX = -16;
   

    ctrShoot = 0;
    ctrLength = 0;
    ctrExplosion = 0;

    attackIndex = 0;
    currentAttack = this.doNothing;
    attackArray = [this.attack0, this.attack1, this.attack2, this.attack3, this.attack4, this.attackSprinkler, this.diagonalAttack, this.doNothing];

    attack0Length = 30;
    attack1Length = 100;    
    attack2Length = 180;

    transitionDone = false;


    yAxis = 0.1;
    //yAxisCtr = 0.1;
    yOrientation = 1;

    testAttack(){
        //Set coordinates to follow the boss
        this.x = this.boss.x + this.offsetX;
        this.y = this.boss.y + this.offsetY; 
    }

    //Shoots "diagonals" and alternates diagonals axis
    diagonalAttackLength = 360;
    diagonalAttack()
    {
        if(this.ctrLength < this.diagonalAttackLength/this.fpsAdapt){
                
            //Set coordinates to follow the boss
            this.x = this.boss.x + this.offsetX;
            this.y = this.boss.y + this.offsetY; 
        //Shoot
            if(this.ctrShoot % 120/this.fpsAdapt == 0){
                {
                    let m = 1;
                    let n = 0;
                    for(let i = 0; i< 12; i++){
                        this.projoSpawner.shoot(this.x + 20, this.y+50, m, n*this.yOrientation);
                        n+=0.1;
                        m+=0.1;
                    }
                    this.yOrientation = this.yOrientation*-1;
                }
            }
        }
        //End
        else{
            this.ctrLength = 0;
            this.currentAttack=this.attackArray[0];
        } 

    }


    //Continuous shoot sweeping the canvas with projos
    attackSprinklerLength = 180;
    attackSprinkler()
    {
        if(this.ctrLength < this.attackSprinklerLength/this.fpsAdapt){
        //Set coordinates to follow the boss
            
            this.x = this.boss.x + this.offsetX;
            this.y = this.boss.y + this.offsetY; 
        //Shoot
        if(this.ctrShoot % 12/this.fpsAdapt == 0)
            {
                this.projoSpawner.shoot(this.x + 20, this.y+50, 2, this.yAxis);                
            
                this.yAxis+=0.1*this.yOrientation;
                if(this.yAxis >= 1 ){
                    this.yOrientation = -1;
                }
                if(this.yAxis <= -1 ){
                    this.yOrientation = 1;
                }
            }
        }

        //End
        else{
            this.ctrLength = 0;
            this.currentAttack=this.attackArray[0];
        } 
 
    }




    /**
     * Non attacking state
     */
    attack0()
    {
    //Set coordinates to follow the boss
        this.x = this.boss.x + this.offsetX;
        this.y = this.boss.y + this.offsetY; 

    //Timer 
        if(this.ctrLength < this.attack0Length/this.fpsAdapt){}
        
    //Next Attack In Order
        else{   
            this.ctrLength = 0;
            this.currentAttack = this.attackArray[this.attackIndex];
            this.attackIndex++;
            if(this.attackIndex>=this.attackArray.length -1){
                this.attackIndex = 0;
            }
        }
    
   /*
    //Next Attack random
        else{   
            this.ctrLength = 0;
            this.currentAttack = this.attackArray[Math.floor(Math.random()*this.attackArray.length)];     
        }
    
        */
    }
    

    /**
     * Continuous shoot up to closest border
     */
    attack1()
    {
    //Up turret
        if(!this.down){
            if(this.y > 0-40)
            {
            //Move
                this.y += this.speed*2*this.orientation;
            //Shoot
                if(this.ctrShoot % 6 == 0)
                {
                    this.projoSpawner.shoot(this.x + 20, this.y+50, 2, 0);
                }
            }
            //End
            else 
            {
                this.currentAttack = this.goBackDownInPlace;
            }
           
        }
    //Down turret
        else{
            if(this.y < canvas.height - 80)
            {
            //Move
                this.y += this.speed*2*this.orientation;
            //Shoot
                if(this.ctrShoot % 6/this.fpsAdapt == 0)
                {
                    this.projoSpawner.shoot(this.x + 20, this.y+50, 2, 0);
                }
            }
            //End
            else 
            {
                this.currentAttack = this.goBackUpInPlace;
            }
        }
    }
   
    
    /**
     * Shoot without moving
     */
    attack2()
    {
        //Move, Set coordinates to follow the boss
        this.x = this.boss.x + this.offsetX;
        this.y = this.boss.y + this.offsetY; 

        //Shoot
        if(this.ctrLength < this.attack2Length/this.fpsAdapt){
            if(this.ctrShoot < this.attack2Length/3/this.fpsAdapt){
                if(this.ctrShoot% 6/this.fpsAdapt == 0)
                {
                    this.projoSpawner.shoot(this.x + 20, this.y+50, 2, 0);
                }   
            }
            else if(this.ctrShoot >this.attack2Length/2/this.fpsAdapt){
                this.ctrShoot = 0;
            }
                        
        }
        //End
        else{
            this.ctrLength = 0;
            this.currentAttack=this.attackArray[0];
        } 
    }
      
    /**
     * Shoot in steps up to farthest border
     */
    attack3()
    {
    //Down turret
        if(this.down){
            if(this.y > 0-40)
            {
            //Shoot
                if(this.ctrLength < 40/this.fpsAdapt){
                    if(this.ctrShoot% 6/this.fpsAdapt == 0)
                    {
                        this.projoSpawner.shoot(this.x + 20, this.y+50, 2, 0);
                    }
                }
            //Move
                else
                {
                    if(this.ctrLength > 80/this.fpsAdapt){this.ctrLength=0;}
                    this.y += this.speed*2*this.orientation*-1;
                }   
            }
            //End
            else
            {
                this.currentAttack = this.goBackDownInPlace;
            }
            
        }
    //Up turret
        else{
            if(this.y < canvas.height - 80)
            {
            //Shoot
                if(this.ctrLength < 40/this.fpsAdapt){
                    if(this.ctrShoot% 6/this.fpsAdapt == 0)
                    {
                        this.projoSpawner.shoot(this.x + 20, this.y+50, 2, 0);
                    }
                }
            //Move
                else
                {
                    if(this.ctrLength > 80/this.fpsAdapt){this.ctrLength=0;}
                    this.y += this.speed*2*this.orientation*-1;
                }  
            }
            //End
            else
            {
                this.currentAttack = this.goBackUpInPlace;
            }
        }
    }
    
     /**
     * Shoot in steps and in diagonal up to farthest border
     */
      attack4()
      {
      //Down turret
          if(this.down){
              if(this.y > 0-40)
              {
              //Shoot
                  if(this.ctrLength < 40/this.fpsAdapt){
                    if(this.ctrShoot% 6/this.fpsAdapt == 0)
                    {
                        this.projoSpawner.shoot(this.x + 20, this.y+50, 2, 0);
                    }
                  }
                  else if(this.ctrLength > 80/this.fpsAdapt)
                  {
                    this.ctrLength = 0;
                  }
              //Move 
                this.y += this.speed*2*this.orientation*-1;
              }
              //End
              else
              {
                  this.currentAttack = this.goBackDownInPlace;
              }
              
          }
      //Up turret
          else{
            if(this.y < canvas.height - 80)
              {
              //Shoot
                if(this.ctrLength < 40/this.fpsAdapt){
                    if(this.ctrShoot% 6/this.fpsAdapt == 0)
                        {
                            this.projoSpawner.shoot(this.x + 20, this.y+50, 2, 0);
                        }
                }
                else if(this.ctrLength > 80/this.fpsAdapt)
                {
                this.ctrLength = 0;
                }
              //Move 
                this.y += this.speed*2*this.orientation*-1;
              }
              //End
              else
              {
                  this.currentAttack = this.goBackUpInPlace;
              }
          }
      }

    draw()
    {
        ctx.drawImage(this.image, this.x, this.y);
    }

    update()
    {
        //Death animation
        if(this.boss.life<=0)
        {
            this.ctrExplosion++;
            if (this.ctrExplosion<12/this.fpsAdapt){this.image=explosionSimple1;}
                    else if (this.ctrExplosion<24/this.fpsAdapt){this.image=explosionSimple2;}
                    else if (this.ctrExplosion<36/this.fpsAdapt){this.image=explosionSimple3;}
                    else if (this.ctrExplosion<48/this.fpsAdapt){this.image=explosionSimple4;}
                    else if (this.ctrExplosion<60/this.fpsAdapt){this.image=explosionSimple5;}
        }
        
        this.ctrShoot++;
        this.ctrLength++;
        //this.detache(); //The will not stay in update but be called in the cinematic
        this.currentAttack(); 
        this.draw();
    }

    goBackUpInPlace(){
        if(this.y > this.boss.y + this.offsetY)
        {
            this.y -= this.speed*3;
        }
        else
        {
            this.ctrLength = 0;
            this.currentAttack = this.attack0;
        }
    }

    goBackDownInPlace(){
        if(this.y < this.boss.y + this.offsetY)
        {
            this.y += this.speed*3;
        }
        else
        {
            this.ctrLength = 0;
            this.currentAttack = this.attack0;
        }
    }

    doNothing()
    {
        //Set coordinates to follow the boss
        this.x = this.boss.x + this.offsetX;
        this.y = this.boss.y + this.offsetY; 

    }

    detache()
    {
        //console.log("on se detach frer");
        if(this.offsetX >-140)
        {
            this.offsetX -= this.speed*2;
        }
        else
        {
            this.ctrShoot = 0;
            this.ctrLength = 0;
            this.currentAttack = this.attack0;
            this.transitionDone = true;
        }
    }
}

/**
 * Function that loads all turret related images from the files
 */
function loadImages()
{
    turretImage = document.createElement("img");
    turretImage.src = "resources/images/game_image/boss_image/Turret.png";

    explosionSimple1 = document.createElement("img");
    explosionSimple1.src = "resources/images/game_image/boss_image/explosionTurret2.png";
    explosionSimple2 = document.createElement("img");
    explosionSimple2.src = "resources/images/game_image/boss_image/explosionTurret3.png";
    explosionSimple3 = document.createElement("img");
    explosionSimple3.src = "resources/images/game_image/boss_image/explosionTurret4.png";
    explosionSimple4 = document.createElement("img");
    explosionSimple4.src = "resources/images/game_image/boss_image/explosionTurret5.png";
    explosionSimple5 = document.createElement("img");
    explosionSimple5.src = "resources/images/game_image/boss_image/explosionTurret6.png";
}

/**
 * Notes
 * Add an height for turret
 * Move the go back in place system in attack
 */


