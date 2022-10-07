import { LitElement, css, html, svg } from 'lit';
import { uA11yStyles } from './u-a11y-styles.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

/**
 * `u-alerts`
 * is a an alert banner that can be expanded for more information
 *
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element u-alerts
 */
class uAlerts extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return 'u-alerts';
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
          background-color: #cfeceb;
          color: #000321;
          position: relative;
          overflow: hidden;
        }
        [hidden] {
          display: none!important;
        }
        #container {
          position: relative;
          margin: 0 auto;
          max-width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          justify-items: flex-start;
          flex-direction: row;
        }
        #date {
          flex: 0 12%;
          max-width: 12%;
          text-align: right;
          font-weight: 700;
          box-sizing: border-box;
          margin-top: 1rem;
          text-transform: uppercase;
        }
        .wrap {
          display: inline-block;
          flex: 0 4.5%;
          max-width: 4.5%;
          position: relative;
          margin: 0;
          padding: 0;
        }
        #message {
          background-color: #fff;
          flex: 0 70%;
          max-width: 70%;
          align-items: center;
          justify-content: normal;
          height: auto;
          display: flex;
          padding: 0;
        }
        #text {
          font-size: 1.125rem;
          font-style: italic;
          line-height: 1.25rem;
          overflow-wrap: break-word;
          padding: 1rem;
          width: 85%;
          font-weight: 700;
          letter-spacing: .03rem;
        }
        #message a {
          color: #000321;
        }
        #alert-icon {
          width: 5em;
          height: 5em;
        }
        .alert-icon > svg,
        .wrap > svg {
          fill: #fff;
          position: absolute;
          top: auto;
          bottom: 0;
          margin: 0;
          padding: 0;
          max-height: 100%;
          width: 100%;
          height: 100%;
          max-width: 100%;
        }
        button {
          display: flex;
          float: right;
          position: relative;
          top: 0;
          border: none;
          background-color: transparent;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 700;
          font-style: italic;
          letter-spacing: .03rem;
          line-height: 1.125rem;
          text-transform: uppercase;
          float: none;
          align-items: center;
          justify-content: space-between;
          margin: 0.25em;
        }
        #collapse {
          flex: 0 9%;
          max-width: 9%;
          padding-right: 0;
          margin-top: 1rem;
        }
        #expand:before,
        #expand:after {
          content: ' ';
          margin: 0.25em;
          aspect: 1/1;
          width: 1.5em;
          height: 1.5em;
          background-repeat: no-repeat;
          background-position-x: 100%;
        }
        #alert-icon:before,
        #expand:before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' preserveAspectRatio='xMidYMid meet' focusable='false' style='pointer-events: none; display: block; width: 100%25; height: 100%25;'%3E%3Cg%3E%3Cpath d='M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
        }
        #expand:after {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' preserveAspectRatio='xMidYMid meet' focusable='false' style='pointer-events: none; display: block; width: 100%25; height: 100%25;'%3E%3Cg%3E%3Cpath d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
        }
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
      /**
       * actual alert data
       */
      alert: {
        type: Object,
      },
    };
  }
  /**
   * Called when element is created and also when
   * custom element is loaded after element is already in DOM.
   * Useful for setting initial property values.
   */
  constructor() {
    //make sure anything it extended from lit runs
    super();
    this.alert = {};
    //determine campus by window.location
    let path = window.location.pathname.split('/');

    /**
     * in the real world this would access a university alerts system
     */
    fetch('/_services/u-alerts-system.json')
      .then((response) => {
        if (response && response.json) return response.json();
        return false;
      })
      .then((json) => {
        this.alert = json && path[1] && json[path[1]] ? json[path[1]] : {};
        Object.keys(this.alert).forEach(
          (key) => (this.alert[key] = unsafeHTML(this.alert[key]))
        );
      });
  }

  /**
   * template used to render HTML in shadowDOM
   */
  render() {
    return !this.alert || !this.message
      ? ''
      : html`
       <div class="visually-hidden">COVID-19 INFO. Alert</div>
        <p class="visually-hidden">
          This dialog contains the "${
            this.title
          }" alert message for the Penn State community.
        </p>
        <div id="container" role="alert" aria-live="assertive">
          ${
            this.expanded
              ? html`
            <div class="date"></div>
            <div class="wrap">${this.leftAngle}</div>
            <div id="message">
              <div id="alert-icon">${this.alertIcon}</div>
              <div id="text">${this.message}</div>
            </div>
            <div class="wrap">${this.rightAngle}</div>
            <button id="collapse" @click="${(e) =>
              (this.expanded = false)}">Close</button>
          `
              : html`
          <button id="expand" @click="${(e) => (this.expanded = true)}">${
                  this.title
                }</button>
          `
          }
        </div>`;
  }

  /**
   * title for location-specific alert
   * @returns {string}
   */
  get title() {
    return this.alert && this.alert.title ? this.alert.title : 'Important Info';
  }

  /**
   * message text for location-specific alert
   * @returns {string}
   */
  get message() {
    return this.alert && this.alert.message ? this.alert.message : false;
  }

  /**
   * svg template for left side of alert
   * @returns {object}
   */
  get leftAngle() {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.625 132.493" preserveAspectRatio="none" aria-hidden="true">
        <path id="Path_4283" data-name="Path 4283" d="M-13525.965,2373.5V2241.005h-51.625l31.835,82.837-22.107,21.054h30.465Z" transform="translate(13577.59 -2241.005)"></path>
      </svg>`;
  }

  /**
   * svg template for right side of alert
   * @returns {object}
   */
  get rightAngle() {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.617 132.499" preserveAspectRatio="none" aria-hidden="true">
        <path id="Path_4279" data-name="Path 4279" d="M-13342.965,2541.5h-51.617V2409Z" transform="translate(13394.582 -2409)"></path>
      </svg>`;
  }

  /**
   * svg for alert icon
   * @returns {object}
   */
  get alertIcon() {
    return svg`
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <g>
          <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
        </g>
      </svg>`;
  }
}
window.customElements.define(uAlerts.tag, uAlerts);
export { uAlerts };
