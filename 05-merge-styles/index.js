const fs = require('fs')
const path = require('path')

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (error) => {
  if (error) console.error(error.message)
})

fs.readdir(path.join(__dirname, 'styles'), (error, files) => {
  if (error) console.error(error.message)
  files.forEach(file => {
    fs.stat(path.join(__dirname, 'styles', file), (error, stat) => {
      if (error) console.error(error.message)
      if (stat.isFile() && path.extname(file) === '.css') {
        const readFile = fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8')
        readFile.on('data', data => {
           fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data, (error) => {
            if (error) console.error(error.message)
           })
        })
      }
    })
  })
})