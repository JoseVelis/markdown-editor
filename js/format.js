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

// Esperar a que el DOM esté cargado antes de añadir event listeners
document.addEventListener('DOMContentLoaded', () => {
    const toggleContrastBtn = document.querySelector('#toggle-contrast');
    const generatePreviewBtn = document.querySelector('#generate-preview');
    const formatButton = document.querySelector('#change-bold-or-cursive');
    
    if (toggleContrastBtn) {
        toggleContrastBtn.addEventListener('click', toggleHeadingsContrast);
    }
    
    if (generatePreviewBtn) {
        generatePreviewBtn.addEventListener('click', () => {
            getTextFromTextArea(convertToHtml);
        });
    }

    if (formatButton) {
        formatButton.addEventListener('click', applyFormatToSelection);
        updateFormatButton();
    }
});