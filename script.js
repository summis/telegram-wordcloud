/* Some settings for word spiral.*/
var config = {
  trace: false,
  spiralResolution: 1, // lower = better resolution
  spiralLimit: 360 * 20,
  lineHeight: 0.8,
  xWordPadding: 5,
  yWordPadding: 5,
}

var colors = [
  "#009FFF",
  "#12812F",
  "#0F42D1",
  "#FF3E82",
  "#FF7300"
]

var cloud = document.getElementById("word-cloud");
cloud.style.position = "relative";

var traceCanvas = document.createElement("canvas");
traceCanvas.width = cloud.offsetWidth;
traceCanvas.height = cloud.offsetHeight;
var traceCanvasCtx = traceCanvas.getContext("2d");
cloud.appendChild(traceCanvas);

var startPoint = {
  x: cloud.offsetWidth / 2,
  y: cloud.offsetHeight / 2
};

var wordsDown = [];

function createWordObject(word, freq) {
  var wordContainer = document.createElement("div");
  wordContainer.style.position = "absolute";
  wordContainer.style.fontSize = freq + "px";
  wordContainer.style.lineHeight = config.lineHeight;
  wordContainer.appendChild(document.createTextNode(word));

  return wordContainer;
}

/* Appends word to page and its coordinates to list
 * containing object with word coordinates.
 * */
function placeWord(word, x, y) {
  cloud.appendChild(word);
  word.style.left = x - word.offsetWidth/2 + "px";
  word.style.top = y - word.offsetHeight/2 + "px";
  word.style.color = colors[Math.floor(Math.random() * colors.length)];

  wordsDown.push(word.getBoundingClientRect());
}

/* Calculates coordinates on spiral, evaluates callback on
 * them and returns its result. */
function spiral(i, callback) {
  angle = config.spiralResolution * i; // radians -> goes many times around
  x = (1 + angle) * Math.cos(angle);
  y = (1 + angle) * Math.sin(angle);
  return callback ? callback() : null;
}

/* Checks if word placed on x, y would overlap with existing words.
 * Return boolean. */
function intersect(word, x, y) {
  cloud.appendChild(word);

  word.style.left = x - word.offsetWidth/2 + "px";
  word.style.top = y - word.offsetHeight/2 + "px";

  var currentWord = word.getBoundingClientRect();

  cloud.removeChild(word);

  for(var i = 0; i < wordsDown.length; i+=1){
    var comparisonWord = wordsDown[i];

    if(!(currentWord.right + config.xWordPadding < comparisonWord.left - config.xWordPadding ||
      currentWord.left - config.xWordPadding > comparisonWord.right + config.xWordPadding ||
      currentWord.bottom + config.yWordPadding < comparisonWord.top - config.yWordPadding ||
      currentWord.top - config.yWordPadding > comparisonWord.bottom + config.yWordPadding)){

      return true;
    }
  }

  return false;
}

/* Main function, for each word iterates through spiral coordinates
 * until free spot is found where it is placed. */
(function placeWords() {
  for (var i = 0; i < words.length; i += 1) {

    var word = createWordObject(words[i].word, words[i].freq);

    for (var j = 0; j < config.spiralLimit; j++) {
      //If the spiral function returns true, we've placed the word down and can break from the j loop
      if (spiral(j, function() {
        if (!intersect(word, startPoint.x + x, startPoint.y + y)) {
          placeWord(word, startPoint.x + x, startPoint.y + y);
          return true;
        }
      })) {
        break;
      }
    }
  }
})();
