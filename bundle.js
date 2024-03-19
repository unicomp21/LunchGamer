// canvas.ts
export function drawRectangle() {
    // Get the canvas element
    const canvas = document.getElementById('myCanvas');
    if (canvas instanceof HTMLCanvasElement) {
        // Get the 2D rendering context
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Set the fill color to red
            ctx.fillStyle = 'red';
            // Draw a rectangle
            ctx.fillRect(10, 10, 100, 100);
        }
    }
}
