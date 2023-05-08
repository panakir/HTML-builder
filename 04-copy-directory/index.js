const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')

fsPromises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true})

fsPromises.readdir(path.join(__dirname, 'files'))
.then((files) => files.forEach(file => {
    fsPromises.copyFile(path.join(__dirname, `files/${file}`), path.join(__dirname, `files-copy/${file}`))
  })
)