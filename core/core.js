
function Game(func, bw, bh){
  let callbackFunc = func;
  let state = initialState(bw, bh);

  let startGame = setInterval(main, 1);

  let update(delta, bw, bh){
    //ball update
    let b = state.ball;

    let lt = state.left;
    let rt = state.right;
    let tp = state.top;
    let btm = state.bottom;

    // bouncing off paddle

    //left paddle
    if (b.x-b.r < lt.h && b.x+b.r > lt.h) {
      if (b.y-b.r >= lt.y && b.y+b.r <= lt.y+lt.w) {
        b.x = b.r+lt.h;
        b.x_spd *= -1;
        b.y_spd += lt.y_spd/2;
      } else {
        state.ball = startBall(bw, bh);
      }

    } //top paddle
    else if (b.y-b.r < tp.y+tp.h && b.y+b.r > tp.y+tp.h) {
      if (b.x-b.r >= tp.x && b.x+b.r <= tp.x+tp.w){
        b.y = b.r+tp.h;
        b.y_spd *= -1;
        b.x_spd += tp.x_spd/2;
      } else {
        state.ball = startBall(bw, bh);
      }

    } //right paddle
    else if (b.x+b.r > state.board.w-rt.h && b.x-b.r < state.board.w-rt.h){
      if (b.y-b.r >= rt.y && b.y + b.r <= rt.y+rt.w){
        b.x = state.board.w-b.r-rt.h;
        b.x_sd *= -1;
        b.y_spd += rt.y_spd/2;
      } else {
        state.ball = startBall(bw, bh);
      }

    }  //bottom paddle
    else if (b.y-b.r > state.board.h-bt.h && b.y+b.r < state.board.h-bt.h){
      if (b.x-b.r >= bt.x && b.x+b.r <= bt.x+bt.w){
        b.y = state.board.h-b.r-bt.h;
        b.y_spd *=  -1;
        b.x_spd += bt.x_spd/2;
      } else {
        state.ball = startBall(bw, bh);
      }
    }

    b.x += delta * b.v.x;
    b.y += delta * b.v.y;

    state.ball = b;


    //player update
    for (let i=0; i<inputs.length; i++){
      if (inputs[i].ud == "up") continue;
      let hasUp = false;
      for (let j=i; j<inputs.length; j++){
        if (inputs[j].player == inputs[i].player && inputs[j].direction == inputs[i].direction && inputs[j].ud == "up"){
          hasUp = inputs[j];
        }
        let dta;
        if (hasUp == false){
          dta = Date.now() - inputs[i].time;
          inputs[i].time = Date.now();
        } else {
          dta = hasUp.time - inputs[i].time;
        }
        let pl;
        if (inputs[j].player == 'l'){
          pl = state.left;
          if (inputs[j].direction == "left"){
            if (pl.y <= 0) {
              pl.y = 0;
              pl.y_spd = 0;
            } else {
              pl.y_spd = 4;
              pl.y -= pl.y_spd * dta;
            }
          } else {
            if (pl.y+pl.w >= state.board.h) {
              pl.y = state.board.h - pl.w;
              pl.y_spd = 0;
            } else {
              pl.y_spd = 4;
              pl.y += pl.y_spd * dta;
            }
          }
          state.left = pl;
        } else if (inputs[j].player == 't'){
          pl = state.top;
          if (inputs[j].direction == "left"){
            if (pl.x >= state.board.w){
              pl.x = state.board.w - pl.w;
              pl.x_spd = 0;
            } else {
              pl.x_spd = 4;
              pl.x += pl.x_spd * dta;
            }
          } else {
            if (pl.x <= 0){
              pl.x = 0;
              pl.x_spd = 0;
            } else {
              pl.x_spd = 4;
              pl.x -= pl.x_spd * dta;
            }
          }
          state.top = pl;
        } else if (inputs[j].player == 'r'){
          pl = state.right;
          if (inputs[j].direction == "left"){
            if (pl.y >= state.board.h){
              pl.y = state.board.h - pl.w;
              pl.y_spd = 0;
            } else {
              pl.y_spd = 4;
              pl.y += pl.y_spd * dta;
            }
          } else {
            if (pl.y <= 0){
              pl.y = 0;
              pl.y_spd = 0;
            } else {
              pl.x_spd = 4;
              pl.y -= pl.y_spd * dta;
            }
          }
          state.right = pl;
        } else {
          pl = state.bottom;
          if (inputs[j].direction == "left"){
            if (pl.x <= 0){
              pl.x = 0;
              pl.x_spd = 0;
            } else {
              pl.x_spd = 4;
              pl.x -= pl.x_spd * dta;
            }
          } else {
            if (pl.x >= state.board.w){
              pl.x = state.board.w - pl.w;
              pl.x_spd = 0;
            } else {
              pl.x_spd = 4;
              pl.x += pl.x_spd * dta;
            }
          }
          state.bottom = pl;
        }
      }
    }

  }

  function main() {
		if (typeof(then) == 'undefined') then = Date.now();
		now = Date.now();
		delta = now - then;
		update(delta / 1000, bw, bh);
		callbackFunc(state);
		then = now;
	}


  function initialState(bw, bh){
    ball: startBall(bw, bh, 25),
    left: new Player(0, bh/2-25, 50, 10),
    top: new Player(bw/2-25, 0, 50, 10),
    right: new Player(bw-10, bh/2-25, 50, 10),
    bottom: new Player(bw/2-25, bh-10, 50, 10),
    board: {
      w: bw,  h: bh
    }
  }

  function startBall(bw, bh){
    return new Ball(bw/2, bh/2, 25);
  }

  function Player(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.x_spd = 0;
    this.y_spd = 0;
  }

  function Ball(x, y, r){
    this.x = x;
    this.y = y;
    this.r = r;
    this.x_spd = 0;
    this.y_spd = 75;
  }

  this.inputs = [];
}

Game.prototype.move = function(player, direction, time, ud){
  this.inputs.push({player: player, direction: direction, time: time, ud: ud});
}