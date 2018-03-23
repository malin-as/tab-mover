'use babel';

import { CompositeDisposable } from 'atom';

export default {

  tabMoverView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'tab-mover:move_left': () => this.move_left(),
      'tab-mover:move_right': () => this.move_right(),
      'tab-mover:move_up': () => this.move_up(),
      'tab-mover:move_down': () => this.move_down(),
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  parentHasCorrectOrientation(pane, direction) {
    const parent = pane.element.parentNode;
    const orientation = ["Left", "Right"].includes(direction)
      ? "horizontal"
      : "vertical";

    return parent.classList.contains(orientation);
  },

  getDestElem(pane, direction) {
    const propName = ["Left", "Up"].includes(direction)
      ? "previousElementSibling"
      : "nextElementSibling";

    let destElem = pane.element[propName];
    while(destElem && !destElem.classList.contains("pane"))
      destElem = destElem[propName];

    return destElem;
  },

  move(direction) {
    const center = atom.workspace.getCenter();
    const src = center.getActivePane();
    const item = src.getActiveItem();

    const destElem = this.getDestElem(src, direction);

    if(this.parentHasCorrectOrientation(src, direction) && destElem) {
      const dst = center.getPanes().find(pane => pane.element === destElem);
      src.moveItemToPane(item, dst, -1);
      dst.activate();
      dst.activateItem(item);
    }
    else {
      const newPane = src[`split${direction}`]();
      src.moveItemToPane(item, newPane, -1);
    }
  },

  move_left() {
    this.move("Left");
  },

  move_right() {
    this.move("Right");
  },

  move_up() {
    this.move("Up");
  },

  move_down() {
    this.move("Down");
  }

};
