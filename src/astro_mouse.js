//
function canvas_mousePressed() {
  // console.log('canvas_mousePressed');

  if (keyIsDown(SHIFT)) {
    saveMouseXY();
    my.shiftTracking = 1;
  } else {
    my.mouseTracking = 1;
  }

  if (my.pane1.touchPoint(mouseX, mouseY)) {
    setPane(my.pane1);
  } else if (my.pane0.touchPoint(mouseX, mouseY)) {
    setPane(my.pane0);
  }
  my.pane.mousePressed();
}

function canvas_mouseReleased() {
  // console.log('canvas_mouseReleased');
  if (my.shiftTracking) {
    saveMouseXY();
  }
  my.pane.mouseReleased();
  my.mouseTracking = 0;
  my.shiftTracking = 0;
}

function clearMouseXY() {
  my.mouseXYs = [];
  my.mouseXYindex = 0;
}

function saveMouseXY() {
  let ment = { x: mouseX, y: mouseY };
  my.mouseXYs[my.mouseXYindex] = ment;
  my.mouseXYindex = (my.mouseXYindex + 1) % 2;
}

// !!@ no canvas mouseDragged
// my.canvas.mouseDragged(canvas_mouseDragged);
