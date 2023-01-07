//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/**
 * Screen for the main phase of the game (Rythm phase)
 */
export default class GameToBossScreen
{
    //Passing keydown to get keyboard inputs for the movement and mouseInteractions to ensure the mouse is not considered already clicking on the next screen
    constructor(keydown, player, ui, mouseInteractions, screenHandler, bossSetup, boss, turretUp, turretDown)
    {
        this.keydown = keydown;
        this.player = player;
        this.ui = ui;
        this.mouseInteractions = mouseInteractions;
        this.screenHandler = screenHandler;
        this.bossSetup = bossSetup;
        this.boss = boss;
        this.turretUp = turretUp;
        this.turretDown = turretDown;
    }
    //Array of the elements contained in the screen
    elements = [];
    //Music that should be playing on this screen
    music = new Audio('resources/music/128Beat.mp3');
    //music = new Audio('resources/music/gameMusic/108Beat.mp3');
    // Timer to set this screen duration before going to bossScreen
    timerCtr = 0;
    timerLength = 500;
     
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
        /*
        this.timerCtr++;
        if(this.timerCtr>this.timerLength){
            
            this.bossSetup();
        }
        */
       
        // Phase 1 : Cricles fade out, once they disapear it goes to second phase
        if(!this.ui.transitionDone)
        {
            this.ui.setTransitionDrawStrategy();
        }
        
        // Phase 2 : Moves moves in, when in place, detaches turrets
        else if(!this.boss.transitionDone)
        {
            //console.log("transition du boss terminée");
            this.boss.setTransitionStrategy();
             
        }
        else
        {
            this.boss.setBossStrategy();
            this.turretUp.detache();
            this.turretDown.detache();
        }
        if (this.turretDown.transitionDone)//Turrets detached
        {
            this.bossSetup();
        }
        
        this.checkInput();
        this.draw();
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