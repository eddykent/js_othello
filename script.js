//const
const cp1='#0000ff';//colour
const cp2='#ff0000';//colour
const cnp='#00ff00';
const chl='#99ff99';
const size=10;//size of board
//1=greedy 2=random
const aiType=1;

//vars
var spaces = new Array();
var turn = 1;//p1's turn first
var animating = false;
var o = new Object();

function initGrid(s){
  var b = '<table>';
  for(var i=0;i<s;i++){
    b += '<tr>';
    for(var j=0;j<s;j++){
      var d='p'+i+'-'+j;
      b += '<td><div class=\"gspace\" id=\"'+d+'\"></div></td>';
    }
    b += '</tr>';
  }
  b += "</table>";
 document.getElementById('gameboard').innerHTML = b;
  for(var i=0;i<s;i++){
    for(var j=0;j<s;j++){ 
      var q='p'+i+'-'+j;
      var e=document.getElementById(q);
      spaces[j*size+i]=e;
      e.play=0;
      e.x = i;
      e.y = j;
      e.dr = function(){
        switch(this.play){
          case 0:
         this.style.backgroundColor=cnp;
            break;
          case 1:
            this.style.backgroundColor=cp1;
            break;
          case 2:
            this.style.backgroundColor=cp2;
            break;
        }
      };
      e.sw = function(){
        if(this.play==1){
          this.play = 2;
          this.dr();
        }else if(this.play==2){
          this.play = 1;
          this.dr();
        }
      };
      e.onclick = function(e){
        if(this.play==0 && !animating){
          if(turn==2&&aiType!=0){
//ai turn click disabled
          }else{
            move(this.x,this.y);
          }
        }
      };
      e.hl = function(){
        if(this.play==0){
this.style.backgroundColor=chl;
        }
      };
      e.uhl = function(){
        if(this.play==0){
          this.style.backgroundColor=cnp;
        }
      };
    }
  }
}

function doScores(){
  var s1=countScore(1);
  var s2=countScore(2);
  var win=0;
  document.getElementById('p1s').innerHTML=s1;
document.getElementById("p2s").innerHTML=s2;
  if(s1==0){
    //p2win
    win=2;
  }
  if(s2==0){
    //p1win
    win=1;
  }
  if(s1+s2==size*size){
    if(s1>s2){
      win=1;
    }
    if(s2>s1){
      win=2;
    }
  }
}



function init(){
  for(var i=0;i<size;i++){
    for(var j=0;j<size;j++){
      var c = spaces[i+size*j];
      if(i==Math.floor(size/2)&&j==Math.floor(size/2)){
        c.play=1;
      }
      if(i==Math.floor((size-1)/2)&&j==Math.floor((size-1)/2)){
        c.play=1;
      }
               if(i==Math.floor((size-1)/2)&&j==Math.floor(size/2)){
        c.play=2;
      }
      if(i==Math.floor(size/2)&&j==Math.floor((size-1)/2)){
        c.play=2;
      }
      c.dr();
    }
  }
}

function clearHL(){
  for(var i=0;i<spaces.length;i++){
    spaces[i].uhl();
  }
}

function move(x,y){
   //move
   var arrs = getMoveArrays(x,y);
   if(getScore(arrs)<=0){
     return;//maybe notify
   }
   //get counter
   var i=x+size*y;
   var c = spaces[i];
   c.play = turn;
   c.dr();
   turn=opp();
   animateFlip(arrs);
  
}

function greedyMove(){
  var co = new Object();
  co.x=-1;
  co.y=-1;
  var best = 0;
  for(var i=0;i<size;i++){
    for(var j=0;j<size;j++){
      if(spaces[i+size*j].play==0){
        var arrs=getMoveArrays(i,j);
        var s=getScore(arrs);
        if(s>best){
          best = s;
          co.x = i;
          co.y = j;
        }
      }
    }
  }
  return co;
}

function randomMove(){
  var mvs=new Array();
  for(var i=0;i<size;i++){
    for(var j=0;j<size;j++){
      if(spaces[i+size*j].play!=0){
        continue;
      }
      var co=new Object();
      co.x=i;
      co.y=j;
      var a=getMoveArrays(i,j);
      if(getScore(a)>0){
         mvs.push(co);
      }
    } 
  }
  var r =Math.floor(Math.random()*mvs.length);
  return mvs[r];
}

function countScore(p){
  var count=0;
  for(var i=0;i<size;i++){
    for(var j=0;j<size;j++){
      if(spaces[i+size*j].play==p){
        count++;
      }
    }
  }
  return count;
}

function getMoveArrays(x,y){
  //flip all valid channels
  //first set up arrays
  //aka list of counters
  //iterate through arrays 
  // at same time
  var marrs = new Object();
  marrs.left = new Array();
  marrs.right = new Array();
  marrs.top = new Array();
  marrs.bottom = new Array();
  marrs.tl = new Array();
  marrs.tr = new Array();
  marrs.bl = new Array();
  marrs.br = new Array();
  //down
  for(var i=x+1;i<size;i++){
    var c=spaces[i+size*y];
    if(c.play==0 || c.play==opp()&&i==size-1){
      marrs.bottom = [];
      break;
    }
    if(c.play==turn){
      break;
    }
    marrs.bottom.push(c);
  }
  //up
  for(var i=x-1;i>=0;i--){
    var c=spaces[i+size*y];
    if(c.play==0 || c.play==opp()&&i==0){
      marrs.top = [];
      break;
    }
    if(c.play==turn){
      break;
    }
    marrs.top.push(c);
  }
  //right
  for(var i=y+1;i<size;i++){
    var c=spaces[x+size*i];
    if(c.play==0 || c.play==opp()&&i==size-1){
      marrs.right=[];
      break;
    }
    if(c.play==turn){
      break;
    }
    marrs.right.push(c);
  }
  //left
  for(var i=y-1;i>=0;i--){
    var c=spaces[x+size*i];
    if(c.play==0 || c.play==opp()&&i==0){
      marrs.left = [];
      break;
    }
    if(c.play==turn){
      break;
    }
    marrs.left.push(c);
  }
  //diagonal +x+y downright
  var j = y+1;
  for(var i=x+1;i<size && j<size;i++){
    var c=spaces[i+size*j];
    if(c.play==0 || c.play==opp()&&(i==size-1 || j==size-1)){
      marrs.br = [];
      break;
    }
    if(c.play==turn){
      break;
    }
    marrs.br.push(c);
    j++;
  }
 
 //diagonal +x-y downleft
  var j = y-1;
  for(var i=x+1;i<size && j>=0;i++){
    var c=spaces[i+size*j];
    if(c.play==0 || c.play==opp()&&(i==size-1 || j==0)){
      marrs.bl = [];
      break;
    }
    if(c.play==turn){
      break;
    }
    marrs.bl.push(c);
    j--;
  }
   //diagonal -x+y upright
  var j = y+1;
  for(var i=x-1;i>=0 && j<size;i--){
    var c=spaces[i+size*j];
    if(c.play==0 || c.play==opp()&&(i==0 || j==size-1)){
      marrs.tr = [];
      break;
    }
    if(c.play==turn){
      break;
    }
    marrs.tr.push(c);
    j++;
  }
   //diagonal -x-y upleft
  var j = y-1;
  for(var i=x-1;i>=0 && j>=0;i--){
    var c=spaces[i+size*j];
    if(c.play==0 || c.play==opp()&&(i==0 || j==0)){
      marrs.tl =[];
      break;
    }
    if(c.play==turn){
      break;
    }
    marrs.tl.push(c);
    j--;
  }
  return marrs;
}

function getScore(arrs){
  var score = 0;
  score+=arrs.top.length;
  score+=arrs.bottom.length;
  score+=arrs.left.length;
  score+=arrs.right.length;
  score+=arrs.tl.length;
  score+=arrs.bl.length;
  score+=arrs.tr.length;
  score+=arrs.br.length;
  return score;
}

function opp(){
  if(turn==1){
    return 2;
  }
  if(turn==2){
    return 1;
  }
}

function animateFlip(arr){
  animating=true;
  var a=arr;
  var s=getMALength(arr);
  var i=0;
  var il=100;//interval length
  var d=setInterval(function(){
  //  document.write(i);
    if(a.top.length>i){
      a.top[i].sw();
    }
    if(a.bottom.length>i){
      a.bottom[i].sw();
    }
    if(a.right.length>i){
      a.right[i].sw();
    }
    if(a.left.length>i){
      a.left[i].sw();
    }
    if(a.tl.length>i){
      a.tl[i].sw();
    }
    if(a.tr.length>i){
      a.tr[i].sw();
    }
    if(a.bl.length>i){
      a.bl[i].sw();
    }
    if(a.br.length>i){
      a.br[i].sw();
    }
    i++;
    if(i==s){
      clearInterval(d);
      var nmi=100;
      if(aiType!=0){
        nmi=1000;
      }
      clearHL();
      checkBoard();
      doScores();
      setTimeout(function(){
        aiMove();
      },nmi);
    }
  },il);
}

function checkBoard(){
  var n=0;
  for(var i=0;i<size;i++){
    for(var j=0;j<size;j++){
      var c=spaces[i+size*j];
      if(c.play==0){
var a=getMoveArrays(i,j);
        var s=getScore(a);
        if(s>0){
          c.hl();
        }
      }
    }
  }
  return n;
}

function aiMove(){
  if(turn==1){
    animating=false;
    return;
  }
  switch(aiType){
    case 0://2p
      animating=false;
      break;
    case 1://greedy
      var m = greedyMove();
      move(m.x,m.y);
      break;
    case 2:
      var m = randomMove();
      move(m.x,m.y);
      break;
  }
}

function getMALength(a){
  var s=0;
  if(a.top.length>s){
    s=a.top.length;
  }
  if(a.bottom.length>s){
    s=a.bottom.length;
  }
  if(a.right.length>s){
    s=a.right.length;
  }
  if(a.left.length>s){
    s=a.left.length;
  }
  if(a.tr.length>s){
    s=a.tr.length;
  }
  if(a.tl.length>s){
    s=a.tl.length;
  }
  if(a.br.length>s){
    s=a.br.length;
  }
  if(a.bl.length>s){
    s=a.bl.length;
  }
  return s;
}

initGrid(size);
init();
checkBoard();
doScores();