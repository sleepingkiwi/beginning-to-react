// entry point for client side rendering

/** static assets
 *  -------------
 *  assets which are referenced in our HTML template.
 *  webpack is configured so that assets imported from /public/root are not renamed
 *  so our HTML template is safe using <link rel="manifest" href="manifest.json">
**/
import 'Public/root/manifest.json';
import 'Public/root/robots.txt';

/** stylesheets
 *  -----------
 *  globals.scss:
 *    default styles, normalisation etc.
**/
import 'Shared/styles/globals.scss';

  /** vendor imports
   *  --------------
  **/
import React from 'react';
import { render } from 'react-dom';

  /** components
   *  ----------
  **/
import Example from 'Shared/components/Example/Example';

const App = () => (
  <Example />
);

render(<App />, document.getElementById('app'));
