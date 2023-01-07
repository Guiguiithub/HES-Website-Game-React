//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/**
 * Screen for the main phase of the game (Rythm phase)
 */
export default class GameScreen
{
    //Passing keydown to get keyboard inputs for the movement and mouseInteractions to ensure the mouse is not considered already clicking on the next screen
    constructor(keydown, player, spawner, ui, mouseInteractions)
    {
        this.keydown = keydown;
        this.player = player;
        this.spawner = spawner;
        this.ui = ui;
        this.mouseInteractions = mouseInteractions;
    }
    //Array of the elements contained in the screen
    elements = [];
    firstInputA = true;
    firstInputS = true;
    firstInputD = true;
    firstInputF = true;
    firstInputP = true;
    //Music that should be playing on this screen
    music = new Audio('resources/music/128Beat.mp3');
    //music = new Audio('resources/music/gameMusic/108Beat.mp3');
     
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
        if (!this.player.dead)
        {
            this.checkInput();
            this.checkCollision();
            this.checkShootCollision();
        }
        this.draw();
    }

    draw()
    {
        for (let i in this.elements)
        {
            this.elements[i].draw();
        }
    }

    //Checking keyboard inputs and moving/shooting at the correct time
    checkInput()
    {
        if (this.mouseInteractions[2]==1)
        {
            this.mouseInteractions[2]=0;
        }

        if(65 in this.keydown)
        {
            if (this.firstInputA)
            {
                this.player.y=80;
                this.player.lane = 'a';
                this.player.shootHandler.shootGame();
                this.ui.circleArray[0].active = true;
                this.shootCtr = 0;
                this.firstInputA = false;
            }
        }
        else
        {
            this.firstInputA = true;
        }

        if(83 in this.keydown)
        {
            if (this.firstInputS)
            {
                this.player.y=180;
                this.player.lane = 's';
                this.player.shootHandler.shootGame();
                this.ui.circleArray[1].active = true;
                this.firstInputS = false;
            }
        }
        else
        {
            this.firstInputS = true;
        }

        if(68 in this.keydown)
        {
            if (this.firstInputD)
            {
                this.player.y=280;
                this.player.lane = 'd';
                this.player.shootHandler.shootGame();
                this.ui.circleArray[2].active = true;
                this.firstInputD = false;
            }
        }
        else
        {
            this.firstInputD = true;
        }

        if(70 in this.keydown)
        {
            if (this.firstInputF)
            {
                this.player.y=380;
                this.player.lane = 'f';
                this.player.shootHandler.shootGame();
                this.ui.circleArray[3].active = true;
                this.firstInputF = false;
            }
        }
        else
        {
            this.firstInputF = true;
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

    //Checking if player touches an asteroid and removing a life if it is the case
    checkCollision()
    {
        for(let i = 0; i<this.spawner.asteroidArray.length; i++)
        {
            if (this.spawner.asteroidArray[i].lane == this.player.lane && !this.spawner.asteroidArray[i].explosion)
            {
                if (this.player.x+this.player.width-46>=this.spawner.asteroidArray[i].x && this.player.x<=this.spawner.asteroidArray[i].x+this.spawner.asteroidArray[i].width)
                {
                    if(!this.player.invincibility)
                    {
                        this.player.invincibility = true;
                        this.player.life--;
                        if(this.player.life <= 0)
                        {
                            this.player.dead=true;
                        }
                    }
                }
            }
        }
    }

    //Checking if projectile shot by the player touches an asteroid and destroying it
    checkShootCollision()
    {
        for(let i = 0; i<this.spawner.asteroidArray.length; i++)
        {
            for(let j = 0; j<this.player.shootHandler.shootArray.length; j++)
            {
                if(this.spawner.asteroidArray[i] != null && this.player.shootHandler.shootArray[j] != null) // avoids errors when at an index of a spliced element
                {
                    if (this.spawner.asteroidArray[i].lane == this.player.shootHandler.shootArray[j].lane && !this.spawner.asteroidArray[i].explosion)
                    {
                        if (this.player.shootHandler.shootArray[j].x+this.player.shootHandler.shootArray[j].width-23>=this.spawner.asteroidArray[i].x && this.player.shootHandler.shootArray[j].x<=this.spawner.asteroidArray[i].x+this.spawner.asteroidArray[i].width)
                        {
                            this.player.shootHandler.shootArray.splice(j,1);
                            this.spawner.asteroidArray[i].explosion = true;

                            // add points if asteroid is destroyed in the circle
                            if(this.spawner.asteroidArray[i].x + this.spawner.asteroidArray[i].width/2 > this.ui.circleArray[0].x - 30 && this.spawner.asteroidArray[i].x + this.spawner.asteroidArray[i].width/2 < this.ui.circleArray[0].x + this.ui.circleArray[0].width + 30)
                            {
                                // add more points if hit in the center of the circle
                                if(this.spawner.asteroidArray[i].x + this.spawner.asteroidArray[i].width/2 > this.ui.circleArray[0].x +15 && this.spawner.asteroidArray[i].x + this.spawner.asteroidArray[i].width/2 < this.ui.circleArray[0].x + this.ui.circleArray[0].width -15 )
                                {
                                    this.ui.player.score = this.ui.player.score +100 ;
                                    this.ui.scoreBonus = 100 ;
                                }
                                
                                else
                                {
                                    this.ui.player.score = this.ui.player.score + 50 ;
                                    this.ui.scoreBonus = 50 ;
                                }
                            }
                        }
                    }
                }  
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