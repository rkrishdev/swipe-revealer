window.onload = function () {
  const canvasWrapper = document.getElementById("canvas-wrapper");
  const image = document.getElementById("canvas-image");
  const overlayCanvas = document.getElementById("overlay-canvas");
  const overlayCtx = overlayCanvas.getContext("2d");
  let totalArea = overlayCanvas.width * overlayCanvas.height;

  function resizeCanvas() {
    overlayCanvas.width = canvasWrapper.clientWidth;
    overlayCanvas.height = canvasWrapper.clientHeight;
    overlayCtx.fillStyle = "rgba(255, 255, 255, 1)";
    overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    totalArea = overlayCanvas.width * overlayCanvas.height;
  }

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  let isMouseDown = false;
  let prevX, prevY;
  let erasedArea = 0;

  function mouseDown(e) {
    isMouseDown = true;
    const rect = overlayCanvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    prevX = clientX - rect.left;
    prevY = clientY - rect.top;
    if (e.touches) {
      e.preventDefault();
    }
  }

  function mouseOut(e) {
    isMouseDown = false;
  }

  function touchStart(e) {
    isMouseDown = true;
    const rect = overlayCanvas.getBoundingClientRect();
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    prevX = clientX - rect.left;
    prevY = clientY - rect.top;
    e.preventDefault();
  }

  function mouseUpOrTouchEnd(e) {
    isMouseDown = false;
  }

  function mouseMoveOrTouchMove(e) {
    if (isMouseDown) {
      const rect = overlayCanvas.getBoundingClientRect();
      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const dx = x - prevX;
      const dy = y - prevY;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      for (var i = 0; i < steps; i++) {
        const tx = prevX + (dx * i) / steps;
        const ty = prevY + (dy * i) / steps;
        overlayCtx.globalCompositeOperation = "destination-out";
        overlayCtx.beginPath();
        overlayCtx.arc(tx, ty, 24, 0, Math.PI * 2, false);
        overlayCtx.fill();
      }
      const distance = Math.sqrt(dx * dx + dy * dy);
      erasedArea += Math.PI * 30 * 30 * (distance / (30 * 2));

      prevX = x;
      prevY = y;

      const ePoint = totalArea * 0.36;
      if (erasedArea > ePoint) {
        overlayCanvas.classList.add("clear");
        setTimeout(() => {
          overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          image.classList.add("allow");
        }, 325);
        removeEventListeners();
      }
    }
    if (e.touches) {
      e.preventDefault();
    }
  }

  function removeEventListeners() {
    overlayCanvas.removeEventListener("mousedown", mouseDown);
    overlayCanvas.removeEventListener("touchstart", mouseDown);
    overlayCanvas.removeEventListener("mouseout", mouseOut);
    overlayCanvas.removeEventListener("touchstart", touchStart);
    overlayCanvas.removeEventListener("mouseup", mouseUpOrTouchEnd);
    overlayCanvas.removeEventListener("touchend", mouseUpOrTouchEnd);
    overlayCanvas.removeEventListener("mousemove", mouseMoveOrTouchMove);
    overlayCanvas.removeEventListener("touchmove", mouseMoveOrTouchMove);
  }

  overlayCanvas.addEventListener("mousedown", mouseDown);
  overlayCanvas.addEventListener("touchstart", mouseDown);
  overlayCanvas.addEventListener("mouseout", mouseOut);
  overlayCanvas.addEventListener("touchstart", touchStart);
  overlayCanvas.addEventListener("mouseup", mouseUpOrTouchEnd);
  overlayCanvas.addEventListener("touchend", mouseUpOrTouchEnd);
  overlayCanvas.addEventListener("mousemove", mouseMoveOrTouchMove);
  overlayCanvas.addEventListener("touchmove", mouseMoveOrTouchMove);
};
