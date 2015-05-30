(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../lifecycle/attached', '../lifecycle/created', '../lifecycle/detached', '../util/get-closest-ignored-element', '../globals', './mutation-observer', './registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../lifecycle/attached'), require('../lifecycle/created'), require('../lifecycle/detached'), require('../util/get-closest-ignored-element'), require('../globals'), require('./mutation-observer'), require('./registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.attached, global.created, global.detached, global.getClosestIgnoredElement, global.globals, global.MutationObserver, global.registry, global.walkTree);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _lifecycleAttached, _lifecycleCreated, _lifecycleDetached, _utilGetClosestIgnoredElement, _globals, _mutationObserver, _registry, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _attached = _interopRequireDefault(_lifecycleAttached);

  var _created = _interopRequireDefault(_lifecycleCreated);

  var _detached = _interopRequireDefault(_lifecycleDetached);

  var _getClosestIgnoredElement = _interopRequireDefault(_utilGetClosestIgnoredElement);

  var _globals2 = _interopRequireDefault(_globals);

  var _MutationObserver = _interopRequireDefault(_mutationObserver);

  var _registry2 = _interopRequireDefault(_registry);

  var _walkTree = _interopRequireDefault(_utilWalkTree);

  function documentObserverHandler(mutations) {
    var mutationsLen = mutations.length;

    for (var a = 0; a < mutationsLen; a++) {
      var mutation = mutations[a];
      var addedNodes = mutation.addedNodes;
      var removedNodes = mutation.removedNodes;

      // Since siblings are batched together, we check the first node's parent
      // node to see if it is ignored. If it is then we don't process any added
      // nodes. This prevents having to check every node.
      if (addedNodes && addedNodes.length && !(0, _getClosestIgnoredElement['default'])(addedNodes[0].parentNode)) {
        (0, _walkTree['default'])(addedNodes, function (element) {
          var components = _registry2['default'].getForElement(element);
          var componentsLength = components.length;

          for (var _a = 0; _a < componentsLength; _a++) {
            (0, _created['default'])(components[_a]).call(element);
          }

          for (var _a2 = 0; _a2 < componentsLength; _a2++) {
            (0, _attached['default'])(components[_a2]).call(element);
          }
        });
      }

      // We can't check batched nodes here because they won't have a parent node.
      if (removedNodes && removedNodes.length) {
        (0, _walkTree['default'])(removedNodes, function (element) {
          var components = _registry2['default'].getForElement(element);
          var componentsLength = components.length;

          for (var _a3 = 0; _a3 < componentsLength; _a3++) {
            (0, _detached['default'])(components[_a3]).call(element);
          }
        });
      }
    }
  }

  function createDocumentObserver() {
    var observer = new _MutationObserver['default'](documentObserverHandler);

    observer.observe(document, {
      childList: true,
      subtree: true
    });

    return observer;
  }

  module.exports = _globals2['default'].registerIfNotExists('observer', {
    observer: undefined,
    register: function register() {
      if (!this.observer) {
        _MutationObserver['default'].fixIe();
        this.observer = createDocumentObserver();
      }

      return this;
    },
    unregister: function unregister() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = undefined;
      }

      return this;
    }
  });
});