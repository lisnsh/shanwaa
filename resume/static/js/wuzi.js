function PubSub() {
  this.handlers = {};
}

PubSub.prototype = {
  // 订阅事件
  	on: function(eventType,handler){
	    var self = this;
	    if(!(eventType in self.handlers)) {
	       self.handlers[eventType] = [];
	    }

	    //self.handlers[eventType].push(handler);
	    self.handlers[eventType][0] = handler;
	    return this;
	   },

     // 触发事件(发布事件)
     trigger: function(eventType){
       var self = this;
       var handlerArgs = Array.prototype.slice.call(arguments,1);
       for(var i = 0; i < self.handlers[eventType].length; i++) {
         self.handlers[eventType][i].apply(self,handlerArgs);
       }
       return self;
     }
};

jQuery(function(){

	window.pubSub = new PubSub();

	var canvas = document.getElementById("myCanvas");
	canvas.width = 680;
	canvas.height = 680;

	var cxt=canvas.getContext("2d");


	var board = Checkerboard.createNew(canvas,cxt);
	board.initilize();

	var human_player = HumanPlayer.createNew(board);
	var ai_player = AIPlayer.createNew(board);

	human_player.setOpponent(ai_player);
	ai_player.setOpponent(human_player);

	human_player.play();

});


var HumanThinker = {
	createNew:function(){

		/*var getClickedPoint = function (click_x,click_y)
	    {
	        var pointPositionXs = [];
	        var pointPositionYs = [];

	        var returnX = 0;
	        var returnY = 0;

	        for(var i=0;i<=15;i++)
	        {
	            pointPositionXs[i] = i*40;
	            pointPositionYs[i] = i*40;
	        }

	        for(var i=1;i<=15;i++)
	        {
	            if(Math.abs(click_x-pointPositionXs[i])<=20)
	            {
	                returnX = i;
	                console.log("click_x: "+click_x+"  pointPositionX "+pointPositionXs[i]+" returnX "+returnX);
	            }
	            if(Math.abs(click_y-pointPositionYs[i])<=20)
	            {
	                returnY = i;
	                console.log("click_y: "+click_y+"  pointPositionY "+pointPositionYs[i]+" returnY "+returnY);
	            }
	        }

	        return [returnX,returnY];
	    }*/

	    var getPointIndex = function(distance){
	    	return Math.round(distance/40);
	    }

	    var getClickedPoint = function (click_x,click_y){
	    	return [getPointIndex(click_x),getPointIndex(click_y)]
	    }

		var thinker = {};

		thinker.getPoint = function(layer){
			return getClickedPoint(layer[0],layer[1]);
		}

		return thinker;

	}
}

var AIThinker = {

	createNew:function(){

		var pickPoint = function ()
	    {
	        return [pickRandomNum(),pickRandomNum()];
	    }

	    var pickRandomNum = function ()
	    {
	        return Math.floor(Math.random()*100+1)%15 +1;
	    }

	    var getOpponentRole = function(){
	    	return 1;
	    }

		var ai_thinker = [];
		ai_thinker.getPoint = function(){
			return pickPoint();
		}

		return ai_thinker;
	}

}

var Player = {

	createNew:function(board){

		var player = {};

		player.board = board;

		player.setOpponent = function (opponentPlayer){
			player.opponent = opponentPlayer;
		}

		player.callOpponent = function(){
			player.opponent.putPiece();
		}

		player.isPointFree = function(point){
			return board.isPointFree(point);
		}

		return player;

	}

}

var HumanPlayer = {

	createNew:function(board,thinker){

		var humanPlayer = Player.createNew(board);

	    humanPlayer.play = function(){
			var thinker = HumanThinker.createNew(board);

			window.pubSub.on("thinkFinished",function(layer){
				var point = thinker.getPoint(layer);

				if(humanPlayer.isPointFree(point)){
					humanPlayer.putPiece(point[0],point[1],2);
				}else{
					alert("Please retry!");
				}
			});
		}	

		humanPlayer.putPiece = function(x,y){
			board.showAPiece(x,y,2);
			//board.points[x][y] = 2;

			var judge = Judge.createNew(board);
			if(judge.check([x,y])){
				alert("Human vin");

				return;
			}

			humanPlayer.opponent.play();
		}

		return humanPlayer;

	}

}


var AIPlayer = {

	createNew:function(board){

		var aiPlayer = Player.createNew(board);

		aiPlayer.play = function(){
			var thinker = AIThinker.createNew(board);
			var point = thinker.getPoint();

			if(aiPlayer.isPointFree(point)){
				aiPlayer.putPiece(point[0],point[1],2);

				return;
			}
		}	

		aiPlayer.putPiece = function(x,y){

			if (board.showAPiece(x,y,1)){

				aiPlayer.opponent.play();
				return true;

			}else{
				return false;
			}

		}

		return aiPlayer;

	}

}

var Judge = {

	createNew:function(board){

		var getPointValue = function(point){
			return board.points[point[0]][point[1]];
		}

		var hasFivePiece = function(diff,role_value,getFronterPointValue){

			for(var i=diff;i<=diff+4;i++){

				if(getDiffPointValue(i) != role_value){
					return false;
				}

			}

			return true;
		}

		var hasFivePiece = function(smallest_related_index,role_value,getRelatedPointValue){

			for(var i=smallest_related_index;i<=smallest_related_index+4;i++){

				if(getRelatedPointValue(i) != role_value){
					return false;
				}

			}

			return true;
		}


		var hasFivePieceInLine = function(point,getRelatedPointValue){
			var point_x = point[0];
			var point_y = point[1];

			var role_value = board.points[point_x][point_y];

			for(var related_index=-4;related_index<=0;related_index++){
				if (hasFivePiece(related_index,role_value,getRelatedPointValue)){
					return true;
				}
			}

			return false;
		}

		var hasFivePieceInRow = function(point){

			var getRelatedPointValue = function(related_index){
				return board.getPointValue([point[0]+related_index,point[1]]); 
			}

			return hasFivePieceInLine(point,getRelatedPointValue);
		}

		var hasFivePieceInCol = function(point){

			var getRelatedPointValue = function(related_index){
				return board.getPointValue([point[0],point[1]+related_index]);
			}

			return hasFivePieceInLine(point,getRelatedPointValue);
		}

		var hasFivePieceInLeftDiagonal = function(point){

			var getRelatedPointValue = function(related_index){
				return board.getPointValue([point[0]+related_index,point[1]+related_index]);
			}

			return hasFivePieceInLine(point,getRelatedPointValue);
		}

		var hasFivePieceInRightDiagonal = function(point){

			var getRelatedPointValue = function(related_index){
				return board.getPointValue([point[0]+related_index,point[1]-related_index]);
			}

			return hasFivePieceInLine(point,getRelatedPointValue);
		}

		var hasFivePieceInDifferentWays = [];
		hasFivePieceInDifferentWays.push(hasFivePieceInRow);
		hasFivePieceInDifferentWays.push(hasFivePieceInCol);
		hasFivePieceInDifferentWays.push(hasFivePieceInLeftDiagonal);
		hasFivePieceInDifferentWays.push(hasFivePieceInRightDiagonal);

		var judge = {};

		judge.check = function(point){

			/*hasFivePieceInDifferentWays.forEach(function(hasFivePiece){
				if(hasFivePiece(point)){
					return true;
				}
			});*/

			if(hasFivePieceInRow(point)){
				return true;
			}

			if(hasFivePieceInCol(point)){
				return true;
			}

			if(hasFivePieceInLeftDiagonal(point)){
				return true;
			}

			if(hasFivePieceInRightDiagonal(point)){
				return true;
			}
			

			return false;
		}

		return judge;
	}

}














