"use strict";

let countMoves=0;
let prevCard; //previous tile (img)
let openPairs; //pairs that haven't been found yet

/**
 * [ Memory Game. ]
 * [Start game when a certain size of a deck is selected. Then initiates
 * the game by building a board. The images of the cards are randomly
 * distributed.
 * Rules for flipping cards:
 *    - 2 cards can be opened at the same time
 *    - if two match -> close when third card is clicked on
 *    - if two do match -> disappear.
 * Game ends when all cards have been found.
 * The game can be reinitialized any time.]
 * ]
 */
$(document).ready(function() {
  $("#start").on("click", function() {
    let cards;
    let level=$("input[name='level']:checked").val();
    if(level==="easy") {
      cards=16;
    } else if(level==="middle") {
      cards=24;
    } else if(level==="hard") {
      cards=36;
    } else {
      alert("Please select deck size");
    }
    
    buildBoard(cards);
  });
});

/**
 * [Initialize board for memory game. Randomly distribute images.]
 *
 * @param cards [cards in the current game.]
 */
function buildBoard(cards) {
  countMoves=0;
  openPairs=cards/2;
  
  //clear memory field
  $("#memoryField *").remove();
  
  // if 4x4 or 4x6 #memoryField width = 372px, 6x6 width = 558px
  if(cards===36) {
    $("#memoryField").css("width", "558px");
  } else {
    $("#memoryField").css("width", "372px");
  }
  
  // create html for each card
  let arr=new Array();
  for(let i=0; i<cards; i++) {
    arr.push(i);
    $("#memoryField").append("</div><div class='card' id='c"+i+"'><div"+
      " class='flip-card-inner' id='innerCard"+i+"'><div"+
      " class='flip-card-front'></div><div"+
      " class='flip-card-back'></div></div></div>");
    $("#c"+i+" .flip-card-inner .flip-card-back").append("<img width='85'"+
      " src='' id='i"+i+"' alt='animal'>");
  }
  
  // randomly distribute images
  let r;
  for(let i=0; i<(cards/2); i++) {
    r=getRandom(0, arr.length-1);
    let addHere="#c"+arr[r]+" .flip-card-inner .flip-card-back img";
    $(addHere).attr("src", "imgs/img_"+i+".jpg");
    arr.splice(r, 1); //deletes the element on index r
    r=getRandom(0, arr.length-1);
    addHere="#c"+arr[r]+" .flip-card-inner .flip-card-back img"
    $(addHere).attr("src", "imgs/img_"+i+".jpg");
    arr.splice(r, 1);
  }
  
  // add clickhandler for flipping tiles
  for(let i=0; i<cards; i++) {
    $("#c"+i).on("click", function() {
      flipTiles(i);
    });
  }
}

/**
 * [Flip cards when clicked upon.
 *  Rules for flipping cards:
 *    - 2 cards can be turned around / opened at the same time
 *    - if they don't match -> they close when third card is clicked
 *    - if they do match -> matching cards disappear and cannot be clicked
 *      anymore
 *
 * @param i [i for id of current tile.]
 */
function flipTiles(i) {
  let currID="#c"+i;
  let currTile=$(currID);
  currTile.addClass("rotate");
  let innerTile="#innerCard"+i;
  $(innerTile).addClass("rotate");
  countMoves++;
  
  // react on open cards
  if(countMoves%2===0) {
    currTile.addClass("rotate");
    $(innerTile).addClass("rotate");
    let prevID="#innerCard"+prevCard;
    if(($("#innerCard"+prevCard+" .flip-card-back img").attr('src')===
      $(innerTile+" .flip-card-back img").attr('src'))
      && (prevID!==innerTile)) {
      // matching cards stay open for a short time
      window.setTimeout(function() {
        currTile.addClass("disappear");
        $("#c"+prevCard).addClass("disappear");
        openPairs--;
        
        //end of game
        if(openPairs===0) {
          alert("Congratulations! You won!\nYou needed "+countMoves+" moves");
        }
      }, 600);
    }
  } else if(countMoves!==1 && countMoves%2!==0) {
    $(".card").removeClass("rotate");
    $(".card .flip-card-inner").removeClass("rotate");
    currTile.addClass("rotate");
    $("#innerCard"+i).addClass("rotate");
    prevCard=i;
  } else {
    prevCard=i;
  }
}

/**
 * [Returns random number for random distribution of images.]
 *
 * @param min [minimum]
 * @param max [maximum, length of array]
 * @returns {number|*}
 */
function getRandom(min, max) {
  if(min>max) return -1;
  if(min===max) return min;
  return min+parseInt(Math.random()*(max-min+1));
}