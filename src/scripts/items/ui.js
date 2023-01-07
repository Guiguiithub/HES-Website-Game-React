import data from '../../resources/json/characters.json' assert {type:'json'};
//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Images management
    //Instanciating images variables
    let circle1, circle2, circle3, circle4;
    //Calling the function that loads images from the files
    loadImages();

/**
 * Class that define a circle with a letter inside that indicates when to shoot the asteroid
 */
class Circle 
{
    constructor(image, y)
    {
        this.image = image;
        this.y = y;
    }

    x = 200;
    width = 80;
    height = 80;
    active = false;
    activeCtr = 0;

    nonActiveOpacity = 50;
    drawStrategy = [this.draw, this.drawTransition];
    currentDraw = this.drawStrategy[0];

    // Draw method used in the GameScreen
    draw()
    {
        if(this.active)
        {
            ctx.filter = 'opacity(100%)' ;
            this.activeCtr++;
            if(this.activeCtr >= 7)
            {
                this.active = false;
                this.activeCtr = 0;
            }
        }
        else
        {
            ctx.filter = 'opacity(' + this.nonActiveOpacity + '%)' ;
        }

        ctx.drawImage(this.image, this.x, this.y, this.width, this.height) ;
        ctx.filter = 'opacity(100%)' ;
        //this.active = false;
    }
    // Draw method used in the GameToBossScreen, makes the circle fade out
    drawTransition()
    {
        ctx.filter = 'opacity(' + this.nonActiveOpacity + '%)' ;
        this.nonActiveOpacity-= 0.4;
        if(this.nonActiveOpacity<0){
            this.nonActiveOpacity = 0;
        }
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height) ;
        ctx.filter = 'opacity(100%)' ;
    }

    // Method called by UI to set the draw strategy to drawTransition
    setDrawStrategy()
    {
        this.currentDraw = this.drawStrategy[1];
    }
}

class BonusPoint
{
    constructor(x, y, numberOfPoint, ui)
    {
        this.x = x;
        this.y = y;
        this.numberOfPoint = numberOfPoint;
        this.ui = ui;
    }
    bonusOpacity = 100;
    ctrScoreBonus = 0 ;

    update()
    {
        if (this.ctrScoreBonus>10)
        {
            this.y -= 0.7 ;
            this.bonusOpacity-=2;
        }
        
        if(this.ctrScoreBonus < 25)
        {
            this.ctrScoreBonus++;
        }
        else
        {
            this.ui.bonusPointArray.splice(this.ui.bonusPointArray.indexOf(this),1) ;
        }
    }

    draw()
    {
        if(this.numberOfPoint == 50)
        {
            ctx.font = '30px serif' ;
            ctx.filter = 'opacity('+this.bonusOpacity+'%)' ;
            ctx.fillText("+ 50", this.x, this.y) ;
            ctx.filter = 'opacity(100%)' ;
        }

        if(this.numberOfPoint == 100)
        {
            ctx.font = '30px serif' ;
            ctx.fillStyle = "#ffea00" ;
            ctx.filter = 'opacity('+this.bonusOpacity+'%)' ;
            ctx.fillText("+ 100", this.x-11, this.y) ;
            ctx.filter = 'opacity(100%)';
        }
    }

}

/**
 * Class that displays all the UI elements (life, score...)
 */
export default class UI
{
    //Passing player to get its score
    constructor(player, spawner)
    {
        this.player = player;
        this.spawner = spawner;

        this.lifeIconArray = [];
        this.loadHeads();
        this.lifeDisplayed = this.lifeIconArray[0];
    }
    //Array containing all circles that display on each lane
    circleArray = [new Circle(circle1, 80), new Circle(circle2, 180), new Circle(circle3, 280), new Circle(circle4, 380)] ;
    

    lifeX = 20;
    lifeY = 10;
    lifeWidth = 50;
    lifeHeight = 50;

    transitionDone = false;

    scoreBonus = -1;

    bonusPointArray = [] ;
    
    update()
    {
        
    }
    
    draw()
    {
        this.displayLife();
        this.displayScore();
        this.displayCircles();
        for (let i in this.bonusPointArray)
        {
            this.bonusPointArray[i].update();
        }
    }

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
        ctx.beginPath();
        ctx.font = '32px serif';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText("SCORE", 600, 40);
        ctx.strokeText(this.player.score, 600, 70);
        ctx.fillStyle = 'cyan' ;
        ctx.textAlign = "center";
        ctx.fillText("SCORE", 600, 40);
        ctx.fillText(this.player.score, 600, 70);

        if(this.scoreBonus == 50)
        {
            this.bonusPointArray.push(new BonusPoint(600, 100, 50, this));
            this.scoreBonus = -1;
        }

        if(this.scoreBonus == 100)
        {
            this.bonusPointArray.push(new BonusPoint(600, 100, 100, this))
            this.scoreBonus = -1;
        }

        for (let i in this.bonusPointArray)
        {
            this.bonusPointArray[i].draw();
        }
    }

    displayCircles()
    {
        for(let i = 0; i < this.circleArray.length; i++)
        {
            this.circleArray[i].currentDraw();
        }
    }

    // Method called by GameToBossScreen to make the circles disappear
    setTransitionDrawStrategy()
    {
        for(let i = 0; i < this.circleArray.length; i++)
        {
            this.circleArray[i].setDrawStrategy();
            if(this.circleArray[i].nonActiveOpacity <=0){
                this.transitionDone = true;
            }
        }
    }

    loadHeads()
    {
        for (let i = 0; i < data.Captain.length; i++)
        {
            this.lifeIconArray[i] = document.createElement("img");
            this.lifeIconArray[i].src = data.Captain[i].head;
        }
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

/**
 * Function that loads all UI related images from the files
 */
function loadImages()
{
    circle1 = document.createElement("img");
    circle1.src = "resources/images/game_image/circle_image/greenCircleA.png";
    circle2 = document.createElement("img");
    circle2.src = "resources/images/game_image/circle_image/greenCircleS.png";
    circle3 = document.createElement("img");
    circle3.src = "resources/images/game_image/circle_image/greenCircleD.png";
    circle4 = document.createElement("img");
    circle4.src = "resources/images/game_image/circle_image/greenCircleF.png";
}