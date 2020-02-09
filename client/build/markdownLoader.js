const markdown = require('markdown-it')
console.log("aiaiai");
module.exports = function(src) {
  const html = markdown().render(src)
  return (
    `<template>\n` +
    	`<div class="markdown">${html}</div>\n` +
    `</template>\n`
  )
}