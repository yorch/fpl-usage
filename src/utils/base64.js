// Obtained from: https://www.fpl.com/app/framework/dojo/dojo/dojo.js.uncompressed.js

export const base64 = {};

const p = '=';
const tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

base64.encode = function (/* byte[] */ ba) {
  // summary:
  //		Encode an array of bytes as a base64-encoded string
  var s = [],
    l = ba.length;
  var rm = l % 3;
  var x = l - rm;
  for (var i = 0; i < x; ) {
    var t = (ba[i++] << 16) | (ba[i++] << 8) | ba[i++];
    s.push(tab.charAt((t >>> 18) & 0x3f));
    s.push(tab.charAt((t >>> 12) & 0x3f));
    s.push(tab.charAt((t >>> 6) & 0x3f));
    s.push(tab.charAt(t & 0x3f));
  }
  //	deal with trailers, based on patch from Peter Wood.
  switch (rm) {
    case 2: {
      var t = (ba[i++] << 16) | (ba[i++] << 8);
      s.push(tab.charAt((t >>> 18) & 0x3f));
      s.push(tab.charAt((t >>> 12) & 0x3f));
      s.push(tab.charAt((t >>> 6) & 0x3f));
      s.push(p);
      break;
    }
    case 1: {
      var t = ba[i++] << 16;
      s.push(tab.charAt((t >>> 18) & 0x3f));
      s.push(tab.charAt((t >>> 12) & 0x3f));
      s.push(p);
      s.push(p);
      break;
    }
  }
  return s.join(''); //	string
};

base64.decode = function (/* string */ str) {
  // summary:
  //		Convert a base64-encoded string to an array of bytes
  var s = str.split(''),
    out = [];
  var l = s.length;
  while (s[--l] == p) {} //	strip off trailing padding
  for (var i = 0; i < l; ) {
    var t = tab.indexOf(s[i++]) << 18;
    if (i <= l) {
      t |= tab.indexOf(s[i++]) << 12;
    }
    if (i <= l) {
      t |= tab.indexOf(s[i++]) << 6;
    }
    if (i <= l) {
      t |= tab.indexOf(s[i++]);
    }
    out.push((t >>> 16) & 0xff);
    out.push((t >>> 8) & 0xff);
    out.push(t & 0xff);
  }
  //	strip off any null bytes
  while (out[out.length - 1] == 0) {
    out.pop();
  }
  return out; //	byte[]
};

// export const base64 = {
//   _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

//   encode: function (input) {
//     var output = "";
//     var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
//     var i = 0;

//     input = base64._utf8_encode(input);

//     while (i < input.length) {
//       chr1 = input.charCodeAt(i++);
//       chr2 = input.charCodeAt(i++);
//       chr3 = input.charCodeAt(i++);

//       enc1 = chr1 >> 2;
//       enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
//       enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
//       enc4 = chr3 & 63;

//       if (isNaN(chr2)) {
//         enc3 = enc4 = 64;
//       } else if (isNaN(chr3)) {
//         enc4 = 64;
//       }

//       output =
//         output +
//         this._keyStr.charAt(enc1) +
//         this._keyStr.charAt(enc2) +
//         this._keyStr.charAt(enc3) +
//         this._keyStr.charAt(enc4);
//     }

//     return output;
//   },

//   decode: function (input) {
//     var output = "";
//     var chr1, chr2, chr3;
//     var enc1, enc2, enc3, enc4;
//     var i = 0;

//     input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

//     while (i < input.length) {
//       enc1 = this._keyStr.indexOf(input.charAt(i++));
//       enc2 = this._keyStr.indexOf(input.charAt(i++));
//       enc3 = this._keyStr.indexOf(input.charAt(i++));
//       enc4 = this._keyStr.indexOf(input.charAt(i++));

//       chr1 = (enc1 << 2) | (enc2 >> 4);
//       chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
//       chr3 = ((enc3 & 3) << 6) | enc4;

//       output = output + String.fromCharCode(chr1);

//       if (enc3 != 64) {
//         output = output + String.fromCharCode(chr2);
//       }
//       if (enc4 != 64) {
//         output = output + String.fromCharCode(chr3);
//       }
//     }

//     output = Base64._utf8_decode(output);

//     return output;
//   },

//   _utf8_encode: function (string) {
//     string = string.replace(/\r\n/g, "\n");
//     var utftext = "";

//     for (var n = 0; n < string.length; n++) {
//       var c = string.charCodeAt(n);

//       if (c < 128) {
//         utftext += String.fromCharCode(c);
//       } else if (c > 127 && c < 2048) {
//         utftext += String.fromCharCode((c >> 6) | 192);
//         utftext += String.fromCharCode((c & 63) | 128);
//       } else {
//         utftext += String.fromCharCode((c >> 12) | 224);
//         utftext += String.fromCharCode(((c >> 6) & 63) | 128);
//         utftext += String.fromCharCode((c & 63) | 128);
//       }
//     }

//     return utftext;
//   },

//   _utf8_decode: function (utftext) {
//     var string = "";
//     var i = 0;
//     var c = (c1 = c2 = 0);

//     while (i < utftext.length) {
//       c = utftext.charCodeAt(i);

//       if (c < 128) {
//         string += String.fromCharCode(c);
//         i++;
//       } else if (c > 191 && c < 224) {
//         c2 = utftext.charCodeAt(i + 1);
//         string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
//         i += 2;
//       } else {
//         c2 = utftext.charCodeAt(i + 1);
//         c3 = utftext.charCodeAt(i + 2);
//         string += String.fromCharCode(
//           ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
//         );
//         i += 3;
//       }
//     }

//     return string;
//   },
// };
