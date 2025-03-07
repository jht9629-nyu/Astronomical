//
async function setup_dbase() {
  //
  my.appTitle = 'Astronomical';
  my.dbase_rootPath = 'm0-@r-@w-';
  my.mo_app = 'mo-astro';
  my.mo_room = 'm1-astro';
  my.mo_group = 's0';
  my.nameDevice = 'astro';

  my.fireb_config = 'jht9629';
  // my.fireb_config = 'jht1493';
  // my.fireb_config = 'jhtitp';

  my.refBox_inited = 0;

  await dbase_app_init(my);

  dbase_app_observe({ observed_item }, 'item');

  function observed_item(item) {
    // console.log('observed_item item', item);

    let refBox = item.refBox;
    console.log('observed_item refBox', refBox);
    console.log('observed_item my.refBox_inited', my.refBox_inited);
    if (refBox && !my.refBox_inited) {
      my.refBox_inited = 1;
      my.refBox.restore_refBox(refBox);
      refIndexSync();
    }
  }
}

//   dbase_issue_action('action_rewind', 'item');

function ui_log(...args) {
  console.log(...args);
  let str = args.join(' ') + '<br/>';
  if (globalThis.id_console_ul) {
    id_console_ul.innerHTML += str;
  }
}
globalThis.ui_log = ui_log;

function ui_verbose(...args) {
  // console.log(...args);
}
globalThis.ui_verbose = ui_verbose;
