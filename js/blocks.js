function getSelectedText(event) {
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;
    currentSelectedText = event.target.value.substring(start, end);
}

// Función de orden superior para procesar listas numeradas
const processOrderedList = (processor) => (text) => {
    const lines = text.split('\n');
    let inList = false;
    let listItems = [];
    let result = [];

    lines.forEach(line => {
        // Detectar líneas que comienzan con número y punto
        const orderedMatch = line.match(/^(\d+)\.\s+(.+)$/);
        
        if (orderedMatch) {
            if (!inList) {
                inList = true;
            }
            listItems.push(processor(orderedMatch[2]));
        } else {
            if (inList) {
                result.push(`<ol class="list-decimal space-y-2 pl-8">${listItems.join('')}</ol>`);
                inList = false;
                listItems = [];
            }
            result.push(line);
        }
    });

    // Cerrar la última lista si existe
    if (inList) {
        result.push(`<ol class="list-decimal space-y-2 pl-8">${listItems.join('')}</ol>`);
    }

    return result.join('\n');
};

// Callback para procesar cada ítem
const processListItem = text => `<li class="py-1">${text}</li>`;

// Función de primera clase para procesar bloques de código
const processCodeBlock = (codeContent) => {
    // Función interna para resaltar sintaxis básica
    const highlightSyntax = (code) => {
        return code
            // Keywords
            .replace(/\b(const|let|var|function|return|if|else|for|while)\b/g, 
                '<span class="token keyword">$1</span>')
            // Functions
            .replace(/\b(\w+)\(/g, 
                '<span class="token function">$1</span>')
            // Strings
            .replace(/(['"])(.*?)\1/g, 
                '<span class="token string">$&</span>')
            // Numbers
            .replace(/\b(\d+)\b/g, 
                '<span class="token number">$1</span>')
            // Comments
            .replace(/(\/\/[^\n]*)/g, 
                '<span class="token comment">$1</span>');
    };

    // Escapar caracteres HTML y preservar espacios
    const escapeHtml = (text) => {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/ /g, '&nbsp;')
            .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    };

    // Procesar y resaltar el código
    const processedCode = highlightSyntax(escapeHtml(codeContent));
    
    // Retornar el bloque de código formateado
    return `<pre class="code-block"><code>${processedCode}</code></pre>`;
};

// Función para detectar y procesar bloques de código
const processCodeBlocks = (text) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    return text.replace(codeBlockRegex, (match, code) => {
        return processCodeBlock(code.trim());
    });
};

// Función principal para procesar todo el contenido
const processContent = (text) => {
    let inCodeBlock = false;
    let codeContent = [];
    const lines = text.split('\n');
    const result = [];

    lines.forEach(line => {
        if (line.trim() === '```') {
            if (inCodeBlock) {
                // Cerrar bloque de código
                result.push(processCodeBlock(codeContent.join('\n')));
                codeContent = [];
            }
            inCodeBlock = !inCodeBlock;
        } else {
            if (inCodeBlock) {
                codeContent.push(line);
            } else {
                result.push(line);
            }
        }
    });

    // Si quedó un bloque abierto, cerrarlo
    if (inCodeBlock && codeContent.length > 0) {
        result.push(processCodeBlock(codeContent.join('\n')));
    }

    return result.join('\n');
};

// Función principal para convertir listas
function convertLists(text) {
    // Primero procesar bloques de código
    text = processContent(text);
    // Luego procesar listas ordenadas
    return processOrderedList(processListItem)(text);
}

// Event listener para detectar cambios en el editor
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.querySelector('#editor');
    const preview = document.querySelector('#preview div:last-child');

    editor.addEventListener('input', () => {
        const text = editor.value;
        if (text.match(/^\d+\.\s+.+$/m) || text.includes('```')) {
            const html = convertLists(text);
            preview.innerHTML = html;
        }
    });
});

// Exportar la función para uso en otros archivos
window.convertLists = convertLists;
window.processCodeBlocks = processCodeBlocks;