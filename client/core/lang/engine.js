define('core.lang.Engine', function (module, require) {

  module.exports = {
    parse: parse
  };

  var Util = require('core.util.Util');
  var Moment = require('lib.Moment');
  var Numeral = require('lib.Numeral');

  function parse(key, data, dfFormat, langData) {
    //    var text = getNestedData(key, langData);
    var text = langData[key];

    var block, parsedBlock, blockKeys, blockCase, blockConditions, blockValues
    var isMatch, arrayToken;
    var parsedText = '';

    while (true) {
      block = nextBlock(text);
      parsedText += block.textBefore;

      if (!block.found) break;

      text = block.textAfter;

      parsedBlock = parseBlock(block.text);

      blockKeys = parsedBlock.keys;

      if (!parsedBlock.complex) {
        parsedText += mergeTokens(blockKeys, data, dfFormat, langData);
        continue;
      }

      var defaultValues = null;

      for (var i in parsedBlock.cases) {
        blockCase = parsedBlock.cases[i];
        blockConditions = blockCase.conditions;
        blockValues = blockCase.values;

        isMatch = false;

        if (blockConditions.length == 1) {
          if (blockConditions[0] === 'default') {
            defaultValues = blockValues;
            continue;
          }

          if (isArray(blockConditions[0])) {
            arrayToken = parseArray(blockConditions[0]);

            if (arrayToken.range) {
              if (compare(blockKeys, arrayToken.elements[0], data, dfFormat, langData) >= 0 &&
                compare(blockKeys, arrayToken.elements[1], data, dfFormat, langData) <= 0) {

                isMatch = true;
              }
            } else {
              for (var i in arrayToken.elements) {
                if (compare(blockKeys, arrayToken.elements[i], data, dfFormat, langData) == 0) {
                  isMatch = true;
                  break;
                }
              }
            }
          }
        }

        if (!isMatch && blockKeys.length == 2) {
          switch (blockConditions[0].trim()) {
          case '=':
            isMatch = (compare(blockKeys, blockConditions[1], data, dfFormat, langData) == 0);
            break;
          case '!=':
            isMatch = (compare(blockKeys, blockConditions[1], data, dfFormat, langData) != 0);
            break;
          case '>=':
            isMatch = (compare(blockKeys, blockConditions[1], data, dfFormat, langData) >= 0);
            break;
          case '<=':
            isMatch = (compare(blockKeys, blockConditions[1], data, dfFormat, langData) <= 0);
            break;
          case '>':
            isMatch = (compare(blockKeys, blockConditions[1], data, dfFormat, langData) > 0);
            break;
          case '<':
            isMatch = (compare(blockKeys, blockConditions[1], data, dfFormat, langData) < 0);
            break;
          }
        }

        if (!isMatch) {
          isMatch = compare(blockKeys, blockConditions, data, dfFormat, langData) == 0;
        }

        if (isMatch) {
          parsedText += mergeTokens(blockValues, data, dfFormat, langData);

          break;
        }
      }

      if (!isMatch && defaultValues) {
        parsedText += mergeTokens(defaultValues, data, dfFormat, langData);
      }
    };

    return parsedText;
  }

  function compare(tokens1, tokens2, data, dfFormat, langData) {
    var token1, token2;

    if (Util.Object.isArray(tokens1) && tokens1.length == 1) {
      token1 = tokens1[0];
    } else {
      token1 = tokens1;
    }

    if (Util.Object.isArray(token1)) {
      token1 = mergeTokens(token1, data, dfFormat, langData);
    } else {
      if (isString(token1)) {
        token1 = getString(token1);
      } else if (isNumber(token1)) {
        token1 = getNumber(token1);
      } else {
        token1 = getData(token1, data, dfFormat, langData);
      }
    }

    if (Util.Object.isArray(tokens2) && tokens2.length == 1) {
      token2 = tokens2[0];
    } else {
      token2 = tokens2;
    }

    if (Util.Object.isArray(token2)) {
      token2 = mergeTokens(token2, data, dfFormat, langData);
    } else {
      if (isString(token2)) {
        token2 = getString(token2);
      } else if (isNumber(token2)) {
        token2 = getNumber(token2);
      } else {
        token2 = getData(token2, data, dfFormat, langData);
      }
    }

    return token1 == token2 ? 0 : (token1 > token2 ? 1 : -1);
  }

  function nextBlock(text) {
    var block = {
      found: null,
      text: null,
      textBefore: null,
      textAfter: null
    };

    var index = text.indexOf('{{');

    if (index == -1) {
      block.found = false;
      block.text = '';
      block.textBefore = text;
      block.textAfter = '';

      return block;
    }

    block.found = false;
    block.text = '';
    block.textBefore = text.substr(0, index);
    block.textAfter = '';

    text = text.substr(index + 2);

    var length = text.length;
    var stringOff = true;
    index = -1;

    while (++index < length) {
      if (text[index] === '}' && text[index + 1] === '}' && stringOff) {
        block.found = true;
        index += 2;
        break;
      }

      block.text += text[index];

      if (text[index] === "'") {
        if (text[index + 1] === "'") {
          index++;
          block.text += "'";
        } else {
          stringOff = !stringOff;
        }
      }
    }

    if (block.found) {
      block.textAfter = text.slice(index);
    } else {
      block.textBefore += block.text;
      block.text = '';
    }

    return block;
  }

  function nextToken(text) {
    var token = {
      found: null,
      text: null,
      textAfter: null
    };

    var text = text.trim();
    var length = text.length;
    var index = -1;
    var stringOff = true,
      arrayOff = true;

    while (++index < length) {
      if ([',', ':'].indexOf(text[index]) != -1 && stringOff && arrayOff) {
        if (index == 0) index++;
        break;
      }
      if (text[index] === '=' && stringOff && text[index + 1] === '>') {
        index += 2;
        break;
      }
      if (text[index] === ' ' && stringOff) {
        break;
      }

      if (text[index] === '[') {
        arrayOff = false;
      } else if (text[index] === ']') {
        arrayOff = true;
      }

      if (text[index] === "'") {
        if (text[index + 1] === "'" && !stringOff) {
          index++;
        } else {
          stringOff = !stringOff;

          if (arrayOff && !stringOff && index > 0) {
            break;
          } else if (arrayOff && stringOff) {
            index++;
            break;
          }
        }
      }
    }

    token.text = text.slice(0, index),
    token.textAfter = text.slice(index);
    token.textAfter = token.textAfter ? token.textAfter.trim() : '';

    return token;
  }

  function parseBlock(text) {
    var block = {
      keys: [],
      cases: [],
      complex: false
    };

    var token;
    var isCondition = true;
    var currentCase = {
      conditions: [],
      values: []
    };

    while (token = nextToken(text)) {
      if (token.text === '=>') {
        block.complex = true;
      } else if (token.text === ':') {
        isCondition = false;
      } else if (token.text === ',') {
        if (currentCase.conditions.length && currentCase.values.length) {
          block.cases.push(currentCase);
        }

        currentCase = {
          conditions: [],
          values: []
        };

        isCondition = true;
      } else if (!block.complex) {
        block.keys.push(token.text);
      } else if (isCondition) {
        currentCase.conditions.push(token.text);
      } else {
        currentCase.values.push(token.text);
      }

      if (token.textAfter === '') {
        break;
      } else {
        text = token.textAfter;
      }
    }

    if (block.complex) {
      if (currentCase.conditions.length && currentCase.values.length) {
        block.cases.push(currentCase);
      }
    }

    return block;
  }

  function mergeTokens(tokens, data, dfFormat, langData) {
    var line = '';
    var token;

    for (var i in tokens) {
      token = tokens[i];

      if (isString(token)) {
        line += getString(token);
      } else if (isNumber(token)) {
        line += token;
      } else {
        line += getData(token, data, dfFormat, langData);
      }
    }

    return line;
  }

  function parseArray(token) {
    token = token.slice(1, token.length - 1);

    var array = {
      range: false,
      elements: []
    };

    var index = -1,
      length = token.length,
      stringOff = true;
    var element = '';
    while (++index < length) {
      if (token[index] === ' ' && stringOff) continue;

      if (token[index] === ',' && stringOff) {
        if (element) array.elements.push(element)
        element = '';

        continue;
      }

      if (token[index] === '.' && stringOff && token[index + 1] === '.') {
        array.range = true;
        if (element) array.elements.push(element);

        element = '';
        index++;

        continue;
      }

      element += token[index];

      if (token[index] === "'") {
        if (token[index + 1] === "'") {
          index++;
        } else {
          stringOff = !stringOff;
        }
      }
    }

    if (element) array.elements.push(element);

    return array;
  }

  function isArray(token) {
    return token[0] === '[' && token[token.length - 1] === ']';
  }

  function isString(token) {
    return token[0] === "'" && token[token.length - 1] === "'";
  }

  function isNumber(token) {
    return !isNaN(token);
  }

  function getString(token) {
    return token.slice(1, token.length - 1).replace(/""/g, "'");
  }

  function getNumber(token) {
    return +token;
  }

  function getData(token, data, dfFormat, langData) {
    var format = null,
      force = null;

    if (token.substr(0, 1) === '.') {

      token = token.substr(1);

      var langText = langData[token];

      if (!langText) return '';

      return parse(token, data, dfFormat, langData);
    }

    var formatIndex = token.indexOf('!');
    if (formatIndex != -1) {
      format = token.slice(formatIndex + 1);
      token = token.substr(0, formatIndex);

      formatIndex = format.indexOf('!');
      if (formatIndex != -1) {
        force = format.substr(0, formatIndex);
        format = format.slice(formatIndex + 1);
      }
    }

    var value = getNestedData(token, data);

    return format || dfFormat ? formatData(value, format, dfFormat, force) : value;
  }

  function getNestedData(token, data) {
    var value = data;

    token = token.split('.');

    for (var i in token) {
      if (value && value[token[i]]) {
        value = value[token[i]];
      } else {
        return '';
      }
    }

    return value;
  }

  function formatData(token, format, dfFormat, force) {
    // format to date - using Moment
    if (force && force.toLowerCase() === 'date' || (Util.Object.isDate(token) && (format || dfFormat.date))) {
      if (!Util.Object.isDate(token)) token = new Date(+token);
      return Moment(token).format(format ? format : dfFormat.date);
    }

    // format to number - using Numeral
    if (force && force.toLowerCase() === 'number' || (isNumber(token) && (format || dfFormat.number))) {
      token = +token;
      return Numeral(+token).format(format ? format : dfFormat.number);
    }

    // format to string - using Util.String
    if (force && force.toLowerCase() === 'string' || format) {
      token = '' + token;
      return Util.String[format] ? Util.String[format](token) : token;
    }

    return token;
  }

});
