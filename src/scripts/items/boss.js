import Turret from "./turret.js";

//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Images management
    //Instanciating images variables
    let explosionSimple1, explosionSimple2, explosionSimple3, explosionSimple4, explosionSimple5, bossEye, bossBody;
    let bossDeathAudio = new Audio("resources/music/BossDeath.mp3");
    //Calling the function that loads images from the files
    loadImages();
 /**
  * Class that defines the boss (with its position, size, health and so on)
  */
  export default class Boss
  {
     constructor(player, projoSpawner, winSetup){
         this.player = player;
         this.projoSpawner = projoSpawner;
         this.winSetup = winSetup;
         this.fpsAdapt = 2;
     }
      x = 800;
      y = 20;
      width = 212;
      height = 384;
      eyeWidth = 120;
      eyeHeight = 120;
      eyeX = this.x;
      eyeY = this.y + (this.height + this.eyeHeight)/2;
      
      eye = bossEye;
      body = bossBody;
      ctr = 0;
      life = 100;
      ctrExplosion=0;
      ctrShoot = 0;
      deathAudio = bossDeathAudio;
      angle = 180;
      dead = false;
      
      transitionDone = false;
      updateStrategy = [this.bossUpdate, this.transitionUpdate, this.doNothing];
      currentUpdate = this.doNothing;

      doNothing()
      {

      }
      transitionUpdate()
      {
         console.log(this.x);
         //Slides in
         this.x -= 1*this.fpsAdapt;
         if(this.x <= 540){
            this.transitionDone = true;
         }
         //Up and down animation
         if(this.ctr <= 120/this.fpsAdapt){this.y += 0.4*this.fpsAdapt}
         else if (this.ctr <= 241/this.fpsAdapt){this.y -= 0.4*this.fpsAdapt}
         this.ctr++;
         if(this.ctr >241/this.fpsAdapt){this.ctr=0} 
      }

      bossUpdate()
      {
         //Attack
         this.attack();
         
         //Up and down animation
         if(this.ctr <= 120/this.fpsAdapt){this.y += 0.4*this.fpsAdapt}
         else if (this.ctr <= 241/this.fpsAdapt){this.y -= 0.4*this.fpsAdapt}
         this.ctr++;
         if(this.ctr >241/this.fpsAdapt){this.ctr=0} 

        //Check if dead
        if (this.life <= 0)
        {
             
            //Boss Death animation
              if (this.ctrExplosion<12/this.fpsAdapt)
              {   
                  this.eye=explosionSimple1;
                  this.deathAudio.play();
               }
              else if (this.ctrExplosion<24/this.fpsAdapt){this.eye=explosionSimple2;}
              else if (this.ctrExplosion<36/this.fpsAdapt){this.eye=explosionSimple3;}
              else if (this.ctrExplosion<48/this.fpsAdapt){this.eye=explosionSimple4;}
              else if (this.ctrExplosion<60/this.fpsAdapt){this.eye=explosionSimple5;}
              else if (this.ctrExplosion>100/this.fpsAdapt)
              {
                  //Prepare and Change current screen in game.js
                 this.winSetup();    
              }
              ctx.drawImage(this.eye, this.x, this.y);
              this.ctrExplosion++;
          }
      }

      setTransitionStrategy()
      {
            this.currentUpdate = this.transitionUpdate;
      }
      setBossStrategy()
      {
            this.currentUpdate = this.bossUpdate;
      }
  
      update()
      {
         this.currentUpdate();
      }
 
     draw()
      {
         ctx.drawImage(this.body, this.x, this.y);

         //Calculate the coordinates for drawing the eye
         this.eyeX = this.x -17;
         this.eyeY = this.y + (this.height - this.eyeHeight)/2 - 4;
 
         // Store the current context state (i.e. rotation, translation etc..)
         ctx.save();
      
         //Calculate the angle between the eye and the player
         this.eyeToPlayerAngle();
         let rad = (this.angle) * Math.PI / 180;

         //Set the origin to the center of the image
         ctx.translate(this.eyeX + 120 / 2, this.eyeY + 120 / 2);
         //Rotate the canvas around the origin
         ctx.rotate(rad);
         //draw the image
         ctx.drawImage(this.eye, 120/2*(-1), 120/2*(-1), 120, 120);
         // Restore canvas state as saved from above
         ctx.restore();
      }
 
      eyeToPlayerAngle()
      {
         this.angle = Math.atan2(this.player.y - this.eyeY, this.player.x - this.eyeX) * 180 / Math.PI;
         this.angle = this.angle + 180;
      }
      attack()
      {
         if(this.angle > 180){
            this.angle -= 360;
         }
         this.ctrShoot++;
         if(this.ctrShoot % 200 == 0)
         {
            let axis = this.angle/100;
            this.projoSpawner.bossShoot(this.x - 80 + Math.abs(this.angle/2), this.y + this.height/2-45+this.angle*-1.3, 1-Math.abs(axis), axis*2);
            this.ctrShoot = 0;
         }
      }

     checkCollision()
     {
        for(let i = 0; i<this.player.shootHandler.shootArray.length; i++){
            if(this.player.shootHandler.shootArray[i].x >= this.x){
                this.life--;
                this.player.shootHandler.shootArray.splice(i,1);
            }
        }
     }
}

function loadImages()
{
 bossEye = document.createElement("img");
 bossEye.src = "resources/images/game_image/boss_image/BossEye30x30x4.png";
 bossBody = document.createElement("img");
 bossBody.src = "resources/images/game_image/boss_image/BossCroped.png";
 
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
}