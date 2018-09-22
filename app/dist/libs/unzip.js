/*
 * $Id: base64.js,v 2.11 2013/04/08 12:27:14 dankogai Exp dankogai $
 *
 *  Licensed under the MIT license.
 *    http://opensource.org/licenses/mit-license
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
;(function(global) {
    'use strict';
    if (global.Base64_Zip){
        //alert("1");
        //return;

    }
    var version = "2.1.1";
    // if node.js, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        buffer = require('buffer').Buffer;
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                   + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                   + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var Base64_btoa =  function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer
        ? function (u) { return (new buffer(u)).toString('base64') } 
    : function (u) { return Base64_btoa(utob(u)) }
    ;
    var encode = function(u, urisafe) {
        return !urisafe 
            ? _encode(u)
            : _encode(u).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var Base64_atob = function(a){
        return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };
    var _decode = buffer
        ? function(a) { return (new buffer(a, 'base64')).toString() }
    : function(a) { return btou(Base64_atob(a)) };
    var decode = function(a){
        return _decode(
            a.replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    // export Base64
    global.Base64_Zip = {
        VERSION: version,
        atob: Base64_atob,
        btoa: Base64_btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64_Zip.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    // that's it!
})(this);


function unzip(b64Data) {
        const jsdom = require("jsdom");
        const { JSDOM } = jsdom;
        const { window } = new JSDOM();
        var strData ;
		if(!window.atob){
		//	strData	= $.base64.atob(b64Data)
		}else{
		//	strData = atob(b64Data)
		}
        var charData ;
		if (!Array.prototype.map) {
		 //  charData =iemap( strData.split(''),function (x) { return x.charCodeAt(0); },null);
		}else{
		//	charData = strData.split('').map(function (x) { return x.charCodeAt(0); });
		}
		
		strData = Base64_Zip.btou(RawDeflate.inflate(Base64_Zip.fromBase64(b64Data)));
       // var binData = new Uint8Array(charData);
      //  var data = pako.inflate(binData);
      //  strData = String.fromCharCode.apply(null, new Uint16Array(data));
        return strData;
}


var com = {};
com.str = {
    _KEY: "12345678900000001234567890000000",//32λ
    _IV: "abcd134556abcedf",//16λ
    /**************************************************************
    *�ַ�������
    *   str����Ҫ���ܵ��ַ���
    ****************************************************************/
    Encrypt: function (str) {
        var key = CryptoJS.enc.Utf8.parse(this._KEY);
        var iv = CryptoJS.enc.Utf8.parse(this._IV);

        var encrypted = '';

        var srcs = CryptoJS.enc.Utf8.parse(str);
        encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.ciphertext.toString();
    },

    /**************************************************************
    *�ַ�������
    *   str����Ҫ���ܵ��ַ���
    ****************************************************************/
    Decrypt: function (str) {
		var result =  com.str.DecryptInner(str);
		 try {
            var newstr =  com.str.DecryptInner(result);
			if(newstr!=""){
				result = newstr;
			}
          } catch (ex) {
			var msg = ex;
        }
        return result;
    },
	 DecryptInner: function (str) {
        var key = CryptoJS.enc.Utf8.parse(this._KEY);
        var iv = CryptoJS.enc.Utf8.parse(this._IV);
        var encryptedHexStr = CryptoJS.enc.Hex.parse(str);
        var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        var decrypt = CryptoJS.AES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
		var result =  decryptedStr.toString();
		 try {
            result =  Decrypt(result);
          } catch (ex) {
			var msg = ex;
        }
        return result;
    }
}


  function iemap(myarray ,callback, thisArg) {
 
        var T, A, k;
 
        if (myarray == null) {
            throw new TypeError(" this is null or not defined");
        }
        var O = Object(myarray);
 
        var len = O.length >>> 0; 
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
 
        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }
      
        A = new Array(len);
        k = 0;
        while(k < len) {
            var kValue, mappedValue;
            if (k in O) {               
                kValue = O[ k ]; 
                mappedValue = callback.call(T, kValue, k, O);
 
                A[ k ] = mappedValue;
            }
            k++;
        }
        return A;
    };


function getDocId(){
    return com.str.Decrypt(unzip("DcKNw4kNADEIw4RaAsOCw7lMGMOowr/CpMOdwp9lw4kywqQNw5HCnMORbTXDhsKYC8ODE1JYwrnDkcO1woc6IcOvw6pWw4NYb8K+U0FyScOgUVHCncO1DsKFw5nCkzzDnj8cwpkqdsOKwr3DpMK2esKyfsOvE27DjkcDw5obL3h5ZcOLMEtbwoR6wqUeST3CiEHCjsOrwpvCmDfDusOvw5XCusKZw63DmsOMcsKAMsK3eVMgAk3CjsOUbcKRDMO3w7LDvAvCt2YgPw==|王守仁犯挪用公款罪刑事决定书|2015-10-22")); 
}

global.unzip = unzip;
// global.com.str.Decrypt = com.str.Decrypt;
global.getDocId = getDocId;