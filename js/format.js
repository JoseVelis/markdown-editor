// Variables globales
const markdownInput = document.querySelector('#editor');
const previewSection = document.querySelector('#preview div:last-child');
let isHighContrast = false;
let formatState = {
    isBold: true
};

// Función de orden superior para aplicar formato
const applyFormat = (callback) => (text) => {
    if (!text) return text;
    return callback(text);
};

// Funciones de formato específicas
const makeBold = text => `**${text}**`;
const makeItalic = text => `*${text}*`;

// Función para obtener el texto seleccionado
function getSelectedText() {
    const editor = document.querySelector('#editor');
    return {
        text: editor.value.substring(editor.selectionStart, editor.selectionEnd),
        start: editor.selectionStart,
        end: editor.selectionEnd
    };
}

// Función para aplicar el formato al texto seleccionado
function applyFormatToSelection() {
    const editor = document.querySelector('#editor');
    const selection = getSelectedText();
    
    if (!selection.text) return;

    const formatFunc = formatState.isBold ? makeBold : makeItalic;
    const format = applyFormat(formatFunc);
    const formattedText = format(selection.text);

    // Reemplazar texto seleccionado con texto formateado
    editor.value = editor.value.substring(0, selection.start) +
                   formattedText +
                   editor.value.substring(selection.end);

    // Actualizar estado y texto del botón
    formatState.isBold = !formatState.isBold;
    updateFormatButton();
}

// Función para actualizar el texto del botón
function updateFormatButton() {
    const button = document.querySelector('#change-bold-or-cursive');
    button.textContent = formatState.isBold ? 'Aplicar Negrita' : 'Aplicar Cursiva';
}

function formatTextToCursiveOrBold(text) {
    if (currentSelectedText) {
      text = text.replace(
        currentSelectedText,
        state ? `**${currentSelectedText}**` : `*${currentSelectedText}*`
      );
      state = !state;
      changeBtnName();
    }
  
    return text;
  }
  
  function getTextFromTextArea(callback) {
    let text = markdownInput.value;
  
    if (text === "") {
      alert("Debe ingresar un texto para poder generar el MD");
      return; // termine la ejecución luego de mostrar la alert
    }
  
    text = formatTextToCursiveOrBold(text);
  
    callback(text);
  }
  
  function convertHeadings(html) {
    html = html.replace(
      /^# (.+)$/gm,
      "<h1 class='text-6xl font-bold border-b'>$1</h1>"
    );
    // ## titulo -> <h2>titulo</h2>
    html = html.replace(
      /^## (.+)$/gm,
      "<h2 class='text-5xl font-bold border-b'>$1</h2>"
    );
    html = html.replace(/^### (.+)$/gm, "<h3 class='text-4xl font-bold'>$1</h3>");
    html = html.replace(
      /^#### (.+)$/gm,
      "<h4 class='text-3xl font-bold'>$1</h4>"
    );
    html = html.replace(
      /^##### (.+)$/gm,
      "<h5 class='text-2xl font-bold'>$1</h5>"
    );
    html = html.replace(
      /^###### (.+)$/gm,
      "<h6 class='text-xl font-bold'>$1</h6>"
    );
  
    return html;
  }
  
  function convertBold(html) {
    // **hola**
    return html.replace(
      /\*\*([^\*]+)\*\*/g,
      "<strong class='text-red-500'>$1</strong>"
    );
  }
  
  function converCursive(html) {
    // *hola*
    return html.replace(/\*([^\*]+)\*/g, "<i>$1</i>");
  }
  
  function convertToHtml(text) {
    // Primero procesar bloques de código
    text = processCodeBlocks(text);
    
    // Luego aplicar otros formatos
    let html = text;
    html = convertHeadings(html);
    html = convertBold(html);
    html = converCursive(html);
    return html;
  }
  
function renderPreview() {
    if (!markdownInput.value.trim()) {
        previewSection.innerHTML = '<p class="text-gray-400">Vista previa aparecerá aquí...</p>';
        return;
    }

    let html = markdownInput.value;
    // Primero convertir listas
    html = convertLists(html);
    // Luego aplicar otros formatos
    html = convertToHtml(html);
    previewSection.innerHTML = html;
}

function toggleHeadingsContrast() {
    const headings = document.querySelectorAll('#preview h1, #preview h2, #preview h3, #preview h4, #preview h5, #preview h6');
    isHighContrast = !isHighContrast;

    headings.forEach(heading => {
        if (isHighContrast) {
            // Aplicar estilos de contraste
            heading.style.backgroundColor = '#1e293b';
            heading.style.color = '#f8fafc';
            heading.style.padding = '1rem';
            heading.style.borderRadius = '0.5rem';
            heading.style.marginBottom = '1rem';
            heading.style.transform = 'scale(1.02)';
            heading.style.transition = 'all 0.3s ease';
            heading.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        } else {
            // Restaurar estilos originales
            heading.style.backgroundColor = '';
            heading.style.color = '';
            heading.style.padding = '';
            heading.style.borderRadius = '';
            heading.style.marginBottom = '';
            heading.style.transform = '';
            heading.style.transition = '';
            heading.style.boxShadow = '';
        }
    });
}

// Función para limpiar el editor y la vista previa
function clearEditor() {
    // Limpiar el editor
    markdownInput.value = '';
    
    // Limpiar la vista previa
    previewSection.innerHTML = '<p class="text-gray-400">Vista previa aparecerá aquí...</p>';
    
    // Reiniciar estados si es necesario
    isHighContrast = false;
    formatState.isBold = true;
    
    // Actualizar el botón de formato
    updateFormatButton();
}

// Debounce function para optimizar el rendimiento
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Función para contar palabras y caracteres
function updateWordAndCharCount() {
    const text = markdownInput.value;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charCount = text.length;

    const wordCountElement = document.querySelector('#word-count');
    const charCountElement = document.querySelector('#char-count');

    if (wordCountElement && charCountElement) {
        wordCountElement.textContent = `${wordCount} ${wordCount === 1 ? 'palabra' : 'palabras'}`;
        charCountElement.textContent = `${charCount} ${charCount === 1 ? 'caracter' : 'caracteres'}`;
    }
}

// Función para leer archivo de forma asíncrona
const readFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        
        reader.readAsText(file);
    });
};

// Función para mostrar mensaje de carga
const showLoadingState = () => {
    markdownInput.value = 'Cargando archivo...';
    previewSection.innerHTML = '<p class="text-gray-400">Cargando...</p>';
    markdownInput.disabled = true;
};

// Función para restaurar estado normal
const restoreEditorState = () => {
    markdownInput.disabled = false;
};

// Función para manejar la carga del archivo
async function handleFileLoad(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    if (!file.name.endsWith('.md')) {
        alert('Por favor, seleccione un archivo Markdown (.md)');
        return;
    }
    
    try {
        showLoadingState();
        
        const content = await readFile(file);
        
        markdownInput.value = content;
        renderPreview();
        updateWordAndCharCount();
        
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        alert('Error al leer el archivo. Por favor, intente nuevamente.');
        markdownInput.value = '';
        previewSection.innerHTML = '<p class="text-gray-400">Vista previa aparecerá aquí...</p>';
    } finally {
        restoreEditorState();
    }
}

// Esperar a que el DOM esté cargado antes de añadir event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Crear versión debounced del renderPreview
    const debouncedRenderPreview = debounce(renderPreview, 300);

    // Escuchar cambios en el editor
    markdownInput.addEventListener('input', debouncedRenderPreview);

    // Remover el event listener del botón de vista previa ya que no es necesario
    const generatePreviewBtn = document.querySelector('#generate-preview');
    if (generatePreviewBtn) {
        generatePreviewBtn.remove();
    }

    // Resto de event listeners
    const toggleContrastBtn = document.querySelector('#toggle-contrast');
    const formatButton = document.querySelector('#change-bold-or-cursive');
    
    if (toggleContrastBtn) {
        toggleContrastBtn.addEventListener('click', toggleHeadingsContrast);
    }

    if (formatButton) {
        formatButton.addEventListener('click', applyFormatToSelection);
        updateFormatButton();
    }

    // Añadir listener para el botón de limpieza
    const clearButton = document.querySelector('#clear-editor');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            if (markdownInput.value.trim()) {
                if (confirm('¿Estás seguro de que deseas limpiar todo el contenido?')) {
                    clearEditor();
                }
            } else {
                clearEditor();
            }
        });
    }

    // Crear versión debounced del contador
    const debouncedCounter = debounce(updateWordAndCharCount, 300);

    // Escuchar cambios en el editor para actualizar contadores
    markdownInput.addEventListener('input', debouncedCounter);

    // Actualizar contadores inicialmente
    updateWordAndCharCount();

    // Renderizar vista previa inicial
    renderPreview();

    // Añadir listener para cargar archivo
    const fileInput = document.querySelector('#md-file');
    const loadButton = document.querySelector('#load-file');
    
    if (fileInput && loadButton) {
        loadButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileLoad);
    }
});