// Ejemplos de implementación para la aplicación web de aprendizaje de inglés
// Basado en el diccionario JSON generado

class EnglishDictionary {
    constructor(dictionaryData) {
        this.data = dictionaryData;
        this.currentLevel = 'A1';
        this.userProgress = {};
    }

    // Obtener estadísticas generales
    getStats() {
        return {
            totalWords: this.data.metadata.total_words,
            levels: this.data.metadata.levels,
            distribution: this.data.statistics
        };
    }

    // Obtener palabras por nivel
    getWordsByLevel(level) {
        return this.data.levels[level]?.words || [];
    }

    // Búsqueda de palabras
    searchWord(query, language = 'english') {
        const searchIndex = language === 'english' ? 
            this.data.word_index.by_english : 
            this.data.word_index.by_spanish;
        
        return searchIndex[query.toLowerCase()] || [];
    }

    // Búsqueda difusa (parcial)
    fuzzySearch(query, language = 'english') {
        const searchIndex = language === 'english' ? 
            this.data.word_index.by_english : 
            this.data.word_index.by_spanish;
        
        const results = [];
        const queryLower = query.toLowerCase();
        
        for (const [word, entries] of Object.entries(searchIndex)) {
            if (word.includes(queryLower)) {
                results.push(...entries);
            }
        }
        
        return results;
    }

    // Generar quiz aleatorio
    generateQuiz(level, count = 10, type = 'english_to_spanish') {
        const levelWords = this.getWordsByLevel(level);
        const shuffled = [...levelWords].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);
        
        return selected.map(word => ({
            question: type === 'english_to_spanish' ? word.english : word.spanish,
            correct_answer: type === 'english_to_spanish' ? word.spanish : word.english,
            options: this.generateOptions(word, type, level),
            level: word.level
        }));
    }

    // Generar opciones múltiples para quiz
    generateOptions(correctWord, type, level, optionsCount = 4) {
        const levelWords = this.getWordsByLevel(level);
        const answerField = type === 'english_to_spanish' ? 'spanish' : 'english';
        const correctAnswer = correctWord[answerField];
        
        // Obtener opciones incorrectas
        const wrongOptions = levelWords
            .filter(word => word[answerField] !== correctAnswer)
            .map(word => word[answerField])
            .sort(() => 0.5 - Math.random())
            .slice(0, optionsCount - 1);
        
        // Mezclar opciones
        const allOptions = [correctAnswer, ...wrongOptions]
            .sort(() => 0.5 - Math.random());
        
        return allOptions;
    }

    // Obtener palabras por dificultad progresiva
    getProgressiveWords(startLevel = 'A1', wordCount = 50) {
        const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const startIndex = levels.indexOf(startLevel);
        const relevantLevels = levels.slice(startIndex);
        
        let words = [];
        for (const level of relevantLevels) {
            words.push(...this.getWordsByLevel(level));
            if (words.length >= wordCount) break;
        }
        
        return words.slice(0, wordCount);
    }

    // Sistema de spaced repetition
    getWordsForReview(userProgress, maxWords = 20) {
        const now = new Date();
        const wordsToReview = [];
        
        for (const [wordId, progress] of Object.entries(userProgress)) {
            const nextReview = new Date(progress.nextReview);
            if (now >= nextReview && wordsToReview.length < maxWords) {
                // Buscar la palabra en el diccionario
                const word = this.findWordById(wordId);
                if (word) {
                    wordsToReview.push({
                        ...word,
                        difficulty: progress.difficulty,
                        reviewCount: progress.reviewCount
                    });
                }
            }
        }
        
        return wordsToReview;
    }

    // Encontrar palabra por ID (inglés + nivel)
    findWordById(wordId) {
        const [english, level] = wordId.split('_');
        const levelWords = this.getWordsByLevel(level);
        return levelWords.find(word => word.english.toLowerCase() === english.toLowerCase());
    }

    // Actualizar progreso del usuario
    updateProgress(wordId, correct, difficulty = 1) {
        if (!this.userProgress[wordId]) {
            this.userProgress[wordId] = {
                reviewCount: 0,
                correctCount: 0,
                difficulty: 1,
                lastReview: new Date(),
                nextReview: new Date()
            };
        }
        
        const progress = this.userProgress[wordId];
        progress.reviewCount++;
        progress.lastReview = new Date();
        
        if (correct) {
            progress.correctCount++;
            progress.difficulty = Math.max(1, progress.difficulty - 0.1);
            // Aumentar intervalo de revisión
            const daysToAdd = Math.min(30, Math.pow(2, progress.correctCount));
            progress.nextReview = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
        } else {
            progress.difficulty = Math.min(5, progress.difficulty + 0.3);
            // Revisar pronto si es incorrecta
            progress.nextReview = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        }
        
        return progress;
    }

    // Obtener estadísticas de progreso
    getProgressStats() {
        const totalWords = this.data.metadata.total_words;
        const reviewedWords = Object.keys(this.userProgress).length;
        const masteredWords = Object.values(this.userProgress)
            .filter(p => p.correctCount >= 3 && p.difficulty <= 1.5).length;
        
        return {
            totalWords,
            reviewedWords,
            masteredWords,
            progressPercentage: (reviewedWords / totalWords) * 100,
            masteryPercentage: (masteredWords / totalWords) * 100
        };
    }

    // Exportar progreso
    exportProgress() {
        return {
            userProgress: this.userProgress,
            currentLevel: this.currentLevel,
            exportDate: new Date().toISOString()
        };
    }

    // Importar progreso
    importProgress(progressData) {
        this.userProgress = progressData.userProgress || {};
        this.currentLevel = progressData.currentLevel || 'A1';
    }
}

// Ejemplo de uso
/*
// Cargar diccionario
fetch('/data/dictionary_data.json')
    .then(response => response.json())
    .then(data => {
        const dictionary = new EnglishDictionary(data);
        
        // Generar quiz de nivel A1
        const quiz = dictionary.generateQuiz('A1', 5);
        console.log('Quiz generado:', quiz);
        
        // Buscar palabra
        const results = dictionary.searchWord('hello');
        console.log('Resultados de búsqueda:', results);
        
        // Obtener estadísticas
        const stats = dictionary.getStats();
        console.log('Estadísticas:', stats);
    });
*/

// Funciones auxiliares para la UI
const UIHelpers = {
    // Renderizar lista de palabras
    renderWordList(words, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = words.map(word => `
            <div class="word-item" data-level="${word.level}">
                <span class="english">${word.english}</span>
                <span class="spanish">${word.spanish}</span>
                <span class="level-badge">${word.level}</span>
            </div>
        `).join('');
    },

    // Renderizar quiz
    renderQuiz(quiz, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = quiz.map((question, index) => `
            <div class="quiz-question" data-index="${index}">
                <h3>¿Cómo se dice "${question.question}" en ${question.question === question.correct_answer ? 'inglés' : 'español'}?</h3>
                <div class="options">
                    ${question.options.map(option => `
                        <button class="option-btn" data-answer="${option}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    // Mostrar estadísticas
    renderStats(stats, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <h3>${stats.totalWords}</h3>
                    <p>Total de palabras</p>
                </div>
                <div class="stat-item">
                    <h3>${stats.reviewedWords || 0}</h3>
                    <p>Palabras revisadas</p>
                </div>
                <div class="stat-item">
                    <h3>${stats.masteredWords || 0}</h3>
                    <p>Palabras dominadas</p>
                </div>
                <div class="stat-item">
                    <h3>${(stats.progressPercentage || 0).toFixed(1)}%</h3>
                    <p>Progreso general</p>
                </div>
            </div>
        `;
    }
};
