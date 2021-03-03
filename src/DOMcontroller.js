import logicController from './logicController';

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
        for(let i= 0; i < logicController.projects.length; i++) {

            //create div for project and add event listeners
            let projectTitle = document.createElement('div');
            projectTitle.textContent = logicController.projects[i].title;
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
            editButton.classList.add('projectEditButton');
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
        let projectIndex = logicController.getCurrentProjectIndex();
        //clear previous task list before rendering new one
        clearDisplay(taskList);
        
        //render current task titles (shown) and task details (hidden)
        let tasksAndDeets = document.createDocumentFragment();
        for(let i = 0; i < logicController.projects[projectIndex].tasks.length; i++) {
            //title of tasks
            let taskTitle = document.createElement('div');
            taskTitle.textContent = logicController.projects[projectIndex].tasks[i].title;
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
            notes.textContent = logicController.projects[projectIndex].tasks[i].notes;

            //create div task completion y/n
            let isComplete = document.createElement('div');
            isComplete.textContent = logicController.projects[projectIndex].tasks[i].isComplete;
            isComplete.setAttribute('data-taskNum', `${i}`);

            //create div for edit button
            let editTaskButton = document.createElement('i');
            editTaskButton.setAttribute('class', 'far fa-edit');
            editTaskButton.setAttribute('data-taskNum', `${i}`);

            //create div for delete button
            let deleteTaskButton = document.createElement('i');
            deleteTaskButton.setAttribute('class', 'fas fa-trash-alt');
            deleteTaskButton.setAttribute('data-taskNum', `${i}`);
            deleteTaskButton.addEventListener('click', deleteTask);

            //create wrapper for task details -
            let taskDetails = document.createElement('div');
            taskDetails.classList.add('taskDetails');
            taskDetails.classList.add('hidden');
            taskDetails.appendChild(notes);
            

            //add task title and info to DOM
            taskTitle.appendChild(taskDetails);
            tasksAndDeets.appendChild(isComplete);
            tasksAndDeets.appendChild(taskTitle);
            tasksAndDeets.appendChild(editTaskButton);
            tasksAndDeets.appendChild(deleteTaskButton);

        }
        taskList.appendChild(tasksAndDeets);
        

    }

    //display title of project above task list
    const displayCurrentProjectTitle = () => {
         
         let projTitleDisplay = document.querySelector('#projTitle');
         let currentProjIndex = logicController.getCurrentProjectIndex();
         projTitleDisplay.textContent = logicController.projects[currentProjIndex].title;
    }

    const renderTaskDetails = (e) => {
        let clickedTaskDeets = e.target.querySelector('.taskDetails');
        clickedTaskDeets.classList.toggle('hidden');
    }

    //sets the current project for later retrieval of index
    const setCurrentProjectOnClick = (e) => {
        let projectIndex = e.target.getAttribute('data-projNum');
        logicController.setCurrentProject(projectIndex);
    }

    //sets the current task for later retrieval of index
    const setCurrentTaskOnClick = (e) => {
        let taskIndex = e.target.getAttribute('data-taskNum');
        logicController.setCurrentTask(taskIndex);
    }

    //creates the button for adding tasks
    const renderAddTaskBtn = () => {
        let taskArea = document.querySelector('#taskArea');
        let addTaskBtn = document.createElement('button');
        let addTaskModal = document.getElementById('addTaskModal');
        addTaskBtn.textContent = '+';
        addTaskBtn.setAttribute('id', 'addTaskBtn');
        //add event listener for btn to open modal window on click
        addTaskBtn.addEventListener('click', addTaskModelOpen)

        if (document.querySelector('#addTaskBtn') != null) {
            return
        } else {
            taskArea.appendChild(addTaskBtn);
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
                logicController.addProject(newProjTitle);
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

        //check if other projects are currently editable and disable editing if so
        let projectEditBtns = [...document.querySelectorAll('.projectEditButton')];
        for (let i = 0; i < projectEditBtns.length; i++) {
            if(projectEditBtns[i].classList.contains('fa-check-square') && projectEditBtns[i] != editBtn) {
                projectEditBtns[i].classList.remove('fa-check-square');
                projectEditBtns[i].classList.add('fa-edit');
                projectEditBtns[i].previousSibling.style.backgroundColor = 'white';
                projectEditBtns[i].previousSibling.contentEditable = 'false';
            }
        }
        //if project is currently editable, clicking the checkmark updates the title
        if (projectTitleToEdit.contentEditable == 'true') {
            editBtn.classList.remove('fa-check-square');
            editBtn.classList.add('fa-edit');
            projectTitleToEdit.contentEditable = 'false';
            projectTitleToEdit.style.backgroundColor = 'white';
            logicController.editProject(projectIndex, projectTitleToEdit.textContent);
            renderProjectArea();
            displayCurrentProjectTitle();
        //otherwise --> make the title editable
        } else {
            editBtn.classList.remove('fa-edit');
            editBtn.classList.add('fa-check-square');
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
            logicController.deleteProject(projectIndex);
            renderProjectArea();
            clearDisplay(taskList);
            projTitleDisplay.textContent = "Project Title";
            document.getElementById('addTaskBtn').outerHTML = '';
            //if to-be-deleted project is the current active project,
            //update the current project to first in the list and display
        } else if (logicController.getCurrentProjectIndex() == projectIndex) {
            logicController.deleteProject(projectIndex);
            logicController.setCurrentProject(0);
            renderProjectArea();
            displayCurrentProjectTitle();
            renderTasks();
        } else {
            logicController.deleteProject(projectIndex);
            renderProjectArea();
        }
    }

    const addTaskModelOpen = () => {
        let addTaskModal = document.getElementById('addTaskModal');
        addTaskModal.style.display = 'block';
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
        let addTaskModal = document.getElementById('addTaskModal');
        let addTaskModalBtn = document.getElementById('addTaskModalBtn');
        addTaskModalBtn.addEventListener('click', () => {
            let taskTitleInput = document.getElementById('task-title-input').value;
            let taskNotesInput = document.getElementById('task-notes-input').value;
            if (taskTitleInput.length < 1) {
                alert('Sure about that title?')
            } else if (taskNotesInput < 1) {
                alert('Sure about those notes?');
            } else {
                addTaskModal.style.display = 'none';
                logicController.addTask(logicController.getCurrentProjectIndex(), taskTitleInput, taskNotesInput, false);
                renderTasks();
            }
            
        })
    }

    const deleteTask = (e) => {
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = e.target.getAttribute('dataTask-num');
        logicController.deleteTask(projectIndex, taskIndex);
        renderTasks();
    }
    

    const editTask = (e) => {
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = logicController.getCurrentTaskIndex();
        let editTaskBtn = e.target;
        logicController.editTaskTitle(projectIndex, taskIndex, )

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

export default DOMController;