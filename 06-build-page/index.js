const fs = require('fs')
const path = require('path')

const newPathForAssets = path.join(__dirname, 'project-dist', 'assets')
const currentPathForAssets = path.join(__dirname, 'assets')
const currentPathForStyles = path.join(__dirname, 'styles')

const copyFiles = (currentPathForAssets, newPathForAssets) => {
  fs.readdir(currentPathForAssets, (error, files) => {
    if (error) console.error(error.message)
    files.forEach(file => {
      fs.stat(path.join(currentPathForAssets, file), (error, stat) => {
        if (error) console.error(error.message)
        if (stat.isFile()) {
          fs.copyFile(path.join(currentPathForAssets, file), path.join(newPathForAssets, file), (error) => {
            if (error) console.error(error.message)
          })
        } else { 
          copyFolders(
            (path.join(currentPathForAssets, file)),
            (path.join(newPathForAssets, file))
          )
        }
      })
    })
  })
}

const copyFolders = (currentPathForAssets, newPathForAssets) => {
  fs.rm(newPathForAssets, {recursive: true, force: true}, (error) => {
    if (error) console.error(error.message)
    fs.mkdir(newPathForAssets, {recursive: true}, (error) => {
      if (error) console.error(error.message)
      copyFiles(currentPathForAssets, newPathForAssets)
    })
  })
}

const getStylesBundle = () => {
  const pathForBundle = path.join(__dirname, 'project-dist', 'style.css')
  const output = fs.createWriteStream(pathForBundle)
  fs.readdir(currentPathForStyles, (error, styles) => {
    if (error) console.error(error.message)
    styles.forEach(style => {
      fs.stat(path.join(__dirname, 'styles', style), (error, stat) => {
        if (error) console.error(error.message)
        if (stat.isFile() && path.extname(style) === '.css') {
          const readFile = fs.createReadStream(path.join(__dirname, 'styles', style), 'utf-8')
          readFile.on('data', data => {
             fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), data, (error) => {
              if (error) console.error(error.message)
             })
          })
        }
      })
    })
  })
}

const buildHtml = () => {
  const input = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8')
  const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8')
  input.on('data', async (data) => {
    const htmlData = await replaceHtml()
    output.write(htmlData)
    async function replaceHtml() {
      let htmlDataString = data.toString()
      const components = htmlDataString.match(/{{(\w*)}}/gi).map(elem => elem.split('}{'))
      const arrayOfElements = []
      components.forEach(element => {
        for (let i = 0; i < element.length; i++) {
          arrayOfElements.push(element[i].replace(/[\{\}]/g, ''))
        }
      })
      for (file of arrayOfElements) {
        const component = await fs.promises.readFile(path.join(__dirname, 'components', `${file}.html`))
        htmlDataString = htmlDataString.replace(`{{${file}}}`, component.toString())
      }
      return htmlDataString
    }
  })
}

fs.rm(path.join(__dirname, 'project-dist'), (error) => {
  if (error) console.error(error.message)
  fs.mkdir(path.join(__dirname, 'project-dist'), {recursive:true}, (error) => {
    if (error) console.error(error.message)
    copyFolders(currentPathForAssets, newPathForAssets)
    getStylesBundle()
    buildHtml()
  })
})