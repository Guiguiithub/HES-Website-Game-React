import data from '../../resources/json/characters.json' assert {type:'json'} ;
/**
 * Get canvas element and 2d context
 */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.font = '48px Galac';

export default class UIBoss
{
    constructor(player, boss)
    {
        this.player = player;
        this.boss = boss;
        this.lifeIconArray = [];
        this.loadHeads();
        this.lifeDisplayed = this.lifeIconArray[0];
    }
    lifeX = 20;
    lifeY = 10;
    lifeWidth = 50;
    lifeHeight = 50;

    lifeBarX = 50;
    lifeBarY = 400;

    displayLife()
    {
        for (let i = 0; i < this.player.life; i++)
        {
            ctx.drawImage(this.lifeDisplayed, this.lifeX, this.lifeY, this.lifeWidth, this.lifeHeight);
            this.lifeX += this.lifeWidth + 15;
        }
        this.lifeX = 20;
    }
    
    displayScore()
    {
        ctx.font = '48px serif';
        ctx.fillStyle = 'cyan' ;
        ctx.fillText(this.player.score, 600, 50) ;
    }

    displayLifeBoss()
    {
        if(!this.boss.dead)
        {
            ctx.fillText(this.boss.life, this.boss.x +50, this.boss.y + this.boss.height/2);
                    
        }
        else
        {
            ctx.font = "72px Galac";
            ctx.textAlign = "center";
            ctx.fillText("You Win", canvas.width/2, canvas.height/2);
        }

        ctx.fillRect(this.lifeBarX, this.lifeBarY, this.boss.life * 6, 50);
        

    }
        
    
    update(){}
    
    draw()
    {
        this.displayLife();
        this.displayScore();

        ctx.fillStyle = "red";
        this.displayLifeBoss();
        ctx.fillStyle = "cyan";

        
    }

    loadHeads()
    {
        for (let i = 0; i < data.Captain.length; i++)
        {
            this.lifeIconArray[i] = document.createElement("img");
            this.lifeIconArray[i].src = data.Captain[i].head;
        }
    }
}