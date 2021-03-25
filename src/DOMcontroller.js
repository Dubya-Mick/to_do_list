import logicController from './logicController';
import firebaseController from './firebaseController';
import Collapsible from 'materialize-css';
import Modal from 'materialize-css';
import Toasts from 'materialize-css';
import Sidenav from 'materialize-css';
import CharacterCounter from 'materialize-css';
import Datepicker from 'materialize-css';
import { parse } from 'date-fns';

const DOMController = (() => {

    //render projects, edit, and delete buttons for projects
    const renderProjectArea = () => {
        //grab div containing list of projects
        let projList = document.getElementById('project-list');
        //clear display before repopulating
        let sideNav = document.getElementById('sidenav-project-wrapper');
        clearDisplay(sideNav);
        clearDisplay(projList);
        
        let sideNavProjects = document.createDocumentFragment();
        let allProjectTitles = document.createDocumentFragment();
        //render those project titles to the DOM
        //adding event listeners as the divs are added
        for(let i= 0; i < logicController.projects.length; i++) {

            //create div for project and add event listeners
            let projectTitle = document.createElement('div');
            projectTitle.textContent = logicController.projects[i].title;
            projectTitle.classList.add('project');
 
            //create edit button
            let editButton = document.createElement('a');
            editButton.classList.add('waves-effect', 'waves-light', 'btn', 'projectEditButton', 'modal-trigger');
            editButton.href = "#add-proj-modal";

            //create edit icon
            let editIcon = document.createElement('i');
            editIcon.classList.add('material-icons');
            editIcon.textContent = 'edit'
            editButton.appendChild(editIcon);
 
            //create delete button
            let deleteButton = document.createElement('a');
            deleteButton.classList.add('waves-effect', 'waves-light', 'btn', 'modal-trigger', 'proj-delete-button');
            deleteButton.href = "#delete-modal";

            //create delete icon
            let deleteIcon = document.createElement('i');
            deleteIcon.classList.add('material-icons')
            deleteIcon.textContent = 'delete';
            deleteButton.appendChild(deleteIcon);

            //add data-attributes so items can be tracked
            projectTitle.setAttribute('data-projNum', `${i}`);
            editButton.setAttribute('data-projNum', `${i}`);
            editIcon.setAttribute('data-projNum', `${i}`);
            deleteButton.setAttribute('data-projNum', `${i}`);
            deleteIcon.setAttribute('data-projNum', `${i}`);

            //clone components for sidenav
            let sideProj = projectTitle.cloneNode(true);
            let sideEdit = editButton.cloneNode(true);
            let sideDelete = deleteButton.cloneNode(true);

            //append items to the document frag before appending to DOM
            allProjectTitles.appendChild(projectTitle);
            allProjectTitles.appendChild(editButton);
            allProjectTitles.appendChild(deleteButton);

            sideNavProjects.appendChild(sideProj);
            sideNavProjects.appendChild(sideEdit);
            sideNavProjects.appendChild(sideDelete);
            
        }

        projList.appendChild(allProjectTitles);
        sideNav.appendChild(sideNavProjects);
        addProjectAreaEventListeners();
       
        
    }

    //add event listeners for project titles, edit and delete buttons
    const addProjectAreaEventListeners = () => {
        let projectTitles = [...document.querySelectorAll('.project')];
        for(let i = 0; i < projectTitles.length; i++) {
            projectTitles[i].addEventListener('click', (e) => {
                setCurrentProjectOnClick(e);
                displayCurrentProjectTitle();
                renderTaskArea(e);
                renderAddTaskBtn();
            })
        } 

        let projectEditButtons = [...document.querySelectorAll('.projectEditButton')];
        for(let i = 0; i < projectEditButtons.length; i++) {
            projectEditButtons[i].addEventListener('click', (e) => {
                editProjectModalOpen(e);
            })
        }

        let projectDeleteButtons = [...document.querySelectorAll('.proj-delete-button')];
        for(let i = 0; i < projectDeleteButtons.length; i++) {
            projectDeleteButtons[i].addEventListener('click', (e) => {
                deleteProjectModalOpen(e);
            })
        }
    
    }
 
    //render task area in materialize collapsible format
    const renderTaskArea = () => {
        //grab tasklist div
        let taskList = document.querySelector('#task-list');
        //grab index of project 
        let projectIndex = logicController.getCurrentProjectIndex();
        //clear previous task list before rendering new one
        clearDisplay(taskList);

        
        
        //render current task titles (shown) and task details (hidden)
        let allTasks = document.createDocumentFragment();
        for(let i = 0; i < logicController.projects[projectIndex].tasks.length; i++) {
            
            //create collapsible components for task list
            let taskContainer = document.createElement('li');
            let taskHeader = document.createElement('div');
            let taskTitle = document.createElement('span');
            let taskBody = document.createElement('div');
            let taskText = document.createElement('span');
            let edtBtn = document.createElement('a');
            let dltBtn = document.createElement('a');
            let edtIcon = document.createElement('i');
            let dltIcon = document.createElement('i');
            let edtDltWrapper = document.createElement('div');

            //create completion checkbox
            let checkBoxWrapper = document.createElement('label');
            checkBoxWrapper.classList.add('check-box-wrapper');
            let checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            let checkBoxText = document.createElement('span');
            checkBoxText.textContent = 'Complete?';
            checkBoxWrapper.appendChild(checkBox);
            checkBoxWrapper.appendChild(checkBoxText);

            //create span to contain due date for task
            let dueDate = document.createElement('span');
            dueDate.classList.add('due-date');
            if (logicController.projects[projectIndex].tasks[i].dueDate) {
                dueDate.textContent = `Due: ${logicController.projects[projectIndex].tasks[i].dueDate}`
            } else {
                dueDate.textContent = "Due Date: None";
            }
            console.log(logicController.projects[projectIndex].tasks[i].isComplete);
            

            //logic to control display of already completed tasks
            if (logicController.projects[projectIndex].tasks[i].isComplete == true) {
                checkBox.checked = true;
                checkBox.nextSibling.textContent = "Complete!"
            } else {
                checkBox.checked = false;
                checkBox.nextSibling.textContent = "Complete?"
            }
            
            //add classes/types to main collapsible components for task list
            taskHeader.classList.add('collapsible-header');
            taskTitle.classList.add('task-title');
            taskBody.classList.add('collapsible-body');
            taskText.classList.add('task-notes')
            edtBtn.classList.add('waves-effect', 'waves-light', 'btn', 'modal-trigger');
            edtBtn.href = '#add-task-modal'; //link edit button to update task modal
            dltBtn.classList.add('waves-effect', 'waves-light', 'btn', 'modal-trigger');
            dltBtn.href = '#delete-modal';
            edtIcon.classList.add('material-icons');
            dltIcon.classList.add('material-icons');
            edtIcon.textContent = 'edit';
            dltIcon.textContent = 'delete';

            //add a little style to muh edit/delete buttons
            dltBtn.style.margin = '2px';
            edtBtn.style.margin = '2px';
            edtDltWrapper.style.float = 'right';

            //append icons to buttons, buttons to wrapper
            edtBtn.appendChild(edtIcon);
            dltBtn.appendChild(dltIcon);
            edtDltWrapper.appendChild(edtBtn);
            edtDltWrapper.appendChild(dltBtn);
            
            //add data attributes for tracing of task indices
            taskHeader.setAttribute('data-taskNum', `${i}`);
            checkBox.setAttribute('data-taskNum', `${i}`);
            taskTitle.setAttribute('data-taskNum', `${i}`);
            dueDate.setAttribute('data-taskNum', `${i}`);

            //fill textContent for task title and notes
            taskTitle.textContent = logicController.projects[projectIndex].tasks[i].title;
            taskText.textContent = logicController.projects[projectIndex].tasks[i].notes;
            
            //add event listeners to components
            taskHeader.addEventListener('click', (e) => {
                setCurrentTaskOnClick(e);
            });
            checkBox.addEventListener('click', (e) => {
                toggleTaskComplete(e);
                checkBoxLabelComplete(e);
            });
            checkBoxWrapper.addEventListener('click', (e) => {
                //prevent collapsible event from triggering
                e.stopPropagation();
            })
            dltBtn.addEventListener('click', deleteTaskModalOpen);
            edtBtn.addEventListener('click', editTaskModalOpen);


            //append task notes and edit/delete buttons to body of collapsible
            taskBody.appendChild(taskText);
            taskBody.appendChild(edtDltWrapper);

            //append title, checkbox, and due date to task header
            taskHeader.appendChild(checkBoxWrapper);
            taskHeader.appendChild(taskTitle);
            
            taskHeader.appendChild(dueDate);

            
            

            //append task header and body to task container
            taskContainer.appendChild(taskHeader);
            taskContainer.appendChild(taskBody);

            allTasks.appendChild(taskContainer);
        }
        renderSortBar();
        taskList.appendChild(allTasks);
    }
            
    //display title of project above task list
    const displayCurrentProjectTitle = () => {
         let projTitleDisplay = document.querySelector('#proj-title');
         let currentProjIndex = logicController.getCurrentProjectIndex();
         projTitleDisplay.textContent = logicController.projects[currentProjIndex].title;
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
        if (document.querySelector('#add-task-btn')) {
            return
        } else {
            let taskWrapper = document.querySelector('.task-list-wrapper');
            let addTaskBtn = document.createElement('a');
            let addTaskIcon = document.createElement('i');

            addTaskIcon.classList.add('material-icons', 'left');
            addTaskIcon.textContent = 'add';

            addTaskBtn.classList.add('waves-effect', 'waves-light', 'btn', 'modal-trigger');
            addTaskBtn.textContent = 'Add Task';
            addTaskBtn.setAttribute('id', 'add-task-btn');

            addTaskBtn.appendChild(addTaskIcon);
            addTaskBtn.href = '#add-task-modal';
            addTaskBtn.addEventListener('click', addTaskModalOpen);
            taskWrapper.appendChild(addTaskBtn);
        }
    }

    const renderSortBar = () => {
        if (document.querySelector('#sort-bar')) {
            return
        } else {

            let taskArea = document.getElementById('task-area');

            let sortBar = document.createElement('div');
            sortBar.setAttribute('id', 'sort-bar');

            let clearComplete = document.createElement('a');
            clearComplete.href = '#complete-modal';
            clearComplete.setAttribute('id', 'clear-complete');
            clearComplete.classList.add('sort-button', 'modal-trigger');
            clearComplete.textContent = 'Clear Completed';
            clearComplete.href = '#complete-modal';
            
            

            let alphaSort = document.createElement('a');
            alphaSort.setAttribute('id', 'alpha-sort');
            alphaSort.classList.add('sort-button');
            alphaSort.textContent = "A-Z";
            alphaSort.addEventListener('click', sortAtoZ);

            let dateSort = document.createElement('a');
            dateSort.setAttribute('id', 'date-sort');
            dateSort.classList.add('sort-button');
            dateSort.textContent = "Date";
            dateSort.addEventListener('click', () => {
                sortByDate();
            });

            let dateSortIcon = document.createElement('i');
            dateSortIcon.classList.add('material-icons', 'right', 'date-icon');
            dateSortIcon.textContent = "keyboard_arrow_down";
            dateSort.appendChild(dateSortIcon);

            sortBar.appendChild(clearComplete);
            sortBar.appendChild(alphaSort);
            sortBar.appendChild(dateSort);
            taskArea.insertBefore(sortBar, taskArea.childNodes[2]);
        }
    }

    //updates project modal window to reflect editing mode
    const addNewProjectModalOpen = () => {
        //update project modal to reflect addition mode
        let projTitleInput = document.getElementById('proj-title-input');
        projTitleInput.value = '';
        let projectModalHeader = document.getElementById('project-modal-header');
        projectModalHeader.textContent = 'Add Project';
        let editProjectLabel = document.getElementById('proj-input-label');
        editProjectLabel.classList.remove('active');
        let editProjectModalBtn = document.getElementById('add-new-proj-btn');
        editProjectModalBtn.textContent = "Add New Project";
        editProjectModalBtn.removeEventListener('click', editProject);
        editProjectModalBtn.addEventListener('click', addNewProject);
    }

    //adds event listener to for opening modal windows for project addition
    const addProjectModalEventListener = () => {
        let addProjectModalOpenBtn = document.getElementById('add-project-modal-open-btn');
        addProjectModalOpenBtn.addEventListener('click', addNewProjectModalOpen);
        let sidenavAddProjBtn = document.getElementById('sidenav-modal-addproj-btn');
        sidenavAddProjBtn.addEventListener('click', addNewProjectModalOpen);
    }

    //adds new project and renders result to DOM
    const addNewProject = () => {
        let newProjTitle = document.querySelector("#proj-title-input").value;
            if(newProjTitle.length == 0) {
                M.toast({html: 'Give us a project title!'});
            } else if (newProjTitle.length > 20) {
                M.toast({html: 'Shorten up this here title.'});
            } else {
                var modalInstance = M.Modal.getInstance(document.getElementById('add-proj-modal'));
                logicController.addProject(newProjTitle); //add project
                renderProjectArea(); 
                modalInstance.close();
                document.querySelector("#proj-title-input").value = ''; //empty text input
                updateStorage();
            }
    }

    //adds event listener for adding project in modal window
    const addNewProjectEventListener = () => {
        let addProjBtn = document.querySelector('#add-new-proj-btn');
        addProjBtn.addEventListener('click', addNewProject);
    }

    //updates modal window to reflect project editing mode
    const editProjectModalOpen = (e) => {
        //change add project modal to reflect edit mode
        let projectIndex = e.target.getAttribute('data-projNum');
        logicController.setCurrentProject(projectIndex);
        let projectTitle = logicController.getCurrentProjectTitle();
        let projectModalHeader = document.getElementById('project-modal-header');
        projectModalHeader.textContent = 'Edit Project';
        let projectTitleInput = document.getElementById('proj-title-input');
        projectTitleInput.value = `${projectTitle}`;
        let editProjectLabel = document.getElementById('proj-input-label');
        editProjectLabel.classList.add('active');
        let editProjectModalBtn = document.getElementById('add-new-proj-btn');
        editProjectModalBtn.textContent = "Update Project Title";
        editProjectModalBtn.removeEventListener('click', addNewProject);
        editProjectModalBtn.addEventListener('click', editProject);
        
    }

    //updates project info and renders result to DOM
    const editProject = () => {
        let projectIndex = logicController.getCurrentProjectIndex();
        let newProjTitle = document.querySelector("#proj-title-input").value;
        if(newProjTitle.length == 0) {
            M.toast({html: 'Give us a project title!'});
        } else if (newProjTitle.length > 20) {
            M.toast({html: 'Shorten up this here title.'});
        } else {
            var modalInstance = M.Modal.getInstance(document.getElementById('add-proj-modal'));
            logicController.editProject(projectIndex, newProjTitle); //update project title
            renderProjectArea(); 
            modalInstance.close();
            document.querySelector("#proj-title-input").value = ''; //empty text input
            updateStorage();
        }
    }

    //add event listener for closure of modal window if no deletion desired for clear complete and normal delete
    const cancelDeleteEventListener = () => {
        let cancelDelButton = document.getElementById('cancel-delete-btn');
        cancelDelButton.addEventListener('click', () => {
            let modalInstance = M.Modal.getInstance(document.getElementById('delete-modal'));
            modalInstance.close();
        })

        let cancelClearButton = document.getElementById('cancel-clear-btn');
        cancelClearButton.addEventListener('click', () => {
            let modalInstance = M.Modal.getInstance(document.getElementById('complete-modal'));
            modalInstance.close();
        })
    }

    //updates deletion modal to reflect deletion of project
    const deleteProjectModalOpen = (e) => {
        let projectIndex = e.target.getAttribute('data-projNum');
        logicController.setCurrentProject(projectIndex);
        let projectTitle = logicController.getCurrentProjectTitle();
        let deleteProjectHeader = document.getElementById('delete-modal-header');
        deleteProjectHeader.textContent = `Delete "${projectTitle}?"`;
        let deleteProjectButton = document.getElementById('delete-modal-btn');
        deleteProjectButton.textContent = "Delete Project"

        deleteProjectButton.removeEventListener('click', deleteTask);
        deleteProjectButton.addEventListener('click', deleteProject);
        
    }

    //deletes project and renders result to DOM
    const deleteProject = () => {
        //grab corresponding index of proj from data-attribute of trash button
        //grab div for proper removal of DOM elements as projects are deleted
        let projectIndex = logicController.getCurrentProjectIndex();
        let numberOfProjects = logicController.projects.length;
        let taskList = document.querySelector('#task-list');
        let projTitleDisplay = document.querySelector('#proj-title');
        let modalInstance = M.Modal.getInstance(document.getElementById('delete-modal'));

        //reset task list if no projects remain after deleting last one
        if (numberOfProjects == 1) {
            logicController.deleteProject(projectIndex);
            renderProjectArea();
            clearDisplay(taskList);
            projTitleDisplay.textContent = "Project Title";
            if (document.getElementById('add-task-btn')) {
                document.getElementById('add-task-btn').outerHTML = '';
            }

            if(document.getElementById('sort-bar')) {
                document.getElementById('sort-bar').outerHTML = '';
            }
            //if to-be-deleted project is the current active project,
            //update the current project to first in the list and display
        } else if (logicController.getCurrentProjectIndex() == projectIndex) {
            logicController.deleteProject(projectIndex);
            logicController.setCurrentProject(0);
            renderProjectArea();
            displayCurrentProjectTitle();
            renderTaskArea();
        } else {
            logicController.deleteProject(projectIndex);
            renderProjectArea();
        }
        modalInstance.close();
        updateStorage();
    }


    //update task modal window to reflect addition mode
    const addTaskModalOpen = () => {
        //change new task modal window text to reflect add task mode
        let taskModalHeader = document.getElementById('task-modal-header');
        taskModalHeader.textContent = 'Add New Task'
        let addTaskTitle = document.getElementById('task-input-label');
        addTaskTitle.textContent = 'Task Title';
        addTaskTitle.classList.remove('active');
        let addTaskNotes = document.getElementById('task-notes-label');
        addTaskNotes.textContent = 'Notes';
        addTaskNotes.classList.remove('active');
        let datePickerLabel = document.getElementById('date-picker-label');
        datePickerLabel.classList.remove('active');
        let addTaskModalBtn = document.getElementById('add-new-task-btn');
        addTaskModalBtn.textContent = "Add Task";
        let taskTitleInput = document.getElementById('task-title-input');
        taskTitleInput.value = '';
        let taskNotesInput = document.getElementById('task-notes-input');
        taskNotesInput.value  = '';
        let datePicker = document.getElementById('date-picker');
        datePicker.value = '';


        addTaskModalBtn.removeEventListener('click', editTask);
        addTaskModalBtn.addEventListener('click', addTask);
    }

    //adds task and renders result to DOM
    const addTask = () => {
        let taskTitleInput = document.getElementById('task-title-input').value;
        let taskNotesInput = document.getElementById('task-notes-input').value;
        let taskDueDate = document.getElementById('date-picker').value;
        console.log(taskDueDate);
        if (taskTitleInput.length < 1) {
            M.toast({html: 'The title of this task seems a little short!'});
        } else if (taskTitleInput.length > 30) {
            M.toast({html: 'Shorten up this here task title.'});
        } else if (taskNotesInput.length < 1) {
            M.toast({html: 'Give us some more detail in the notes!'});
        } else if (taskNotesInput.length > 500) {
            M.toast({html: 'Shorten up these here notes!'});
        } else {
            logicController.addTask(logicController.getCurrentProjectIndex(), taskTitleInput, taskNotesInput, false, taskDueDate);
            var modalInstance = M.Modal.getInstance(document.getElementById('add-task-modal'));
            modalInstance.close();
            renderTaskArea();
            updateStorage();
        }
    }

    //adds event listener to add task button in modal window
    const addNewTaskEventListener = () => {
        let addTaskModalBtn = document.getElementById('add-new-task-btn');
        addTaskModalBtn.addEventListener('click', addTask);
    }

    //updates delete modal to reflect deletion of task
    const deleteTaskModalOpen = () => {
        let taskTitle = logicController.getCurrentTaskTitle();
        let deleteTaskHeader = document.getElementById('delete-modal-header');
        deleteTaskHeader.textContent = `Delete "${taskTitle}?"`
        let deleteTaskButton = document.getElementById('delete-modal-btn');
        deleteTaskButton.textContent = "Delete Task"

        deleteTaskButton.removeEventListener('click', deleteProject);
        deleteTaskButton.addEventListener('click', deleteTask);
    }

    //deletes task and renders result to DOM
    const deleteTask = () => {
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = logicController.getCurrentTaskIndex();
        let modalInstance = M.Modal.getInstance(document.getElementById('delete-modal'));
        logicController.deleteTask(projectIndex, taskIndex);
        renderTaskArea();
        modalInstance.close();
        updateStorage();
    }

    //edits task and redners result to DOM
    const editTask = () => {
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = logicController.getCurrentTaskIndex();
        let editedTitle = document.getElementById('task-title-input').value;
        let editedNotes = document.getElementById('task-notes-input').value;
        let editedDueDate = document.getElementById('date-picker').value;
        if (editedTitle.length < 1) {
            M.toast({html: 'The title of this task seems a little short!'});
        } else if (editedNotes.length < 1) {
            M.toast({html: 'Give us some more detail in the notes!'});
        } else {
            logicController.editTaskTitle(projectIndex, taskIndex, editedTitle);
            logicController.editTaskNotes(projectIndex, taskIndex, editedNotes);
            logicController.editTaskDueDate(projectIndex, taskIndex, editedDueDate);
            var modalInstance = M.Modal.getInstance(document.getElementById('add-task-modal'));
            modalInstance.close();
            renderTaskArea();
            updateStorage();
        }
    }
    
    //change the modal window for adding tasks into one for editing tasks
    const editTaskModalOpen = () => {
        
        //grab current indices
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = logicController.getCurrentTaskIndex();
        //change text of modal window to reflect editing mode
        let taskModalHeader = document.getElementById('task-modal-header');
        taskModalHeader.textContent = 'Edit Task';
        let editTaskTitle = document.getElementById('task-input-label');
        editTaskTitle.classList.add('active');
        editTaskTitle.textContent = 'Edit Title';
        let editTaskNotes = document.getElementById('task-notes-label');
        editTaskNotes.classList.add('active');
        editTaskNotes.textContent = 'Edit Notes';
        let editTaskModalBtn = document.getElementById('add-new-task-btn');
        editTaskModalBtn.textContent = "Edit Task";
        let datePickerLabel = document.getElementById('date-picker-label');
        datePickerLabel.classList.add('active');
        //display current title for editing
        let editTitleInput = document.getElementById('task-title-input');
        
        editTitleInput.value = logicController.projects[projectIndex].tasks[taskIndex].title;
        //display current notes for editing
        let editNotesInput = document.getElementById('task-notes-input');
        editNotesInput.value = logicController.projects[projectIndex].tasks[taskIndex].notes;

        //display current date for editing
        let datePicker = document.getElementById('date-picker');
        datePicker.value = logicController.projects[projectIndex].tasks[taskIndex].dueDate;
        //remove add task event listener and replace with edit task event listener
        editTaskModalBtn.removeEventListener('click', addTask);
        editTaskModalBtn.addEventListener('click', editTask);
    }

    //controls toggling of task completion checkbox
    const toggleTaskComplete = (e) => {
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = e.target.getAttribute('data-taskNum');
        logicController.toggleComplete(projectIndex, taskIndex);
        updateStorage();
    }

    //updates checkbox label to reflect completion
    const checkBoxLabelComplete = (e) => {
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = e.target.getAttribute('data-taskNum');
        let checkBoxLabel = e.target.nextSibling;
        if (logicController.projects[projectIndex].tasks[taskIndex].isComplete == true) {
            checkBoxLabel.textContent = 'Complete!';
        } else {
            checkBoxLabel.textContent = "Complete?";
        } 
    }

    const sortByDate = () => {
        let dateSortIcon = document.querySelector('.date-icon')
        if (dateSortIcon.textContent == 'keyboard_arrow_down') {
            logicController.sortTasksRecentLast();
            renderTaskArea();
            dateSortIcon.textContent = 'keyboard_arrow_up';
        } else {
            logicController.sortTasksRecentFirst();
            renderTaskArea();
            dateSortIcon.textContent= 'keyboard_arrow_down';
        }
    }

    const sortAtoZ = () => {
        let alphaSortButton = document.getElementById('alpha-sort');
        if (alphaSortButton.textContent == 'A-Z') {
            alphaSortButton.textContent = 'Z-A';
            logicController.sortTasksZtoA();
            renderTaskArea();
        } else {
            alphaSortButton.textContent = 'A-Z';
            logicController.sortTasksAtoZ();
            renderTaskArea();
        }
    }


    const clearCompleteEventListener = () => {
        let clearBtn = document.getElementById('clear-modal-btn');
        clearBtn.addEventListener('click', () => {
            logicController.clearCompleteTasks();
            renderTaskArea();
            let modalInstance = M.Modal.getInstance(document.getElementById('complete-modal'));
            modalInstance.close();
        })
    }





    const clearDisplay = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }

    //sets default project/task on load
    const setTutorialProject = () => {
        logicController.addProject('Example Project');
        logicController.setCurrentProject(0);
        logicController.addTask(0, 'Example Task: Click me!', 'Use the edit and delete buttons to update your tasks', false, 'Feb 13, 2020');
        logicController.addTask(0, 'Dump', 'Use the edit and delete buttons to update your tasks', false, 'Mar 26, 2021');
        logicController.addTask(0, 'ECoom', 'Use the edit and delete buttons to update your tasks', false, 'Mar 25, 2021');
        logicController.addTask(0, 'Jumanji', 'Use the edit and delete buttons to update your tasks', false, 'Jan 20, 2022');
        logicController.addTask(0, 'Scoob', 'Use the edit and delete buttons to update your tasks', false, 'May 16, 2025');
        logicController.addProject('test 2');
    }

    const materializeCollapsible = () => {
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, true);
          });
    }

    const materializeModal = () => {
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.modal');
            var instances = M.Modal.init(elems, true);
          });
    }

    const materializeSideNav = () => {
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.sidenav');
            var instances = M.Sidenav.init(elems, true);
          });
    }

    const materializeCharacterCount = () => {
        document.addEventListener('DOMContentLoaded', function () {
            var textNeedCount = document.querySelectorAll('#proj-title-input, #task-title-input, #task-notes-input');
            M.CharacterCounter.init(textNeedCount);
        });
    }

    const materializeDatePicker = () => {
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.datepicker');
            var instances = M.Datepicker.init(elems, {
                container: document.getElementsByTagName('body') //sets container div for date picker
            });
          });
    }

    const updateStorage = () => {
        if (logicController.storageIsLocal) {
            logicController.populateStorage();
        }
    }

    const checkForStoredProjects = () => {
        if (!localStorage.getItem('toDoProjects')) {
            setTutorialProject();
            logicController.populateStorage();
        } else {
            logicController.getProjectsFromLocalStorage();
            logicController.setCurrentProject(0);
        }
    }

    const checkLocalStoreCapability = () => {
        if (logicController.storageAvailable('localStorage')) {
            logicController.storageIsLocal = true;
            checkForStoredProjects();
            renderDOM();
            var elem = M.Modal.getInstance(document.getElementById('storage-modal'))
            elem.close();
        } else {
            M.toast({html: 'Sorry, no local storage capability.'});
        }
    }
  
    const storageModal = () => {
        document.addEventListener('DOMContentLoaded', function() {
            var elem = document.getElementById('storage-modal');
            var instance = M.Modal.init(elem, {
                dismissible: false
            })
            instance.open()
        })
    }

    const storageEventListeners = () => {
        let localStorageButton = document.getElementById('local-storage-btn');
        localStorageButton.addEventListener('click', checkLocalStoreCapability);
        let cloudStorageButton = document.getElementById('cloud-storage-btn');
        cloudStorageButton.addEventListener('click', firebaseInit);
    }

    const firebaseInit = () => {
        logicController.storageIsFirebase = true;
        firebaseController.firebaseInit();
        setTutorialProject()
        renderDOM();
        createSignInButton();
        var elem = M.Modal.getInstance(document.getElementById('storage-modal'))
        elem.close();
    }

    const createSignInButton = () => {
        let signInIcon = document.createElement('i');
        signInIcon.classList.add('material-icons', 'large');
        signInIcon.textContent = 'account_circle';
        let signInButton =document.getElementById('sign-in-btn');
        signInButton.appendChild(signInIcon);
        signInButton.addEventListener('click', firebaseController.signIn);

    }


    const initialLoad = () => {
        materializeCollapsible(); 
        materializeModal(); 
        materializeSideNav();  
        materializeCharacterCount();
        materializeDatePicker();
        storageModal();
        storageEventListeners();
    }

    
    const renderDOM = () => {
        renderProjectArea();
        renderTaskArea();
        renderAddTaskBtn();
        displayCurrentProjectTitle();
        addNewProjectEventListener();
        addProjectModalEventListener();
        addNewTaskEventListener();
        cancelDeleteEventListener();
        clearCompleteEventListener();
    }

    const renderNormal = () => {
        setTutorialProject();
        renderProjectArea();
        renderTaskArea();
        renderAddTaskBtn();
        displayCurrentProjectTitle();
        addNewProjectEventListener();
        addProjectModalEventListener();
        addNewTaskEventListener();
        cancelDeleteEventListener();
        materializeCollapsible(); 
        materializeModal(); 
        materializeSideNav();  
        materializeCharacterCount();
        materializeDatePicker();
        clearCompleteEventListener();
    }


    

    return {
        initialLoad,
        renderDOM,
        renderNormal
    }

})();

export default DOMController;