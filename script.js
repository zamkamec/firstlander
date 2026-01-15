const mainInput = document.getElementById('mainImage');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

// Settings - You can change these values
const WATERMARK_SRC = 'watermark.png'; // Path to your logo
const WATERMARK_SIZE_RATIO = 0.15;     // 15% of the main image width
const PADDING_RATIO = 0.03;            // 3% distance from the edges

mainInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        // Load the user image and your logo simultaneously
        const [mainImg, logoImg] = await Promise.all([
            loadImage(URL.createObjectURL(file)),
            loadImage(WATERMARK_SRC)
        ]);

        // 1. Match canvas size to the uploaded image
        canvas.width = mainImg.width;
        canvas.height = mainImg.height;

        // 2. Draw the main image as the background
        ctx.drawImage(mainImg, 0, 0);

        // 3. Calculate Watermark Dimensions
        const wWidth = canvas.width * WATERMARK_SIZE_RATIO;
        const wHeight = (logoImg.height / logoImg.width) * wWidth;

        // 4. Position: TOP LEFT
        // x = padding from left, y = padding from top
        const padding = canvas.width * PADDING_RATIO;
        const x = padding;
        const y = padding;

        // 5. Apply the watermark with transparency
        ctx.globalAlpha = 0.8; // 80% opacity
        ctx.drawImage(logoImg, x, y, wWidth, wHeight);
        ctx.globalAlpha = 1.0; // Reset alpha for future operations

        // 6. Prepare the download button
        downloadBtn.href = canvas.toDataURL('image/png');
        downloadBtn.download = `watermarked_${file.name}`;
        downloadBtn.classList.remove('hidden');

    } catch (err) {
        console.error("Error:", err);
        alert("Please ensure watermark.png is in the same folder as your code!");
    }
});

/**
 * Helper to load an image and return a Promise
 */
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}
