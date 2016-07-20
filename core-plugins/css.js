'use strict';
const chalk = require('chalk');

module.exports = (text) => (
  new Promise((resolve, reject) => {

    let buildWord = ''
    let buildCSS = ''
    let wordStart = false
    let tagStart = false
    let idStart = false
    let specialStart = false
    let attrStart = false
    let styleStart = false
    let mediaStart = false
    let commentStart = false
    let textStart = true
    let escaped = false
    let doubleQuotesUsed = false;

    for (let c of text) {
      if (c === "/" && !wordStart && !attrStart) {
          if(!commentStart) {
            commentStart = true
            buildWord += c
          }
          else
            if(buildWord.substr(buildWord.length-1)==='*') {
              commentStart=false
              buildWord += c
              buildCSS +=  chalk.grey(buildWord)
              
              buildWord = ''
            }
      } else if (commentStart) {
            buildWord += c
      }else if (c === ";") {
            if(attrStart) { 
              if(specialStart) 
                buildCSS += chalk.magenta(buildWord)
              else
                buildCSS += chalk.cyan(buildWord)
            }
              wordStart = false
              specialStart = false
              attrStart = false
              buildCSS += c
              buildWord = ''
      } else if (c === ":") { 
            if(styleStart)
            { 
              buildCSS += chalk.cyan(buildWord)
              attrStart = true
            } else if(idStart) {
                buildCSS += chalk.green(buildWord)
                idStart = false
            } else if(tagStart) { 
              buildCSS += chalk.red(buildWord)
            }

            wordStart = false
            tagStart = false
            buildCSS += c
            buildWord = ''   
      } else if (c === " ") {
            wordStart = false
            buildWord += c
            if(idStart) {
                buildCSS += chalk.green(buildWord)
            } else if(tagStart)
            {  
              tagStart = false
              buildCSS += chalk.red(buildWord)
            } else if(attrStart)
            { 
              if(specialStart) 
                buildCSS += chalk.magenta(buildWord)
              else
                buildCSS += chalk.cyan(buildWord)
            } else {
              buildCSS += buildWord
            } 
            // tagStart = false
            buildWord = ''    
      } else if (c === ".") {
            if(!attrStart && !wordStart)
            {
              idStart = true
              wordStart = true
              buildWord = c
            }
            else if(attrStart)
            {
              specialStart = true
              buildWord += c
              if(!wordStart)
                wordStart = true
            }
            else
              buildWord += c
      } else if (c === ",") {
            if(!attrStart)
            {
              buildWord += c
              wordStart = false
            }
            else
            {
              buildCSS += buildWord
              buildCSS += c
              buildWord = ''
            }
      } else if (c === "#") {
            if(!attrStart && !wordStart)
            {
              idStart = true
              wordStart = true
              buildWord = c
            }
            else if(attrStart)
            {
              specialStart = true
              buildWord += c
              if(!wordStart)
                wordStart = true
            }
      } else if (c === "{") {
            wordStart = false
            if(tagStart)
            {  
              tagStart = false
              buildCSS += chalk.red(buildWord)
            } else if(attrStart)
            { 
              if(specialStart) 
                buildCSS += chalk.magenta(buildWord)
              else
                buildCSS += chalk.cyan(buildWord)
            } else if(idStart) {
                buildCSS += chalk.green(buildWord)
            } else {
              buildCSS += buildWord
            } 
            buildCSS += c
            buildWord = ''
            styleStart = true;  
      } else if (c === "}") {
            buildCSS += buildWord
            buildCSS += c
            buildWord = ''
            wordStart = false
            styleStart = false;
      }
      // [] , = "" @ ! ()
      else{
            if(!tagStart && !styleStart && c!='\n')
            {  
              tagStart = true
              // buildWord += c
            }
            buildWord += c
      }
  }

    resolve(buildCSS)
  })
);