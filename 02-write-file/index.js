const fs = require('fs')
const path = require('path/posix')
const { stdin, stdout, exit } = process

const createFile = fs.createWriteStream(path.join(__dirname, 'new-file.txt'), (error) => {
  if (error) console.error(error.message)
})

stdout.write('Please, write some text\n')
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit()
  }
  fs.appendFile(path.join(__dirname, 'new-file.txt'), data, (error) => {
    if (error) console.error(error.message)
  })
})

process.on('exit', () => console.log('Good Luck!'))
process.on('SIGINT', () => process.exit())