var Piece = function(cxt,x,y,role)
{
    this.cxt = cxt;
    this.x = x;
    this.y = y;
    this.role = role;

    //role 1 for white. 2 for black.

    var me = this;

    this.draw = function()
    {
        cxt.beginPath();

        setStyle();
        setOutLine();
        executeDraw();

        cxt.closePath();
    }

    function setOutLine ()
    {
        me.cxt.lineWidth=0;
        //me.cxt.arc((x+1)*40,(x+1)*40,15,0,Math.PI*2,true);
        me.cxt.arc(x*40,y*40,15,0,Math.PI*2,true);
    }

    function setStyle ()
    {
        var color = "";

        if(me.role == 1)
        {
            me.cxt.strokeStyle = "grey";
            me.cxt.fillStyle = "white";
        }else if(me.role == 2)
        {
            color= "black";
            me.cxt.strokeStyle = color;
            me.cxt.fillStyle=color;
        }
    }

    function executeDraw ()
    {
        if(me.cxt.fillStyle !="white")
        {
            me.cxt.fill();
        }
        
        me.cxt.stroke();
    }

    return this;
}