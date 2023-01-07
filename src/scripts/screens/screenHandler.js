/**
 * Allows other classes to manage activeScreen  
 * Must be passed as a parameter
 */
export default class ScreenHandler 
{
    //Screens numbers in the screenArray
    startScreenNbr = 0;
    spaceshipSelectionScreenNbr = 1;
    gameScreenNbr = 2;
    deadScreenNbr = 3;
    bossScreenNbr = 4;
    winScreenNbr = 5;
    gameToBossScreenNbr = 6;

    //Currently active screen number
    activeScreen = this.startScreenNbr;
}