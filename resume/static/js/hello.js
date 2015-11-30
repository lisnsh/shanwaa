class Calc {
  constructor() {
    console.log('Calc constructor');
  }
  add(a, b) {
    return a + b;
  }
}

jQuery(function () {
  var c = new Calc();
  console.log(c.add(4, 5));

  //new Piece(cxt,10,10,"red").draw();
});