//
function my_setup() {
  //
  my.version = '?v=12';
  my.canvas = createCanvas(windowWidth, windowHeight - 90);
  // my.canvas.mousePressed(canvas_mousePressed);
  // my.canvas.mouseReleased(canvas_mouseReleased);
  my.width = width;
  my.height = height;
  my.paneRatio = 12 / 16;
  // my.isPortrait = height > width;
  my.scanFlag = 1;
  // my.scanFlag = 0;

  my.refBox = new RefBox(refBox_init);

  create_panes();

  create_ui();

  focusAction();

  my.cycleCount = 1;
}
