//

let centered_focus = 1;

function create_panes() {
  create_pane0();

  if (my.mobileScreen) {
    my.pane = my.pane0;
  } else {
    create_pane1();
    my.pane = my.pane1;
  }
}

function create_pane0() {
  let fwidth = my.width;
  let height = my.height;
  let backImage = my.backImage;
  let rr = 1 - my.paneRatio;
  if (my.mobileScreen) rr = 1;
  let x0 = 0;
  let y0 = 0;
  let z0 = 8;
  // let z0 = 20;
  let width = floor(fwidth * rr);
  let refBox = my.refBox;
  if (my.isPortrait) {
    // width = floor(my.width * (3 / 9));
    width = my.width;
    height = floor(my.height * (6 / 16));
    // y0 = my.height - height;
  }
  let regionIndex = 0;
  // let centered_focus = 1;
  my.pane0 = new Pane({ backImage, x0, y0, z0, width, height, refBox, regionIndex, centered_focus });
}

function create_pane1() {
  let fwidth = my.width;
  let height = my.height;
  let backImage = my.backImage;
  let rr = my.paneRatio;
  let x0 = floor(fwidth * (1 - rr));
  let y0 = 0;
  let z0 = 4.5;
  // let z0 = 2.0;
  let initCentered = 1;
  let width = floor(fwidth * rr);
  let refBox = my.refBox;
  if (my.isPortrait) {
    width = my.width;
    x0 = 0;
  }
  let regionIndex = 1;
  // let centered_focus = 1;
  my.pane1 = new Pane({ backImage, x0, y0, z0, width, height, initCentered, refBox, regionIndex, centered_focus });
}
