var logs,court,photos,photoArray;

var minLeft,maxLeft,minTop,maxTop; 
var clicked=false;
var p = [];
const dt = 0.5;

function getRandomNumber(min,max)
{
    //console.log(min,max);
    return Math.floor(Math.random() * (max - min)) + min + "px";
}
function initialize()
{
    court = document.getElementById("court");
    photos = document.getElementById("photos");
    logs = document.getElementById("message");

    photoArray = photos.querySelectorAll('img');

    minLeft = Math.floor(court.getBoundingClientRect().left);
    maxLeft = Math.floor(court.getBoundingClientRect().width + minLeft - photoArray[0].getBoundingClientRect().width);
    minTop = Math.floor(court.getBoundingClientRect().top);
    maxTop = Math.floor(court.getBoundingClientRect().height + minTop - photoArray[0].getBoundingClientRect().height);

    for(const pht of photoArray)
    {
        pht.style.top = getRandomNumber(minTop,maxTop);
        pht.style.left = getRandomNumber(minLeft,maxLeft);
    }
    for(var i =0;i<photoArray.length;i++)
    {
        p[i] = new Photo(photoArray[i],
                        parseInt(photoArray[i].style.left.split("px")[0]),
                        parseInt(photoArray[i].style.top.split("px")[0]),
                        photoArray[i].width,
                        photoArray[i].height); 
    }
}

function resumeAction(event)
{
    if(!clicked)
    {
        clicked = true;
        animatePhoto();
    }
    else
    {
        clicked = false;
    }
}

function Photo(img,left,top,w,h)
{
    this.img = img;
    this.left = left;
    this.top = top;
    this.w = w;
    this.h = h;
    this.lp = true;
    this.tp = true;
    this.move = function()
    {
        this.img.style.left = this.left + "px";
        this.img.style.top = this.top + "px";
        //console.log(this.img);
        for(var i=0;i<p.length;i++)
        {
            if(p[i] == this)
            {
                continue;
            }
            else
            {
                if((this.left <= (p[i].w+p[i].left)) &&
                    ((this.w+this.left) >= p[i].left) &&
                    ((this.top <= (p[i].h+p[i].top)) &&
                    ((this.h+this.top) >= p[i].top))) 
                    {
                        this.lp = !this.lp;
                        p[i].lp = !p[i].lp;
                        this.tp = !this.tp;
                        p[i].tp = !p[i].tp;
                    }
            }
        }
        if(this.lp)
        {
            if(this.left >= maxLeft)
            {
                this.lp = false;
                this.left = this.left-dt;
            }
            this.left = this.left+dt;
        }
        else
        {
            if(this.left <= minLeft)
            {
                this.lp = true;
                this.left = this.left+dt;
            }
            this.left = this.left-dt;
        }
        
        if(this.tp)
        {
            if(this.top >= maxTop)
            {
                this.tp = false;
                this.top = this.top-dt;
            }
            this.top = this.top+dt;
        }
        else
        {
            if(this.top <= minTop)
            {
                this.tp = true;
                this.top = this.top+dt;
            }
            this.top = this.top-dt;
        }
        //setTimeout(this.move(),100);
    };
}

function animatePhoto() 
{
    if(clicked)
    {
        setTimeout(
            function(){
                for(var i=0;i<p.length;i++)
                {
                    //console.log("her", p[i]);
                    p[i].move();
                }
                animatePhoto();
            },0.4);
    }
}