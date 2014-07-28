[![Build Status](https://travis-ci.org/skatejs/skatejs.png?branch=master)](https://travis-ci.org/skatejs/skatejs)

Skate
=====

Skate is a web component library that allows you to define behaviour for elements without worrying about when that element is inserted into the DOM.

HTML

    <my-component></my-component>

JavaScript

    skate('my-component', {
      ready: function (element) {
        element.textContent = 'Hello, World!';
      }
    });

Result

    <my-component>Hello, World!</my-component>

Compatibility
-------------

IE9+ and all evergreens.

Installing
----------

You can install Skate using Bower or by downloading the source from the repository.

    bower install skatejs

### AMD

Skate supports AMD if detected and is registered as an anonymous module.

### Global

If you're still skating old school, we've got you covered. Just make sure it's included on the page and you can access it via `window.skate`.

Docs
----

You define a component by calling `skate()` and passing it your component ID and a definition. The ID you speicfy corresponds to one of the following:

- Tag name
- Value of the `is` attribute
- Attribute name
- Class name

The definition is an object of options defining your component.

  	skate('my-component', {
      // Called before the element is displayed. This can be made asynchronous
      // by defining a second argument in the method signature. You would then
      // call that argument as a function to tell the component it's ok to
      // proceed with its lifecycle. If the second argument is not provided, it
      // is assumed everything in the callback is synchronous.
  	  ready: function (element, done) {

  	  },

      // Called after the element is displayed.
  	  insert: function (element) {

  	  },

      // Called after the element is removed.
  	  remove: function (element) {

  	  },

  	  // Attribute callbacks that get triggered when attributes on the main web
      // component are inserted, updated or removed. Each callback gets the
      // element that the change occurred on and the corresponding changes. The
      // change object contains the following information:
      //
      // - type: The type of modification (insert, update or remove).
      // - name: The attribute name.
      // - newValue: The new value. If inserted, this will be undefined.
      // - oldValue: The old value. If removed, this will be undefined.
      attributes: {
      	'my-attribute': {
      	  insert: function (element, change) {

      	  },

      	  update: function (element, change) {

          },

      	  remove: function (element, change) {

          }
      	}
      },

      // The event handlers to bind to the web component element. If the event
      // name is followed by a space and a CSS selector, the handler is only
      // triggered if a child matching the selector triggered the event. This is
      // synonymous with Backbone's style of event binding in its views.
      events: {
        'click': function (element, eventObject) {

        },

        'click .some-child-selector': function (element, eventObject) {

        }
      },

      // Properties and methods to add to each element instance. It's notable
      // that the element's prototype is not modified. These are added after the
      // element is instantiated. Since the methods and properties are applied to
      // the element, `this` inside a method will refer to the element.
      prototype: {
        callMeLikeAnyNativeMethod: function () {

        }
      },

      // By default, Skate ships with a default templating mechanism that is
      // similar to ShadowDOM templating. This is explained later in the
      // templating section.
      template: '<article><h3 data-skate-content=".heading"></h3><section data-skate-content></section></article>',

      // The binding methods this component supports. For example, if you specify
      // the `type` as `skate.types.TAG`, then the component will only be bound
      // to an element whos tag name matches the component ID.
      //
      // - `ANY` Any type of binding. This is the default.
      // - `TAG` Tag name only.
      // - `ATTR` Attribute names.
      // - `CLASS` Class names.
      // - `NOTAG` Attribute or class names.
      // - `NOATTR` Class or tag names.
      // - `NOCLASS` Attribute or tag names.
      type: skate.types.ANY,

      // This is the class name that is added to the web component in order to
      // display it in the DOM after the `ready` callback is invoked.
      classname: '__skate',
  	});

### Component Lifecycle

The component lifecycle consists of three callbacks:

1. `ready` Called before the element is displayed.
2. `insert` Called after the element is displayed.
3. `remove` Called after the element is removed.

The `ready` callback can be made asynchronous by specifying a second argument in the callback. If this argument is found, it will pass a callback to it which when called will cause the lifecycle to continue by displaying the element and then calling the `insert` callback.

	skate('my-component', {
	  ready: function (element, done) {
	  	doSomethingAsync().then(done);
	  }
	});

Without full web-component support, we can only emulate the `ready` callback to ensure the element is hidden by inserting a CSS rule that matches the element based on its component type. That being the case, it is best to define your components as early as possible so that Skate can make sure there is a CSS rule to hide it before it ever exists in the DOM.

It is possible to render the entire DOM tree and then define your components, however, this is not recommended for several reasons:

- Skate must scour the entire DOM tree for components to process (this is faster than `querySelectorAll` in large DOMs). It attempts to minmise the impact of subsequent `skate()` by debouncing the initialisation process.
- If you have any elements in the DOM already and the component adds CSS rules to ensure the component elements are hidden until augmented, these elements may disappear and then reappear after they have been processed.

### Attribute Lifecycle

An attribute lifecycle definition can take three forms. First, it emulates something similar to what we see in the Web Component spec:

    skate('my-component', {
      attributes: function (element, change) {

      }
    });

A notable difference, though, is that this callback gets called for attributes that already exist on the element as this is more predictable. This also allows you to have initialisation code for attributes, rather than forcing the developer to do this in one of the lifecycle callbacks.

This is called for each attribute on an element when:

- An element is inserted with attributes already on it.
- Attributes are added to an element.
- Attributes are modified.
- Attributes are removed.

The second form of a callback takes an object of attribues and handlers.

    skate('my-component', {
      attributes: {
        'my-attribute-name': function handleInsertAndUpdate (element, change) {

        }
      }
    });

This allows you to specify which attributes you want to listen to and will call the specified function when it when:

- A processed element is inserted with the corresponding attribute already on it.
- The corresponding attribute is added to the processed element.
- The corresponding attribute is updated on the processed element.

The third form gives you more granularity and flexibility, and is the same form that the example component at the top takes:

	skate('my-component', {
	  attributes: {
	  	insert: function (element, change) {

	  	},

	  	update: function (element, change) {

	  	},

	  	remove: function (element, change) {

	  	}
	  }
	});

The `insert` handler gets called when:

- A processed element is inserted with the corresponding attribute already on it.
- The corresponding attribute is added to the processed element.

The `update` handler gets called when:

- The corresponding attribute is updated on the processed element.

The `remove` handler gets called when:

- The corresponding attribute is removed from the processed element.

### Event Binding

Event binding allows you to declare which events you want to listen for and also offers you the ability to use event delegation, Backbone style.

As we saw above:

    skate('my-component', {
      events: {
        'click': function (element, eventObject) {

        },

        'click .some-child-selector': function (element, eventObject) {

        }
      }
    });

The first `click` handler gets executed whenever the component receives a click event regardless of what triggered it. The second `click .some-child-selector` handler gets executed only when it receives a click event that came from a descendant matching the `.some-child-selector` selector.

Events listeners are not automatically removed from the element when it is removed from the DOM. This is because Skate does not know if you intend to re-insert the element back into the DOM. Skate leaves it up to you and the JavaScript engine's garbage collector to manage this.

### Prototype Extending

Skate gives you the option to specify custom properties and methods on your component.

	skate('my-component', {
	  prototype: {
        callMeLikeAnyNativeMethod: function () {

        }
      }
	});

These members are applied directly to the element instance that your component is bound to so you can do stuff like this:

	document.getElementById('my-component-id').callMeLikeanyNativeMethod();

It's important to understand that the `Element.prototype` is not modified as part of this process.

### Templating

A simple templating engine is bundled with Skate. It gives you the ability to use templates similar to that of what you can do with Shadow DOM templating. It does not polyfill any sort of Shadow DOM behaviour, however.

As we saw above:

	skate('my-component', {
	  template: '<article><h3 data-skate-content=".heading"></h3><section data-skate-content><p>There is no content to display.</p></section></article>'
	});

We can now insert our component into the DOM:

    <my-component>
      <span class="heading">My Heading</span>
      <p>First paragraph.</p>
      <p>Second paragraph.</p>
    </my-component>

And the built-in templating engine would transform this into:

	<my-component>
	  <article>
	  	<h3 data-skate-content=".heading"><span class="heading">My Heading</span></h3>
	  	<section data-skate-content>
          <p>First paragraph.</p>
          <p>Second paragraph.</p>
	  	</section>
	  </article>
	</my-component>

This is very similar to what the Shadow DOM allows you to do with `<content>` tags and its `select` attribute but without the problems that come with attempting to polyfill it.

Additionally, if both paragraphs were removed from the `<section>`, the default content that we specified in the template definition would take their place:

	<my-component>
	  <article>
	  	<h3 data-skate-content=".heading">
	  		<span class="heading">My Heading</span>
	  	</h3>
	  	<section data-skate-content>
          <p>There is no content to display.</p>
	  	</section>
	  </article>
	</my-component>

If you decide you want to put some content back in, then it will remove the default content in favour of the content you specify.

License
-------

The MIT License (MIT)

Copyright (c) 2014 Trey Shugart

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/treshugart/skate/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
