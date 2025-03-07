//
function my_setup() {
  //
  my.version = '?v=14';
  my.bottomMargin = 40;
  my.canvas = createCanvas(windowWidth, windowHeight - my.bottomMargin);
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

// Resize the canvas when the
// browser's size changes.
function windowResized() {
  // resizeCanvas(windowWidth, windowHeight);
  console.log('-- windowResized my.resizedTimer', my.resizedTimer);
  // Wait a sec to avoid excessive firing
  if (!my.resizedTimer) {
    let period = 2.0;
    function timer_event() {
      // my_setup();
      resizeCanvas(windowWidth, windowHeight - my.bottomMargin);
      my.width = width;
      my.height = height;
      create_panes();
      my.resizedTimer.clear();
      my.resizedTimer = 0;
    }
    my.resizedTimer = new PeriodTimer({ period, timer_event });
  }
  // my_setup();
}
