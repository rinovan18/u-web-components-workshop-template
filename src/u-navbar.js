import { LitElement, css, html } from 'lit';
import { uA11yStyles } from './u-a11y-styles.js';

/**
 * `u-navbar`
 * accessible nav menubar adapted from {@link https://www.w3.org/WAI/ARIA/apg/example-index/menubar/menubar-navigation.html | ARIA Authoring Practices Guide (APG): Navigation Menubar Example}
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element u-navbar
 */
class uNavbar extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return 'u-navbar';
  }

  /**
   * array of CSS styles to be attached to shadowDOM
   */
  static get styles() {
    return [
      //add visually hiddent styles for accessibility
      ...uA11yStyles,
      css`
        :host {
            display: block;
        }

        [hidden] {
            display: none!important;
        }
        /* TODO: SLIDES 91 & 93 */
    `,
    ];
  }

  static get properties() {
    return {
      /**
       * whether is currently expanded
       */
      expanded: {
        type: Boolean,
        attribute: 'expanded',
        reflect: true,
      },
    };
  }

  /**
   * template used to render HTML in shadowDOM
   */
  render() {
    //slotted content in light DOM for styling
    return html`<slot></slot>`;
  }

  /**
   * Called when element is created and also when
   * custom element is loaded after element is already in DOM.
   * Useful for setting initial property values.
   */
  constructor() {
    //make sure anything it extended from lit runs
    super();

    this.__menuitems = [];
    this.__popups = [];
    this.__menuitemGroups = {};
    this.__menuOrientation = {};
    this.__isPopup = {};
    this.__isPopout = {};
    this.__openPopups = false;
    this.__domNode = false;

    this.__firstChars = {}; // see Menubar init method
    this.__firstMenuitem = {}; // see Menubar init method
    this.__lastMenuitem = {};
  }

  /**
   * Called after component's DOM has been updated first time.
   * Useful for initial access to attributes and shadow DOM.
   */
  firstUpdated(changedProperties) {
    var linkURL, linkTitle;
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    let nav = this.querySelector('nav'),
      ul = nav ? nav.querySelector('ul') : this.querySelector('ul');

    if (!ul) return;
    this.__domNode = ul;
    if (!nav) {
      nav = document.createElement('nav');
      this.insertBefore(nav, ul);
    }
    if (!nav.getAttribute('aria-label'))
      nav.setAttribute('aria-label', 'Main Navigation');
    if (!ul.getAttribute('aria-label'))
      ul.setAttribute('aria-label', 'Main Navigation');
    ul.setAttribute('role', 'menubar');
    [...ul.querySelectorAll('ul')].forEach((menu) => {
      menu.setAttribute('role', 'menu');
      let prev = menu.previousElementSibling;
      prev.setAttribute('aria-haspopup', 'true');
      prev.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', prev.textContent);
    });
    [...ul.querySelectorAll('li')].forEach((li) => {
      let link = li.querySelector('a');
      if (!!link) {
        li.setAttribute('role', 'none');
        link.setAttribute('role', 'menuitem');
      } else {
        li.setAttribute('role', 'separator');
      }
    });

    // see Menubar init method

    this.initMenu(this.__domNode, 0);

    this.__domNode.addEventListener(
      'focusin',
      this.onMenubarFocusin.bind(this)
    );
    this.__domNode.addEventListener(
      'focusout',
      this.onMenubarFocusout.bind(this)
    );

    window.addEventListener(
      'pointerdown',
      this.onBackgroundPointerdown.bind(this),
      true
    );
    let home = this.__domNode.querySelector('[role=menuitem]');
    home.tabIndex = 0;

    // Initial content for page
    if (window.location.href.split('#').length > 1) {
      linkURL = window.location.href;
      linkTitle = getLinkNameFromURL(window.location.href);
    } else {
      linkURL = window.location.href + home.href;
      linkTitle = home.innerHTML;
    }

    function getLinkNameFromURL(url) {
      function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }

      var name = url.split('#')[1];
      if (typeof name === 'string') {
        name = name.split('-').map(capitalize).join(' ');
      } else {
        name = 'Home';
      }
      return name;
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {});
  }

  getParentMenuitem(menuitem) {
    var node = menuitem.parentNode;
    if (node) {
      node = node.parentNode;
      if (node) {
        node = node.previousElementSibling;
        if (node) {
          if (node.getAttribute('role') === 'menuitem') {
            return node;
          }
        }
      }
    }
    return false;
  }
  /**
   * given a node and depth get array of descendant nodes with role="menuitem"
   * @param {object} domNode
   * @param {number} depth starting depth for recursion
   * @returns {array}
   */
  getMenuitems(domNode, depth) {
    var nodes = [];

    var initMenu = this.initMenu.bind(this);
    var popups = this.__popups;

    function findMenuitems(node) {
      var role, flag;

      while (node) {
        flag = true;
        role = node.getAttribute('role');

        if (role) {
          role = role.trim().toLowerCase();
        }

        switch (role) {
          case 'menu':
            node.tabIndex = -1;
            initMenu(node, depth + 1);
            flag = false;
            break;

          case 'menuitem':
            if (node.getAttribute('aria-haspopup') === 'true') {
              popups.push(node);
            }
            nodes.push(node);
            break;

          default:
            break;
        }

        if (
          flag &&
          node.firstElementChild &&
          node.firstElementChild.tagName !== 'svg'
        ) {
          findMenuitems(node.firstElementChild);
        }
        node = node.nextElementSibling;
      }
    }
    findMenuitems(domNode.firstElementChild);
    return nodes;
  }
  /**
   * initializes a menu
   * @param {object} menu DOM node
   * @param {number} depth starting depth for recursion
   */
  initMenu(menu, depth) {
    var menuitems, menuitem, role;

    var menuId = this.getMenuId(menu);

    menuitems = this.getMenuitems(menu, depth);
    this.__menuOrientation[menuId] = this.getMenuOrientation(menu);

    this.__isPopup[menuId] =
      menu.getAttribute('role') === 'menu' && depth === 1;
    this.__isPopout[menuId] = menu.getAttribute('role') === 'menu' && depth > 1;

    this.__menuitemGroups[menuId] = [];
    this.__firstChars[menuId] = [];
    this.__firstMenuitem[menuId] = null;
    this.__lastMenuitem[menuId] = null;

    for (var i = 0; i < menuitems.length; i++) {
      menuitem = menuitems[i];
      role = menuitem.getAttribute('role');

      if (role.indexOf('menuitem') < 0) {
        continue;
      }

      menuitem.tabIndex = -1;
      this.__menuitems.push(menuitem);
      this.__menuitemGroups[menuId].push(menuitem);
      this.__firstChars[menuId].push(
        menuitem.textContent.trim().toLowerCase()[0]
      );

      menuitem.addEventListener('keydown', this.onKeydown.bind(this));
      menuitem.addEventListener('click', this.onMenuitemClick.bind(this), {
        capture: true,
      });

      menuitem.addEventListener('menuitem', this.onMenuitemmenuitem.bind(this));

      if (!this.__firstMenuitem[menuId]) {
        if (this.hasPopup(menuitem)) {
          menuitem.tabIndex = 0;
        }
        this.__firstMenuitem[menuId] = menuitem;
      }
      this.__lastMenuitem[menuId] = menuitem;
    }
  }
  /**
   * focuses on a menuitem
   * @param {string} menuId unique idendifier for menu item group
   * @param {object} newMenuitem menuitem node
   */
  setFocusToMenuitem(menuId, newMenuitem) {
    this.closePopupAll(newMenuitem);

    if (this.__menuitemGroups[menuId]) {
      this.__menuitemGroups[menuId].forEach(function (item) {
        if (item === newMenuitem) {
          item.tabIndex = 0;
          newMenuitem.focus();
        } else {
          item.tabIndex = -1;
        }
      });
    }
  }

  /**
   * focuses on first menuitem
   * @param {string} menuId unique idendifier for menu item group
   */
  setFocusToFirstMenuitem(menuId) {
    this.setFocusToMenuitem(menuId, this.__firstMenuitem[menuId]);
  }

  /**
   * focuses on last menuitem
   * @param {string} menuId unique idendifier for menu item group
   */
  setFocusToLastMenuitem(menuId) {
    this.setFocusToMenuitem(menuId, this.__lastMenuitem[menuId]);
  }

  /**
   * focuses on previous menuitem
   * @param {string} menuId unique idendifier for menu item group
   * @param {object} currentMenuitem current menuitem node
   */
  setFocusToPreviousMenuitem(menuId, currentMenuitem) {
    var newMenuitem, index;

    if (currentMenuitem === this.__firstMenuitem[menuId]) {
      newMenuitem = this.__lastMenuitem[menuId];
    } else {
      index = this.__menuitemGroups[menuId].indexOf(currentMenuitem);
      newMenuitem = this.__menuitemGroups[menuId][index - 1];
    }

    this.setFocusToMenuitem(menuId, newMenuitem);

    return newMenuitem;
  }

  /**
   * focuses on next menuitem
   * @param {string} menuId unique idendifier for menu item group
   * @param {object} currentMenuitem current menuitem node
   */
  setFocusToNextMenuitem(menuId, currentMenuitem) {
    var newMenuitem, index;

    if (currentMenuitem === this.__lastMenuitem[menuId]) {
      newMenuitem = this.__firstMenuitem[menuId];
    } else {
      index = this.__menuitemGroups[menuId].indexOf(currentMenuitem);
      newMenuitem = this.__menuitemGroups[menuId][index + 1];
    }
    this.setFocusToMenuitem(menuId, newMenuitem);

    return newMenuitem;
  }

  /**
   * focuses on menuitem by first characher
   * @param {string} menuId unique idendifier for menu item group
   * @param {object} currentMenuitem current menuitem node
   * @param {string} char first character
   */
  setFocusByFirstCharacter(menuId, currentMenuitem, char) {
    var start, index;

    char = char.toLowerCase();

    // Get start index for search based on position of currentItem
    start = this.__menuitemGroups[menuId].indexOf(currentMenuitem) + 1;
    if (start >= this.__menuitemGroups[menuId].length) {
      start = 0;
    }

    // Check remaining slots in the menu
    index = this.getIndexFirstChars(menuId, start, char);

    // If not found in remaining slots, check from beginning
    if (index === -1) {
      index = this.getIndexFirstChars(menuId, 0, char);
    }

    // If match was found...
    if (index > -1) {
      this.setFocusToMenuitem(menuId, this.__menuitemGroups[menuId][index]);
    }
  }

  // Utilities

  /**
   * given a first character, gets index of first matching menuitem
   * @param {string} menuId unique idendifier for menu item group
   * @param {number} startIndex index to start searching from
   * @param {string} char first character
   * @returns {number}
   */
  getIndexFirstChars(menuId, startIndex, char) {
    for (var i = startIndex; i < this.__firstChars[menuId].length; i++) {
      if (char === this.__firstChars[menuId][i]) {
        return i;
      }
    }
    return -1;
  }

  /**
   * determins is string is a printable character
   * @param {string} str string
   * @returns {boolean}
   */
  isPrintableCharacter(str) {
    return str.length === 1 && str.match(/\S/);
  }

  /**
   * converts node's aria-label into a valid identifier
   * @param {object} node DOM node
   * @returns {string}
   */
  getIdFromAriaLabel(node) {
    var id = node.getAttribute('aria-label');
    if (id) {
      id = id.trim().toLowerCase().replace(' ', '-').replace('/', '-');
    }
    return id;
  }

  /**
   * determines menu orientation by node's role
   * @param {object} node DOM node
   * @returns {string}
   */
  getMenuOrientation(node) {
    var orientation = node.getAttribute('aria-orientation');

    if (!orientation) {
      var role = node.getAttribute('role');

      switch (role) {
        case 'menubar':
          orientation = 'horizontal';
          break;

        case 'menu':
          orientation = 'vertical';
          break;

        default:
          break;
      }
    }

    return orientation;
  }

  /**
   * gets a node's menuId
   * @param {object} node DOM node
   * @returns {string}
   */
  getMenuId(node) {
    var id = false;
    var role = node.getAttribute('role');

    while (node && role !== 'menu' && role !== 'menubar') {
      node = node.parentNode;
      if (node) {
        role = node.getAttribute('role');
      }
    }

    if (node) {
      id = role + '-' + this.getIdFromAriaLabel(node);
    }

    return id;
  }

  /**
   * gets a menuitem's menu
   * @param {object} menuitem DOM node
   * @returns {object}
   */
  getMenu(menuitem) {
    var menu = menuitem;
    var role = menuitem.getAttribute('role');

    while (menu && role !== 'menu' && role !== 'menubar') {
      menu = menu.parentNode;
      if (menu) {
        role = menu.getAttribute('role');
      }
    }

    return menu;
  }

  // Popup menu methods

  /**
   * determines if a popup is open
   * @returns {boolean}
   */
  isAnyPopupOpen() {
    for (var i = 0; i < this.__popups.length; i++) {
      if (this.__popups[i].getAttribute('aria-expanded') === 'true') {
        return true;
      }
    }
    return false;
  }

  /**
   * sets 'data-menubar-item-expanded' attribute
   * @param {boolean} value expanded value
   */
  setMenubarDataExpanded(value) {
    this.__domNode.setAttribute('data-menubar-item-expanded', value);
  }

  /**
   * determines if menu is expanded
   * @param {boolean}
   */
  isMenubarDataExpandedTrue() {
    return this.__domNode.getAttribute('data-menubar-item-expanded') === 'true';
  }

  /**
   * opens a pop up menu
   * @param {string} menuId menu identifier
   * @param {object} menuitem DOM node
   */
  openPopup(menuId, menuitem) {
    // set aria-expanded attribute
    var popupMenu = menuitem.nextElementSibling;

    if (popupMenu) {
      var rect = menuitem.getBoundingClientRect();

      // Set CSS properties
      if (this.__isPopup[menuId]) {
        popupMenu.parentNode.style.position = 'relative';
        popupMenu.style.display = 'block';
        popupMenu.style.position = 'absolute';
        popupMenu.style.left = rect.width + 10 + 'px';
        popupMenu.style.top = '0px';
        popupMenu.style.zIndex = 100;
      } else {
        popupMenu.style.display = 'block';
        popupMenu.style.position = 'absolute';
        popupMenu.style.left = '0px';
        popupMenu.style.top = rect.height + 8 + 'px';
        popupMenu.style.zIndex = 100;
      }

      menuitem.setAttribute('aria-expanded', 'true');
      this.setMenubarDataExpanded('true');
      return this.getMenuId(popupMenu);
    }

    return false;
  }

  /**
   * closes a pop out menu
   * @param {object} menuitem DOM node
   */
  closePopout(menuitem) {
    var menu,
      menuId = this.getMenuId(menuitem),
      cmi = menuitem;

    while (this.__isPopup[menuId] || this.__isPopout[menuId]) {
      menu = this.getMenu(cmi);
      cmi = menu.previousElementSibling;
      menuId = this.getMenuId(cmi);
      menu.style.display = 'none';
    }
    cmi.focus();
    return cmi;
  }

  /**
   * closes  apop up menu
   * @param {object} menuitem DOM node
   */
  closePopup(menuitem) {
    var menu,
      menuId = this.getMenuId(menuitem),
      cmi = menuitem;

    if (this.isMenubar(menuId)) {
      if (this.isOpen(menuitem)) {
        menuitem.setAttribute('aria-expanded', 'false');
        menuitem.nextElementSibling.style.display = 'none';
      }
    } else {
      menu = this.getMenu(menuitem);
      cmi = menu.previousElementSibling;
      cmi.setAttribute('aria-expanded', 'false');
      cmi.focus();
      menu.style.display = 'none';
    }

    return cmi;
  }

  /**
   * determines if a pop up contains amenu item
   * @param {object} popup DOM node
   * @param {object} menuitem DOM node
   * @returns {boolean}
   */
  doesNotContain(popup, menuitem) {
    if (menuitem) {
      return !popup.nextElementSibling.contains(menuitem);
    }
    return true;
  }

  /**
   * closes all popup ancestors to menuitem
   * @param {object} menuitem DOM node
   */
  closePopupAll(menuitem) {
    if (typeof menuitem !== 'object') {
      menuitem = false;
    }
    for (var i = 0; i < this.__popups.length; i++) {
      var popup = this.__popups[i];
      if (this.doesNotContain(popup, menuitem) && this.isOpen(popup)) {
        var cmi = popup.nextElementSibling;
        if (cmi) {
          popup.setAttribute('aria-expanded', 'false');
          cmi.style.display = 'none';
        }
      }
    }
  }

  /**
   * determines if menuitem has pop up
   * @param {object} menuitem DOM node
   * @returns {boolean}
   */
  hasPopup(menuitem) {
    return menuitem.getAttribute('aria-haspopup') === 'true';
  }

  /**
   * determines if menuitem is open
   * @param {object} menuitem DOM node
   * @returns {boolean}
   */
  isOpen(menuitem) {
    return menuitem.getAttribute('aria-expanded') === 'true';
  }

  /**
   * determines if given id is for a menubar
   * @param {string} menuId DOM node
   * @returns {boolean}
   */
  isMenubar(menuId) {
    return !this.__isPopup[menuId] && !this.__isPopout[menuId];
  }

  /**
   * determines if menuitem is horizontal
   * @param {object} menuitem DOM node
   * @returns {boolean}
   */
  isMenuHorizontal(menuitem) {
    return this.__menuOrientation[menuitem] === 'horizontal';
  }

  /**
   * determines if menu has focus
   * @returns {boolean}
   */
  hasFocus() {
    return this.__domNode.classList.contains('focus');
  }

  // Menu event handlers

  /**
   * handles menubar focusin event
   */
  onMenubarFocusin() {
    // if the menubar or any of its menus has focus, add styling hook for hover
    this.__domNode.classList.add('focus');
  }

  /**
   * handles menubar focusout event
   */
  onMenubarFocusout() {
    // remove styling hook for hover on menubar item
    this.__domNode.classList.remove('focus');
  }

  /**
   * handles keydown event
   */
  onKeydown(event) {
    var tgt = event.currentTarget,
      key = event.key,
      flag = false,
      menuId = this.getMenuId(tgt),
      id,
      popupMenuId,
      mi;

    switch (key) {
      case ' ':
      case 'Enter':
        if (this.hasPopup(tgt)) {
          this.__openPopups = true;
          popupMenuId = this.openPopup(menuId, tgt);
          this.setFocusToFirstMenuitem(popupMenuId);
        } else {
          if (tgt.href !== '#') {
            this.closePopupAll();
            this.setMenubarDataExpanded('false');
          }
        }
        flag = true;
        break;

      case 'Esc':
      case 'Escape':
        this.__openPopups = false;
        mi = this.closePopup(tgt);
        id = this.getMenuId(mi);
        this.setMenubarDataExpanded('false');
        flag = true;
        break;

      case 'Up':
      case 'ArrowUp':
        if (this.isMenuHorizontal(menuId)) {
          if (this.hasPopup(tgt)) {
            this.__openPopups = true;
            popupMenuId = this.openPopup(menuId, tgt);
            this.setFocusToLastMenuitem(popupMenuId);
          }
        } else {
          this.setFocusToPreviousMenuitem(menuId, tgt);
        }
        flag = true;
        break;

      case 'ArrowDown':
      case 'Down':
        if (this.isMenuHorizontal(menuId)) {
          if (this.hasPopup(tgt)) {
            this.__openPopups = true;
            popupMenuId = this.openPopup(menuId, tgt);
            this.setFocusToFirstMenuitem(popupMenuId);
          }
        } else {
          this.setFocusToNextMenuitem(menuId, tgt);
        }
        flag = true;
        break;

      case 'Left':
      case 'ArrowLeft':
        if (this.isMenuHorizontal(menuId)) {
          mi = this.setFocusToPreviousMenuitem(menuId, tgt);
          if (this.isAnyPopupOpen() || this.isMenubarDataExpandedTrue()) {
            this.openPopup(menuId, mi);
          }
        } else {
          if (this.__isPopout[menuId]) {
            mi = this.closePopup(tgt);
            id = this.getMenuId(mi);
            mi = this.setFocusToMenuitem(id, mi);
          } else {
            mi = this.closePopup(tgt);
            id = this.getMenuId(mi);
            mi = this.setFocusToPreviousMenuitem(id, mi);
            this.openPopup(id, mi);
          }
        }
        flag = true;
        break;

      case 'Right':
      case 'ArrowRight':
        if (this.isMenuHorizontal(menuId)) {
          mi = this.setFocusToNextMenuitem(menuId, tgt);
          if (this.isAnyPopupOpen() || this.isMenubarDataExpandedTrue()) {
            this.openPopup(menuId, mi);
          }
        } else {
          if (this.hasPopup(tgt)) {
            popupMenuId = this.openPopup(menuId, tgt);
            this.setFocusToFirstMenuitem(popupMenuId);
          } else {
            mi = this.closePopout(tgt);
            id = this.getMenuId(mi);
            mi = this.setFocusToNextMenuitem(id, mi);
            this.openPopup(id, mi);
          }
        }
        flag = true;
        break;

      case 'Home':
      case 'PageUp':
        this.setFocusToFirstMenuitem(menuId, tgt);
        flag = true;
        break;

      case 'End':
      case 'PageDown':
        this.setFocusToLastMenuitem(menuId, tgt);
        flag = true;
        break;

      case 'Tab':
        this.__openPopups = false;
        this.setMenubarDataExpanded('false');
        this.closePopup(tgt);
        break;

      default:
        if (this.isPrintableCharacter(key)) {
          this.setFocusByFirstCharacter(menuId, tgt, key);
          flag = true;
        }
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  /**
   * handles manuitem click event
   */
  onMenuitemClick(event) {
    var tgt = event.currentTarget;
    var menuId = this.getMenuId(tgt);

    if (this.hasPopup(tgt)) {
      if (this.isOpen(tgt)) {
        this.closePopup(tgt);
      } else {
        this.closePopupAll(tgt);
        this.openPopup(menuId, tgt);
      }
      event.stopPropagation();
    } else {
      this.closePopupAll();
    }
    event.preventDefault();
  }

  /**
   * handles manuitem menuitem event
   */
  onMenuitemmenuitem(event) {
    var tgt = event.currentTarget;
    var menuId = this.getMenuId(tgt);

    if (this.hasFocus()) {
      this.setFocusToMenuitem(menuId, tgt);
    }

    if (this.isAnyPopupOpen() || this.hasFocus()) {
      this.closePopupAll(tgt);
      if (this.hasPopup(tgt)) {
        this.openPopup(menuId, tgt);
      }
    }
  }

  /**
   * handles backgroundpointerdown event
   */
  onBackgroundPointerdown(event) {
    if (!this.__domNode.contains(event.target)) {
    }
  }
}
window.customElements.define(uNavbar.tag, uNavbar);
export { uNavbar };
