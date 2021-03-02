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

    //render projects, edit, and delete buttons for projects
    const renderProjectArea = () => {
        //grab div containing list of projects
        let projList = document.getElementById('projectList');
        //clear display before repopulating
        clearDisplay(projList);
        
        let allProjectTitles = document.createDocumentFragment();
        //render those project titles to the DOM
        //adding event listeners as the divs are added
        for(let i= 0; i < _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects.length; i++) {

            //create div for project and add event listeners
            let projectTitle = document.createElement('div');
            projectTitle.textContent = _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects[i].title;
            projectTitle.classList.add('project');
            projectTitle.addEventListener('click', (e) => {
                setCurrentProjectOnClick(e);
                displayCurrentProjectTitle();
                renderTasks(e);
                renderAddTaskBtn();
            });

            //create edit button
            let editButton = document.createElement('i');
            editButton.setAttribute('class', 'far fa-edit');
            editButton.addEventListener('click', (e) => {
                editProjectTitle(e);
            })

            //create delete button
            let deleteButton = document.createElement('i');
            deleteButton.setAttribute('class', 'fas fa-trash-alt');
            deleteButton.addEventListener('click', (e) => {
                deleteProject(e);
            })

            //add data-attributes so items can be tracked
            projectTitle.setAttribute('data-projNum', `${i}`);
            editButton.setAttribute('data-projNum', `${i}`);
            deleteButton.setAttribute('data-projNum', `${i}`);

            //append items to the document frag before appending to DOM
            allProjectTitles.appendChild(projectTitle);
            allProjectTitles.appendChild(editButton);
            allProjectTitles.appendChild(deleteButton);
        }
        projList.appendChild(allProjectTitles);
    }


    const renderTasks = () => {
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
            isComplete.setAttribute('data-taskNum', `${i}`);

            //create div for edit button
            let editTaskButton = document.createElement('i');
            editTaskButton.setAttribute('class', 'far fa-edit');
            editTaskButton.setAttribute('data-taskNum', `${i}`);

            //create div for delete button
            let deleteTaskButton = document.createElement('i');
            deleteTaskButton.setAttribute('class', 'fas fa-trash-alt');
            deleteTaskButton.setAttribute('data-taskNum', `${i}`);

            //create wrapper for task details -
            let taskDetails = document.createElement('div');
            taskDetails.classList.add('taskDetails');
            taskDetails.classList.add('hidden');
            taskDetails.appendChild(notes);
            

            //add task title and info to DOM
            taskTitle.appendChild(taskDetails);
            tasksAndDeets.appendChild(taskTitle);
            tasksAndDeets.appendChild(isComplete);
            tasksAndDeets.appendChild(editTaskButton);
            tasksAndDeets.appendChild(deleteTaskButton);

        }
        taskList.appendChild(tasksAndDeets);
        

    }

    const displayCurrentProjectTitle = () => {
         //display title of project above task list
         let projTitleDisplay = document.querySelector('#projTitle');
         let currentProjIndex = _logicController__WEBPACK_IMPORTED_MODULE_0__.default.getCurrentProjectIndex();
         projTitleDisplay.textContent = _logicController__WEBPACK_IMPORTED_MODULE_0__.default.projects[currentProjIndex].title;
    }

    const renderTaskDetails = (e) => {
        let allTaskDeets = document.querySelectorAll('.taskDetails');
        //close opened tasks when you click on a new one
        allTaskDeets.forEach((element) => {
            element.classList.add('hidden');
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

    //creates the button for adding tasks
    const renderAddTaskBtn = () => {
        let taskArea = document.querySelector('#taskArea');
        let addTaskBtn = document.createElement('button');
        addTaskBtn.textContent = '+';
        addTaskBtn.setAttribute('id', 'addTaskBtn');

        if (document.querySelector('#addTaskBtn') != null) {
            return
        } else {
            taskArea.appendChild(addTaskBtn);
            addTaskModalOpen();
            addTaskModalClose();
        }

        
    }

    //unhides the dropdown for adding projects
    const addProjectDropDown = () => {
        let projDropDown = document.querySelector('.addProjMenu');
        let addProjBtn = document.querySelector('.addProjBtn');
        addProjBtn.addEventListener('click', () => {
            projDropDown.classList.toggle('show');
        })
        
    }

    //adds new project
    const addNewProject = () => {
        let addProjDropBtn = document.querySelector('#addProjDropDownBtn');
        addProjDropBtn.addEventListener('click', () => {
            let newProjTitle = document.querySelector("#proj-title-input").value;
            if(newProjTitle.length > 30) {
                return
            } else {
                _logicController__WEBPACK_IMPORTED_MODULE_0__.default.addProject(newProjTitle);
                renderProjectArea();
            }
        })
    }

    //controls editing of new project title
    //click makes the title editable and changes the icon to a checkmark
    //clicking the checkmark adds the new project and updates the displayed project
    const editProjectTitle = (e) => {
        let projectIndex = e.target.getAttribute('data-ProjNum');
        let editBtn = e.target;
        let projectTitleToEdit = e.target.previousSibling;
        
        

        
        if (projectTitleToEdit.contentEditable == 'true') {
            editBtn.setAttribute('class', 'far fa-edit');
            projectTitleToEdit.contentEditable = 'false';
            projectTitleToEdit.style.backgroundColor = 'white';
            _logicController__WEBPACK_IMPORTED_MODULE_0__.default.editProject(projectIndex, projectTitleToEdit.textContent);
            renderProjectArea();
            displayCurrentProjectTitle();
        } else {
            editBtn.setAttribute('class', 'far fa-check-square');
            projectTitleToEdit.contentEditable = 'true';
            projectTitleToEdit.style.backgroundColor = '#87ceff';
        }
    }

    const deleteProject = (e) => {
        //grab corresponding index of proj from data-attribute of trash button
        //grab div for proper removal of DOM elements as projects are deleted
        let projectIndex = e.target.getAttribute('data-projNum');
        let projectTitles = document.querySelectorAll('.project');
        let taskList = document.querySelector('#taskList');
        let projTitleDisplay = document.querySelector('#projTitle');
        //reset task list if no projects remain after deleting last one
        if (projectTitles.length == 1) {
            _logicController__WEBPACK_IMPORTED_MODULE_0__.default.deleteProject(projectIndex);
            renderProjectArea();
            clearDisplay(taskList);
            projTitleDisplay.textContent = "Project Title";
            document.getElementById('addTaskBtn').outerHTML = '';
            //if to-be-deleted project is the current active project,
            //update the current project to first in the list and display
        } else if (_logicController__WEBPACK_IMPORTED_MODULE_0__.default.getCurrentProjectIndex() == projectIndex) {
            _logicController__WEBPACK_IMPORTED_MODULE_0__.default.deleteProject(projectIndex);
            _logicController__WEBPACK_IMPORTED_MODULE_0__.default.setCurrentProject(0);
            renderProjectArea();
            displayCurrentProjectTitle();
            renderTasks();
        } else {
            _logicController__WEBPACK_IMPORTED_MODULE_0__.default.deleteProject(projectIndex);
            renderProjectArea();
        }
    }

    //unhides the modal window for adding tasks and notes
    const addTaskModalOpen = () => {
        let addTaskModalBtn = document.getElementById('addTaskBtn');
        let addTaskModal = document.getElementById('addTaskModal');
        addTaskModalBtn.addEventListener('click', () => {
            addTaskModal.style.display = 'block';
        })
    }

    //closes the task addition window if you click outside it
    const addTaskModalClose = () => {
        window.onclick = (e) => {
            let addTaskModal = document.getElementById('addTaskModal');
            if (e.target == addTaskModal) {
                addTaskModal.style.display = 'none';
            }
        }
    }

    //controls adding of tasks using button in modal window
    const addTask = () => {
        let addTaskModalBtn = document.getElementById('addTaskModalBtn');
        addTaskModalBtn.addEventListener('click', () => {
            let taskTitleInput = document.getElementById('task-title-input').value;
            let taskNotesInput = document.getElementById('task-notes-input').value;
            _logicController__WEBPACK_IMPORTED_MODULE_0__.default.addTask(_logicController__WEBPACK_IMPORTED_MODULE_0__.default.getCurrentProjectIndex(), taskTitleInput, taskNotesInput, false);
            renderTasks();
        })
    }


    const clearDisplay = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }
    
    const renderDOM = () => {
        renderProjectArea();
        addProjectDropDown();
        addNewProject();
        addTask();
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

    const deleteProject = (projectIndex) => {
        projects.splice(projectIndex, 1);
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

    const deleteTask = (projectIndex, taskIndex) => {
        projects[projectIndex].tasks.splice(taskIndex, 1);
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
        deleteProject,
        addTask,
        editTaskTitle,
        deleteTask,
        editTaskNotes,
        toggleComplete,
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