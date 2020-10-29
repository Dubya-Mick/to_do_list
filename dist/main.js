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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _logicController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logicController */ "./src/logicController.js");


const DOMController = (() => {

    const renderProjectTitles = () => {
        //grab div containing list of projects
        let projList = document.getElementById('projectList');
        //clear display before repopulating
        clearDisplay(projList);
        
        let allProjectTitles = document.createDocumentFragment();
        //render those project titles to the DOM
        //adding event listeners as the divs are added
        for(let i= 0; i < _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects.length; i++) {
            let projectTitle = document.createElement('div');
            projectTitle.setAttribute('data-projNum', `${i}`);
            projectTitle.textContent = _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects[i].title;
            projectTitle.classList.add('project');
            projectTitle.addEventListener('click', (e) => {
                setCurrentProjectOnClick(e);
                displayActiveProject(e);
                renderTaskTitles(e);
                renderAddTaskBtn();
                
            });
            allProjectTitles.appendChild(projectTitle);
        }
        projList.appendChild(allProjectTitles);
    }

    const renderTaskTitles = (e) => {
        //grab tasklist div
        let taskList = document.querySelector('#taskList');
        //grab index of project 
        let projectIndex = _logicController__WEBPACK_IMPORTED_MODULE_0__.default.getCurrentProjectIndex();
        //clear previous task list before rendering new one
        clearDisplay(taskList);
        
        //render current task titles (shown) and task details (hidden)
        let tasksAndDeets = document.createDocumentFragment();
        for(let i = 0; i < _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects[projectIndex].tasks.length; i++) {
            //title of tasks
            let taskTitle = document.createElement('div');
            taskTitle.textContent = _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects[projectIndex].tasks[i].title;
            taskTitle.setAttribute('data-taskNum', `${i}`);
            taskTitle.classList.add('task');
            taskTitle.addEventListener('click', (e) => {
                //prevent children from inheriting the onclick event
                if (e.currentTarget !== e.target) {
                    return;
                }
                setCurrentTaskOnClick(e);
                renderTaskDetails(e);
            });

            //create div for task notes
            let notes = document.createElement('div');
            notes.textContent = _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects[projectIndex].tasks[i].notes;

            //create div task completion y/n
            let isComplete = document.createElement('div');
            isComplete.textContent = _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects[projectIndex].tasks[i].isComplete;

            //create wrapper for task details
            let taskDetails = document.createElement('div');
            taskDetails.classList.add('taskDetails');
            taskDetails.classList.add('hidden');
            taskDetails.appendChild(notes);
            taskDetails.appendChild(isComplete);

            //add task title and info to DOM
            taskTitle.appendChild(taskDetails);
            tasksAndDeets.appendChild(taskTitle);

        }
        taskList.appendChild(tasksAndDeets);

    }

    const displayActiveProject = (e) => {
         //display title of project above task list
         let projTitleDisplay = document.querySelector('#projTitle');
         projTitleDisplay.textContent = e.target.textContent;
    }

    const renderTaskDetails = (e) => {
        let allTaskDeets = document.querySelectorAll('.taskDetails');
        //close the opened task when you click on a new one
        allTaskDeets.forEach((element) => {
            if (!element.classList.contains('hidden')) {
                element.classList.add('hidden')
            }
        });

        //open the clicked task
        let clickedTaskDeets = e.target.querySelector('.taskDetails');
        clickedTaskDeets.classList.toggle('hidden');
        
    }

    //sets the current project for later retrieval of index
    const setCurrentProjectOnClick = (e) => {
        let projectIndex = e.target.getAttribute('data-projNum');
        _logicController__WEBPACK_IMPORTED_MODULE_0__.default.setCurrentProject(projectIndex);
    }

    //sets the current task for later retrieval of index
    const setCurrentTaskOnClick = (e) => {
        let taskIndex = e.target.getAttribute('data-taskNum');
        _logicController__WEBPACK_IMPORTED_MODULE_0__.default.setCurrentTask(taskIndex);
    }

    const renderAddTaskBtn = () => {
        let taskArea = document.querySelector('#taskList');
        let addTaskBtn = document.createElement('button');
        addTaskBtn.textContent = '+';
        addTaskBtn.setAttribute('id', 'addTaskBtn');
        taskArea.appendChild(addTaskBtn);
    }

    const addProjectDropDown = () => {
        let projDropDown = document.querySelector('.addProjMenu');
        let addProjBtn = document.querySelector('.addProjBtn');
        addProjBtn.addEventListener('click', () => {
            projDropDown.classList.toggle('show');
        })
        
    }

    const addNewProject = () => {
        let addProjDropBtn = document.querySelector('#addProjDropDownBtn');
        addProjDropBtn.addEventListener('click', () => {
            let newProjTitle = document.querySelector("#proj-title-input").value;
            if(newProjTitle.length > 30) {
                return
            } else {
                _logicController__WEBPACK_IMPORTED_MODULE_0__.default.addProject(newProjTitle);
                renderProjectTitles();
            }
        })
        
    }

    const clearDisplay = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    
    }
    
    const renderDOM = () => {
        renderProjectTitles();
        addProjectDropDown();
        addNewProject();
    }

    return {
        renderDOM
    }

})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DOMController);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DOMcontroller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOMcontroller */ "./src/DOMcontroller.js");
/* harmony import */ var _logicController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logicController */ "./src/logicController.js");



_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addProject('daily living');
_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addTask(0, 'take a dump', 'I have to do this', false);
_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addTask(0, 'get out of bed', 'No choice', false);
_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addProject('life goals');
_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addTask(1, 'party a lot', 'drinking is good', false);
_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addProject('obligations');
_logicController__WEBPACK_IMPORTED_MODULE_1__.default.addTask(2, 'go to school', 'learning is good', false);

_DOMcontroller__WEBPACK_IMPORTED_MODULE_0__.default.renderDOM();

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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
const logicController = (() => {

    let currentProject = null;
    let currentTask = null;

    let projects = [];

    const projectFactory = (title) => {
        let tasks = [];
        return {title, tasks};
    }

    const taskFactory = (title, notes, isComplete) => {
        return {title, notes, isComplete};
    }

    const addProject = (title) => {
        projects.push(projectFactory(title));

    }

    const editProject = (projectIndex, title) => {
        projects[projectIndex].title = title;
    }


    const setCurrentProject = (index) => {
        currentProject = projects[index];
    }

    const getCurrentProjectIndex = () => {
        return projects.indexOf(currentProject);
    }


    const setCurrentTask = (index) => {
        currentTask = currentProject.tasks[index];
    }

    const getCurrentTaskIndex = () => {
        return currentProject.tasks.indexOf(currentTask);
    }

    const addTask = (projectIndex, title, notes, isComplete) => {
        projects[projectIndex].tasks.push(taskFactory(title, notes, isComplete));
    }

    const editTaskTitle = (projectIndex, taskIndex, title) => {
        projects[projectIndex].tasks[taskIndex].title = title;
    }


    const editTaskNotes = (projectIndex, taskIndex, notes) => {
        project[projectIndex].tasks[taskIndex].notes = notes;
    }

    const toggleComplete = (projectIndex, taskIndex) => {
        if (project[projectIndex].tasks[taskIndex].isComplete) {
            project[projectIndex].tasks[taskIndex].isComplete = false;
        } else {
            project[projectIndex].tasks[taskIndex].isComplete = true;
        }
    }

    return {
        projects,
        setCurrentProject,
        getCurrentProjectIndex,
        setCurrentTask,
        getCurrentTaskIndex,
        addProject,
        editProject,
        addTask,
        editTaskTitle,
        editTaskNotes,
        toggleComplete
    }

})();


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (logicController);

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
//# sourceMappingURL=main.js.map