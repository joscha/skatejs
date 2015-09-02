import skate from '../../../../../src/index';

export default skate('sk-page-docs-options-attribute', {
  template () {
    this.innerHTML = `
      <sk-docs-layout>
        <h2><code>options.attribute</code></h2>

        <p>A function that is called when an attribute is created, updated or removed.</p>
        <noscript is="sk-code" lang="js">
          skate('my-element', {
            attribute (name, oldvalue, newValue) {
              // Reference to the element.
              this;

              if (oldValue === null) {
                // created
              } else if (newValue === null) {
                // removed
              } else {
                // updated
              }
            }
          });
        </noscript>
        <p>
          The attribute callback has the following parameters:
          <ul>
            <li>name (String) - the name of the attribute that was created/updated or removed</li>
            <li>oldValue (String) - the old value of the attribute before the update</li>
            <li>newValue (String)- the new value of the attribute after the update</li>
          </ul>
        </p>

        <p class="notice notice-info">In native custom elements, this is not invoked for attributes that exist on the element before it is upgraded. Skate fixes that so that it <em>is</em> in fact invoked for all attributes no matter if they existed before or were added after the element was upgraded.</p>
      </sk-docs-layout>
    `;
  }
});
