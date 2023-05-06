const fs = require('fs')
const path = require('path')

const readFile = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8')
let text = '' 
readFile.on('data', (chunk) => {
  text += chunk
  readFile.on('end', () => {
    console.log(text)
  })
})