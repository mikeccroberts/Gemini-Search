import {
  require_react
} from "./chunk-3TFVT2CW.js";
import {
  __commonJS,
  __toESM
} from "./chunk-4MBMRILA.js";

// node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
var require_use_sync_external_store_shim_development = __commonJS({
  "node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var React2 = require_react();
        var ReactSharedInternals = React2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var useState2 = React2.useState, useEffect2 = React2.useEffect, useLayoutEffect2 = React2.useLayoutEffect, useDebugValue = React2.useDebugValue;
        var didWarnOld18Alpha = false;
        var didWarnUncachedGetSnapshot = false;
        function useSyncExternalStore2(subscribe, getSnapshot, getServerSnapshot) {
          {
            if (!didWarnOld18Alpha) {
              if (React2.startTransition !== void 0) {
                didWarnOld18Alpha = true;
                error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release.");
              }
            }
          }
          var value = getSnapshot();
          {
            if (!didWarnUncachedGetSnapshot) {
              var cachedValue = getSnapshot();
              if (!objectIs(value, cachedValue)) {
                error("The result of getSnapshot should be cached to avoid an infinite loop");
                didWarnUncachedGetSnapshot = true;
              }
            }
          }
          var _useState = useState2({
            inst: {
              value,
              getSnapshot
            }
          }), inst = _useState[0].inst, forceUpdate = _useState[1];
          useLayoutEffect2(function() {
            inst.value = value;
            inst.getSnapshot = getSnapshot;
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
          }, [subscribe, value, getSnapshot]);
          useEffect2(function() {
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
            var handleStoreChange = function() {
              if (checkIfSnapshotChanged(inst)) {
                forceUpdate({
                  inst
                });
              }
            };
            return subscribe(handleStoreChange);
          }, [subscribe]);
          useDebugValue(value);
          return value;
        }
        function checkIfSnapshotChanged(inst) {
          var latestGetSnapshot = inst.getSnapshot;
          var prevValue = inst.value;
          try {
            var nextValue = latestGetSnapshot();
            return !objectIs(prevValue, nextValue);
          } catch (error2) {
            return true;
          }
        }
        function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
          return getSnapshot();
        }
        var canUseDOM2 = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
        var isServerEnvironment = !canUseDOM2;
        var shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore2;
        var useSyncExternalStore$2 = React2.useSyncExternalStore !== void 0 ? React2.useSyncExternalStore : shim;
        exports.useSyncExternalStore = useSyncExternalStore$2;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/use-sync-external-store/shim/index.js
var require_shim = __commonJS({
  "node_modules/use-sync-external-store/shim/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_use_sync_external_store_shim_development();
    }
  }
});

// node_modules/regexparam/dist/index.mjs
function parse(input, loose) {
  if (input instanceof RegExp) return { keys: false, pattern: input };
  var c, o, tmp, ext, keys = [], pattern = "", arr = input.split("/");
  arr[0] || arr.shift();
  while (tmp = arr.shift()) {
    c = tmp[0];
    if (c === "*") {
      keys.push(c);
      pattern += tmp[1] === "?" ? "(?:/(.*))?" : "/(.*)";
    } else if (c === ":") {
      o = tmp.indexOf("?", 1);
      ext = tmp.indexOf(".", 1);
      keys.push(tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length));
      pattern += !!~o && !~ext ? "(?:/([^/]+?))?" : "/([^/]+?)";
      if (!!~ext) pattern += (!!~o ? "?" : "") + "\\" + tmp.substring(ext);
    } else {
      pattern += "/" + tmp;
    }
  }
  return {
    keys,
    pattern: new RegExp("^" + pattern + (loose ? "(?=$|/)" : "/?$"), "i")
  };
}

// node_modules/wouter/esm/react-deps.js
var React = __toESM(require_react(), 1);
var import_react = __toESM(require_react(), 1);
var import_shim = __toESM(require_shim(), 1);
var useBuiltinInsertionEffect = React["useInsertionEffect"];
var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
var useIsomorphicLayoutEffect = canUseDOM ? React.useLayoutEffect : React.useEffect;
var useInsertionEffect2 = useBuiltinInsertionEffect || useIsomorphicLayoutEffect;
var useEvent = (fn) => {
  const ref = React.useRef([fn, (...args) => ref[0](...args)]).current;
  useInsertionEffect2(() => {
    ref[0] = fn;
  });
  return ref[1];
};

// node_modules/wouter/esm/use-browser-location.js
var eventPopstate = "popstate";
var eventPushState = "pushState";
var eventReplaceState = "replaceState";
var eventHashchange = "hashchange";
var events = [
  eventPopstate,
  eventPushState,
  eventReplaceState,
  eventHashchange
];
var subscribeToLocationUpdates = (callback) => {
  for (const event of events) {
    addEventListener(event, callback);
  }
  return () => {
    for (const event of events) {
      removeEventListener(event, callback);
    }
  };
};
var useLocationProperty = (fn, ssrFn) => (0, import_shim.useSyncExternalStore)(subscribeToLocationUpdates, fn, ssrFn);
var currentSearch = () => location.search;
var useSearch = ({ ssrSearch = "" } = {}) => useLocationProperty(currentSearch, () => ssrSearch);
var currentPathname = () => location.pathname;
var usePathname = ({ ssrPath } = {}) => useLocationProperty(
  currentPathname,
  ssrPath ? () => ssrPath : currentPathname
);
var navigate = (to, { replace = false, state = null } = {}) => history[replace ? eventReplaceState : eventPushState](state, "", to);
var useBrowserLocation = (opts = {}) => [usePathname(opts), navigate];
var patchKey = Symbol.for("wouter_v3");
if (typeof history !== "undefined" && typeof window[patchKey] === "undefined") {
  for (const type of [eventPushState, eventReplaceState]) {
    const original = history[type];
    history[type] = function() {
      const result = original.apply(this, arguments);
      const event = new Event(type);
      event.arguments = arguments;
      dispatchEvent(event);
      return result;
    };
  }
  Object.defineProperty(window, patchKey, { value: true });
}

// node_modules/wouter/esm/index.js
var _relativePath = (base, path) => !path.toLowerCase().indexOf(base.toLowerCase()) ? path.slice(base.length) || "/" : "~" + path;
var baseDefaults = (base = "") => base === "/" ? "" : base;
var absolutePath = (to, base) => to[0] === "~" ? to.slice(1) : baseDefaults(base) + to;
var relativePath = (base = "", path) => _relativePath(unescape(baseDefaults(base)), unescape(path));
var stripQm = (str) => str[0] === "?" ? str.slice(1) : str;
var unescape = (str) => {
  try {
    return decodeURI(str);
  } catch (_e) {
    return str;
  }
};
var sanitizeSearch = (search) => unescape(stripQm(search));
var defaultRouter = {
  hook: useBrowserLocation,
  searchHook: useSearch,
  parser: parse,
  base: "",
  // this option is used to override the current location during SSR
  ssrPath: void 0,
  ssrSearch: void 0,
  // customizes how `href` props are transformed for <Link />
  hrefs: (x) => x
};
var RouterCtx = (0, import_react.createContext)(defaultRouter);
var useRouter = () => (0, import_react.useContext)(RouterCtx);
var Params0 = {};
var ParamsCtx = (0, import_react.createContext)(Params0);
var useParams = () => (0, import_react.useContext)(ParamsCtx);
var useLocationFromRouter = (router) => {
  const [location2, navigate2] = router.hook(router);
  return [
    relativePath(router.base, location2),
    useEvent((to, navOpts) => navigate2(absolutePath(to, router.base), navOpts))
  ];
};
var useLocation = () => useLocationFromRouter(useRouter());
var useSearch2 = () => {
  const router = useRouter();
  return sanitizeSearch(router.searchHook(router));
};
var matchRoute = (parser, route, path, loose) => {
  const { pattern, keys } = route instanceof RegExp ? { keys: false, pattern: route } : parser(route || "*", loose);
  const result = pattern.exec(path) || [];
  const [$base, ...matches] = result;
  return $base !== void 0 ? [
    true,
    (() => {
      const groups = keys !== false ? Object.fromEntries(keys.map((key, i) => [key, matches[i]])) : result.groups;
      let obj = { ...matches };
      groups && Object.assign(obj, groups);
      return obj;
    })(),
    // the third value if only present when parser is in "loose" mode,
    // so that we can extract the base path for nested routes
    ...loose ? [$base] : []
  ] : [false, null];
};
var useRoute = (pattern) => matchRoute(useRouter().parser, pattern, useLocation()[0]);
var Router = ({ children, ...props }) => {
  var _a, _b;
  const parent_ = useRouter();
  const parent = props.hook ? defaultRouter : parent_;
  let value = parent;
  const [path, search] = ((_a = props.ssrPath) == null ? void 0 : _a.split("?")) ?? [];
  if (search) props.ssrSearch = search, props.ssrPath = path;
  props.hrefs = props.hrefs ?? ((_b = props.hook) == null ? void 0 : _b.hrefs);
  let ref = (0, import_react.useRef)({}), prev = ref.current, next = prev;
  for (let k in parent) {
    const option = k === "base" ? (
      /* base is special case, it is appended to the parent's base */
      parent[k] + (props[k] || "")
    ) : props[k] || parent[k];
    if (prev === next && option !== next[k]) {
      ref.current = next = { ...next };
    }
    next[k] = option;
    if (option !== parent[k]) value = next;
  }
  return (0, import_react.createElement)(RouterCtx.Provider, { value, children });
};
var h_route = ({ children, component }, params) => {
  if (component) return (0, import_react.createElement)(component, { params });
  return typeof children === "function" ? children(params) : children;
};
var useCachedParams = (value) => {
  let prev = (0, import_react.useRef)(Params0), curr = prev.current;
  for (const k in value) if (value[k] !== curr[k]) curr = value;
  if (Object.keys(value).length === 0) curr = value;
  return prev.current = curr;
};
var Route = ({ path, nest, match, ...renderProps }) => {
  const router = useRouter();
  const [location2] = useLocationFromRouter(router);
  const [matches, routeParams, base] = (
    // `match` is a special prop to give up control to the parent,
    // it is used by the `Switch` to avoid double matching
    match ?? matchRoute(router.parser, path, location2, nest)
  );
  const params = useCachedParams({ ...useParams(), ...routeParams });
  if (!matches) return null;
  const children = base ? (0, import_react.createElement)(Router, { base }, h_route(renderProps, params)) : h_route(renderProps, params);
  return (0, import_react.createElement)(ParamsCtx.Provider, { value: params, children });
};
var Link = (0, import_react.forwardRef)((props, ref) => {
  const router = useRouter();
  const [currentPath, navigate2] = useLocationFromRouter(router);
  const {
    to = "",
    href: targetPath = to,
    onClick: _onClick,
    asChild,
    children,
    className: cls,
    /* eslint-disable no-unused-vars */
    replace,
    state,
    /* eslint-enable no-unused-vars */
    ...restProps
  } = props;
  const onClick = useEvent((event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0)
      return;
    _onClick == null ? void 0 : _onClick(event);
    if (!event.defaultPrevented) {
      event.preventDefault();
      navigate2(targetPath, props);
    }
  });
  const href = router.hrefs(
    targetPath[0] === "~" ? targetPath.slice(1) : router.base + targetPath,
    router
    // pass router as a second argument for convinience
  );
  return asChild && (0, import_react.isValidElement)(children) ? (0, import_react.cloneElement)(children, { onClick, href }) : (0, import_react.createElement)("a", {
    ...restProps,
    onClick,
    href,
    // `className` can be a function to apply the class if this link is active
    className: (cls == null ? void 0 : cls.call) ? cls(currentPath === targetPath) : cls,
    children,
    ref
  });
});
var flattenChildren = (children) => Array.isArray(children) ? children.flatMap(
  (c) => flattenChildren(c && c.type === import_react.Fragment ? c.props.children : c)
) : [children];
var Switch = ({ children, location: location2 }) => {
  const router = useRouter();
  const [originalLocation] = useLocationFromRouter(router);
  for (const element of flattenChildren(children)) {
    let match = 0;
    if ((0, import_react.isValidElement)(element) && // we don't require an element to be of type Route,
    // but we do require it to contain a truthy `path` prop.
    // this allows to use different components that wrap Route
    // inside of a switch, for example <AnimatedRoute />.
    (match = matchRoute(
      router.parser,
      element.props.path,
      location2 || originalLocation,
      element.props.nest
    ))[0])
      return (0, import_react.cloneElement)(element, { match });
  }
  return null;
};
var Redirect = (props) => {
  const { to, href = to } = props;
  const [, navigate2] = useLocation();
  const redirect = useEvent(() => navigate2(to || href, props));
  useIsomorphicLayoutEffect(() => {
    redirect();
  }, []);
  return null;
};
export {
  Link,
  Redirect,
  Route,
  Router,
  Switch,
  matchRoute,
  useLocation,
  useParams,
  useRoute,
  useRouter,
  useSearch2 as useSearch
};
/*! Bundled license information:

use-sync-external-store/cjs/use-sync-external-store-shim.development.js:
  (**
   * @license React
   * use-sync-external-store-shim.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=wouter.js.map
