class NotificationManager {
    constructor() {
        this.container = document.querySelector('#notifications');
    }

    show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `
            notification
            flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
            transform translate-x-full opacity-0 transition-all duration-300
            ${this.getTypeStyles(type)}
        `;

        const icon = this.getIcon(type);
        notification.innerHTML = `
            ${icon}
            <p class="text-sm font-medium">${message}</p>
        `;

        this.container.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.remove('translate-x-full', 'opacity-0');
        }, 100);

        // Remover después de 5 segundos
        setTimeout(() => {
            notification.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    getTypeStyles(type) {
        const styles = {
            success: 'bg-emerald-500/90 text-white backdrop-blur-sm',
            error: 'bg-rose-500/90 text-white backdrop-blur-sm',
            info: 'bg-sky-500/90 text-white backdrop-blur-sm',
            warning: 'bg-amber-500/90 text-white backdrop-blur-sm'
        };
        return styles[type] || styles.info;
    }

    getIcon(type) {
        const icons = {
            success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
            error: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
            info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            warning: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>'
        };
        return icons[type] || icons.info;
    }
}

// Exportar instancia global
window.notifications = new NotificationManager();

// Función para exportar a PDF con notificaciones
async function exportToPdf() {
    const exporter = new PdfExporter();
    try {
        await exporter.exportToPdf();
        notifications.show('PDF exportado exitosamente', 'success');
    } catch (error) {
        notifications.show('Error al exportar el PDF', 'error');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...

    // Añadir listener para el botón de exportar PDF
    const exportButton = document.querySelector('#export-pdf');
    if (exportButton) {
        exportButton.addEventListener('click', exportToPdf);
    }
});