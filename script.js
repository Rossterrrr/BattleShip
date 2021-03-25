const ships = document.querySelectorAll('.ships_container_1 div');
const field = document.querySelector('.game_field_1');
let coords = [];
let mouseDrag = false;
let prevX,prevY,curX,curY;
let currentEvent;
let currentShip;
const blockSize = 20;

function gameInit(){
    let offsetX = -220;
    let offsetY = 20;
    let counter = 0;
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
function moveShip(e){
    curX = e.pageX;
    curY = e.pageY;
    console.log('cur',curX,curY);
    let offsetX = curX - prevX;
    let offsetY = curY - prevY;
    prevX = curX;
    prevY = curY;
    console.log('offset',offsetX,offsetY);
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
    checkCollision(ship,coords[((+ship.getAttribute('id'))*2)-2],coords[((+ship.getAttribute('id'))*2)-1])
    ship.style.cssText += `
        left:${coords[((+ship.getAttribute('id'))*2)-2]}px;
        top:${coords[((+ship.getAttribute('id'))*2)-1]}px;
    `;
    console.log(coords[((+ship.getAttribute('id'))*2)-2],coords[((+ship.getAttribute('id'))*2)-1])
}
function checkCollision(ship,x,y){
    ships.forEach((elem) => {
        let j = coords[((+elem.getAttribute('id'))*2)-2];
        if((x - coords[j]) > -2*blockSize && (x - coords[j]) < 2*blockSize && (y - coords[j+1]) > -2*blockSize && (y - coords[j+1]) > -2*blockSize){
            
        }
    });
}
function turnShip(ship){
    let shipProt = {};
    let tmp;
    shipProt = window.getComputedStyle(ship);
    tmp = window.getComputedStyle(ship).height
    ship.style.cssText += `
        height:${window.getComputedStyle(ship).width};
        width:${tmp};
    `;
}

ships.forEach(elem => {
    elem.addEventListener('mousedown',(e) => {
        e.preventDefault();
        if(e.which == 1){
            console.log('mouse down');
            prevX = e.pageX;
            prevY = e.pageY;
            mouseDrag = true;
            console.log('prev' , prevX,prevY);
            currentShip = e.target;
        }else if(e.which == 2){
            currentShip = e.target; 
            turnShip(currentShip);
        }
        
    });
});

document.addEventListener('mouseup',(e) => {
    e.preventDefault();
    console.log('mouse up');
    e.target.classList.remove('active');
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
