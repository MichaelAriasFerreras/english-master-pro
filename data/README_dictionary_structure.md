# Diccionario Inglés-Español A1-C2 - Documentación

## 📋 Resumen General

Este diccionario contiene **1,100 palabras** organizadas según los niveles del Marco Común Europeo de Referencia para las Lenguas (MCER), desde A1 (principiante) hasta C2 (maestría).

### Distribución por Niveles:
- **A1**: 178 palabras (16.2%) - Nivel básico
- **A2**: 192 palabras (17.5%) - Nivel elemental  
- **B1**: 179 palabras (16.3%) - Nivel intermedio
- **B2**: 178 palabras (16.2%) - Nivel intermedio alto
- **C1**: 186 palabras (16.9%) - Nivel avanzado
- **C2**: 187 palabras (17.0%) - Nivel maestría

## 🗂️ Estructura del JSON

El archivo `dictionary_data.json` está organizado en las siguientes secciones:

### 1. Metadata
```json
{
  "metadata": {
    "title": "Diccionario Inglés-Español A1-C2",
    "description": "Diccionario completo organizado por niveles del Marco Común Europeo de Referencia",
    "total_words": 1100,
    "levels": ["A1", "A2", "B1", "B2", "C1", "C2"],
    "created_date": "2025-07-19T04:38:25.471720",
    "source_file": "diccionario_ingles_español_A1_C2.xlsx"
  }
}
```

### 2. Statistics
Estadísticas detalladas por nivel con conteo de palabras y porcentajes.

### 3. Levels
Palabras organizadas por nivel, cada entrada contiene:
- `english`: Palabra en inglés
- `spanish`: Traducción al español
- `level`: Nivel MCER (A1-C2)

### 4. Word Index
Índices de búsqueda rápida:
- `by_english`: Búsqueda por palabra en inglés
- `by_spanish`: Búsqueda por palabra en español

## 🔍 Características Especiales

### Duplicados Identificados
- **51 palabras en inglés** aparecen en múltiples niveles
- **95 palabras en español** tienen múltiples traducciones o aparecen en diferentes niveles

### Ejemplos de Duplicados:
- "advantage" aparece en B1 y B2
- "agreement" aparece en B1 y B2
- "aspect" aparece en B2 y C1

## 💻 Uso en Aplicación Web

### Cargar Datos
```javascript
// Cargar el diccionario completo
fetch('/data/dictionary_data.json')
  .then(response => response.json())
  .then(data => {
    console.log('Diccionario cargado:', data.metadata.total_words, 'palabras');
  });
```

### Filtrar por Nivel
```javascript
// Obtener palabras de un nivel específico
const a1Words = data.levels.A1.words;
const b2Words = data.levels.B2.words;
```

### Búsqueda de Palabras
```javascript
// Buscar palabra en inglés
const searchEnglish = (word) => {
  return data.word_index.by_english[word.toLowerCase()] || [];
};

// Buscar palabra en español
const searchSpanish = (word) => {
  return data.word_index.by_spanish[word.toLowerCase()] || [];
};
```

### Generar Ejercicios
```javascript
// Obtener palabras aleatorias de un nivel
const getRandomWords = (level, count = 10) => {
  const levelWords = data.levels[level].words;
  return levelWords.sort(() => 0.5 - Math.random()).slice(0, count);
};
```

## 🎯 Funcionalidades Sugeridas para la App

1. **Quiz por Niveles**: Ejercicios específicos para cada nivel MCER
2. **Búsqueda Inteligente**: Búsqueda bidireccional inglés-español
3. **Progreso por Niveles**: Seguimiento del avance del usuario
4. **Ejercicios Adaptativos**: Dificultad basada en el nivel del usuario
5. **Revisión de Duplicados**: Mostrar diferentes contextos de uso

## 📊 Calidad de los Datos

- ✅ **Sin datos faltantes**: Todas las entradas tienen inglés, español y nivel
- ✅ **Distribución equilibrada**: Cada nivel tiene entre 178-192 palabras
- ✅ **Cobertura completa**: Todos los niveles MCER representados
- ⚠️ **Duplicados controlados**: Identificados y preservados para contexto

## 🚀 Próximos Pasos

1. Implementar sistema de categorías temáticas
2. Añadir pronunciación fonética
3. Incluir ejemplos de uso en contexto
4. Agregar imágenes asociadas a las palabras
5. Implementar sistema de dificultad dentro de cada nivel
