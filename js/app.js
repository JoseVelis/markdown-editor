// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Selectores únicos
    const editor = document.querySelector("#editor");
    const preview = document.querySelector("#preview div:last-child");
    const generatePreviewBtn = document.querySelector("#generate-preview");
    const toggleContrastBtn = document.querySelector("#toggle-contrast");
    const changeBoldOrCursiveBtn = document.querySelector("#change-bold-or-cursive");

    // Variables de estado
    let state = false;
    let currentSelectedText = "";
    let isHighContrast = false;

    function changeBtnName() {
        changeBoldOrCursiveBtn.textContent = state
            ? "Cambiar a Negrita"
            : "Cambiar a cursiva";
    }

    function getSelectedText(event) {
        currentSelectedText = editor.value.substring(
            editor.selectionStart,
            editor.selectionEnd
        );
    }

    function renderPreview() {
        if (!editor.value.trim()) {
            preview.innerHTML = '<p class="text-gray-400">Vista previa aparecerá aquí...</p>';
            return;
        }

        let html = editor.value;
        html = convertToHtml(html);
        preview.innerHTML = html;
    }

    function toggleHeadingsContrast() {
        const headings = document.querySelectorAll('#preview h1, #preview h2, #preview h3, #preview h4, #preview h5, #preview h6');
        isHighContrast = !isHighContrast;

        headings.forEach(heading => {
            if (isHighContrast) {
                heading.style.backgroundColor = '#1e293b';
                heading.style.color = '#f8fafc';
                heading.style.padding = '1rem';
                heading.style.borderRadius = '0.5rem';
                heading.style.marginBottom = '1rem';
                heading.style.transform = 'scale(1.02)';
                heading.style.transition = 'all 0.3s ease';
                heading.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            } else {
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

    // Event listeners
    editor.addEventListener("select", getSelectedText);
    generatePreviewBtn.addEventListener('click', renderPreview);
    toggleContrastBtn.addEventListener('click', toggleHeadingsContrast);
    changeBoldOrCursiveBtn.addEventListener('click', () => {
        if (currentSelectedText) {
            const formattedText = state ? `**${currentSelectedText}**` : `*${currentSelectedText}*`;
            editor.value = editor.value.replace(currentSelectedText, formattedText);
            state = !state;
            changeBtnName();
        }
    });

    // Inicialización
    changeBtnName();
});