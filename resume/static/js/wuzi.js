jQuery(function(){
	var canvas = document.getElementById("myCanvas");
	canvas.width = 680;
	canvas.height = 680;

	var cxt=canvas.getContext("2d");

	drwawCheckerboardLine(cxt);
    drawCheckerboardNum(cxt);

    drawPiece(cxt);
});


function drwawCheckerboardLine (cxt){

	//var cxt=canvas.getContext("2d");

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

function drawCheckerboardNum(cxt)
{
	//var cxt=canvas.getContext("2d");
	
	for(var i=1;i<=15;i++)
	{
		cxt.font="14px California";
		cxt.fillText(i-1,40*i-3,30);

		cxt.fillText(String.fromCharCode(96+i),20,40*i+3);
	}
}

function drawPiece(cxt)
{

}
