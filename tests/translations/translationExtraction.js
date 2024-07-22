const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');


const TWIG_T_FUNCTION_RX = /\{\{\s*t\(['"][^'"]*['"].*\)\}\}/sg;
const TWIG_T_FILTER_SINGLE_RX = /\{\{\s*[']([^']+)[']\s*\|\s*t(\(\s*(\{[^}]+\})\s*\))?\s*\}\}/sg;
const TWIG_T_FILTER_DOUBLE_RX = /\{\{\s*["]([^"]+)["]\s*\|\s*t(\(\s*(\{[^}]+\})\s*\))?\s*\}\}/sg;
const TWIG_T_VARIABLE_SET_RX = /\{\%\s*set\s*[A-Za-z_0-9]+\s*\=\s*["]([^"]+)["]\s*\|\s*t\s*\%\}/sg;
const TWIG_T_DICT_SET_RX = /\:\s*['"]([^'"]+)['"]\s*\|\s*t/sg;
const PHP_T_FUNCTION_RX = /-\>t\(['"]([^'"]+)['"]\)/sg;

/**
 * Given a source string, provide an array
 * of matches that match either the single
 * or double quoted variant of the T_FILTER
 * regex, and other variants
 */
const matchTranslationFilters = source => {
  let result = [];
  const doubleQuoted = source.matchAll(TWIG_T_FILTER_DOUBLE_RX);
  if(doubleQuoted){
    result = result.concat(Array.from(doubleQuoted));
  }
  const singleQuoted = source.matchAll(TWIG_T_FILTER_SINGLE_RX);
  if(singleQuoted){
    result = result.concat(Array.from(singleQuoted));
  }
  const variableBased = source.matchAll(TWIG_T_VARIABLE_SET_RX);
  if(variableBased){
    result = result.concat(Array.from(variableBased));
  }

  const dictBased = source.matchAll(TWIG_T_DICT_SET_RX);
  if(dictBased){
    result = result.concat(Array.from(dictBased));
  }

  return result.sort((a, b) => {
    if(a.index < b.index){
      return -1;
    } else {
      return 0;
    }
  });
};

/**
 * For a given PHP file, extract all of the translation matches
 * and return information about the match line number
 * and matched / extracted strings
 */
const extractPHPTranslations = filePath => {
  const source = fs.readFileSync(filePath).toString();
  let result = [];

  const matches = source.matchAll(PHP_T_FUNCTION_RX);
  if(matches){
    result = result.concat(Array.from(
      matches,
      match => {
        return {
          filename: path.basename(filePath),
          matchedString: match[0],
          extracted: match[1],
          extractedArgs: match[3] | null,
          lineNumber: getLineNumberForPosition(source, match.index)
        };
      }
    ));
  }

  return result;
};

/**
 * For a given template file, extract all of the
 * translation matches and return information about
 * the match line number and string
 */
const extractTemplateTranslations = filePath => {
  const source = fs.readFileSync(filePath).toString();
  let result = [];
  const functionMatches = source.matchAll(TWIG_T_FUNCTION_RX);
  if(functionMatches){
    result = result.concat(Array.from(
      functionMatches,
      match => {
        return {
          filename: path.basename(filePath),
          matchedString: match[0],
          extracted: match[1],
          extractedArgs: match[3] | null,
          lineNumber: getLineNumberForPosition(source, match.index),
          index: match.index
        };
      }));
  }
  const filterMatches = matchTranslationFilters(source);
  if(filterMatches.length){
    result = result.concat(Array.from(
      filterMatches,
      match => {
        return {
          filename: path.basename(filePath),
          matchedString: match[0],
          extracted: match[1],
          extractedArgs: match[3] || null,
          lineNumber: getLineNumberForPosition(source, match.index),
          index: match.index
        };
      }));
  }

  return result.sort((a, b) => {
    if(a < b){
      return -1;
    }
    return 0;
  });
};

/**
 * For a given source string and an index into that
 * string, determine which line number of the source
 * the position appears at.
 */
const getLineNumberForPosition = (source, position) => {
  let cursor = 0;
  const lines = source.split("\n");
  for(let i = 0; i < lines.length; i++){
    const currentLine = lines[i];
    cursor += currentLine.length + 1; // Add the newline char
    if(position <= cursor){
      return i + 1; // Editors use index-1 for line counting
    }
  }

  return -1;
};

/**
 * Appends the value to the lookup dictionary's
 * key. Because keys map to arrays, if there is not
 * yet an entry for the key, it creates the initial array
 * value and sets the passed-in value as the first element.
 */
const appendToLookup = (lookup, key, val) => {
  if(!Object.keys(lookup).includes(key)){
    lookup[key] = [val];
  } else {
    lookup[key].push(val);
  }
};

/**
 * Given a source path of templates, return a lookup
 * dictionary that maps string to be translated to
 * arrays of match information.
 */
const getFileMatchInfo = (templatePaths, phpPaths) => {
  const lookupByTerm = {};

  templatePaths.forEach(filePath => {
    const parsed = extractTemplateTranslations(filePath);
    if(parsed.length){
      parsed.forEach(translateMatch => {
        appendToLookup(lookupByTerm, translateMatch.extracted, translateMatch);
      });
    }
  });

  phpPaths.forEach(filePath => {
    const parsed = extractPHPTranslations(filePath);
    if(parsed.length){
      parsed.forEach(translateMatch => {
        appendToLookup(lookupByTerm, translateMatch.extracted, translateMatch);
      });
    }
  });
  
  return lookupByTerm;
};

module.exports = {
  getFileMatchInfo,
  matchTranslationFilters
};
