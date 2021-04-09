//https://stackoverflow.com/a/29450606

Math.seed = function(s) {
    var mask = 0xffffffff;
    var m_w  = (123456789 + s) & mask;
    var m_z  = (987654321 - s) & mask;

    return function() {
      m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

      var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
      result /= 4294967296;
      return result;
    }
}

//https://stackoverflow.com/a/25352300

function isAlphaNumeric(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};

function toDigit(s, limit = 16) {
    let t = s;
    if(typeof t == "string") {
        t = t.toString().split('');

        for(let i = 0; i < t.length; i++) {
            t[i] = t[i].toUpperCase();
            if(!isAlphaNumeric(t[i])) {
                t[i] = t[i].charCodeAt() % 36;
                if(t[i] < 10) {
                    t[i] += 48;
                }else{
                    t[i] += 55;
                }
                t[i] = String.fromCharCode(t[i]);
            }
        }

        t = parseInt(t.join(''), 36) % Math.pow(10, limit);
    }
    console.log("Input seed: ", s);
    console.log("Integer seed: ", t);
    console.log("Use game.startGame() with a seed in the parenthases to generate a seeded map.")
    console.log("Note: Inputting a string of numbers will not set the seed to the string. Inputting an integer directly will.")
    return t
}

var c = 0;
var rand = function(){} //Math.seed(c);
