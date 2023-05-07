const fs = require('fs')
const path = require('path')

const readDir = fs.readdir(path.join(__dirname, 'secret-folder'), {withFileType: true}, (error, files) => {
  if (error) console.error(error.message)
  files.forEach(file=> {
    const name = file.split('.')[0]
    const extention = file.split('.')[1]
    
    const filePath = path.join(__dirname, `secret-folder/${file}`)

    let weight = null
    const getWeight = fs.stat(filePath, (error, stats) => {
      if (error) console.error(error.message)
      if(!stats.isDirectory()) { 
        weight = stats.size 
      } else {return}
      console.log(`${name} - ${extention} - ${weight}kb`) 
    })
  });
})  