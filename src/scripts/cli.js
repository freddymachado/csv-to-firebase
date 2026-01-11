import {readdir,stat} from 'node:fs/promises';
import {join} from 'node:path';

//1. Recuperar carpeta
const dir = process.argv[2] ?? '.'

//2. Formateo simple de los tamaños
const formatBytes = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  return `${Math.round(bytes / (1024 ** i), 2)} ${sizes[i]}`
}

//3. Leer los nombres, sin info
const files = await readdir(dir)
console.log(files) 

//node cli.js ./resources para leer la carpeta resources
for (const file of files) {
  const filePath = join(dir, file)
  const fileStat = await stat(filePath)
  console.log(`${file} - ${formatBytes(fileStat.size)}`)
}

//4. Recuperar la info de cada file
const entries = await Promise.all(
  files.map(async (name) => {
    const filePath = join(dir, name)
    const fileStat = await stat(filePath)

    return {
      name,
      isDir: fileStat.isDirectory(),
      size: formatBytes(fileStat.size)
    }
  })
)

//5. Mostrar la info
for (const entry of entries) {
  const icon = entry.isDir ? '📁' : '📄'
  const size = entry.isDir ? '' : ` - ${entry.size}`

  console.log(`${icon} ${entry.name.padEnd(25)}  ${size}`)
}