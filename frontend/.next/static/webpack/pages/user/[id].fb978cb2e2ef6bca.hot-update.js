"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/user/[id]",{

/***/ "./pages/Render/RenderItems.jsx":
/*!**************************************!*\
  !*** ./pages/Render/RenderItems.jsx ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _FavoritesHandling_ToggleButton_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../FavoritesHandling/ToggleButton.jsx */ \"./pages/FavoritesHandling/ToggleButton.jsx\");\n\n\nconst renderItems = (currentCharacters, favList, setFavList, openPopup, router)=>{\n    return currentCharacters.map((character)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n            className: \"hero\",\n            onClick: ()=>router.push(\"/character/\".concat(character.id)),\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                    src: character.image,\n                    alt: character.name,\n                    className: \"hero-image\"\n                }, void 0, false, {\n                    fileName: \"/home/msavelie/Hive/SP-Fan/frontend/pages/Render/RenderItems.jsx\",\n                    lineNumber: 9,\n                    columnNumber: 13\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_FavoritesHandling_ToggleButton_jsx__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n                    characterName: character.name,\n                    favList: favList,\n                    setFavList: setFavList,\n                    onClick: (e)=>e.stopPropagation(),\n                    openPopup: openPopup\n                }, void 0, false, {\n                    fileName: \"/home/msavelie/Hive/SP-Fan/frontend/pages/Render/RenderItems.jsx\",\n                    lineNumber: 11,\n                    columnNumber: 13\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"char-name\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                        className: \"char-name\",\n                        children: character.name\n                    }, void 0, false, {\n                        fileName: \"/home/msavelie/Hive/SP-Fan/frontend/pages/Render/RenderItems.jsx\",\n                        lineNumber: 19,\n                        columnNumber: 17\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"/home/msavelie/Hive/SP-Fan/frontend/pages/Render/RenderItems.jsx\",\n                    lineNumber: 18,\n                    columnNumber: 13\n                }, undefined)\n            ]\n        }, character.id, true, {\n            fileName: \"/home/msavelie/Hive/SP-Fan/frontend/pages/Render/RenderItems.jsx\",\n            lineNumber: 5,\n            columnNumber: 9\n        }, undefined));\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (renderItems);\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9SZW5kZXIvUmVuZGVySXRlbXMuanN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQWlFO0FBRWpFLE1BQU1DLGNBQWMsQ0FBQ0MsbUJBQW1CQyxTQUFTQyxZQUFZQyxXQUFXQztJQUNwRSxPQUFPSixrQkFBa0JLLEdBQUcsQ0FBQyxDQUFDQywwQkFDMUIsOERBQUNDO1lBQ0dDLFdBQVU7WUFDVkMsU0FBUyxJQUFNTCxPQUFPTSxJQUFJLENBQUMsY0FBMkIsT0FBYkosVUFBVUssRUFBRTs7OEJBRXJELDhEQUFDQztvQkFBSUMsS0FBS1AsVUFBVVEsS0FBSztvQkFBRUMsS0FBS1QsVUFBVVUsSUFBSTtvQkFBRVIsV0FBVTs7Ozs7OzhCQUUxRCw4REFBQ1YsMkVBQVlBO29CQUNUbUIsZUFBZVgsVUFBVVUsSUFBSTtvQkFDN0JmLFNBQVNBO29CQUNUQyxZQUFZQTtvQkFDWk8sU0FBUyxDQUFDUyxJQUFNQSxFQUFFQyxlQUFlO29CQUNqQ2hCLFdBQVdBOzs7Ozs7OEJBRWYsOERBQUNpQjtvQkFBSVosV0FBVTs4QkFDWCw0RUFBQ2E7d0JBQUViLFdBQVU7a0NBQWFGLFVBQVVVLElBQUk7Ozs7Ozs7Ozs7OztXQWJ0QlYsVUFBVUssRUFBRTs7Ozs7QUFpQjlDO0FBRUEsaUVBQWVaLFdBQVdBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9SZW5kZXIvUmVuZGVySXRlbXMuanN4P2EwYjgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRvZ2dsZUJ1dHRvbiBmcm9tIFwiLi4vRmF2b3JpdGVzSGFuZGxpbmcvVG9nZ2xlQnV0dG9uLmpzeFwiO1xyXG5cclxuY29uc3QgcmVuZGVySXRlbXMgPSAoY3VycmVudENoYXJhY3RlcnMsIGZhdkxpc3QsIHNldEZhdkxpc3QsIG9wZW5Qb3B1cCwgcm91dGVyICkgPT4ge1xyXG4gICAgcmV0dXJuIGN1cnJlbnRDaGFyYWN0ZXJzLm1hcCgoY2hhcmFjdGVyKSA9PiAoXHJcbiAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJoZXJvXCIga2V5PXtjaGFyYWN0ZXIuaWR9XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJvdXRlci5wdXNoKGAvY2hhcmFjdGVyLyR7Y2hhcmFjdGVyLmlkfWApfVxyXG4gICAgICAgID5cclxuICAgICAgICAgICAgPGltZyBzcmM9e2NoYXJhY3Rlci5pbWFnZX0gYWx0PXtjaGFyYWN0ZXIubmFtZX0gY2xhc3NOYW1lPVwiaGVyby1pbWFnZVwiLz5cclxuXHJcbiAgICAgICAgICAgIDxUb2dnbGVCdXR0b25cclxuICAgICAgICAgICAgICAgIGNoYXJhY3Rlck5hbWU9e2NoYXJhY3Rlci5uYW1lfVxyXG4gICAgICAgICAgICAgICAgZmF2TGlzdD17ZmF2TGlzdH1cclxuICAgICAgICAgICAgICAgIHNldEZhdkxpc3Q9e3NldEZhdkxpc3R9XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cclxuICAgICAgICAgICAgICAgIG9wZW5Qb3B1cD17b3BlblBvcHVwfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYXItbmFtZVwiPlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiY2hhci1uYW1lXCI+e2NoYXJhY3Rlci5uYW1lfTwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICApKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJlbmRlckl0ZW1zOyJdLCJuYW1lcyI6WyJUb2dnbGVCdXR0b24iLCJyZW5kZXJJdGVtcyIsImN1cnJlbnRDaGFyYWN0ZXJzIiwiZmF2TGlzdCIsInNldEZhdkxpc3QiLCJvcGVuUG9wdXAiLCJyb3V0ZXIiLCJtYXAiLCJjaGFyYWN0ZXIiLCJidXR0b24iLCJjbGFzc05hbWUiLCJvbkNsaWNrIiwicHVzaCIsImlkIiwiaW1nIiwic3JjIiwiaW1hZ2UiLCJhbHQiLCJuYW1lIiwiY2hhcmFjdGVyTmFtZSIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJkaXYiLCJwIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/Render/RenderItems.jsx\n"));

/***/ })

});