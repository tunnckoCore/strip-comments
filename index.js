'use strict';

var extract = require('extract-comments');

/**
 * Strip comments from the given `string`.
 *
 * ```js
 * //example.strip
 * console.log(strip("foo // this is a comment\n/* me too *\/"));
 * //=> 'foo'
 * ```
 * @name strip
 * @param {String} `string`
 * @param {Object} `options` Pass `safe: true` to keep comments with `!`
 * @return {String}
 * @api public
 */

function strip(str, options) {
  options = options || {};
  if (options.line) {
    return line(str, options);
  }
  if (options.block) {
    return block(str, options);
  }
  if (options.first) {
    return first(str, options);
  }
  str = block(str, options);
  return line(str, options);
}

/**
 * Strip block comments from the given `string`.
 *
 * @name .block
 * @param {String} `string`
 * @param {Object} `options` Pass `safe: true` to keep comments with `!`
 * @return {String}
 * @api public
 */

function block(str, options) {
  return stripEach(str, extract.block(str, options), options);
}

/**
 * Strip line comments from the given `string`.
 *
 * @name .line
 * @param {String} `string`
 * @param {Object} `options` Pass `safe: true` to keep comments with `!`
 * @return {String}
 * @api public
 */

function line(str, options) {
  return stripEach(str, extract.line(str, options), options);
}

/**
 * Strip the first comment from the given `string`.
 *
 * @name .first
 * @param {String} `string`
 * @param {Object} `options` Pass `safe: true` to keep comments with `!`
 * @return {String}
 * @api public
 */

function first(str, options) {
  return stripEach(str, extract.first(str), options);
}

/**
 * Private function for stripping comments.
 *
 * @param {String} `string`
 * @param {Object} `options` Pass `safe: true` to keep comments with `!`
 * @return {String}
 */

function stripEach(str, comments, options) {
  comments.forEach(function(comment) {
    str = discard(str, comment, options);
  });
  return str;
}

/**
 * Remove a comment from the given string.
 *
 * @param {String} `string`
 * @param {Object} `options` Pass `safe: true` to keep comments with `!`
 * @return {String}
 */

function discard(str, comment, opts) {
  var ch = comment.value.charAt(0);
  if (opts && opts.safe === true && ch === '!') {
    return str;
  }
  var nl = '';
  if (opts && opts.preserveNewlines) {
    nl = comment.raw.replace(/[^\r\n]/g, '');
  }
  return str.replace(comment.raw, nl);
}

/**
 * Expose `strip`
 */

module.exports = strip;

/**
 * Expose methods
 */

module.exports.block = block;
module.exports.first = first;
module.exports.line = line;
