const { error } = require('console')
const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')

fsPromises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true})

fs.readdir(path.join(__dirname, 'files-copy'), (error, files) => {
  if(error) console.error(error.message)
  files.forEach(file => {
    fs.unlink(path.join(__dirname, 'files-copy', file), (error,) => {
      if (error) console.error(error.message)
    })
  })
})

fsPromises.readdir(path.join(__dirname, 'files'))
.then((files) => files.forEach(file => {
    fsPromises.copyFile(path.join(__dirname, `files/${file}`), path.join(__dirname, `files-copy/${file}`))
  })
)