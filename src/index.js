(function(){

"use strict"

let ctx;
let canvas;
let data, imageData;
let slider, slider1;
let maxRandomD = 10;
let radius = 3;
let squareRadius = 5;
let pixelRatio;
let pixelSize = 2;
let particleArray = [];
let maxDistance = 100;
const mouse ={
    x: null,
    y: null,
    radius: 10
};
let img;
let isCircle = true;
let dropDown;

window.onload = init;


function init(){
    canvas = document.querySelector("#myCanvas");
    
    ctx = canvas.getContext("2d", {alpha: false});

    canvas.height = 500;
    canvas.width = 500;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    img = new Image();

    slider = document.querySelector("#points");
    slider.value = maxDistance;

    slider.addEventListener('change', function(){

        maxDistance = slider.value;
    });

    dropDown = document.querySelector("#shapes");

    dropDown.addEventListener('change', function(){
        isCircle = !isCircle;
    });

    slider1 = document.querySelector("#mouse");

    slider1.addEventListener('click', function(){
        mouse.radius = slider1.value;
    });


    addEventListener("mousemove", function(event){
        let rect = canvas.getBoundingClientRect();
        mouse.x = (event.clientX - rect.left);
        mouse.y = (event.clientY - rect.top);
        
    });


    document.querySelector('input[type="file"]').addEventListener('change', function() {

        if (this.files[0] != null){
            img.src = URL.createObjectURL(this.files[0]);
            ctx.clearRect(0,0,canvas.width, canvas.height);

            particleArray = [];
        }
    });

    
    function animate(){
        
        requestAnimationFrame(animate);
        
        ctx.clearRect(0,0,canvas.width,canvas.height);

       for(let i = 0; i < particleArray.length; i++){
            particleArray[i].update();
        }

    }//end of animate


    img.onload = function(){
        

        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        //typed array -float value
        imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
       // ChangeOpacity();
        ctx.putImageData(imageData,0,0);
        ctx.clearRect(0,0,canvas.width,canvas.height);
       // ctx.fillStyle = "black";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        onLoad();
        animate();

    }//end of onload    

    img.src = 'images/theScream.jpg';

}//end of init

function onLoad(){

    let col = Math.ceil(canvas.width / pixelSize);
    let row = Math.ceil(canvas.height / pixelSize);
    ctx.save();
   // constructor(ctx, x, y, radius, red, green, blue){
    for(let i = 0; i < canvas.width; i+=3){
        const y = (i + 0.5) * pixelSize;
        const pixelY = window.barLIB.getMax(y, canvas.height);

        for(let j = 0; j < canvas.height; j+=3){
            const x = (j + 0.5) * pixelSize;
            const pixelX = window.barLIB.getMax(x, canvas.width);


            const pixelIndex = (pixelX + pixelY * canvas.width) * 4;
            const red = imageData.data[pixelIndex +0];
            const green = imageData.data[pixelIndex +1];
            const blue = imageData.data[pixelIndex +2];

            let newShape = new Circle(ctx, x, y, squareRadius, radius, red, green, blue);

            newShape.drawShape();
            particleArray.push(newShape);
        }
    }

    ctx.restore();
}//end of onLoad

function drawOnCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
}

function ChangeOpacity(val, index){
    for(let i =0; i < imageData.data.length; i+=4){

        imageData.data[i+index] = val;

    }
}//change opacity

class Circle{
    constructor(ctx, x, y, squareR, radius, red, green, blue){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.density = window.barLIB.getRandomDensity(maxRandomD);
        this.base = {
            x : x,
            y : y
        };
        this.squareR = squareR;

    }//end of constructor

    drawShape(){
        ctx.beginPath();
        ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
        ctx.lineWidth = 0;
        
        if(isCircle == true){
            ctx.arc(this.x,this.y,this.radius,0*Math.PI, 2*Math.PI);
        }else{
            ctx.fillRect(this.x,this.y, this.squareR, this.squareR);
        }
        ctx.fill();
        ctx.closePath();

    }//end of drawCircle

    update(){

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = window.barLIB.getDistance(dx,dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        let force = (maxDistance - distance)/ maxDistance;
        if(force < 0){force = 0;}

        let densityOffset = 0.6;

        let directionX = (forceDirectionX * force * this.density * densityOffset);
        let directionY = (forceDirectionY * force * this.density* densityOffset);

        if(distance < mouse.radius + this.radius*2){
            this.x -= directionX;
            this.y -= directionY;
        }else{
            let paddingAmount = 0.75;
            if(this.x != this.base.x){
                let distanceX = this.x - this.base.x;
                this.x -= distanceX*paddingAmount;
            }if(this.y != this.base.y){
                let distanceY = this.y - this.base.y;
                this.y -= distanceY*paddingAmount;

            }
            
        }//end of else
        this.drawShape();
    
    }//end of update

}//end of circle

})();