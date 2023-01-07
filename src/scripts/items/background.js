//Get canvas element and 2d context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Images management
    //Instanciating images variables
    let starImage, dustImage, nebulaImage, planetImage;
    //Calling the function that loads images from the files
    loadImages();

/**
 * Class that contains all the layers of the background (composite of the layers)
 */
export default class Background
{
    elements=[];
    //Assigning all layers on creation
    constructor()
    {
        this.elements[0] = new Layer(0, 0, starImage, 0.1);
        this.elements[1] = new Layer(0, 0, nebulaImage, 0.2);
        this.elements[2] = new Layer(0, 0, planetImage, 0.3);
        this.elements[3] = new Layer(0, 0, dustImage, 0.4);
    }

    update()
    {
        for (let i in this.elements)
        {
            this.elements[i].update();
        }
    }

    draw()
    {
        for (let i in this.elements)
        {
            this.elements[i].draw();
        }
    }

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
}

/**
 * Class that represents a layer of the background (displays one image moving at a certain speed and looping)
 */
class Layer
{
    constructor(x, y, image, speed)
    {
        this.x = x;
        this.y = y;
        this.image = image;
        this.fpsAdapt = 2;
        this.speed = speed;
    }
    update()
    {
        this.x -= this.speed*this.fpsAdapt;
    }

    draw()
    {
        if(this.x <= -this.image.width + canvas.width){ctx.drawImage(this.image, this.x + this.image.width, this.y);}
        ctx.drawImage(this.image, this.x, this.y);
        if(this.x <= -this.image.width){this.x = 0;}
    }
}

/**
 * Function that loads all background related images from the files
 */
function loadImages()
{
    starImage = document.createElement("img");
    starImage.src = "resources/images/game_image/background_image/star.png";
    nebulaImage = document.createElement("img");
    nebulaImage.src = "resources/images/game_image/background_image/nebula.png";
    planetImage = document.createElement("img");
    planetImage.src = "resources/images/game_image/background_image/planet.png";
    dustImage = document.createElement("img");
    dustImage.src = "resources/images/game_image/background_image/dust.png";
}