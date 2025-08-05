

//Global Variables
var lineWidth = "1.9px";
var lineColour = "#ff8d00";
var LshadowColour = "#ff8d00";
var z_index = 0;

var rectColour = "transparent";

var coords = {
};
var id = null;

var Line_Container = document.getElementById("Line_Container");
var nav_items = document.getElementsByClassName("nav_item");
var Fill_Container = document.getElementById("Fill_Container");

var sections = document.getElementsByClassName("Section");

var t = 0 ;
//menu variables
var menuState = false;
var menu_shown = false;
var menu_offset;
//Game variables
var gameElement = document.getElementsByClassName("game");
var mousedown = false;
var target = null;
// Initialisation
set_coords();
NavItemsUpdate();

//Hide all sections on start
for(let i = 1; i < sections.length;i++){
    sections[i].style.opacity = "0";
    sections[i].style.height = "0";
    sections[i].style.overflow = "hidden";
}

function set_coords(){
    var Ref_coords;
    var heightconvert;
    var widthconvert;
    coords = {};

    if(window.innerWidth <= 800){ //if page width is less than 800px
        heightconvert = window.innerHeight/100;
        widthconvert = window.innerWidth/56;
        Ref_coords = {
            Set1 :{x:0,y:0},
            Set2 :{x:0,y:27},
            Set3 :{x:-2,y:27},
            Set4 :{x:100,y:26},
            Set5 :{x:100,y:155},
            Set6 :{x:-51,y:30},
            Set7 :{x:-56,y:98}
        };
    }    
    else{
         Ref_coords ={
            Set1 :{x:0,y:0},
            Set2 :{x:-15,y:33},
            Set3 :{x:35,y:16},
            Set4 :{x:18,y:18},
            Set5 :{x:-10,y:21},
            Set6 :{x:-13,y:25},
            Set7 :{x:-10,y:56}
        };
         heightconvert = window.innerHeight/56;
          widthconvert = window.innerWidth/100;
    }



    
    for(let i = 0; i < Object.keys(Ref_coords).length;i++){
        coords[Object.keys(Ref_coords)[i]] = Ref_coords[Object.keys(Ref_coords)[i]];
    }    


    for(let i = 0; i < Object.keys(coords).length;i++){
        coords[Object.keys(coords)[i]].x = coords[Object.keys(Ref_coords)[i]].x * widthconvert;
        coords[Object.keys(coords)[i]].y = coords[Object.keys(Ref_coords)[i]].y * heightconvert;
        
    }    
}

//Nav items initialisation
function NavItemsUpdate(){
    //ensures that all nav items are hidden and initialises its delay property  
    if(menu_shown == false){
        for(let i = 0; i < nav_items.length; i++){        
                nav_items[i].style.animationDelay = (i-1)*100 + "ms";
                nav_items[i].style.position = "relative";
                nav_items[i].style.left = "115%";
        }
    }
}





//creating line containers
for(let i = 0; i < gameElement.length;i++){
    var div = document.createElement("div");
    div.className = "gameLineContainer";
    var button = document.createElement("button");
    button.innerHTML = "Reset";
    button.className = "reset";
    gameElement[i].insertBefore(button,gameElement[i].firstChild);
    gameElement[i].appendChild(div);
}

innitGame();
function innitGame(){
    //Make a div for storing lines
    //Needed Variables
    let coords = {};
    target = gameElement[1].children[1];
    var width = target.getBoundingClientRect().right - target.getBoundingClientRect().left;
    var height = target.getBoundingClientRect().bottom - target.getBoundingClientRect().top;
    var GameElementChildren;

    //set positions for all the markers
    for(let i = 0;i< gameElement.length;i++){
        var Gameheight = gameElement[i].getBoundingClientRect().bottom - gameElement[i].getBoundingClientRect().top;
        for(let d = 0; d < gameElement[i].getElementsByTagName("img").length;d++){
            if(d%2 == 0 ){
                gameElement[i].getElementsByTagName("img")[d].style.top = Gameheight/2+"px";
                gameElement[i].getElementsByTagName("img")[d].style.left = (width/2)*d+"px";
            }
            else{
                gameElement[i].getElementsByTagName("img")[d].style.top = Gameheight/3+"px";
                gameElement[i].getElementsByTagName("img")[d].style.left = (width/2)*d+"px";
    
            }
        }
    }

    //generate Line 
    for(let i = 0; i < gameElement.length; i++){
        lineWidth = width/6+"px";
        lineColour = "red";
        LshadowColour = "transparent";
        z_index = -1;

        GameElementChildren = gameElement[i].children;
        for(let d = 0;d < GameElementChildren.length; d++){
            if(GameElementChildren[d].alt == "Marker"){
                coords["Set"+d] = {};
                coords["Set"+d].x = parseInt(GameElementChildren[d].style.left) + width/2 ;
                coords["Set"+d].y = parseInt(GameElementChildren[d].style.top) + height/2;
            }
        }
        
        lineWidth = width/12+"px";
        lineColour = "green";
        LshadowColour = "transparent";
        z_index = -2;
        for(let d = 0;d < Object.keys(coords).length -1;d++){
            document.getElementsByClassName("gameLineContainer")[i].appendChild(createLine(coords["Set"+(d+1)].x,coords["Set"+(d+1)].y,coords["Set"+(d+2)].x,coords["Set"+(d+2)].y));
        }
        lineWidth = width/6+"px";
        lineColour = "red";
        LshadowColour = "transparent";
        z_index = -1;
        let t_ = 0;
        while(t_ < 1){
            t_ += 0.05;
            let Set1 = Generate_Bezier(t_-0.05,coords);
            let Set2 = Generate_Bezier(t_,coords);
            
            document.getElementsByClassName("gameLineContainer")[i].appendChild(createLine(Set1.x,Set1.y,Set2.x,Set2.y));
        }
    }
    //reset the line generation attributes to original state
    z_index = 0;
    lineColour = "#ff8d00";
    LshadowColour = "#ff8d00";
    lineWidth = "1.9px";
    t_marker();
}





//Tool Functions



//Create Line
function createLineElement(x, y, length, angle) {
    var line = document.createElement("div");
    line.className = "Outline";
    var styles = 'border:'+ lineWidth + ' solid ' + lineColour +
               ';' + 'width: ' + length + 'px' +
               ';' + 'height: 0px' +
               ';' + '-moz-transform: rotate(' + angle + 'rad)' +
               ';' + '-webkit-transform: rotate(' + angle + 'rad)' +
               ';' + '-o-transform: rotate(' + angle + 'rad)' +  
               ';' + '-ms-transform: rotate(' + angle + 'rad)' +  
               ';' + 'position: absolute' +
               ';' + 'top: ' + y + 'px'+
               ';' + 'left: ' + x + 'px' +
               ';' + 'box-shadow:0 0 15px '+ LshadowColour +
               ';' + 'z-Index:'+ z_index +
               ';' + 'overflow:visible ;';
    line.setAttribute('style', styles);  
    return line;
}

function createLine(x1, y1, x2, y2) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b); 
    //find midpoint
    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;
    
    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha);
}


//Create Rect
function createRectElement(x,y,length,angle,width){
    var Rect = document.createElement("div");
    Rect.className = "rect";
    var styles = 'border-top:' +   (width)    + 'px solid ' + rectColour +
               ';' + 'width: ' + length + 'px' +
               ';' + 'height:' + width + 'px' +
               ';' + 'transition: 1s' +
               ';' + '-moz-transform: rotate(' + angle + 'rad)' +
               ';' + '-webkit-transform: rotate(' + angle + 'rad)' +
               ';' + '-o-transform: rotate(' + angle + 'rad)' +  
               ';' + '-ms-transform: rotate(' + angle + 'rad)' +  
               ';' + 'position: absolute' +
               ';' + 'top: ' + (y-(width)) + 'px' +
               ';' + 'left: ' + (x) + 'px' +
               ';' + 'box-sizing:border-box' +
               ';' + 'transform-origin:bottom center;';
    Rect.setAttribute('style', styles);  

    return Rect;


}


function createRect(x1,y1,x2,y2,length){
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);// width of the rect

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;
    

    var alpha = Math.PI - Math.atan2(-b, a);


    return createRectElement(x,y,c,alpha,length);
}



function interpolate(p0,p1,t){
    var ansX = (1-t)*p0.x + t*p1.x;
    var ansY = (1-t)*p0.y + t*p1.y;
    var ans = {x:ansX,y:ansY};
    
    return ans;
}



function Generate_Bezier(t,coord_set){
    //n is the number of points used in the curve
    var points = Object.keys(coord_set).length;
    var temp1 = [];
    
    for(let i = 0;i< points;i++){
        temp1[i] = coord_set[Object.keys(coord_set)[i]];
    }

    for(let i = 0; i < points - 1;  i++){
        temp1[i] = interpolate(temp1[i],temp1[i+1],t)  ;
        if(i == points - 2){    
            i = -1;
            points -= 1;
        }
    }
    return temp1[0];
}


//event listeners
document.getElementById("Hamburger").addEventListener("click",nav_Outline_anim);
document.getElementById("drums").onclick = function(){var drums = new Audio('Audio/drum-roll-sound-effect.mp3');drums.play();};
document.getElementsByTagName("body")[0].onresize = function() {check();};
for(let i = 0; i < nav_items.length;i++){
    nav_items[i].addEventListener("click",navContentManager);
}
document.getElementsByClassName("Arrow_Container")[0].addEventListener("click", arrowContentManager);
document.getElementsByClassName("Arrow_Container")[1].addEventListener("click", arrowContentManager);
document.getElementById("Calc-Enter").addEventListener("click", calculator);
document.getElementById("moveEnemy").addEventListener("click", t_marker);
document.getElementById("addMarker").addEventListener("click", addMarker);
document.getElementById("removeMarker").addEventListener("click", removeMarker);

for(let i = 0; i < document.getElementsByClassName("game").length;i++){
    document.getElementsByClassName("game")[i].addEventListener("mouseleave", mouseleaves);
    document.getElementsByClassName("game")[i].addEventListener("mouseenter", mouseleaves);
    document.getElementsByClassName("game")[i].addEventListener("touchcancel", mouseleaves);

    document.getElementsByClassName("game")[i].addEventListener("mousedown", markerClick);
    document.getElementsByClassName("game")[i].addEventListener("mouseup", markerClick);
    document.getElementsByClassName("game")[i].addEventListener("mousemove", drag);

    document.getElementsByClassName("game")[i].addEventListener("touchstart", markerClick);
    document.getElementsByClassName("game")[i].addEventListener("touchend", markerClick);
    document.getElementsByClassName("game")[i].addEventListener("touchmove", drag);

}
//test



//Bezier Curve Game
//Fail safe for when mouse leaves the game area but let go outside
function mouseleaves(event){
    if(event.buttons == 0){
        mousedown = false;
    }
}

function markerClick(event){
    mousedown = !mousedown;
    if(event.target.tagName == "BUTTON"){
        mousedown = false;
        if(event.target.className == "reset"){
            for(let i = 0;i < document.getElementsByClassName("gameLineContainer").length; i++){
               document.getElementsByClassName("gameLineContainer")[i].replaceChildren();
            }
            innitGame();
        }
    }
    else{
        target = event.target;
        
    }
}
function drag(event){
    //check if the mouse is held down, the mouse is holding something and that it is a marker
    if(mousedown == true && target != null && target.alt == "Marker"){
        //get the width and height of the marker
        var width = target.getBoundingClientRect().right - target.getBoundingClientRect().left;
        var height = target.getBoundingClientRect().bottom - target.getBoundingClientRect().top;
        
        //set the markers position to the middle of the mouse / finger touch 
        if(window.innerWidth <= 800){ //if page width is less than 800px
            //on mobile clicking the button will activate a click event instead of a touch event
            if(event.type == "click"){
                target.style.left = event.clientX - target.parentElement.getBoundingClientRect().x - width/2+ "px";
                target.style.top = event.clientY - target.parentElement.getBoundingClientRect().y - height/2 + "px";
            }
            else{
                target.style.left = event.touches[0].clientX - target.parentElement.getBoundingClientRect().x - width/2+ "px";
                target.style.top = event.touches[0].clientY - target.parentElement.getBoundingClientRect().y - height/2 + "px";  
            }

        }
        else{
            target.style.left = event.clientX - target.parentElement.getBoundingClientRect().x - width/2+ "px";
            target.style.top = event.clientY - target.parentElement.getBoundingClientRect().y - height/2 + "px";
        }

        let coords = {};
        var gamecontainer = target.parentElement.children;
        //counter is to name the set variables accurately
        let counter = 1;
        //set the coords
        for(let i = 0;i < gamecontainer.length; i++){
            if(gamecontainer[i].alt == "Marker"){
                coords["Set"+counter] = {};
                coords["Set"+counter].x = parseInt(gamecontainer[i].style.left) + width/2;
                coords["Set"+counter].y = parseInt(gamecontainer[i].style.top) + height/2;
                counter++;
            }
        }
        
        //set the line render data
        lineWidth = width/12+"px";
        lineColour = "green";
        LshadowColour = "transparent";
        z_index = -2;
        //clear all the currently rendered lines
        target.parentElement.lastChild.replaceChildren();
        //render the line that connects the markers
        for(let i = 0;i < Object.keys(coords).length -1;i++){
            target.parentElement.lastChild.appendChild(createLine(coords["Set"+(i+1)].x,coords["Set"+(i+1)].y,coords["Set"+(i+2)].x,coords["Set"+(i+2)].y));
        }
        //set the line rendering data to suit the curve
        lineWidth = width/6+"px";
        lineColour = "red";
        LshadowColour = "transparent";
        z_index = -1;

        //render the curves
            let t_ = 0;
            while(t_ < 1){
                t_ += 0.05;
                let Set1 = Generate_Bezier(t_-0.05,coords);
                let Set2 = Generate_Bezier(t_,coords);
                target.parentElement.lastChild.appendChild(createLine(Set1.x,Set1.y,Set2.x,Set2.y));
            }
            t_marker();
    }
    //reset the data to default values
    z_index = 0;
    lineColour = "#ff8d00";
    LshadowColour = "#ff8d00";
    lineWidth = "1.9px";
}
//adds a marker as the last child
function addMarker(event){
    var pathfinding = document.getElementById("Pathfinding");
    var circle = document.getElementsByClassName("circle")[0];
    var marker = document.createElement("img");
    marker.src = "Images/Marker.png";
    marker.alt = "Marker";
    marker.draggable = false;
    pathfinding.insertBefore(marker,circle);
    target = circle.previousElementSibling;
    mousedown = true;
    drag(event);
    mousedown = false;
}

//deletes the last added marker
function removeMarker(event){
    var pathfinding = document.getElementById("Pathfinding");
    var circle = document.getElementsByClassName("circle")[0];
    if(circle.previousElementSibling.alt == "Marker"){
        pathfinding.removeChild(circle.previousElementSibling);
    
        target = circle.previousElementSibling;
        mousedown = true;
        drag(event);
        mousedown = false;
    }
}

//control the movement of the blue dot on page 4 in the pathfinding section
function t_marker(){

    var pathfinding = document.getElementById("Pathfinding");
    var PathChildren = pathfinding.children;
    let counter = 1;
    //get the width of the marker image
    var width = target.getBoundingClientRect().right - target.getBoundingClientRect().left;
    var height = target.getBoundingClientRect().bottom - target.getBoundingClientRect().top;
    let coords = {};

    //set the coordinates of the bezier curve based off of the marker left and top positions
    for(let i = 0;i < PathChildren.length; i++){
        if(PathChildren[i].alt == "Marker"){
            coords["Set"+counter] = {};
            if(window.innerWidth >= 800){ //if page width is more than 800px
                //dividing by 4 beccause the line starts in the middle of the circle (which is the width/height divided by 2) 
                // so we divide by 4 to get in the middle of the line
                coords["Set"+counter].x = parseInt(PathChildren[i].style.left) + width/4;
                coords["Set"+counter].y = parseInt(PathChildren[i].style.top) + height/4;
            }
            else if(window.innerWidth <= 800){
                //idk why i have to use a different set of calculations but it works 
                coords["Set"+counter].x = parseInt(PathChildren[i].style.left)  + width/2 ;
                coords["Set"+counter].y = parseInt(PathChildren[i].style.top) - height * 1.5;
            }
            counter++;
        }
        if(PathChildren[i].className == "circle"){
            PathChildren[i].remove();
        }
    }
    //create circle element
    var circle = document.createElement("div");
    
    circle.className = "circle";
    pathfinding.insertBefore(circle,pathfinding.lastChild);
    
    circle = document.getElementsByClassName("circle")[0];
    circle.style.position = "relative";
    circle.style.left = coords.Set1.x+"px";
    circle.style.top = coords.Set1.y+"px";
    //moves the circle aka the enemy
    clearInterval(id);
    id = setInterval(frame, 10);
    let t_ = 0;
    function frame(){
        //stops the animation when the t value is 100%
        if(t_ >=1){
            clearInterval(id);
        }
        else{
            //moves the circle in accordance to the bezier
            let Set2 = Generate_Bezier(t_,coords);
            circle.style.left = Set2.x+"px";
            circle.style.top = Set2.y+"px";
            t_ += 0.009;
        }
        
    }

}




//calculator for page 2
function calculator(){
    var x1 = document.getElementsByTagName("input")[0].value;
    var y1 = document.getElementsByTagName("input")[1].value;
    var x2 = document.getElementsByTagName("input")[2].value;
    var y2 = document.getElementsByTagName("input")[3].value;
    var t = document.getElementsByTagName("input")[4].value;
    var result = document.querySelector("#Calc-Results");
    var coords = {
        Set1:{x:x1,y:y1},
        Set2:{x:x2,y:y2}
    };
    //checks if the input value is empty and responds accordingly
    for(let i = 0; i < 5; i++){
        if(document.getElementsByTagName("input")[i].value == ""){
            result.innerHTML = "Please enter all data correctly";
        }
        else{
            result.innerHTML = "X Value: " + interpolate(coords.Set1,coords.Set2,t).x + "|Y Value: " +  interpolate(coords.Set1,coords.Set2,t).y;
        }
    }
}

//Page Content Managers based on the arrows clicked
function arrowContentManager(event){
    if(event.target.alt == "right"){
        for(let i = 0;i < sections.length;i++){
            if(sections[i].style.overflow != "hidden"){
                //This is to check if the user is trying to go to the first page from the last page
                if(sections[3].style.overflow != "hidden"){
                    sections[i].style.height = "0";
                    sections[i].style.overflow = "hidden";
                    sections[i].style.opacity = "0";
                    i = -1  ;
                }
                else{
                    sections[i].style.height = "0";
                    sections[i].style.overflow = "hidden";
                    sections[i].style.opacity = "0";
                }
                document.getElementsByTagName("Header") [0].children[0].innerHTML = nav_items[i+1].innerHTML;
                sections[i+1].style.overflow = "visible";
                sections[i+1].style.height = "auto";
                sections[i+1].style.opacity = "1";
                break;
            }
        }
        document.documentElement.scrollTo(0,0);
    }
    //Check which sprite was called since this is event delegation 
    else if(event.target.alt == "left"){
        for(let i = 0;i < sections.length;i++){
            if(sections[i].style.overflow != "hidden"){
                if(sections[0].style.overflow != "hidden"){
                    sections[i].style.height = "0";
                    sections[i].style.overflow = "hidden";
                    sections[i].style.opacity = "0";
                    i = 4;
                }
                else{
                    sections[i].style.height = "0";
                    sections[i].style.overflow = "hidden";
                    sections[i].style.opacity = "0";
                }
                document.getElementsByTagName("Header") [0].children[0].innerHTML = nav_items[i-1].innerHTML;
                sections[i-1].style.overflow = "visible";
                sections[i-1].style.height = "auto";
                sections[i-1].style.opacity = "1";
                break;
            }
        }
        //its not outside of the if else statement so that the document only scrolls to the top when the arrow is clicked and not the arrows parent
        document.documentElement.scrollTo(0,0);
    }

}

//handles what page will be shown
function navContentManager(event){
    for(let i = 0; i < nav_items.length;i++){
        if(nav_items[i] == event.target.parentElement){
            document.getElementsByTagName("Header") [0].children[0].innerHTML = event.target.innerHTML;
            sections[i].style.overflow = "visible";
            sections[i].style.height = "auto";
            sections[i].style.opacity = "1";
        }
        else{
            sections[i].style.height = "0";
            sections[i].style.overflow = "hidden";
            sections[i].style.opacity = "0";
            
        }    
    }
    
    document.documentElement.scrollTo(0,0);
}


//check when screen size is updated

function check(){
    NavItemsUpdate(); 
    set_coords();
    refresh();
    if(menu_shown != false){
        Nav_fill();
    }
}

//re-render the line in accordance to the percentage of the line render
function refresh(){
    let t_ = 0;
    set_coords();
    Line_Container.replaceChildren();
    while(t_ < t){
        t_ += 0.01;
        var minus = 0.01;     

        var Set1 = Generate_Bezier(t_ ,coords);
        var Set2 = Generate_Bezier(t_ - minus,coords);

        Line_Container.appendChild(createLine(Set1.x, Set1.y,Set2.x, Set2.y));
    }
}

//fill in the shape that appears when the menu is summoned
function Nav_fill(){
    //seperate variables
    let t_ = 0;
    let width = 1000;
    set_coords();
    //the visuals happen instantly because its a while loop
    //first clear all current fill
    Fill_Container.replaceChildren();

    while(t_ < 1){
        //generate the bezier curve
        t_ += 0.01; 
        var minus = 0.012;  
        //generate the bezier curve
        var Set1 = Generate_Bezier(t_ ,coords);
        var Set2 = Generate_Bezier(t_ - minus,coords);

        //this bit is really manual and I don't like it but I couldnt find a better solution in time
        //This detects if the line has begun and creates a rectangle to hide a hole that the original fill couldnt patch
        if(t_ == 0.01){
            if(window.innerWidth >= 800){ //if page width is more than 800px
                Fill_Container.appendChild(createRect(Set2.x, Set2.y,Set2.x,Set2.y+100,width));        
            }
        }
        //the same thing happens but at the last created element
        if(t_ >= 1){
            if(window.innerWidth <= 800){ //if page width is less than 800px
                Fill_Container.appendChild(createRect(Set2.x,Set2.y,Set2.x,Set2.y+600  ,width));
            }
            else{
                Fill_Container.appendChild(createRect(Set2.x,Set2.y,Set2.x+10,Set2.y+100  ,width));
            }
        }
            
        Fill_Container.appendChild(createRect(Set2.x ,Set2.y ,Set1.x,Set1.y  ,width));
    }
}


function nav_Outline_anim(){
    //refresh the bezier curve coordinates
    set_coords();
    refresh();
    menuState = !menuState;
    //stop current animation then restart it
    clearInterval(id);
    id = setInterval(frame, 10);
    
    function frame() {
    if(menuState == false){
        if(Line_Container.childElementCount != 0){
            //first progressively hide the outline by deleting the last child
            Line_Container.removeChild(Line_Container.lastChild);
            t = t - 0.01; 
        }
        else{
            //Animate Nav items hidings
            if(menu_shown == true){
                //hide the navigation items
                for(let i = 0; i < nav_items.length; i++){
                    nav_items[i].classList.remove('nav_show');
                    nav_items[i].classList.add('nav_hide');
                }
                //hide the navigation fill
                for(let i = 0; i < Fill_Container.childElementCount; i++){
                    //remove current animation to clear it
                    Fill_Container.children[i].classList.remove("show_fill")               
                    Fill_Container.children[i].classList.add("hide_fill")               
                }

                //clear the fill container of its children after the animation is finished
                setTimeout(function(){Fill_Container.replaceChildren();}, 500);
                
                menu_shown = false;
            }
            rectColour = "transparent";
            t = 0;
            clearInterval(id);
        }
        
    }

    else if (t >= 1) {
            //Animate Nav items showing
            if(menu_shown == false){
                for(let i = 0; i < nav_items.length; i++){
                    nav_items[i].classList.remove('nav_hide');
                    nav_items[i].classList.add('nav_show');

                }  

                //makes a invisible fill so that the fill is invisible when it is created
                rectColour = "transparent";
                Nav_fill();
                //tells us that the menu is shown
                menu_shown = true;
                //toggling animation
                for(let i = 0; i < Fill_Container.childElementCount; i++){
                    Fill_Container.children[i].classList.add("show_fill");
                }
            }
                
            //update rect color so that when the window is resized it gets updated to the proper color
            rectColour = "#2b00cb";
            //stop animation
            clearInterval(id);
        } 

    else {
        //animate the outline being shown
        t += 0.01; 

        var minus = 0.02;  
        var Set1 = Generate_Bezier(t,coords);
        var Set2 = Generate_Bezier(t - minus,coords);

        Line_Container.appendChild(createLine(Set1.x, Set1.y,Set2.x, Set2.y));
        
        
        }
    }
}





