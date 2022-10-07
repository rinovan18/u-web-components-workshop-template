/**
 * `uA11yStyles`
 * adds a visually hidden style for content that should be read by screenreaders but not visible
 */
import { css } from 'lit';
export const uA11yStyles = [
  css`
    .visually-hidden {
      position: absolute;
      left: -9999999px;
      width: 0;
      height: 0;
    }
  `,
];