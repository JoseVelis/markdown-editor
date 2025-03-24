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
const processCodeBlocks = (text) => {
    let inCodeBlock = false;
    let codeContent = [];
    const lines = text.split('\n');
    const result = [];

    const wrapCodeBlock = (code) => {
        return `<pre class="bg-gray-800 rounded-lg p-4 my-4 overflow-x-auto">
            <code class="text-sm font-mono text-gray-200">${code}</code>
        </pre>`;
    };

    lines.forEach(line => {
        if (line.trim() === '```') {
            if (inCodeBlock) {
                // Cerrar bloque de código
                result.push(wrapCodeBlock(codeContent.join('\n')));
                codeContent = [];
            }
            inCodeBlock = !inCodeBlock;
        } else {
            if (inCodeBlock) {
                // Escapar caracteres HTML y preservar espacios
                const escapedLine = line
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/ /g, '&nbsp;');
                codeContent.push(escapedLine);
            } else {
                result.push(line);
            }
        }
    });

    // Si quedó un bloque abierto, cerrarlo
    if (inCodeBlock && codeContent.length > 0) {
        result.push(wrapCodeBlock(codeContent.join('\n')));
    }

    return result.join('\n');
};

// Función principal para convertir listas
function convertLists(text) {
    // Primero procesar bloques de código
    text = processCodeBlocks(text);
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