//
// my.canvas.mousePressed(canvas_mousePressed);
// !!@ mousePressed
// on mobile does not appear to be called
//
// function canvas_mousePressed() {

function mousePressed() {
  console.log('canvas_mousePressed');
  if (keyIsDown(SHIFT)) {
    saveMouseXY();
    my.shiftTracking = 1;
  } else {
    my.mouseTracking = 1;
  }
  if (my.pane1 && my.pane1.touchPoint(mouseX, mouseY)) {
    setPane(my.pane1);
  } else if (my.pane0.touchPoint(mouseX, mouseY)) {
    setPane(my.pane0);
  }
  my.pane.mousePressed();
  // return false;
}

function mouseDragged() {
  let inX = mouseX >= 0 && mouseX < width;
  let inY = mouseY >= 0 && mouseY < height;
  let onCanvas = inX && inY;
  if (onCanvas && !my.shiftTracking) {
    my.pane.mouseDragged();
  }
  // return false to allow scrolling on mobile
  return !onCanvas;
}

// function canvas_mouseReleased() {
function mouseReleased() {
  console.log('canvas_mouseReleased');
  if (my.shiftTracking) {
    saveMouseXY();
  }
  my.pane.mouseReleased();
  my.mouseTracking = 0;
  my.shiftTracking = 0;
}

// --

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

// From Heavenly3D
// prevent whole screen dragging on mobile
function mouseDragged_XXX() {
  //
  let inX = mouseX >= 0 && mouseX < width;
  let inY = mouseY >= 0 && mouseY < height;
  let onCanvas = inX && inY;
  // if (onCanvas) {
  //   if (my.shiftTracking) {
  //     my.panX += my.panX0 - mouseX;
  //     my.panY += my.panY0 - mouseY;
  //     my.panX0 = mouseX;
  //     my.panY0 = mouseY;
  //   }
  // }
  // return false to allow scrolling on mobile
  return !onCanvas;
}

// https://p5js.org/reference/p5/mouseDragged/
// To prevent any default behavior for this event, add return false;
