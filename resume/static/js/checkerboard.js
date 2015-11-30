var Checkerboard2 = function(canvas)
{
    
    this.canvas = canvas;

    this.points = [];
    this.cxt = canvas.getContext("2d");
    this.lastPoint = [0,0];
    this.last_put_role = 0;

    draw();

    var me = this;

    this.init = function()
    {
        for(var i=0; i<=15; i++)
        {
            var a = [];
            for(var j=0;j<=15;j++)
            {
                a.push(0);
            }
            me.points.push(a);
        }
    }

    //Draw the board.
    var draw = function()
    {
        drawOutLine();
        drawNums(); 
    }

    var drawOutLine = function()
    {
        me.cxt.beginPath();
        for(var i=1;i<16;i++)
        {
            me.cxt.moveTo(40,i*40);    
            me.cxt.lineTo(600,i*40);
            
            me.cxt.moveTo(i*40,40);
            me.cxt.lineTo(i*40,600);
        }
        me.cxt.closePath();
        me.cxt.stroke();
    }

    var drawNums = function()
    {
       for(var i=1;i<=15;i++)
        {
            me.cxt.font="14px California";

            me.cxt.fillText(i,40*i-3,30);
            me.cxt.fillText(i*40,40*i-3,15);

            me.cxt.fillText(String.fromCharCode(96+i),20,40*i+3);
            me.cxt.fillText(i*40,0,40*i+3);
        } 
    }
    //Draw the board.
    
}



var Checkerboard = {
    //Draw the board.

    createNew: function(canvas,cxt){
        //Private Draw the board.
        var draw = function()
        {
            drawOutLine(cxt);
            drawNums(cxt); 
        }

        var drawOutLine = function()
        {
            cxt.beginPath();
            for(var i=1;i<16;i++)
            {
                cxt.moveTo(40,i*40);    
                cxt.lineTo(600,i*40);
                
                cxt.moveTo(i*40,40);
                cxt.lineTo(i*40,600);
            }
            cxt.closePath();
            cxt.stroke();
        }

        var drawNums = function()
        {
           for(var i=1;i<=15;i++)
            {
                cxt.font="14px California";

                cxt.fillText(i,40*i-3,30);
                cxt.fillText(i*40,40*i-3,15);

                cxt.fillText(String.fromCharCode(96+i),20,40*i+3);
                cxt.fillText(i*40,0,40*i+3         );
            } 
        }     
        //End private draw the board.

        //Start Listen to the click action
        var addClickListener = function (){
            canvas.addEventListener("mousedown",triggerThinkerFinished,false); 
        }

        var triggerThinkerFinished = function(event){
            window.pubSub.trigger("thinkFinished",[event.layerX,event.layerY]);
        }

        var reportClickAction = function(){
            var point = getClickedPoint(event.layerX,event.layerY);
            checkboard.clickActionReporter.putPiece(point[0],point[1]);
        }
        //End listen to the click action

        //Initilize the poins
        var getInitilizePoints = function()
        {
            var points = [];

            for(var i=0; i<=15; i++)
            {
                var a = [];
                for(var j=0;j<=15;j++)
                {
                    a.push(0);
                }
                points.push(a);
            }

            return points;
        }
        //End of initilize the poins

        
        var board = {};

        board.showAPiece = function(x,y,role){

            if(board.points[x][y] === 0){

                new Piece(cxt,x,y,role).draw(); 
                board.points[x][y] = role;

                return true;

            }
            else{

                return false;

            }

        }

        board.isPointFree = function(point){

            if(board.getPointValue(point) == 0){
                return true;
            }

            return false;
        }

        board.getPointValue = function(point){
            var point_x = point[0];
            var point_y = point[1];

            if(point_x < 0 || point_x > 15 || point_y < 0 || point_y > 15){
                return 0;
            }

            return board.points[point_x][point_y];
        }

        board.initilize = function(){

            draw(cxt);
            addClickListener();

            board.points = getInitilizePoints();
        }
        
        return board;

    }

}
















