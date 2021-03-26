const ships = document.querySelectorAll('.ships_container_1 div');
const ships_2 = document.querySelectorAll('.ships_container_2 div');
let coords = [];
let mouseDrag = false;
let prevX,prevY,curX,curY;
let currentEvent;
let currentShip;
let counter = 0;
const blockSize = 20;

function gameInit(){
    let offsetX = -220;
    let offsetY = 20;
    ships.forEach((elem,i) => {
        elem.style.cssText = `
            left:${offsetX}px;
            top:${offsetY}px;
        `;
        coords[counter] = offsetX;
        counter++;
        coords[counter] = offsetY;
        offsetX = offsetX + 40;
        if(i == 4){
            offsetY = offsetY + 100;
            offsetX = -220;
        }
        counter++;
    });
}
function gameInit_2(){
    let offsetX = 220;
    let offsetY = 20;
    ships_2.forEach((elem,i) => {
        elem.style.cssText = `
            left:${offsetX}px;
            top:${offsetY}px;
        `;
        coords[counter] = offsetX;
        counter++;
        coords[counter] = offsetY;
        offsetX = offsetX + 40;
        if(i == 4){
            offsetY = offsetY + 100;
            offsetX = 220;
        }
        counter++;
    });
}
function moveShip(e){
    curX = e.pageX;
    curY = e.pageY;
    let offsetX = curX - prevX;
    let offsetY = curY - prevY;
    prevX = curX;
    prevY = curY;
    coords[((+currentShip.getAttribute('id'))*2)-2] = coords[((+currentShip.getAttribute('id'))*2)-2] + offsetX;
    coords[((+currentShip.getAttribute('id'))*2)-1] = coords[((+currentShip.getAttribute('id'))*2)-1] + offsetY;
    currentShip.style.cssText += `
        left:${coords[((+currentShip.getAttribute('id'))*2)-2]}px;
        top:${coords[((+currentShip.getAttribute('id'))*2)-1]}px;
        z-index:15;
    `;
}
function coordMathRoundX(x){
    x = (Math.round(x/blockSize)) * blockSize;
    return x;
}
function coordMathRoundY(y){
    y = (Math.round(y/blockSize)) * blockSize;
    return y;
}
function setShipPlace(ship){
    coords[((+ship.getAttribute('id'))*2)-2] = coordMathRoundX(coords[((+ship.getAttribute('id'))*2)-2]);
    coords[((+ship.getAttribute('id'))*2)-1] = coordMathRoundY(coords[((+ship.getAttribute('id'))*2)-1]);  
    if(checkCollision(ship,coords[((+ship.getAttribute('id'))*2)-2],coords[((+ship.getAttribute('id'))*2)-1]) == true){
        findEmptyPosition(ship,coords[((+ship.getAttribute('id'))*2)-2],coords[((+ship.getAttribute('id'))*2)-1]);
    }
    ship.style.cssText += `
        left:${coords[((+ship.getAttribute('id'))*2)-2]}px;
        top:${coords[((+ship.getAttribute('id'))*2)-1]}px;
    `;
}
function findEmptyPosition(ship,x,y){
    let position_find = false;
    let dx,dy,signDx,signDy;
    let width = +window.getComputedStyle(ship).width.slice(0,window.getComputedStyle(ship).width.length - 2);
    let height = +window.getComputedStyle(ship).height.slice(0,window.getComputedStyle(ship).height.length - 2);
    while(!position_find){
        dx = Math.round(Math.random()) * blockSize;
        dy = Math.round(Math.random()) * blockSize;
        signDx = Math.round(Math.random());
        signDy = Math.round(Math.random()); 
        if(signDx == 0){dx = -dx;}
        if(signDy == 0){dy = -dy;}
        x += dx;
        y += dy;
        if( x < 0 || x + width > blockSize * 10 || y < 0 || y + height > blockSize * 10){
            x = (blockSize * 10)/2;
            y = (blockSize * 10)/2;
        }
        if(!checkCollision(ship,x,y)){
            position_find = true;
        }
    }
    coords[((+ship.getAttribute('id'))*2)-2] = x;
    coords[((+ship.getAttribute('id'))*2)-1] = y;


}
function checkCollision(ship,x,y){
    let width = +window.getComputedStyle(ship).width.slice(0,window.getComputedStyle(ship).width.length - 2);
    let height = +window.getComputedStyle(ship).height.slice(0,window.getComputedStyle(ship).height.length - 2);
    let collision = false;
    ships.forEach((elem) => {
        let xShip = coords[((+elem.getAttribute('id'))*2)-2];
        let yShip = coords[((+elem.getAttribute('id'))*2)-1]; 
        let shipsWidth = +window.getComputedStyle(elem).width.slice(0,window.getComputedStyle(ship).width.length - 2);
        let shipsHeight = +window.getComputedStyle(elem).height.slice(0,window.getComputedStyle(ship).height.length - 2);
        let needed_ship = false;
        ships.forEach(item => {
            if (item == ship){
                needed_ship = true;
            }
        });
        if(needed_ship){
            if(ship != elem){
                if((yShip + shipsHeight + blockSize > y  && yShip - blockSize - height < y) && (xShip + shipsWidth + blockSize > x  && xShip - blockSize - width < x)){
                    collision = true;
                }
            }
            if(x < 0 || x + width > blockSize * 10 || y < 0 || y + height > blockSize * 10){
                collision = true;
            }
        }
       
        
    });
    ships_2.forEach((elem) => {
        let xShip = coords[((+elem.getAttribute('id'))*2)-2];
        let yShip = coords[((+elem.getAttribute('id'))*2)-1]; 
        let shipsWidth = +window.getComputedStyle(elem).width.slice(0,window.getComputedStyle(ship).width.length - 2);
        let shipsHeight = +window.getComputedStyle(elem).height.slice(0,window.getComputedStyle(ship).height.length - 2);
        let needed_ship = false;
        ships_2.forEach(item => {
            if (item == ship){
                needed_ship = true;
            }
        });
        if(needed_ship){
        if(ship != elem){
            if((yShip + shipsHeight + blockSize > y  && yShip - blockSize - height < y) && (xShip + shipsWidth + blockSize > x  && xShip - blockSize - width < x)){
                collision = true;
            }
        }
        if(x < 0 || x + width > blockSize * 10 || y < 0 || y + height > blockSize * 10){
            collision = true;
        }
        }
        
        
    });
    return collision;
}
function turnShip(ship){
    let tmp;
    tmp = window.getComputedStyle(ship).height
    ship.style.cssText += `
        height:${window.getComputedStyle(ship).width};
        width:${tmp};
    `;
}
function mouseDownEvent(elem){
    elem.addEventListener('mousedown',(e) => {
        e.preventDefault();
        if(e.which == 1){
            prevX = e.pageX;
            prevY = e.pageY;
            mouseDrag = true;
            currentShip = e.target;
        }else if(e.which == 2){
            currentShip = e.target;
            turnShip(currentShip);
        }
        
    });
}
ships.forEach(elem => mouseDownEvent(elem));
ships_2.forEach(elem => mouseDownEvent(elem));

document.addEventListener('mouseup',(e) => {
    e.preventDefault();
    e.target.style.cssText += 'z-index:1';
    mouseDrag = false;
    setShipPlace(currentShip);
});

document.addEventListener('mousemove',(e) => {
    if(mouseDrag == true){
        moveShip(e);
    }
});

gameInit();
gameInit_2();
