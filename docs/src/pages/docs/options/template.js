import skate from '../../../../../src/index';

export default skate('sk-page-docs-options-template', {
  template () {
    this.innerHTML = `
      <sk-docs-layout>
        <h2><code>options.template</code></h2>

        <p>Called during the created lifecycle before the <code>created</code> callback is invoked. Since the template function is just a callback and it's up to you how you template the element, you can use any templating engine that you want.</p>
        <noscript is="sk-code" lang="js">
          skate('my-element', {
            template () {
              this.innerHTML = 'something';
            }
          });
        </noscript>

        <p>
          In the <code>template</code> callback <code>this</code> refers to the component's <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element"> element</a>.
        </p>

        <h3>Handlebars</h3>

        <noscript is="sk-code" lang="js">
          skate('my-element', {
            template () {
              var compiled = Handlebars.compile('<p>Hello, {{ name }}!</p>');
              this.innerHTML = compiled(this);
            }
          });
        </noscript>

        <p>A good way to reuse a template function is to simply create a function that takes a string and returns a function that templates that string onto the element. You could rewrite the above example to be reusable very easily:</p>
        <noscript is="sk-code" lang="js">
          function handlebarify (html) {
            var compiled = Handlebars.compile(html);
            return function () {
              this.innerHTML = compiled(this);
            };
          }

          skate('my-element', {
            template: handlebarify('<p>Hello, {{name}}!</p>')
          });
        </noscript>



        <h3>Shadow DOM</h3>

        <p>If you wanted to fully embrace Web Components, you could even use Shadow DOM:</p>
        <noscript is="sk-code" lang="js">
          function shadowify (html) {
            return function () {
              this.createShadowRoot().innerHTML = html;
            };
          }

          skate('my-element', {
            template: shadowify('<p>Hello, <content></content>!</p>')
          });
        </noscript>



        <h3>Virtual DOM</h3>

        <p>You could also use a virtual DOM implementation - such as <a href="https://github.com/Matt-Esch/virtual-dom">virtual-dom</a> - here if you wanted to.</p>
        <noscript is="sk-code" lang="js">
          import createElement from './path/to/virtual-dom/create-element';

          function createVdomTree (props) {
            // Return your Virtual DOM tree.
          }

          skate('my-element', {
            template () {
              var tree = createVdomTree(this);
              var root = createElement(tree);

              // Initial render.
              this.appendChild(root);
            }
          });
        </noscript>



        <h3>Responding to Component Changes</h3>

        <p>If you want to re-render your component when properties change, you can listen to the <code>skate.property</code> event triggered by defined properties.</p>
        <p>With Handlebars you might do something like:</p>
        <noscript is="sk-code" lang="js">
          skate('my-element', {
            template () {
              var render = handlebarify('<p>Hello, {{name}}!</p>');
              this.addEventListener('skate.property', render);
              render.call(this);
            }
          });
        </noscript>

        <p>If you're using Virtual DOM you might do something like:</p>
        <noscript is="sk-code" lang="js">
          import createElement from './path/to/virtual-dom/create-element';
          import diff from './path/to/virtual-dom/diff';
          import patch from './path/to/virtual-dom/patch';

          function createVdomTree (props) {
            // Return your Virtual DOM tree.
          }

          skate('my-element', {
            template () {
              var tree = createVdomTree(this);
              var root = createElement(tree);

              // Initial render.
              this.appendChild(root);

              // Subsequent renders.
              this.addEventListener('skate.property', function () {
                var newTree = createVdomTree(this);
                root = patch(root, diff(tree, newTree));
                tree = newTree;
              });
            }
          });
        </noscript>
      </sk-docs-layout>
    `;
  }
});
