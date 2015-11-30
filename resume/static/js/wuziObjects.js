class Calc {
    constructor(){
      console.log('Calc constructor');
    }
    add(a, b){
      return a + b;
    }
  }

jQuery(function(){
    var c = new Calc();
    console.log(c.add(4,5));

    new Piece(cxt,10,10,"red").draw();
});

class Piece
{
    /*constructor(cxt,x,y,role)
    {
      console.log('Piece has been created');

      this.cxt=cxt;
      this.x=x;
      this.y=y;
      this.role = role;
    }

    draw()
    {
        cxt.beginPath();

        cxt.setPieceStyle();
        drawPieceOutLine();
        strokeDraw();
      
        cxt.closePath();

    drawPieceOutLine()
    {
        cxt.lineWidth=0;
        cxt.arc((x+1)*40,(x+1)*40,15,0,Math.PI*2,true);
    }

    setPieceStyle()
    {
        cxt.strokeStyle = color;
        cxt.fillStyle=color;
    }

    strokeDraw()
    {
        cxt.fill();
        cxt.stroke();
    }*/

} 

