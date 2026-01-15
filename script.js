const mainInput = document.getElementById('mainImage');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

// Path to your watermark file in the repo
const WATERMARK_SRC = 'watermark.png'; 

mainInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        // Load the user's image and your watermark simultaneously
        const [mainImg, logoImg] = await Promise.all([
            loadImage(URL.createObjectURL(file)),
            loadImage(WATERMARK_SRC)
        ]);

        // 1. Set canvas size to the original image dimensions
        canvas.width = mainImg.width;
        canvas.height = mainImg.height;

        // 2. Draw the main image
        ctx.drawImage(mainImg, 0, 0);

        // 3. Calculate Watermark Scaling (e.g., watermark is 15% of image width)
        const scaleFactor = 0.15; 
        const wWidth = canvas.width * scaleFactor;
        const wHeight = (logoImg.height / logoImg.width) * wWidth;

        // 4. Position: Bottom Right with padding
        const padding = canvas.width * 0.02; // 2% padding
        const x = canvas.width - wWidth - padding;
        const y = canvas.height - wHeight - padding;

        // 5. Apply watermark
        ctx.globalAlpha = 0.9; // 90% opacity
        ctx.drawImage(logoImg, x, y, wWidth, wHeight);
        ctx.globalAlpha = 1.0;

        // 6. Enable Download
        downloadBtn.href = canvas.toDataURL('image/png');
        downloadBtn.download = `watermarked_${file.name}`;
        downloadBtn.classList.remove('hidden');

    } catch (err) {
        console.error("Error processing image:", err);
        alert("Make sure watermark.png exists in your folder!");
    }
});

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Prevents CORS issues
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}