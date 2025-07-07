//
function create_ui() {
  //
  createSpan(my.version);
  if (!my.mobileScreen) {
    // createSpan(my.version.substring(1));
    createSpan().id('id_panX');
    createSpan().id('id_panY');
    createSpan().id('id_zoom');
    createButton('full screen').mousePressed(function () {
      my.scanFlag = true;
      run_action();
      ui_toggleFullScreen();
    });
  }
  let href = 'https://commons.wikimedia.org/wiki/File:The_Celestial_Zoo_infographic_wikimedia.png';
  createA(href, ' 210 Astronomical Objects ', '_blank');

  createElement('br');
  {
    my.refIndex_input = createInput('' + (my.refBox.refIndex + 1))
      .id('id_refIndex')
      .input(function () {
        // console.log('id_refIndex', this.value());
        my.refBox.refIndex = parseFloat(this.value()) - 1;
      });
    my.refIndex_input.size(50);
  }
  createButton('←').mousePressed(function () {
    my.animLoop.restart();
    previousRefAction();
  });
  createButton('→').mousePressed(function () {
    my.animLoop.restart();
    nextRefAction();
  });
  if (!my.mobileScreen) {
    createButton('focus').mousePressed(function () {
      my.animLoop.restart();
      focusAction();
    });
    createButton('Add').mousePressed(function () {
      addAction();
    });
    createButton('update').mousePressed(function () {
      updateAction();
    });
    createButton('delete').mousePressed(function () {
      deleteAction();
    });
  }
  {
    my.refLabel_input = createInput('' + my.refBox.refLabel)
      .id('id_refLabel')
      .input(function () {
        // console.log('id_refLabel ' + this.value());
        my.refBox.refLabel = this.value();
      });
    my.refLabel_input.size(180);
  }
  createElement('br');
  my.scanFlagChk = createCheckbox('run', my.scanFlag).changed(function () {
    my.scanFlag = this.checked();
    run_action();
  });
  my.scanFlagChk.style('display:inline');
  {
    my.zoom_slider = createSlider(1, 32, my.pane.zoomIndex, 0.01).input(function () {
      clearMouseXY();
      my.pane.pan_updateZoom(this.value());
    });
    my.zoom_slider.style('width:500px');
  }
  if (my.mobileScreen) {
    // my.zoom_slider.hide();
  }
  {
    my.refEntryReport_div = createDiv().id('id_refReport');
  }
  //
  if (!my.mobileScreen) {
    createButton('download').mousePressed(function () {
      downloadAction();
    });
    createButton('random').mousePressed(function () {
      randomAction();
    });
    createButton('zero').mousePressed(function () {
      my.pane.pan_init();
    });
    createButton('center').mousePressed(function () {
      my.pane.pan_center();
    });
    createButton('clear').mousePressed(function () {
      clearMouseXY();
    });
  }
}

function addAction() {
  let n = my.refBox.refs.length;
  console.log('addAction n', n, 'refIndex', my.refBox.refIndex);
  if (my.refBox.refIndex + 1 == n) {
    my.refBox.refIndex = n;
  } else {
    // Insert zero to force entry init
    my.refBox.refs.splice(my.refBox.refIndex + 1, 0, 0);
    nextRefAction();
  }
  refIndexSync();
}

function deleteAction() {
  let n = my.refBox.refs.length;
  console.log('deleteAction n', n, 'refIndex', my.refBox.refIndex);
  my.refBox.refs.splice(my.refBox.refIndex, 1);
  if (my.refBox.refIndex + 1 == n) {
    my.refBox.refIndex = my.refBox.refs.length - 1;
    refIndexSync();
  }
  focusAction();
  // ui_paneUpdate();
}

function run_action() {
  my.animLoop.loop = my.scanFlag;
  my.animLoop.running = my.scanFlag;
  if (my.scanFlag) {
    my.animLoop.restart();
  }
  focusAction();
}

function downloadAction() {
  let str = 'let refBox_init = ' + JSON.stringify(my.refBox, undefined, 2);
  downloadToFile('refBox_init.js', str);
}

function focusAction() {
  clearMouseXY();
  if (my.scanFlag) {
    if (my.pane1) my.pane1.focus_animated();
    my.pane0.focus_animated();
  } else {
    if (my.pane1) my.pane1.focus();
    my.pane0.focus();
  }
}

function updateAction() {
  my.pane.updateRefEntry(my.mouseXYs);
  ui_paneUpdate();
}

function setPane(nPane) {
  my.pane = nPane;
  ui_paneUpdate();
}

function ui_paneUpdate() {
  let rg = my.pane.region();
  let str = '';
  str = my.pane.label + ' ' + JSON.stringify(rg);
  my.refEntryReport_div.html(str);
  my.zoom_slider.value(my.pane.zoomIndex);
}

function previousRefAction() {
  if (my.refBox.refIndex == 0) {
    // Wrap around to top
    refIndexAssign(my.refBox.refs.length - 1);
  } else {
    refAdjustDelta(-1);
  }
  if (my.mobileScreen) focusAction();
}

function nextRefAction() {
  my.cycleCount++;
  let n = my.refBox.refs.length - 1;
  if (my.refBox.refIndex == n) {
    // Wrap around to botom
    refIndexAssign(0);
  } else {
    // Advance to next ref
    refAdjustDelta(1);
  }
  if (my.mobileScreen) {
    focusAction();
  }
}

function refIndexAssign(index) {
  my.refBox.refIndex = index;
  my.refBox.save_refIndex();
  refIndexSync();
}

function refIndexSync() {
  my.refIndex_input.value(my.refBox.refIndex + 1);
  my.refLabel_input.value(my.refBox.refLabel);
  ui_paneUpdate();
  if (my.pane0.region().z && my.pane1 && my.pane1.region().z) {
    focusAction();
  }
}

function refAdjustDelta(delta) {
  refIndexAssign(my.refBox.refIndex + delta);
  // refIndexSync();
}

function randomAction() {
  my.refBox.refIndex = floor(random(0, my.refBox.refs.length));
  refIndexSync();
}

function create_ui_update() {
  //
  if (!ui_present()) return;
  let pane = my.pane;

  let panX = pane.panX.toFixed(1);
  select('#id_panX').html(' [panX=' + panX + '] ');

  let panY = pane.panY.toFixed(1);
  select('#id_panY').html('[panY=' + panY + '] ');

  let zoom = pane.zoomIndex.toFixed(2);
  select('#id_zoom').html('[zoom=' + zoom + '] ');
}

function ui_present() {
  return select('#id_panX');
}

// https://unicode.org/charts/nameslist/n_2190.html
// Arrows

// https://editor.p5js.org/jht9629-nyu/sketches/bG2JhGUBX
// 3.5 circleX ui span buttons slider checkbox

// https://editor.p5js.org/jht9629-nyu/sketches/rXhPgZ1k6
// 2.2.3 circleX ui span coordinates xy colors rgb
// reporting variable values, coorindates and colors

// https://commons.wikimedia.org/wiki/File:The_Celestial_Zoo_infographic_wikimedia.png
