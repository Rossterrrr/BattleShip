const blockSize = 20;
function setGame(){
    class ShipInfo{
        xMax;
        yMax; 
        constructor(x,y,width,height,side,death){
            this.x = x;
            this.y = y,
            this.width = width;
            this.height = height;
            this.side = side;
            this.death = death;
            this.xMax = x + width;
            this.yMax = y + height;
            this.health = (width / blockSize) * (height / blockSize); 
        }  
    }

    const ships = document.querySelectorAll('.ships_container_1 div');
    const ships_2 = document.querySelectorAll('.ships_container_2 div');
    let coords = [];
    let mouseDrag = false;
    let prevX,prevY,curX,curY;
    let currentShip;
    let counter = 0;

    let player1IsReady = false;
    let player2IsReady = false;
    
    let shipsSideLeft = [];
    let shipsSideRight = []; 

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
    function initInfoBar(){
        const infoBar = document.querySelector('ul');
        let li = [];
        li[0] = document.createElement('li');
        li[1] = document.createElement('li');
        li[0].textContent = 'Расставить корабли вручную';
        li[0].classList.add('hand');
        li[1].textContent = 'Расставить корабли автоматически';
        li[1].classList.add('auto');
        infoBar.append(li[0]); 
        infoBar.append(li[1]);
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
        if(checkReady() && player1IsReady && player2IsReady){
            let count = 0;
            ships.forEach(elem => removeMouseDownListener(elem));
            ships_2.forEach(elem => removeMouseDownListener(elem));
        
            document.removeEventListener('mouseup',mouseUpListener);
        
            document.removeEventListener('mousemove',mouseMoveListener);
            for(let i = 0;i < coords.length ;i+=2){
                let obj = document.querySelector(`[id="${count+1}"]`);
                let width = +window.getComputedStyle(obj).width.slice(0,window.getComputedStyle(obj).width.length - 2);
                let height = +window.getComputedStyle(obj).height.slice(0,window.getComputedStyle(obj).height.length - 2);
                if(i <= 19){
                    shipsSideLeft[count] = new ShipInfo(coords[i],coords[i+1],width,height,'left','false');
                }
                if (i == 18){
                    count = -1;
                }
                if(i > 19){
                    shipsSideRight[count] = new ShipInfo(coords[i],coords[i+1],width,height,'right','false');
                }
                count++;
            }
            console.log(shipsSideLeft,shipsSideRight);
            ships.forEach(elem => {
                elem.remove();
            });
            ships_2.forEach(elem => {
                elem.remove();
            });
            gameProcess(shipsSideLeft,shipsSideRight);
            clearInfoBar()
        }
    }
    function checkReady(){
        let ready = false;
        let i = 0;
        ships.forEach(elem => {
            let x = coords[((+elem.getAttribute('id'))*2)-2];
            let y = coords[((+elem.getAttribute('id'))*2)-1];
            if(x >= 0 && x < blockSize * 10 && y >= 0 && y < blockSize * 10){
                i++;
            }
        });
        ships_2.forEach(elem =>{
            let x = coords[((+elem.getAttribute('id'))*2)-2];
            let y = coords[((+elem.getAttribute('id'))*2)-1];
            if(x >= 0 && x < blockSize * 10 && y >= 0 && y < blockSize * 10){
                i++;
            }
        });
        if (i == 20){
            ready = true;
            console.log('ready');

        }
        return ready;
    }
    function removeMouseDownListener(elem){
        elem.removeEventListener('mousedown',mouseDownFunction)
     
    }

    function findEmptyPosition(ship,x,y){
        let position_find = false;
        let dx,dy,signDx,signDy,orientation;
        let width = +window.getComputedStyle(ship).width.slice(0,window.getComputedStyle(ship).width.length - 2);
        let height = +window.getComputedStyle(ship).height.slice(0,window.getComputedStyle(ship).height.length - 2);
        while(!position_find){
            orientation = Math.round(Math.random()); 
            dx = Math.round(Math.random()) * blockSize;
            dy = Math.round(Math.random()) * blockSize;
            signDx = Math.round(Math.random());
            signDy = Math.round(Math.random()); 
            if(orientation == 0){
                turnShip(ship);
            }
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
    function mouseDownFunction(e){
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
    }
    function mouseDownListener(elem){
        elem.addEventListener('mousedown',mouseDownFunction);
     
    }
    function mouseUpListener(e){
        e.preventDefault();
        e.target.style.cssText += 'z-index:1';
        mouseDrag = false;
        setShipPlace(currentShip);
    }
    function mouseMoveListener(e){
        if(mouseDrag == true){
            moveShip(e);
        }
    }
    function clearInfoBar(){
        document.querySelectorAll('section li').forEach(elem => {
            elem.remove();
        });
        document.querySelectorAll('section button').forEach(elem => {
            elem.remove();
        });
    }
    function readyBTN(e){
        e.preventDefault();
        e.target.style.cssText = `transform:scale(1.1);`;
        let k = 0,m = 0;
        ships.forEach(elem => {
            let x = coords[((+elem.getAttribute('id'))*2)-2];
            let y = coords[((+elem.getAttribute('id'))*2)-1];
            if(x >= 0 && x < blockSize * 10 && y >= 0 && y < blockSize * 10){
                k++;
            }
        });
        if(k == 10){
            player1IsReady = true;
            console.log('pl 1 set true');
        }else{
           document.querySelector('li').style.cssText += `color:red`;
           setTimeout(() => {
            document.querySelector('li').style.cssText += ``;
           },1500); 
        }
        ships_2.forEach(elem => {
            let x = coords[((+elem.getAttribute('id'))*2)-2];
            let y = coords[((+elem.getAttribute('id'))*2)-1];
            if(x >= 0 && x < blockSize * 10 && y >= 0 && y < blockSize * 10){
                m++;
            }
        });
        if(player1IsReady){
            document.querySelector('li').textContent = 'Игрок 2 , расставьте все свои корабли на поле 1, по готовности нажмите кнопку';
            if(player1IsReady == true && m == 10){
                player2IsReady = true;
                console.log('pl 2 set true');
            }else {
                document.querySelector('li').style.cssText += `color:red`;
                setTimeout(() => {
                 document.querySelector('li').style.cssText += ``;
                },1500); 
            }
        }
        console.log('button is work');
        k = 0;
        m = 0;
        
    }
    function readyBTNauto(e){
        e.preventDefault();
        e.target.style.cssText = `transform:scale(1.1);`;
        if(player1IsReady){
            player2IsReady = true;
            console.log('pl 2 set true');
        }
        player1IsReady = true;
        document.querySelectorAll('.ships_container_1 div').forEach(elem => {
            elem.style.cssText += 'display:none;';
        });
        ships_2.forEach(elem => {
            setShipPlace(elem);
        });
        if (!player2IsReady){
            
        }
        console.log('pl 1 set true');
        document.querySelector('.playerdescr').textContent = 'Игрок 2 ,по желанию, сделайте корректировки и нажмите кнопку ГОТОВ'
    }
    function changeMethod(e){
        if(e.target && e.target.classList.contains('hand')){
            handleSetShips();
            clearInfoBar()
            const li2 = document.createElement('li');
            li2.classList.add('playerdescr')
            li2.textContent = 'Игрок 1 , расставьте все свои корабли на поле 1, по готовности нажмите кнопку';
            const readyBtn = document.createElement('button');
            readyBtn.classList.add('ready');
            readyBtn.textContent = 'ГОТОВ';
            document.querySelector('ul').append(li2);
            document.querySelector('.info_bar').append(readyBtn);
            readyBtn.addEventListener('mousedown',readyBTN);
            readyBtn.addEventListener('mouseup',(e) => {
                e.target.style.cssText = `transform:scale(1);`;
            });
            
        }
        if(e.target && e.target.classList.contains('auto')){
            autoSetShips();
            clearInfoBar();
            ships.forEach(elem => {
                setShipPlace(elem);
            });
            const li2 = document.createElement('li');
            li2.classList.add('playerdescr')
            li2.textContent = 'Игрок 1 ,по желанию, сделайте корректировки и нажмите кнопку ГОТОВ';
            const readyBtn = document.createElement('button');
            readyBtn.classList.add('ready','player1');
            readyBtn.textContent = 'ГОТОВ';
            document.querySelector('ul').append(li2);
            document.querySelector('.info_bar').append(readyBtn);
            readyBtn.addEventListener('mousedown',readyBTNauto);
            readyBtn.addEventListener('mouseup',(e) => {
                e.target.style.cssText = `transform:scale(1);`;
            });

        }
    }
    function handleSetShips(){
        ships.forEach(elem => mouseDownListener(elem));
        ships_2.forEach(elem => mouseDownListener(elem));
        document.addEventListener('mouseup',mouseUpListener);
        document.addEventListener('mousemove',mouseMoveListener);
    }
    function autoSetShips(){
        ships.forEach(elem => mouseDownListener(elem));
        ships_2.forEach(elem => mouseDownListener(elem));
        document.addEventListener('mouseup',mouseUpListener);
        document.addEventListener('mousemove',mouseMoveListener);    
    }
    function elementFocus(e){
            if(e.target && e.target.tagName == 'LI' ){
                e.target.style.cssText = `
                    transform:scale(1.1);
                    color:green;
                `;
            }else {
            document.querySelectorAll('li').forEach(elem => {
                    elem.style.cssText = `
                        transform:scale(1);
                        color:black;
                    `;
                });
            }
    }
    gameInit();
    gameInit_2();
    initInfoBar();
    
    document.querySelector('ul').addEventListener('mousedown',changeMethod);
    document.querySelector('.game').addEventListener('mousemove',elementFocus);

}
function gameProcess(shipsSideLeft,shipsSideRight){
    const gameField = document.querySelector('.game_field_1');
    const gameField2 = document.querySelector('.game_field_2');
    let xRect = coordMathRound(gameField.getBoundingClientRect().x);
    let yRect = coordMathRound(gameField.getBoundingClientRect().y+20);
    let xRect2 = coordMathRound(gameField2.getBoundingClientRect().x);
    let yRect2 = coordMathRound(gameField2.getBoundingClientRect().y+20);
    let widthRect = coordMathRound(gameField.getBoundingClientRect().width);
    let heightRect = coordMathRound(gameField.getBoundingClientRect().height);
    let mouseDown = false;
    

    function initGameInfoBar(){
        const gameBar = document.querySelector('ul');
        const desc = document.createElement('li');
        desc.textContent = 'Стреляет правый игрок';
        gameBar.append(desc);
        gameField.classList.add('active');
     
    }
    function changeShootSide(){
        if (gameField2.classList.contains('active')){
            
            gameField2.addEventListener('mousedown',mouseDownEvent);
            gameField2.addEventListener('mouseup',mouseUpEvent2);
            gameField.removeEventListener('mousedown',mouseDownEvent);
            gameField.removeEventListener('mouseup',mouseUpEvent);
            const info = document.createElement('li');
            info.textContent = 'Стреляет игрок справа';
            document.querySelector('section ul').remove();
            document.querySelector('section ul').append(info);

        }
        if (gameField.classList.contains('active')){
            
            gameField.addEventListener('mousedown',mouseDownEvent);
            gameField.addEventListener('mouseup',mouseUpEvent);
            gameField2.removeEventListener('mousedown',mouseDownEvent);
            gameField2.removeEventListener('mouseup',mouseUpEvent2);
            const info = document.createElement('li');
            info.textContent = 'Стреляет игрок слева';
            document.querySelector('section ul').remove();
            document.querySelector('section ul').append(info);

        }
    }
    function coordMathRound(num){
        num = (Math.floor(num/blockSize)) * blockSize;
        return num;
    }
    
    function mouseDownEvent(e){
        mouseDown = true;
    }
    function mouseUpEvent2(e){
        if (mouseDown == true){
            if((e.clientX >= xRect2 && e.clientX < xRect2 + widthRect) && (e.clientY >= yRect2 && e.clientY < yRect2 + heightRect)){
                console.log(coordMathRound(e.clientX - xRect2),coordMathRound(e.clientY - yRect2));
                mouseDown = false;
                if(shot(coordMathRound(e.clientX - xRect2),coordMathRound(e.clientY - yRect2),shipsSideRight)){
                    if(!checkPositionWasShooted(coordMathRound(e.clientX - xRect2),coordMathRound(e.clientY - yRect2),'2')){
                        createHit(coordMathRound(e.clientX - xRect2),coordMathRound(e.clientY - yRect2),shipsSideRight,'2');
                    }
                }else{
                    if(!checkPositionWasShooted(coordMathRound(e.clientX - xRect2),coordMathRound(e.clientY - yRect2),'2')){
                        createEmptyShot(coordMathRound(e.clientX - xRect2),coordMathRound(e.clientY - yRect2),'2');
                        gameField2.classList.remove('active');
                        gameField.classList.add('active');
                        changeShootSide();
                    }
                }
            }
        }
    }
    function mouseUpEvent(e){
        if (mouseDown == true){
            if((e.clientX >= xRect && e.clientX < xRect + widthRect) && (e.clientY >= yRect && e.clientY < yRect + heightRect)){
                console.log(coordMathRound(e.clientX - xRect),coordMathRound(e.clientY - yRect));
                mouseDown = false;
                if(shot(coordMathRound(e.clientX - xRect),coordMathRound(e.clientY - yRect),shipsSideLeft)){
                    if(!checkPositionWasShooted(coordMathRound(e.clientX - xRect),coordMathRound(e.clientY - yRect),'1')){
                        createHit(coordMathRound(e.clientX - xRect),coordMathRound(e.clientY - yRect),shipsSideLeft,'1');
                    }
                }else{
                    if(!checkPositionWasShooted(coordMathRound(e.clientX - xRect),coordMathRound(e.clientY - yRect),'1')){
                        createEmptyShot(coordMathRound(e.clientX - xRect),coordMathRound(e.clientY - yRect),'1');
                        gameField.classList.remove('active');
                        gameField2.classList.add('active');
                        changeShootSide();
                    }
                }
            }
        }
    }
    function checkPositionWasShooted(xShot,yShot,numberOfField){
        let spanBlock = document.querySelectorAll(`.game_field_${numberOfField} span`);
        let posWasShooted = false; 
        spanBlock.forEach(item => {
            if(xShot == +window.getComputedStyle(item).left.slice(0,window.getComputedStyle(item).left.length - 2) && yShot == +window.getComputedStyle(item).top.slice(0,window.getComputedStyle(item).top.length - 2) ){
                posWasShooted = true;
            }
        });
        return posWasShooted;
    }
    function shot(xShot,yShot,ships){
        let isShot = false;
        ships.forEach((element) => {
            for(let j = 0;j < element.height / blockSize;j++ ){
                if(yShot == element.y + blockSize * j && xShot == element.x){
                    isShot = true;
                }
            }
            for(let k = 0; k < element.width / blockSize;k++){
                if(xShot == element.x + blockSize * k && yShot == element.y){
                    isShot = true;
                }
            }
            
        });
        return isShot;
    }
    function checkDeath(ship,numberOfField){
        let isFind = false;
        if (ship.health == 0){
            console.log('health = 0');
            for(let i = 0;i < ship.height / blockSize; i++){
               document.querySelectorAll(`.game_field_${numberOfField} .grey_cross`).forEach(elem => {
                    if(window.getComputedStyle(elem).top == `${ship.y + (blockSize * i)}px` && window.getComputedStyle(elem).left == `${ship.x}px`){
                        elem.classList.remove('grey_cross');
                        elem.classList.add('red_cross');
                        isFind = true;
                    }
                    if(!isFind){
                        if(window.getComputedStyle(elem).left == `${ship.x + (blockSize * i)}px` && window.getComputedStyle(elem).top == `${ship.y}px`){
                            elem.classList.remove('grey_cross');
                            elem.classList.add('red_cross');
                        }
                    } 
               });
            }
            for(let i = 0;i < ship.width / blockSize; i++){
                document.querySelectorAll(`.game_field_${numberOfField} .grey_cross`).forEach(elem => {
                     if(window.getComputedStyle(elem).top == `${ship.y}px` && window.getComputedStyle(elem).left == `${ship.x + (blockSize * i)}px`){
                         elem.classList.remove('grey_cross');
                         elem.classList.add('red_cross');
                         isFind = true;
                     }
                     if(!isFind){
                         if(window.getComputedStyle(elem).left == `${ship.x}px` && window.getComputedStyle(elem).top == `${ship.y + (blockSize * i)}px`){
                             elem.classList.remove('grey_cross');
                             elem.classList.add('red_cross');
                         }
                     } 
                });
             }

             let spanBlock = document.querySelectorAll(`.game_field_${numberOfField} .dot`);
             for(let i = -1;i < (ship.width / blockSize) + 1; i++){
                let x,y,k;
                k = 0;
                x = ship.x + (blockSize * i);
                y = ship.y - blockSize;
                spanBlock.forEach(item => {
                    if (window.getComputedStyle(item).left == `${x}px` && window.getComputedStyle(item).top == `${y}px` ){
                        k++;
                    }
                });
                if(k == 0 && (x >=0 && x < 200) && (y >=0 && y < 200)){
                    createEmptyShot(x,y,numberOfField);
                }
                
             }
             spanBlock = document.querySelectorAll(`.game_field_${numberOfField} .dot`);
             for(let j = -1;j < (ship.height / blockSize) + 1; j++){
                let x,y,k;
                k = 0;
                x = ship.x - blockSize;
                y = ship.y + (blockSize * j);
                spanBlock.forEach(item => {
                    if (window.getComputedStyle(item).left == `${x}px` && window.getComputedStyle(item).top == `${y}px`){   
                        k++
                    }
                });
                if(k == 0 && (x >=0 && x < 200) && (y >=0 && y < 200)){
                    createEmptyShot(x,y,numberOfField);
                }
             }
             spanBlock = document.querySelectorAll(`.game_field_${numberOfField} .dot`);
             for(let i = -1;i < (ship.width / blockSize) + 1; i++){
                let x,y,k;
                k = 0;
                x = ship.x + (blockSize * i);
                y = ship.y + ship.height;
                spanBlock.forEach(item => {
                    if (window.getComputedStyle(item).left == `${x}px` && window.getComputedStyle(item).top == `${y}px`){
                        k++;
                    }
                });
                if(k == 0 && (x >=0 && x < 200) && (y >=0 && y < 200) ){
                    createEmptyShot(x,y,numberOfField);
                }
                
             }
             spanBlock = document.querySelectorAll(`.game_field_${numberOfField} .dot`);
             for(let j = -1;j < (ship.height / blockSize) + 1; j++){
                let x,y,k;
                k = 0;
                x = ship.x + ship.width;
                y = ship.y + (blockSize * j);
                spanBlock.forEach(item => {
                    if (window.getComputedStyle(item).left == `${x}px` && window.getComputedStyle(item).top == `${y}px`){   
                        k++
                    }
                });
                if(k == 0 && (x >=0 && x < 200) && (y >=0 && y < 200)){
                    createEmptyShot(x,y,numberOfField);
                }
             }
        }
    }
    function createHit(xShot,yShot,ships,numberOfField){
        let isFind = false;
        const hitBlock = document.createElement('span');
        hitBlock.textContent = 'X';
        hitBlock.classList.add('field_icons');
        hitBlock.classList.add('grey_cross');
        if(numberOfField == '1'){
            gameField.append(hitBlock);
        }else{
            gameField2.append(hitBlock);
        }
        hitBlock.style.cssText = `
            left:${xShot}px;
            top:${yShot}px;
        `;
        ships.forEach(element => {
            for(let j = 0;j < element.height / blockSize;j++ ){
                if(yShot == element.y + blockSize * j && xShot == element.x){
                    element.health--;
                    checkDeath(element,numberOfField);
                    isFind = true;
                }
            }
            if(!isFind){
                for(let k = 0; k < element.width / blockSize;k++){
                    if(xShot == element.x + blockSize * k && yShot == element.y){
                        element.health--;
                        checkDeath(element,numberOfField);
                    }
                }
            }
        });
    }
    function createEmptyShot(xShot,yShot,numberOfField){
        const emptyBlock = document.createElement('span');
        emptyBlock.textContent = '·';
        emptyBlock.classList.add('field_icons');
        emptyBlock.classList.add('dot');
        if(numberOfField == '1'){
            gameField.append(emptyBlock);
        }else{
            gameField2.append(emptyBlock);
        }
        emptyBlock.style.cssText = `
            left:${xShot}px;
            top:${yShot}px;
        `;
    }
    gameField.addEventListener('mousedown',mouseDownEvent);
    gameField.addEventListener('mouseup',mouseUpEvent);
    // initGameInfoBar();
    //  gameField2.addEventListener('mousedown',mouseDownEvent);
    //  gameField2.addEventListener('mouseup',mouseUpEvent2);
}
function startMenu(){
    game = document.querySelector('.game');
    startBtn = document.querySelector('.start_game');
    menu = document.querySelector('.menu');
    let width = +window.getComputedStyle(menu).width.slice(0,window.getComputedStyle(menu).width.length - 2);
    let height = +window.getComputedStyle(menu).height.slice(0,window.getComputedStyle(menu).height.length - 2);
    game.style.cssText = 'display:none;';
    menu.style.cssText = `
        left:${Math.round(document.documentElement.clientWidth / 2) - width / 2}px;
        top:${Math.round(document.documentElement.clientHeight / 2) - height / 2}px;
    `;
    startBtn.addEventListener('mousedown',(e) => {
        e.preventDefault();
        e.target.classList.add('button_scale');
    });
    startBtn.addEventListener('mouseup',(e) => {
        e.preventDefault();
        e.target.classList.remove('button_scale');
        setGame();
        game.style.cssText = 'display:static;';
        menu.style.cssText = 'display:none;';
    });

}

startMenu();
