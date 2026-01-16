const mainInput = document.getElementById('mainImage');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

// Settings
const WATERMARK_SRC = 'watermark.png'; 
const WATERMARK_SIZE_RATIO = 0.15;     
const PADDING_RATIO = 0.03;            

// --- NEW: Paste Event Listener ---
window.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            processImage(blob);
        }
    }
});

// --- File Upload Listener ---
mainInput.addEventListener('change', (e) => {
    if (e.target.files[0]) processImage(e.target.files[0]);
});

async function processImage(file) {
    try {
        const [mainImg, logoImg] = await Promise.all([
            loadImage(URL.createObjectURL(file)),
            loadImage(WATERMARK_SRC)
        ]);

        canvas.width = mainImg.width;
        canvas.height = mainImg.height;

        // Draw background
        ctx.drawImage(mainImg, 0, 0);

        // Watermark Math
        const wWidth = canvas.width * WATERMARK_SIZE_RATIO;
        const wHeight = (logoImg.height / logoImg.width) * wWidth;
        const padding = canvas.width * PADDING_RATIO;
        
        // Position: Top Left
        const x = padding;
        const y = padding;

        ctx.globalAlpha = 0.8;
        ctx.drawImage(logoImg, x, y, wWidth, wHeight);
        ctx.globalAlpha = 1.0;

        // Prep Download
        downloadBtn.href = canvas.toDataURL('image/png');
        downloadBtn.download = `watermarked_screenshot.png`;
        downloadBtn.classList.remove('hidden');

    } catch (err) {
        console.error(err);
        alert("Error: Check if watermark.png exists!");
    }
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Image Load Failed"));
        img.src = src;
    });
}
