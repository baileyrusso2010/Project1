(function(){
    "use strict"

    let barLIB = {
        getDistance(dx, dy){

            return Math.sqrt((dx * dx) + (dy * dy));
        },

        getRandomDensity(max){
            return Math.random() * max;
        },

        getMax(value, canvas){
            return Math.max(Math.min(value, canvas),0);
        }
    };

    if(window){
        window["barLIB"] = barLIB;
    }else{
        throw "Something Went Wrong";
    }

})();