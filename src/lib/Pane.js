//

export class Pane {
  // { backImage, x0, y0, z0, width, height, initCentered, refBox, regionIndex }
  constructor(props) {
    //
    Object.assign(this, props);

    if (!this.regionIndex) this.regionIndex = 0;

    // console.log('Pane', this.label, 'width', this.width, 'height', this.height);

    // panX
    // panY
    // zoomIndex
    // zoomRatio

    this.pan_init();

    if (this.initCentered) {
      this.pan_center();
    }

    this.focusRect_init();

    this.anim_init();
  }

  render() {
    // must step values before render
    this.anim.stepValues();
    this.render_backImage();
    if (this.anim.running) {
      // animation is running, don't touch props
      // this.focus_pan();
    } else if (this.refBox) {
      // when not animating show focus rect
      this.focus_focusRect();
      this.focusRect.render();
    }
  }

  // let targetProps = { panX: 1, panY: 1, zoomIndex: 1 };
  // pan_updateZoom(newValue) {

  focus() {
    this.focus_pan();
    this.focus_focusRect();
  }

  focus_animated() {
    this.anim.initValues({ panX: this.panX, panY: this.panY, zoomIndex: this.zoomIndex });
    if (this.regionIndex == 1) {
      let zoomOutIndex = 2.0;
      this.anim.addChange(3, { panX: this.panX, panY: this.panY, zoomIndex: this.zoomIndex }); // Pause
      this.focus_pan();
      this.focus_focusRect();
      this.anim.addChange(1, { panX: this.panX, panY: this.panY, zoomIndex: this.zoomIndex }); // pan and zoom
      this.anim.addChange(0, { panZoomIndex: this.zoomIndex }); // Pause
      this.anim.addChange(2, { panZoomIndex: zoomOutIndex }); // Zoom out
      this.anim.addChange(2, { panZoomIndex: zoomOutIndex }); // Pause
      this.anim.addChange(1, { panZoomIndex: this.zoomIndex }); // zoom in
    } else {
      this.focus_pan();
      this.focus_focusRect();
      this.anim.addChange(1.0, { panX: this.panX, panY: this.panY, zoomIndex: this.zoomIndex });
    }
  }

  focus_pan() {
    let rg = this.region();
    this.zoomIndex = rg.z;
    let cm = this.canvasMap();
    // console.log('focus cm', JSON.stringify(cm));
    // let x = rg.x + rg.w * 0.5 - cm.zWidth * 0.5;
    // let y = rg.y + rg.h * 0.5 - cm.zHeight * 0.5;
    // this.panX = floor(x);
    // this.panY = floor(y);
    this.panX = floor(rg.x + (rg.w - cm.zWidth) * 0.5);
    this.panY = floor(rg.y + (rg.h - cm.zHeight) * 0.5);
    // console.log('focus rg', JSON.stringify(rg));
  }

  anim_init() {
    this.anim = new Anim({ target: this });
  }

  focusRect_init() {
    let x0 = 0;
    let y0 = 0;
    let width = 0;
    let height = 0;
    let stroke = color(234, 171, 126); // color('yellow');
    let strokeWeight = 2;
    let shadowBlur = 15;
    let shadowColor = color(234, 171, 126); // color('white');
    this.focusRect = new Rect({ x0, y0, width, height, stroke, strokeWeight, shadowBlur, shadowColor });
  }

  render_backImage() {
    let cm = this.canvasMap();
    let backImage = this.backImage;
    // zoom background image to the full width of the canvas
    let dx = this.x0;
    let dy = this.y0;
    let sx = this.panX;
    let sy = this.panY;
    image(backImage, dx, dy, cm.cWidth, cm.cHeight, sx, sy, cm.zWidth, cm.zHeight);
  }

  // image(img, x, y, [width], [height])
  // image(img, dx, dy, cWidth, cHeight, sx, sy, [zWidth], [zHeight], [fit], [xAlign], [yAlign])

  set zoomIndex(newValue) {
    this._zoomIndex = newValue;
    this.zoomRatio = 1 / newValue;
  }

  get zoomIndex() {
    return this._zoomIndex;
  }

  set panZoomIndex(newValue) {
    this.pan_updateZoom(newValue);
  }

  get panZoomIndex() {
    return this._zoomIndex;
  }

  refEntry() {
    if (!this.refBox) {
      return { label: '', i: 0, regions: [{ x: 0, y: 0, w: this.width, h: this.height, z: 1 }] };
    }
    return this.refBox.refEntry();
  }

  get label() {
    return 'pane' + this.regionIndex;
  }

  region() {
    let ent = this.refEntry();
    let rg = ent.regions[this.regionIndex];
    // console.log(this.label, 'rg', JSON.stringify(rg));
    return rg;
  }

  focus_focusRect() {
    let rg = this.region();
    let crg = this.rgToCanvas(rg);
    this.focusRect.x0 = crg.x;
    this.focusRect.y0 = crg.y;
    this.focusRect.width = crg.w;
    this.focusRect.height = crg.h;
  }

  touchPoint(x, y) {
    let xhit = this.x0 < x && x < this.x0 + this.width;
    let yhit = this.y0 < y && y < this.y0 + this.height;
    return xhit && yhit;
  }

  pan_updateZoom(newValue) {
    let oRatio = this.zoomRatio;
    this.zoomIndex = newValue;

    let iWidth = this.backImage.width;
    let iHeight = this.backImage.height;

    let oW = floor(iWidth * oRatio * 0.5);
    let oH = floor(iHeight * oRatio * 0.5);

    let nW = floor(iWidth * this.zoomRatio * 0.5);
    let nH = floor(iHeight * this.zoomRatio * 0.5);

    this.panX = this.panX + oW - nW;
    this.panY = this.panY + oH - nH;
  }

  pan_init() {
    this.panX = 0;
    this.panY = 0;
    this.zoomIndex = this.z0;
    // this.zoomRatio = 1 / this.zoomIndex;
  }

  pan_center() {
    this.zoomIndex = this.z0;
    let cm = this.canvasMap();
    this.panX = floor((cm.iWidth - cm.zWidth) * 0.5);
    this.panY = floor((cm.iHeight - cm.zHeight) * 0.5);
  }

  mousePressed() {
    // console.log('Pane mousePressed', this.label);
    this.panX0 = mouseX;
    this.panY0 = mouseY;
  }

  mouseDragged() {
    this.panX += this.panX0 - mouseX;
    this.panY += this.panY0 - mouseY;
    this.panX0 = mouseX;
    this.panY0 = mouseY;
  }

  mouseReleased() {
    // console.log('Pane mouseReleased', this.label);
  }

  updateRefEntry(mouseXYs) {
    let ent = this.refEntry();

    if (mouseXYs.length >= 2) {
      this.updateEnt(ent, mouseXYs);
    } else {
      ent.regions[this.regionIndex].z = this.zoomIndex;
    }

    this.refBox.save_localStorage();
  }

  updateEnt(ent, mouseXYs) {
    // map from image to screen coordinates
    let cm = this.canvasMap();
    let rw = cm.zWidth / cm.cWidth;
    let rh = cm.zHeight / cm.cHeight;
    let regions = [];
    for (let ment of mouseXYs) {
      let x = floor((ment.x - this.x0) * rw) + this.panX;
      let y = floor((ment.y - this.y0) * rh) + this.panY;
      regions.push({ x, y });
    }
    if (regions[0].x > regions[1].x) {
      let temp = regions[1].x;
      regions[1].x = regions[0].x;
      regions[0].x = temp;
    }
    if (regions[0].y > regions[1].y) {
      let temp = regions[1].y;
      regions[1].y = regions[0].y;
      regions[0].y = temp;
    }
    let x = regions[0].x;
    let y = regions[0].y;
    let w = regions[1].x - x;
    let h = regions[1].y - y;
    let z = this.zoomIndex;
    ent.regions[this.regionIndex] = { x, y, w, h, z };
  }

  rgToCanvas(rg) {
    // map from screen to image coordinates

    let cm = this.canvasMap();
    let wr = cm.cWidth / cm.zWidth;
    let hr = cm.cHeight / cm.zHeight;

    // solve for ment.x
    // let x = floor((ment.x - this.x0) * rw) + this.panX;
    // let y = floor((ment.y - this.y0) * rh) + this.panY;

    let x = floor((rg.x - this.panX) * wr + this.x0);
    let y = floor((rg.y - this.panY) * hr + this.y0);
    let w = floor(rg.w * wr);
    let h = floor(rg.h * hr);

    return { x, y, w, h };
  }

  // { cWidth, cHeight, zWidth, zHeight, iWidth, iHeight };
  canvasMap() {
    let backImage = this.backImage;
    let iWidth = backImage.width;
    let iHeight = backImage.height;
    let rr = iHeight / iWidth;

    let cWidth = this.width;
    let cHeight = floor(cWidth * rr);
    if (cHeight < this.height) {
      cHeight = this.height;
      cWidth = floor(cHeight / rr);
    }

    let zWidth = floor(iWidth * this.zoomRatio);
    let zHeight = floor(iHeight * this.zoomRatio);
    if (this.width < cWidth) {
      let dr = this.width / cWidth;
      cWidth = this.width;
      zWidth = floor(zWidth * dr);
    }

    return { cWidth, cHeight, zWidth, zHeight, iWidth, iHeight };
  }
}

globalThis.Pane = Pane;
