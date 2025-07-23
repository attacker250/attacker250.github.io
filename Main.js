


//Todo:
//Design Page layout
//Animate the nav menu items when clicked(Optional)
//Design what to put inside the page itself


//Global Variables
var lineWidth = "1.9px"
var lineColour = "#ff8d00"

var rectColour = "transparent"

var coords = {
    Set1 :{},
    Set2 :{},
    Set3 :{},
    Set4 :{},
    Set5 :{},
    Set6 :{},
    Set7 :{}
}
var id = null;
var menuState = false

var Line_Container = document.getElementById("Line_Container")
var nav_items = document.getElementsByClassName("nav_item")
var Fill_Container = document.getElementById("Fill_Container")

var sections = document.getElementsByClassName("Section")

var t = 0 

var menu_shown = false
var menu_offset


// Initialisation
set_coords()
NavItemsUpdate()

//Hide all sections on start
for(var i = 1; i < sections.length;i++){
    // sections[i].style.display = "none"
    sections[i].style.opacity = "0"
    sections[i].style.height = "0"
    sections[i].style.overflow = "hidden"
    
}

function set_coords(){
    var Ref_coords
    var heightconvert
    var widthconvert

    if(window.innerWidth <= 800){ //if page width is less than 800px
        Ref_coords ={
            Set1 :{x:-40,y:0},
            Set2 :{x:-40,y:200},
            Set3 :{x:500,y:100},
            Set4 :{x:376,y:500},
            Set5 :{x:-157,y:10},
            Set6 :{x:-35,y:170},
            Set7 :{x:-445,y:250}
        }
        heightconvert = window.innerHeight/480
        widthconvert = window.innerWidth/320
    }    
    else{
         Ref_coords ={
            Set1 :{x:0,y:0},
            Set2 :{x:-15,y:33},
            Set3 :{x:34,y:16},
            Set4 :{x:18,y:18},
            Set5 :{x:-10,y:21},
            Set6 :{x:-13,y:25},
            Set7 :{x:-10,y:56}
        }
         heightconvert = window.innerHeight/56
          widthconvert = window.innerWidth/100
    }



    
    for(var i = 0; i < Object.keys(Ref_coords).length;i++){
        coords[Object.keys(coords)[i]] = Ref_coords[Object.keys(Ref_coords)[i]]

    }    


    for(var i = 0; i < Object.keys(coords).length;i++){
        coords[Object.keys(coords)[i]].x = coords[Object.keys(Ref_coords)[i]].x * widthconvert
        coords[Object.keys(coords)[i]].y = coords[Object.keys(Ref_coords)[i]].y * heightconvert
        
    }    
}
//Nav items initialisation
function NavItemsUpdate(){

    if(window.innerWidth <= 800){ //if page width is less than 800px
        menu_offset = -1.02* window.innerWidth
    }
    else{
        menu_offset = -0.17 * window.innerWidth
    }   
    if(menu_shown == false){
        for(var i = 0; i < nav_items.length; i++){        
            nav_items[i].style.position = "relative" 
            nav_items[i].style.left = "110%"
            }
        }
    else{
        for(var i = 0; i < nav_items.length; i++){        
            nav_items[i].animate(
                [{transform:"translateX("+ (menu_offset-20) +"px)"},  ],
                {
                    duration:0,
                    fill:"forwards",
                    
                }
            )
        }   
    }

}


// console.log(window.innerWidth)


// console.log("Screen ",window.screen.availWidth)
// console.log("\nPage height ",window.innerHeight)





//Tool Functions



//Create Line
function createLineElement(x, y, length, angle) {
    var line = document.createElement("div");
    line.className = "Outline"
    var styles = 'border:'+ lineWidth + ' solid ' + lineColour +'; '
               + 'width: ' + length + 'px; '
               + 'height: 0px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'position: absolute; '
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; '
               + 'box-shadow:0 0 15px'+ lineColour +';';
               + 'overflow:visible  '
    line.setAttribute('style', styles);  
    return line;
}

function createLine(x1, y1, x2, y2) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b); 


        //What?
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
    Rect.className = "rect"
    var styles = 'border-top:' +   (width)    + 'px solid ' + rectColour +'; '
               + 'width: ' + length + 'px; '
               + 'height:' + width + 'px; '
               + 'transition: 1s;'
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'position: absolute; '
               + 'top: ' + (y - width ) + 'px; '
               + 'left: ' + (x ) + 'px; '
               
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

    return createRectElement(x,y,c,alpha,length)
}

function interpolate(p0,p1,t){
    var ansX = (1-t)*p0.x + t*p1.x
    var ansY = (1-t)*p0.y + t*p1.y
    
    var ans = {x:ansX,y:ansY}
    
    return ans
}



function Generate_Bezier(t,coord_set){
    //n is the number of points used in the curve
    var points = Object.keys(coord_set).length
    var temp1 = []  
    
    for(var i = 0;i< points;i++){
        temp1[i] = coord_set[Object.keys(coord_set)[i]]
    }

    for(var i = 0; i < points - 1;  i++){
        temp1[i] = interpolate(temp1[i],temp1[i+1],t)  
        if(i == points - 2){    
            i = -1
            points -= 1;
        }
    }
    return temp1[0]
}


//event listeners
document.getElementById("Hamburger").addEventListener("click",nav_Outline_anim)
document.getElementsByTagName("body")[0].onresize = function() {check()};
for(var i = 0; i < nav_items.length;i++){
    nav_items[i].addEventListener("click",content_manager)

}

//test
//resasd
function content_manager(event){
    for(var i = 0; i < nav_items.length;i++){
        if(nav_items[i] == event.target.parentElement){
            // sections[i].style.display = "block"
            console.log(event.target.innerHTML)
            document.getElementsByTagName("Header") [0].children[0].innerHTML = event.target.innerHTML
            sections[i].style.overflow = "visible"
            sections[i].style.height = "auto"
            sections[i].style.opacity = "1"
        }
        else{
            // sections[i].style.display = "none"
            sections[i].style.height = "0"
            sections[i].style.overflow = "hidden"
            sections[i].style.opacity = "0"
            
        }
        // console.log(sections[i])
    }
    
}

function test(){
    console.log("Window Inner Width: ",window.innerWidth)
    console.log("NavItems: ",nav_items[0].getBoundingClientRect().left)
    console.log("\nDEBUG\n")
    console.log("\nFill container child count: ",Fill_Container.childElementCount)
    console.log("\nLine container child count: ",Line_Container.childElementCount)

}
//Desktop
// Window Inner Width:  1536 Main.js:232:13
// NavItems:  1289.13330078125
//84%
//mobile
// Window Inner Width:  320 Main.js:232:13
// NavItems:  282.58331298828125
//88%
// var main = document.getElementsByTagName("main")[0]


// main.appendChild(createRect(300,490,310,500,500))
// main.appendChild(createLine(300,490,310,500))
// main.appendChild(createLine(450,400,450,500))


//misc

//check when screen size is updated

function check(){
    NavItemsUpdate()    
    set_coords()
    refresh()
    Nav_fill()
}

function animate_nav_items(){



}

//re-render the line in accordance to the percentage of the line render
function refresh(){
    let t_ = 0
    set_coords()
    Line_Container.replaceChildren()
    while(t_ < t){
        t_ += 0.01; 
        var minus = 0.01        

        var Set1 = Generate_Bezier(t_ ,coords)
        var Set2 = Generate_Bezier(t_ - minus,coords)


        Line_Container.appendChild(createLine(Set1.x, Set1.y,Set2.x, Set2.y));
    }
    
}

//fill in the shape that appears when the menu is summoned
function Nav_fill(){
    let t_ = 0
    let width = 1000;
    set_coords()    

    Fill_Container.replaceChildren()
    while(t_ < 1){
        t_ += 0.01; 
        var minus = 0.012         

        var Set1 = Generate_Bezier(t_ ,coords)
        var Set2 = Generate_Bezier(t_ - minus,coords)

        
        if(t_ ==0.01){
            if(window.innerWidth >= 800){ //if page width is less than 800px
                Fill_Container.appendChild(createRect(Set2.x, Set2.y,Set2.x,Set2.y+100,width))            
            }
        }
        if(t_ >= 1){
            if(window.innerWidth <= 800){ //if page width is less than 800px
                Fill_Container.appendChild(createRect(Set2.x,Set2.y,Set2.x,Set2.y+600  ,width))
            }
            else{
                Fill_Container.appendChild(createRect(Set2.x,Set2.y,Set2.x+10,Set2.y+100  ,width))
            }
        }
            
        Fill_Container.appendChild(createRect(Set2.x ,Set2.y ,Set1.x,Set1.y  ,width))
    }
}

//fix the top right shape being shown when zoomed in all the way (Optional)
//figure out colour scheme for nav bar


function nav_Outline_anim(){
    set_coords()
    refresh()
    menuState = !menuState
    clearInterval(id);
    id = setInterval(frame, 10);
    
    function frame() {
        document.getElementById("t value").innerHTML = t

    if(menuState == false){

        if(Line_Container.childElementCount != 0){
            Line_Container.removeChild(Line_Container.lastChild)
            t = t - 0.01; 
        }
        else{
            //Animate Nav items hiding
            if(menu_shown == true){
                for(var i = 0; i < nav_items.length; i++){
                    nav_items[i].animate(
                        [
                            {transform:"translateX("+ (menu_offset-20) +"px)"},  
                            {transform:"translateX("+ (menu_offset-30) +"px)"},  
                            {transform:"translateX(0%)"},
    
                        ],
                        {
                            duration:500,
                            fill:"forwards",
                            delay:(i-1)*100,
                            ease:"cubic-bezier(0.68, -0.6, 0.32, 1.6);"
                            
                        }
                    )
                }

                for(var i = 0; i < Fill_Container.childElementCount; i++){
                    Fill_Container.children[i].animate(
                        [
                            {borderTopColor:"transparent"}
                        ],
                        {
                            duration:500,
                            fill:"forwards",
                        }
                    )
                }
                
                
                
                menu_shown = false
            }
            rectColour = "transparent"
            t = 0
            clearInterval(id)
        }
        
    }

    else if (t >= 1) {
            //Animate Nav items showing
            if(menu_shown == false){
                for(var i = 0; i < nav_items.length; i++){
                    nav_items[i].animate(
                        [
                            {transform:"translateX(0%)"},
                            {transform:"translateX("+ (menu_offset-30) +"px)"},  
                            {transform:"translateX("+ (menu_offset-20) +"px)"},  
    
                        ],
                        {
                            duration:500,
                            fill:"forwards",
                            delay:(i-1)*100,
                            ease:"cubic-bezier(0.68, -0.6, 0.32, 1.6);"
                            
                        }
                    )
                }  
                rectColour = "transparent"
                Nav_fill()
                menu_shown = true
                for(var i = 0; i < Fill_Container.childElementCount; i++){
                    Fill_Container.children[i].animate(
                        [
                            {borderTopColor:"#2b00cb"}
                        ],
                        {
                            duration:500,
                            fill:"forwards",
                        }
                    )
                }

            }
                
                
            rectColour = "#2b00cb"
            clearInterval(id);
        } 

    else {
        t += 0.01; 

        var minus = 0.02        
        var Set1 = Generate_Bezier(t,coords)
        var Set2 = Generate_Bezier(t - minus,coords)

        Line_Container.appendChild(createLine(Set1.x, Set1.y,Set2.x, Set2.y));
        
        
        }
    }
}





