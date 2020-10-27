/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/DOMcontroller.js":
/*!******************************!*\
  !*** ./src/DOMcontroller.js ***!
  \******************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _logicController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logicController */ \"./src/logicController.js\");\n\n\nconst DOMController = (() => {\n\n    const renderProjectTitles = () => {\n        let testDiv = document.getElementById('projectList');\n        let allProjectTitles = document.createDocumentFragment();\n        for(let i= 0; i < _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects.length; i++) {\n            let projectTitle = document.createElement('ul');\n            projectTitle.setAttribute('data-projNum', `${i}`);\n            projectTitle.textContent = _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects[i].title;\n            projectTitle.addEventListener('click', (e) => {\n                renderTaskTitles(e);\n            })\n            allProjectTitles.appendChild(projectTitle);\n        }\n        testDiv.appendChild(allProjectTitles);\n    }\n\n    const renderTaskTitles = (e) => {\n        let projectIndex = e.target.getAttribute('data-projNum');\n        let projTitleDisplay = document.querySelector('#projTitle');\n        projTitleDisplay.textContent = e.target.textContent;\n        let taskList = document.querySelector('#taskList');\n        clearDisplay(taskList);\n        \n\n        let allTaskTitles = document.createDocumentFragment();\n        for(let i = 0; i < _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects[projectIndex].tasks.length; i++) {\n            let taskTitle = document.createElement('div');\n            taskTitle.textContent = _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects[projectIndex].tasks[i].title;\n            taskTitle.setAttribute('data-taskNum', `${i}`);\n            allTaskTitles.appendChild(taskTitle);\n        }\n        taskList.appendChild(allTaskTitles);\n\n    }\n\n    const clearDisplay = (parent) => {\n        while (parent.firstChild) {\n            parent.removeChild(parent.firstChild)\n        }\n    \n    }\n    \n\n    return {\n        renderProjectTitles\n    }\n\n})();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DOMController);\n\n//# sourceURL=webpack://to_do_list/./src/DOMcontroller.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _DOMcontroller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOMcontroller */ \"./src/DOMcontroller.js\");\n/* harmony import */ var _logicController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logicController */ \"./src/logicController.js\");\n\n\n\n_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addProject('daily living');\n_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addTask(0, 'take a dump', 'I have to do this', 'it will take an hour', false);\n_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addTask(0, 'get out of bed', 'No choice', 'no news readng in bed', false);\n_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addProject('life goals');\n_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addTask(1, 'party a lot', 'drinking is good', 'maybe beer', false);\n_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addProject('obligations');\n_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addTask(2, 'go to school', 'learning is good', 'need to get an A', false);\n\nconsole.log(_logicController__WEBPACK_IMPORTED_MODULE_1__.default.projects[0].title);\nconsole.log(_logicController__WEBPACK_IMPORTED_MODULE_1__.default.projects[1].tasks[0]);\n\n_DOMcontroller__WEBPACK_IMPORTED_MODULE_0__.default.renderProjectTitles();\n\n//# sourceURL=webpack://to_do_list/./src/index.js?");

/***/ }),

/***/ "./src/logicController.js":
/*!********************************!*\
  !*** ./src/logicController.js ***!
  \********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nconst logicController = (() => {\n\n    let projects = [];\n\n    const projectFactory = (title) => {\n        let tasks = [];\n        return {title, tasks};\n    }\n\n    const taskFactory = (title, notes, isComplete) => {\n        return {title, notes, isComplete};\n    }\n\n    const addProject = (title) => {\n        projects.push(projectFactory(title));\n\n    }\n\n    const editProject = (projectIndex, title) => {\n        projects[projectIndex].title = title;\n    }\n\n\n    const addTask = (projectIndex, title, notes, isComplete) => {\n        projects[projectIndex].tasks.push(taskFactory(title, notes, isComplete));\n    }\n\n    const editTaskTitle = (projectIndex, taskIndex, title) => {\n            projects[projectIndex].tasks[taskIndex].title = title;\n    }\n\n\n    const editTaskNotes = (projectIndex, taskIndex, notes) => {\n        project[projectIndex].tasks[taskIndex].notes = notes;\n    }\n\n    const toggleComplete = (projectIndex, taskIndex) => {\n        if (project[projectIndex].tasks[taskIndex].isComplete) {\n            project[projectIndex].tasks[taskIndex].isComplete = false;\n        } else {\n            project[projectIndex].tasks[taskIndex].isComplete = true;\n        }\n    }\n\n    return {\n        projects,\n        addProject,\n        editProject,\n        addTask,\n        editTaskTitle,\n        editTaskNotes,\n        toggleComplete\n    }\n\n})();\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (logicController);\n\n//# sourceURL=webpack://to_do_list/./src/logicController.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;