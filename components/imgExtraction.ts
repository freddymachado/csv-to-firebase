import fs from 'fs'
import path from 'path'
import ollama from 'ollama'

//TODO: Ruta de la imagen
const imagePath = path.resolve('./estado_cuenta.png')

//TODO: Prompt personalizado para extracción estructurada
const prompt = `
Esta imagen contiene una tabla de transacciones bancarias. Extrae cada fila como un objeto JSON con los siguientes campos:
- fecha
- referencia
- banco
- monto
- receptor

Devuelve solo un array JSON con los objetos, sin explicaciones ni texto adicional.
`

// Llamada al modelo vision
const response = await ollama.chat({
  model: 'llama3.2-vision',
  messages: [
    {
      role: 'user',
      content: prompt,
      images: [imagePath]
    }
  ]
})

// Procesar y guardar el JSON
try {
  const raw = response.message.content.trim()
  const data = JSON.parse(raw)

  fs.writeFileSync('./transacciones.json', JSON.stringify(data, null, 2), 'utf-8')
  console.log('✅ Archivo transacciones.json generado con éxito.')
} catch (err) {
  console.error('❌ Error al procesar la respuesta del modelo:', err)
  console.log('Respuesta recibida:', response.message.content)
}