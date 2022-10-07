import { Toast } from 'bootstrap';
import { LitElement, css, html } from 'lit';

/**
 * `u-toast`
 * a toast component to pop up with messages
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element u-toast
 */
class uToast extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return 'u-toast';
  }

  /**
   * array of CSS styles to be attached to shadowDOM
   */
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          overflow: visible;
          position: sticky;
          bottom: 3px;
          font-size: 80%;
        }
        [hidden] {
          display: none!important;
        }
        .toast-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 700;
          text-transform: uppercase;
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * toast header content
       */
      header: {
        type: String,
      },
      /**
       * toast body content
       */
      body: {
        type: String,
      },
    };
  }

  /**
   * template used to render HTML in shadowDOM
   */
  render() {
    return html`<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
      
      <div ?hidden="${!this
        .header}" class="toast-container position-absolute bottom-0 end-0 p-3">
        <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            ${this.header}
            <button type="button" class="btn-close" @click="${
              this.hide
            }" aria-label="Close"></button>
          </div>
          ${!this.body ? '' : html`<div class="toast-body">${this.body}</div>`}
          
        </div>
      </div>
     `;
  }

  /**
   * Called when element is created and also when
   * custom element is loaded after element is already in DOM.
   * Useful for setting initial property values.
   */
  constructor() {
    //make sure anything it extended from lit runs
    super();
  }

  /**
   * displays toast
   * @param {string} header toast header
   * @param {string} body toast body
   */
  show(header, body) {
    if (!!header && !!this.shadowRoot) {
      this.header = header;
      this.body = body;
      let toastContent = this.shadowRoot.querySelector('#liveToast');
      this._toast = !!toastContent ? new Toast(toastContent) : false;
      if (this._toast) this._toast.show();
    }
  }
  /**
   * hides toast
   */
  hide() {
    this._open = false;
    if (this._toast) this._toast.hide();
    this.header = undefined;
    this.body = undefined;
  }
}
window.customElements.define(uToast.tag, uToast);
export { uToast };
