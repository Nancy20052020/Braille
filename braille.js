document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileElem');
    const convertBtn = document.getElementById('convert-btn');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const colorPicker = document.getElementById('color-picker');
    const sizePicker = document.getElementById('size-picker');

    let brailleColor = '#000000';
    let brailleSize = 20;

    function handleFile(file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const text = event.target.result;
            const brailleText = convertToBraille(text);
            downloadBrailleFile(brailleText);
        };

        reader.readAsText(file);
    }

    function convertToBraille(text) {
        // Convert text to Braille with color and size.
        return `
            <html>
            <head>
                <style>
                    .braille-cell {
                        display: inline-block;
                        width: ${brailleSize}px;
                        height: ${brailleSize}px;
                        background-color: ${brailleColor};
                        margin: 2px;
                        border-radius: 4px;
                    }
                </style>
            </head>
            <body>
                <div>${text.split('').map(char => `<div class="braille-cell">${char}</div>`).join('')}</div>
            </body>
            </html>
        `;
    }

    function downloadBrailleFile(text) {
        const blob = new Blob([text], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'braille_output.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function generatePdf(content) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.html(content, {
            callback: function (doc) {
                doc.save('braille_output.pdf');
            },
            x: 10,
            y: 10
        });
    }

    function downloadPdfFile() {
        const brailleText = convertToBraille('Sample Text for PDF');
        generatePdf(brailleText);
    }

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over');
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('drag-over');
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFile(file);
        }
    });

    convertBtn.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file) {
            handleFile(file);
        }
    });

    downloadPdfBtn.addEventListener('click', () => {
        const brailleText = convertToBraille('Sample Text for PDF');
        generatePdf(brailleText);
    });

    colorPicker.addEventListener('input', (event) => {
        brailleColor = event.target.value;
    });

    sizePicker.addEventListener('input', (event) => {
        brailleSize = event.target.value;
    });
});

