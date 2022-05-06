"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = exports.Utils = exports.BigNumber = void 0;
const bignumber_js_1 = require("bignumber.js");
Object.defineProperty(exports, "BigNumber", { enumerable: true, get: function () { return bignumber_js_1.BigNumber; } });
;
;
class Utils {
    constructor(wallet) {
        this.wallet = wallet;
    }
    ;
    asciiToHex(str) {
        if (!str)
            return "0x00";
        var hex = "";
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            var n = code.toString(16);
            hex += n.length < 2 ? '0' + n : n;
        }
        ;
        return "0x" + hex;
    }
    ;
    sleep(millisecond) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(null);
            }, millisecond);
        });
    }
    ;
    numberToBytes32(value, prefix) {
        let v = new bignumber_js_1.BigNumber(value).toString(16);
        v = v.replace("0x", "");
        v = this.padLeft(v, 64);
        if (prefix)
            v = '0x' + v;
        return v;
    }
    ;
    padLeft(string, chars, sign) {
        return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
    }
    ;
    padRight(string, chars, sign) {
        return string + new Array(chars - string.length + 1).join(sign ? sign : "0");
    }
    ;
    stringToBytes32(value) {
        if (Array.isArray(value)) {
            let result = [];
            for (let i = 0; i < value.length; i++) {
                result.push(this.stringToBytes32(value[i]));
            }
            return result;
        }
        else {
            if (value.length == 66 && value.startsWith('0x'))
                return value;
            return this.padRight(this.asciiToHex(value), 64);
        }
    }
    stringToBytes(value, nByte) {
        if (Array.isArray(value)) {
            let result = [];
            for (let i = 0; i < value.length; i++) {
                result.push(this.stringToBytes(value[i]));
            }
            return result;
        }
        else {
            if (nByte) {
                if (new RegExp(`^0x[0-9a-fA-F]{${2 * nByte}}$`).test(value))
                    return value;
                else if (/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(value)) {
                    if (value.length >= ((nByte * 2) + 2))
                        return value;
                    else
                        return "0x" + value.substring(2) + "00".repeat(nByte - ((value.length - 2) / 2));
                }
                else if (/^([0-9a-fA-F][0-9a-fA-F])+$/.test(value)) {
                    if (value.length >= (nByte * 2))
                        return value;
                    else
                        return "0x" + value + "00".repeat(nByte - (value.length / 2));
                }
                else
                    return this.padRight(this.asciiToHex(value), nByte * 2);
            }
            else {
                if (/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(value))
                    return value;
                else if (/^([0-9a-fA-F][0-9a-fA-F])+$/.test(value))
                    return "0x" + value;
                else
                    return this.asciiToHex(value);
            }
        }
    }
    addressToBytes32(value, prefix) {
        let v = value;
        v = v.replace("0x", "");
        v = this.padLeft(v, 64);
        if (prefix)
            v = '0x' + v;
        return v;
    }
    ;
    bytes32ToAddress(value) {
        return '0x' + value.replace('0x000000000000000000000000', '');
    }
    ;
    bytes32ToString(value) {
        return this.wallet.utils.hexToUtf8(value);
    }
    ;
    addressToBytes32Right(value, prefix) {
        let v = value;
        v = v.replace("0x", "");
        v = this.padRight(v, 64);
        if (prefix)
            v = '0x' + v;
        return v;
    }
    ;
    toNumber(value) {
        if (typeof (value) == 'number')
            return value;
        else if (typeof (value) == 'string')
            return new bignumber_js_1.BigNumber(value).toNumber();
        else
            return value.toNumber();
    }
    ;
    toDecimals(value, decimals) {
        decimals = decimals || 18;
        return new bignumber_js_1.BigNumber(value).shiftedBy(decimals);
    }
    ;
    fromDecimals(value, decimals) {
        decimals = decimals || 18;
        return new bignumber_js_1.BigNumber(value).shiftedBy(-decimals);
    }
    ;
    toString(value) {
        if (Array.isArray(value)) {
            let result = [];
            for (let i = 0; i < value.length; i++) {
                result.push(this.toString(value[i]));
            }
            return result;
        }
        else if (typeof value === "number")
            return value.toString(10);
        else if (bignumber_js_1.BigNumber.isBigNumber(value))
            return value.toFixed();
        else
            return value;
    }
    ;
}
exports.Utils = Utils;
Utils.nullAddress = "0x0000000000000000000000000000000000000000";
var contract_1 = require("./contract");
Object.defineProperty(exports, "Contract", { enumerable: true, get: function () { return contract_1.Contract; } });
