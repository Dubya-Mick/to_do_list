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
            let editButton = document.createElement('a');
            editButton.classList.add('waves-effect', 'waves-light', 'btn', 'projectEditButton');
            editButton.textContent = "Edit";
            editButton.addEventListener('click', (e) => {
                editProjectTitle(e);
            });

            //create delete button
            let deleteButton = document.createElement('a');
            deleteButton.classList.add('waves-effect', 'waves-light', 'btn');
            deleteButton.addEventListener('click', (e) => {
                deleteProject(e);
            })

            //create delete icon
            let deleteIcon = document.createElement('i');
            deleteIcon.classList.add('material-icons')
            deleteIcon.textContent = 'delete';
            deleteButton.appendChild(deleteIcon);

            //add data-attributes so items can be tracked
            projectTitle.setAttribute('data-projNum', `${i}`);
            editButton.setAttribute('data-projNum', `${i}`);
            deleteButton.setAttribute('data-projNum', `${i}`);
            deleteIcon.setAttribute('data-projNum', `${i}`);

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

            //task completion slider
            //add event listener to the nested checkbox to avoid multiple firings due to bubbling
            let toggle = document.querySelector('.complete-switch');
            let completionSlider = toggle.cloneNode(true);
            let completionSliderCheckBox = completionSlider.firstElementChild;
            completionSliderCheckBox.setAttribute('data-taskNum', `${i}`);
            completionSlider.style.display = 'block';
            
            
            //check if the task is complete and display the slide accordingly
            if (logicController.projects[projectIndex].tasks[i].isComplete == true) {
                completionSliderCheckBox.checked = true;
                
            } else {
                completionSliderCheckBox.checked = false;
            }

            completionSliderCheckBox.addEventListener('click', (e) => {
                toggleTaskComplete(e);
            });



            //create div for edit button
            let editTaskButton = document.createElement('i');
            editTaskButton.setAttribute('class', 'far fa-edit');
            editTaskButton.setAttribute('data-taskNum', `${i}`);
            editTaskButton.addEventListener('click', (e) => {
                setCurrentTaskOnClick(e);
                editTaskModalOpen();
            })

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
            tasksAndDeets.appendChild(completionSlider);
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
        addTaskBtn.addEventListener('click', addTaskModalOpen);

        if (document.querySelector('#addTaskBtn') != null) {
            return
        } else {
            taskArea.appendChild(addTaskBtn);
        }

        
    }

    //unhides the dropdown for adding projects
    const addProjectDropDownEventListener = () => {
        let projDropDown = document.querySelector('.addProjMenu');
        let addProjBtn = document.querySelector('.addProjBtn');
        addProjBtn.addEventListener('click', () => {
            projDropDown.classList.toggle('show');
        })
        
    }

    //adds new project
    const addNewProjectEventListener = () => {
        let projDropDown = document.querySelector('.addProjMenu');
        let addProjDropBtn = document.querySelector('#addProjDropDownBtn');
        addProjDropBtn.addEventListener('click', () => {
            let newProjTitle = document.querySelector("#proj-title-input").value;
            if(newProjTitle.length > 30) {
                return
            } else {
                projDropDown.classList.toggle('show'); //hide dropdow
                logicController.addProject(newProjTitle); //add project
                renderProjectArea(); 
                document.querySelector("#proj-title-input").value = ''; //empty text input
            }
        })
    }

    //controls editing of new project title
    //click makes the title editable and changes the icon to a checkmark
    //clicking the checkmark adds the new project and updates the displayed project
    const editProjectTitle = (e) => {
        let projectIndex = e.target.getAttribute('data-ProjNum');
        let editBtn = e.target;
        let projectTitleToEdit = e.target.previousSibling; //grab the project title

        //check if other projects are currently editable and disable editing if so
        let projectEditBtns = [...document.querySelectorAll('.projectEditButton')];
        for (let i = 0; i < projectEditBtns.length; i++) {
            if(projectEditBtns[i].textContent = 'done' && projectEditBtns[i] != editBtn) {
                projectEditBtns[i].textContent = 'edit';
                projectEditBtns[i].previousSibling.style.backgroundColor = 'white';
                projectEditBtns[i].previousSibling.contentEditable = 'false';
            }
        }
        //if project is currently editable, clicking the checkmark updates the title
        if (projectTitleToEdit.contentEditable == 'true') {
            editBtn.textContent = 'edit';
            projectTitleToEdit.contentEditable = 'false';
            projectTitleToEdit.style.backgroundColor = 'white';
            logicController.editProject(projectIndex, projectTitleToEdit.textContent);
            renderProjectArea();
            displayCurrentProjectTitle();
        //otherwise --> make the title editable
        } else {
            editBtn.textContent = 'done';
            //editBtn.classList.remove('fa-edit');
            //editBtn.classList.add('fa-check-square');
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

    const addTaskModalOpen = () => {
        let addTaskModal = document.getElementById('addTaskModal');
        addTaskModal.style.display = 'block';
        //change modal window text to reflect add task mode
        let addTaskTitle = document.getElementById('add-task-title');
        addTaskTitle.textContent = 'Title of New Task';
        let addTaskNotes = document.getElementById('add-task-notes');
        addTaskNotes.textContent = 'Notes';
        let addTaskModalBtn = document.getElementById('addTaskModalBtn');
        addTaskModalBtn.textContent = "Add Task";

        addTaskModalBtn.removeEventListener('click', editTask);
        addTaskModalBtn.addEventListener('click', addTask);

        
    }


    const addTaskModalCloseEventListener = () => {
        let addTaskModal = document.getElementById('addTaskModal');
        addTaskModal.addEventListener('click', (e) => {
            if (e.target == addTaskModal) {
                addTaskModal.style.display ='none';
            }
        })
        
    }

    const addTask = () => {
        let addTaskModal = document.getElementById('addTaskModal');
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
            document.getElementById('task-title-input').value = '';
            document.getElementById('task-notes-input').value = '';
        }
    }



    const deleteTask = (e) => {
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = e.target.getAttribute('data-taskNum');
        logicController.deleteTask(projectIndex, taskIndex);
        renderTasks();
    }

    const editTask = () => {
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = logicController.getCurrentTaskIndex();
        let editedTitle = document.getElementById('task-title-input').value;
        let editedNotes = document.getElementById('task-notes-input').value;
        if (editedTitle.length < 1) {
            alert('Sure about your new title?');
        } else if (editedNotes.length < 1) {
            alert('Sure about your new notes?');
        } else {
            logicController.editTaskTitle(projectIndex, taskIndex, editedTitle);
            logicController.editTaskNotes(projectIndex, taskIndex, editedNotes);
            addTaskModal.style.display = 'none';
            renderTasks();
        }
    }
    
    //change the modal window for adding tasks into one for editing tasks
    const editTaskModalOpen = () => {
        let addTaskModal = document.getElementById('addTaskModal');
        addTaskModal.style.display = 'block';
        //grab current indices
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = logicController.getCurrentTaskIndex();
        //change text of modal window to reflect editing mode
        let editTaskTitle = document.getElementById('add-task-title');
        editTaskTitle.textContent = 'Edit Title';
        let editTaskNotes = document.getElementById('add-task-notes');
        editTaskNotes.textContent = 'Edit Notes';
        let editTaskModalBtn = document.getElementById('addTaskModalBtn');
        editTaskModalBtn.textContent = "Edit Task";
        //display current title for editing
        let editTitleInput = document.getElementById('task-title-input');
        editTitleInput.value = logicController.projects[projectIndex].tasks[taskIndex].title;
        //display current notes for editing
        let editNotesInput = document.getElementById('task-notes-input');
        editNotesInput.value = logicController.projects[projectIndex].tasks[taskIndex].notes;
        //remove add task event listener and replace with edit task event listener
        editTaskModalBtn.removeEventListener('click', addTask);
        editTaskModalBtn.addEventListener('click', editTask);
    }

    

    const toggleTaskComplete = (e) => {
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = e.target.getAttribute('data-taskNum');
        logicController.toggleComplete(projectIndex, taskIndex);
    }


    const clearDisplay = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }

    const setTutorialProject = () => {
        logicController.addProject('Example Project');
        logicController.setCurrentProject(0);
        logicController.addTask(0, 'Example Task: Click me!', 'Use the edit and delete buttons to update your tasks', false);
    }
    
    const renderDOM = () => {
        setTutorialProject();
        renderProjectArea();
        addProjectDropDownEventListener();
        addNewProjectEventListener();
        addTaskModalCloseEventListener();        
    }

    return {
        renderDOM
    }

})();

export default DOMController;