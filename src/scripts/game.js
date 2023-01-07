//Import JS modules
    //Class that manages jumps between the different screens in our game
    import ScreenHandler from "./screens/screenHandler.js";

    //Title screen, first screen and entry point in the game and all its components
    import StartScreen from "./screens/startScreen.js";

    //Screen where you select the spaceship you want to play with and all its components
        import Spaceship from "./items/spaceship.js";
    import SpaceshipSelectionScreen from "./screens/spaceShipSelectionScreen.js";

    //Screen for the main phase of the game and all its components
        import Background from "./items/background.js";
        import Spawner from "./items/spawner.js";
        import Player from "./items/player.js";
        import UI from "./items/ui.js";
     import GameScreen from "./screens/gameScreen.js";

    //Game over screen that displays when the player dies and all its components
    import DeadScreen from "./screens/deadScreen.js";

    //Win screen that displays when the player succed the level
    import WinScreen from "./screens/winScreen.js";

    //Screen to tansition from GameScreen to BossScreen
    import GameToBossScreen from "./screens/gameToBossScreen.js";

    //Screen for the boss phase of the game and all its components
        import ProjoSpawner from "./items/projoSpawner.js";
        import Boss from "./items/boss.js";
        import BossScreen from "./screens/bossScreen.js";
        import UIBoss from "./items/uiBoss.js";
        import Turret from "./items/turret.js";

//Get canvas element and 2d context
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

//Framerate related variables
    let fpsInterval, then, startTime, now, elapsed;
    let fps = 32;

//Screens and classes related variables
    //Variables used for screens management
    let screenHandler;
    let screenArray;
    //Screen classes instanciations
    let startScreen, spaceshipSelectionScreen, gameScreen, deadScreen, bossScreen, winScreen, gameToBossScreen;
    //Item classes instanciations (in screen order)
    let spaceship, spaceshipAnim, background, spawner, player, ui, projoSpawner, boss, turretUp, turretDown, uiBoss;

//Manage Keyboard and Mouse inputs
    //Object containing ints corresponding to the keys that are currently pressed down
    let keydown = {};
    //Array containing the coordinates of the mouse and the status of the click
    let mouseInteractions = []; // 0 = horizontal coordinate, 1 = vertical coordinate, 2 = clicked or not, 3 = fullscreen or not
    mouseInteractions[2]=0;
    mouseInteractions[3]=false;
    //Fullscreen management
    document.onfullscreenchange = () => {mouseInteractions[3] = !mouseInteractions[3]};
    function map(v,n1,n2,m1,m2){return (v-n1)/(n2-n1)*(m2-m1)+m1;};
    //Event listeners for the keyboard presses
    document.addEventListener('keydown', function(event){keydown[event.keyCode] = true;});
    document.addEventListener('keyup', function(event){delete keydown[event.keyCode];});
    //Event listeners for the mouse position and click status
    document.addEventListener('mousemove', function(event){let element = event.target;
                                                            let br = element.getBoundingClientRect();
                                                            if(mouseInteractions[3])
                                                            {
                                                                let ratio = window.innerHeight/canvas.height;
                                                                let offset = (window.innerWidth-(canvas.width*ratio))/2;
                                                                mouseInteractions[0] = map(event.clientX-br.left-offset,0,canvas.width*ratio,0,element.width);
                                                                mouseInteractions[1] = map(event.clientY-br.top,0,canvas.height*ratio,0,element.height);
                                                            }
                                                            else
                                                            {
                                                                mouseInteractions[0] = event.clientX - br.left;
                                                                mouseInteractions[1] = event.clientY - br.top;
                                                            }});
    document.addEventListener('click', function(event){mouseInteractions[2]=1});

/**
 * Main function that calls itself via requestAnimationFrame() - Repeats function each frame so that the game keeps updating
 */
export function main()
 {
    requestAnimationFrame(main);  

    // Calculating elapsed time since last loop
    now = Date.now();
    elapsed = now - then;

    // If enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval)
    {
        //Putting the last frame update now before updating the frame
        then = now - (elapsed % fpsInterval);
        //Updating the frame using the currently active screen in the screenHandler
        screenArray[screenHandler.activeScreen].update();
    }
 }

/**
 * Function that declares all the screens and items (passing all variables and functions necessary as parameters) and sets up the main function, requesting animation frame on the main function at the end
 */
export function mainSetup()
{
    screenHandler = new ScreenHandler();

    spaceship = new Spaceship();
    spaceshipAnim = new Spaceship();

    background = new Background();
    spawner = new Spawner(gameToBossSetup);
    player = new Player(deadSetup);
    ui = new UI(player, spawner);

   
    projoSpawner = new ProjoSpawner();
    boss = new Boss(player, projoSpawner, winSetup);
    turretUp = new Turret(boss, projoSpawner, 40);
    turretDown = new Turret(boss, projoSpawner, 210);
    uiBoss = new UIBoss(player, boss);

    startScreen = new StartScreen(keydown, mouseInteractions, spaceshipSetup, gameToBossSetup);
    spaceshipSelectionScreen = new SpaceshipSelectionScreen(keydown, player, ui, uiBoss, gameSetup, mouseInteractions);
    gameScreen = new GameScreen(keydown, player, spawner, ui, mouseInteractions);
    deadScreen = new DeadScreen(keydown, mouseInteractions, mainSetup, player);
    winScreen = new WinScreen(keydown, mouseInteractions, mainSetup, player);
    bossScreen = new BossScreen(keydown, player, mouseInteractions, boss);
    gameToBossScreen = new GameToBossScreen(keydown, player, ui, mouseInteractions, screenHandler, bossSetup, boss, turretUp, turretDown);

    screenArray = [startScreen, spaceshipSelectionScreen, gameScreen, deadScreen, bossScreen, winScreen, gameToBossScreen];

    //FPS stuff
    fpsInterval = 1000 / fps;  // One second divided by the number of frame we want per second, results is in ms 1000/54 = 18.51851851851852
    then = Date.now();
    startTime = then;

    requestAnimationFrame(main);
}

/**
 * Function that sets up the spaceshipSelectionScreen - Needs to be called each time we want to pass it as the active screen
 */
function spaceshipSetup()
{
    //Starting this screen's music and sets its volume
    spaceshipSelectionScreen.music.volume = 0.5;
    spaceshipSelectionScreen.music.play();

    //Initializing the x position of the second spaceship element in the screen (used for the animations when selecting) so that it is not immediately visible
    spaceshipAnim.x=-250;

    //Adding both spaceship elements on the actual screen
    spaceshipSelectionScreen.add(spaceship);
    spaceshipSelectionScreen.add(spaceshipAnim);

    //Replacing the activeScreen so that the main calls on this one
    screenHandler.activeScreen = screenHandler.spaceshipSelectionScreenNbr;
}

/**
 * Function that sets up the gameScreen - Needs to be called each time we want to pass it as the active screen
 */
function gameSetup()
{
    //Pausing the selection screen music
    spaceshipSelectionScreen.music.pause();

    //Adding all the elements on the screen
    gameScreen.add(background);
    gameScreen.add(spawner);
    gameScreen.add(player);
    gameScreen.add(player.shootHandler);
    gameScreen.add(ui);

    //Starting this screen's music and sets its volume
    gameScreen.music.volume = 0.8;
    gameScreen.music.play();
    //gameScreen.musicTest.volume = 0.0;
    //gameScreen.musicTest.play();

    //Replacing the activeScreen so that the main calls on this one
    screenHandler.activeScreen = screenHandler.gameScreenNbr;
}

/**
 * Function that sets up the gameToBossScreen
 */
function gameToBossSetup()
{
    //Pausing the selection screen music
    //spaceshipSelectionScreen.music.pause();

    //Adding all the elements on the screen
    gameToBossScreen.add(background);
    gameToBossScreen.add(player);
    gameToBossScreen.add(player.shootHandler);
    gameToBossScreen.add(ui);
    gameToBossScreen.add(boss);
    gameToBossScreen.add(turretUp);
    gameToBossScreen.add(turretDown);

    //Starting this screen's music and sets its volume
    //gameScreen.music.volume = 0.8;
    //gameScreen.music.play();
    //gameScreen.musicTest.volume = 0.0;
    //gameScreen.musicTest.play();

    //Replacing the activeScreen so that the main calls on this one
    screenHandler.activeScreen = screenHandler.gameToBossScreenNbr;
}

/**
 * Function that sets up the deadScreen - Needs to be called each time we want to pass it as the active screen
 */
function deadSetup()
{
    //Pausing the game music
    gameScreen.music.pause();

    //Replacing the activeScreen so that the main calls on this one
    screenHandler.activeScreen = screenHandler.deadScreenNbr;
}

/**
 * Function that sets up the winScreen - Needs to be called each time we want to pass it as the active screen
 */
function winSetup()
{
    //Pauseing the game music
    gameScreen.music.pause();

    //replacing the activeScreen so that the main calls on this one
    screenHandler.activeScreen = screenHandler.winScreenNbr;
}

/**
 * Function that sets up the bossScreen - Needs to be called each time we want to pass it as the active screen
 */
function bossSetup()
{
    //music

    //Adding all the items on the screen
    bossScreen.add(background); 
    bossScreen.add(boss);
    bossScreen.add(boss.projoSpawner);
    bossScreen.add(player);
    bossScreen.add(player.shootHandler);
    bossScreen.add(uiBoss);
    bossScreen.add(turretUp);
    bossScreen.add(turretDown);

    //Replacing the activeScreen so that the main calls on this one
    screenHandler.activeScreen = screenHandler.bossScreenNbr;
}

mainSetup();