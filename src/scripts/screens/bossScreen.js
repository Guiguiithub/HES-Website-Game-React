/**
 * Get canvas element and 2d context
 */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export default class BossScreen
 {
    constructor(keydown, player, mouseInteractions, boss)
    {
        this.keydown = keydown;
        this.player = player;
        this.mouseInteractions = mouseInteractions;
        this.boss = boss;
        this.fpsAdapt = 2;
    }
     elements = [];
 
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
         if(!this.player.dead){
            this.checkInput();
            this.checkCollision();
            this.checkCollisionBoss();
        }
        if(this.boss.dead)
        {
            this.remove(this.boss.projoSpawner);
            //Make sure the player cannot take damage after boss' death
            this.checkCollision = () => {};
        }
        
         this.draw();
         
//DEBUG show player hitbox
         ctx.lineWidth = 2;
         ctx.strokeStyle = "blue";
         ctx.stroke(); 
     }
 
     draw()
     {
         for (let i in this.elements)
         {
             this.elements[i].draw();
         }
     }
 
     checkInput()
     {
        if (this.mouseInteractions[2]==1)
        {
            this.mouseInteractions[2]=0;
        }
        if(65 in this.keydown && this.checkBorder('l'))
        {
            this.player.x -= this.player.speed*this.fpsAdapt;
        }
        if(68 in this.keydown && this.checkBorder('r'))
        {
            this.player.x += this.player.speed*this.fpsAdapt;
            this.player.powering = true;
        }
        else{this.player.powering = false};
        if(87 in this.keydown && this.checkBorder('u'))
        {
            this.player.y -= this.player.speed*this.fpsAdapt; 
        }
        if(83 in this.keydown && this.checkBorder('d'))
        {
            this.player.y += this.player.speed*this.fpsAdapt;
        }
        if(32 in this.keydown) // spacebar
        {
            this.player.shootHandler.shootBoss();
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

      checkBorder(direction)
      {
        let check;
        switch(direction)
        {
            case 'u':
                check = this.player.y - this.player.speed*this.fpsAdapt;
                if(check < 0){return false;}
            break;
            case 'l':
                check = this.player.x - this.player.speed*this.fpsAdapt;
                if(check < 0){return false;}
            break;
            case 'r':
                check = this.player.x + this.player.speed*this.fpsAdapt + this.player.width;
                if(check > canvas.width){return false;}
            break;
            case 'd':
                check = this.player.y + this.player.speed*this.fpsAdapt + this.player.height;
                if(check > canvas.height){return false;}
            break;
        }   
        return true;
    }
 
    checkCollision()
    {
        //Wrong shape
        ctx.beginPath();
        ctx.moveTo(this.player.x + 32, this.player.y + 22);
        ctx.lineTo(this.player.x + 32 + 15, this.player.y + 22);
        ctx.lineTo(this.player.x + 32 + 15 + 24, this.player.y + 22 + 25);
        ctx.lineTo(this.player.x + 32 + 15 + 24 + 6, this.player.y + 22 + 25);
        ctx.lineTo(this.player.x + this.player.width - 28, this.player.y + this.player.height/2 - 3);

        ctx.lineTo(this.player.x + this.player.width - 28, this.player.y + this.player.height/2);

        ctx.lineTo(this.player.x + this.player.width - 28, this.player.y + this.player.height/2 + 3);
        ctx.lineTo(this.player.x + 32 + 15 + 24 + 6, this.player.y + this.player.height - 22 - 25);
        ctx.lineTo(this.player.x + 32 + 15 + 24, this.player.y + this.player.height - 22 - 25);
        ctx.lineTo(this.player.x + 32 + 15, this.player.y + this.player.height-22);
        ctx.lineTo(this.player.x + 32, this.player.y + this.player.height-22);
        ctx.closePath();
        
        
        if(!this.player.invincibility)
        {
            //For the array of projectil, do that
            for(let i = 0; i<this.boss.projoSpawner.array.length; i++)
            if(this.boss.projoSpawner.array[i] != null)
            {
                {
                if(ctx.isPointInPath(this.boss.projoSpawner.array[i].x + this.boss.projoSpawner.array[i].width/2, this.boss.projoSpawner.array[i].y))
                {
                    this.player.invincibility = true;
                    this.player.life -= 1;
                }   
                else if(ctx.isPointInPath(this.boss.projoSpawner.array[i].x, this.boss.projoSpawner.array[i].y + this.boss.projoSpawner.array[i].height/2))
                {
                    this.player.invincibility = true;
                    this.player.life -= 1;
                }
                else if(ctx.isPointInPath(this.boss.projoSpawner.array[i].x + this.boss.projoSpawner.array[i].width/2, this.boss.projoSpawner.array[i].y + this.boss.projoSpawner.array[i].height))
                {
                    this.player.invincibility = true;
                    this.player.life -= 1;
                }
                else if(ctx.isPointInPath(this.boss.projoSpawner.array[i].x + this.boss.projoSpawner.array[i].width, this.boss.projoSpawner.array[i].y + this.boss.projoSpawner.array[i].height/2))
                {
                    this.player.invincibility = true;
                    this.player.life -= 1;
                    
                }

                if(this.player.life <= 0)
                {
                    this.player.dead=true;
                }
            }

            }
            
        }
        else
        {
            this.player.ctrInvincibility++;
            if(this.player.ctrInvincibility >= 60)
            {
                this.player.ctrInvincibility = 0;
                this.player.invincibility = false;
            }
        }
     }

    checkCollisionBoss()
    {
        for(let i = 0; i<this.player.shootHandler.shootArray.length; i++){
            if(this.player.shootHandler.shootArray[i].x >= this.boss.x){
                this.boss.life--;
                if(this.boss.life <= 0)
                {
                    this.boss.dead = true;
                }
                this.player.shootHandler.shootArray.splice(i,1);
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