import { LitElement, svg, css, html } from 'lit';
import { uMarkPaths } from './u-mark-paths';

/**
 * `u-mark`
 * is a basic button for rich text editor (custom buttons can extend RichTextEditorButtonBehaviors)
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element u-mark
 */
class UMark extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return 'u-mark';
  }

  /**
   * array of CSS styles to be attached to shadowDOM
   */
  static get styles() {
    return [
      css`
        :host {
            display: inline-block;
            width: 150px;
        }

        [hidden] {
            display: none!important;
        }
        a, svg {
          width: 100%;
        }
        @media (min-width: 400px) {
          width: 250px;
        }
    `,
    ];
  }

  static get properties() {
    return {
      /* TODO: SLIDE 71 */
      /* TODO: SLIDE 72 */
    };
  }

  /**
   * template used to render HTML in shadowDOM
   */
  render() {
    return html`<a href="${this.locationData[this.location || 'psu']?.href}}">${
      this.svg
    }</a><slot hidden></slot>`;
  }

  /**
   * Called when element is created and also when
   * custom element is loaded after element is already in DOM.
   * Useful for setting initial property values.
   */
  constructor() {
    //make sure anything it extended from lit runs
    super();
    this.grayscale = false;
    this.invert = false;
    this.location = 'psu';
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName == 'location') this.requestUpdate();
    });
  }

  get svgData() {
    return this.locationData[this.location] || this.locationData['psu'];
  }

  /**
   * template for SVG to render in shadow DOM
   * @param {string} location
   * @returns {object}
   */
  get svg() {
    return svg`
      <svg 
        id="university-mark${
          this.location !== 'psu' ? `-${this.location}` : ''
        }"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="${this.svgData?.viewbox}" 
        aria-labelledby="u-title u-desc">
        <title id="u-title">${this.svgData?.text}</title>
        <desc id="u-desc">Nittany lion shield mark</desc>
        <defs>
          <style>
            .shield-lightest {
              fill:#fff;
            }
            .text,
            .shield-darkest{
              fill:#1e407c;
            }
            .shield-shadow {
              fill:#96bee6;
            }
            /* TODO: SLIDE 74 */
          </style>
        </defs>
        <!-- TODO: SLIDE 73.1 -->
        <path 
          class="shield-lightest" 
          d="${uMarkPaths.light}"/>
        <path 
          class="shield-darkest" 
          d="${uMarkPaths.dark}"/>
        <path 
          class="shield-shadow" 
          d="${uMarkPaths.shadow}"/>
        <!-- TODO: SLIDE 73.2 -->
        <path 
          class="text" 
          d="${this.svgData?.path}"/>
        </svg>
      `;
  }

  /**
   * campus or college-specific data for mark
   */
  get locationData() {
    return {
      psu: {
        text: 'Penn State',
        href: '//psu.edu',
        viewbox: '0 0 259.48 81.66',
        path: uMarkPaths.psu,
      },
      altoona: {
        text: 'Penn State Altoona',
        href: '//altoona.psu.edu',
        viewbox: '0 0 259.48 81.66',
        path: uMarkPaths.altoona,
      },
      arts: {
        text: 'Penn State College of Arts and Architecture',
        href: '//arts.psu.edu',
        viewbox: '0 0 284.35 92',
        path: uMarkPaths.arts,
      },
      wc: {
        text: 'Penn State World Campus',
        href: '//worldcampus.psu.edu',
        viewbox: '0 0 259.91 81.66',
        path: uMarkPaths.wc,
      },
    };
  }
}
window.customElements.define(UMark.tag, UMark);
export { UMark };
