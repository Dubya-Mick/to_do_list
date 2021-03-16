import logicController from './logicController';
import Collapsible from 'materialize-css';
import Modal from 'materialize-css';
import Toasts from 'materialize-css';
import Sidenav from 'materialize-css';
import CharacterCounter from 'materialize-css';

const DOMController = (() => {

    //render projects, edit, and delete buttons for projects
    const renderProjectArea = () => {
        //grab div containing list of projects
        let projList = document.getElementById('projectList');
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
            editButton.textContent = "Edit";
            editButton.href = "#add-proj-modal";
 
            //create delete button
            let deleteButton = document.createElement('a');
            deleteButton.classList.add('waves-effect', 'waves-light', 'btn', 'proj-delete-button');

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

    const addProjectAreaEventListeners = () => {
        let projectTitles = [...document.querySelectorAll('.project')];
        for(let i = 0; i < projectTitles.length; i++) {
            projectTitles[i].addEventListener('click', (e) => {
                setCurrentProjectOnClick(e);
                displayCurrentProjectTitle();
                renderTasks(e);
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
                deleteProject(e);
            })
        }
    
    }
 

    const renderTasks = () => {
        //grab tasklist div
        let taskList = document.querySelector('#taskList');
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
            let taskBody = document.createElement('div');
            let taskText = document.createElement('span');
            let edtBtn = document.createElement('a');
            let dltBtn = document.createElement('a');
            let edtIcon = document.createElement('i');
            let dltIcon = document.createElement('i');
            let edtDltWrapper = document.createElement('div');

            //create completion checkbox
            let checkBoxWrapper = document.createElement('label');
            let checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            let checkBoxText = document.createElement('span');
            checkBoxText.textContent = 'Complete?';
            checkBoxWrapper.appendChild(checkBox);
            checkBoxWrapper.appendChild(checkBoxText);

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
            taskBody.classList.add('collapsible-body');
            taskText.classList.add('task-notes')
            edtBtn.classList.add('waves-effect', 'waves-light', 'btn', 'modal-trigger');
            edtBtn.href = '#add-task-modal'; //link edit button to update task modal
            dltBtn.classList.add('waves-effect', 'waves-light', 'btn');
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

            //fill textContent for task name and notes
            taskHeader.textContent = logicController.projects[projectIndex].tasks[i].title;
            taskText.textContent = logicController.projects[projectIndex].tasks[i].notes;
            
            //add event listeners to components
            taskHeader.addEventListener('click', (e) => {
                setCurrentTaskOnClick(e);
            });
            checkBox.addEventListener('click', (e) => {
                    toggleTaskComplete(e);
                    checkBoxLabelComplete(e);
            });
            dltBtn.addEventListener('click', deleteTask);
            edtBtn.addEventListener('click', editTaskModalOpen);


            //append task notes and edit/delete buttons to body of collapsible
            taskBody.appendChild(taskText);
            taskBody.appendChild(edtDltWrapper);

            //append checkbox to task header
            taskHeader.appendChild(checkBoxWrapper);

            //append task header and body to task container
            taskContainer.appendChild(taskHeader);
            taskContainer.appendChild(taskBody);

            allTasks.appendChild(taskContainer);
        }

        taskList.appendChild(allTasks);
    }
            
    //display title of project above task list
    const displayCurrentProjectTitle = () => {
         let projTitleDisplay = document.querySelector('#projTitle');
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
        let taskWrapper = document.querySelector('.task-list-wrapper');
        let addTaskBtn = document.createElement('a');
        let addTaskIcon = document.createElement('i');

        addTaskIcon.classList.add('material-icons', 'left');
        addTaskIcon.textContent = 'add';

        addTaskBtn.classList.add('waves-effect', 'waves-light', 'btn', 'modal-trigger');
        addTaskBtn.textContent = 'Add Task';
        addTaskBtn.setAttribute('id', 'addTaskBtn');

        addTaskBtn.appendChild(addTaskIcon);
        addTaskBtn.href = '#add-task-modal';
        addTaskBtn.addEventListener('click', addTaskModalOpen);

        if (document.querySelector('#addTaskBtn') != null) {
            return
        } else {
            taskWrapper.appendChild(addTaskBtn);
        }

        
    }

    const addNewProjectModalOpen = () => {
        //update project modal to reflect addition mode
        let projectModalHeader = document.getElementById('project-modal-header');
        projectModalHeader.textContent = 'Add Project';
        let editProjectLabel = document.getElementById('proj-input-label');
        editProjectLabel.classList.remove('active');
        let editProjectModalBtn = document.getElementById('add-new-proj-btn');
        editProjectModalBtn.textContent = "Add New Project";
        editProjectModalBtn.removeEventListener('click', editProject);
        editProjectModalBtn.addEventListener('click', addNewProject);
    }

    const addProjectModalEventListener = () => {
        let addProjectModalOpenBtn = document.getElementById('add-project-modal-open-btn');
        addProjectModalOpenBtn.addEventListener('click', addNewProjectModalOpen);
        let sidenavAddProjBtn = document.getElementById('sidenav-modal-addproj-btn');
        sidenavAddProjBtn.addEventListener('click', addNewProjectModalOpen);
    }

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
            }
    }

    const addNewProjectEventListener = () => {
        let addProjBtn = document.querySelector('#add-new-proj-btn');
        addProjBtn.addEventListener('click', addNewProject);
    }

   

    const editProjectModalOpen = (e) => {
        //change add project modal to reflect edit mode
        let projectIndex = e.target.getAttribute('data-projNum');
        logicController.setCurrentProject(projectIndex);
        let projectModalHeader = document.getElementById('project-modal-header');
        projectModalHeader.textContent = 'Edit Project';
        let projectTitleInput = document.getElementById('proj-title-input');
        projectTitleInput.value = logicController.projects[projectIndex].title;
        let editProjectLabel = document.getElementById('proj-input-label');
        editProjectLabel.classList.add('active');
        let editProjectModalBtn = document.getElementById('add-new-proj-btn');
        editProjectModalBtn.textContent = "Update Project Title";
        editProjectModalBtn.removeEventListener('click', addNewProject);
        editProjectModalBtn.addEventListener('click', editProject);
        
    }

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
        }
    }

    const deleteProject = (e) => {
        //grab corresponding index of proj from data-attribute of trash button
        //grab div for proper removal of DOM elements as projects are deleted
        let projectIndex = e.target.getAttribute('data-projNum');
        let numberOfProjects = logicController.projects.length;
        let taskList = document.querySelector('#taskList');
        let projTitleDisplay = document.querySelector('#projTitle');
        //reset task list if no projects remain after deleting last one
        if (numberOfProjects == 1) {
            logicController.deleteProject(projectIndex);
            renderProjectArea();
            clearDisplay(taskList);
            projTitleDisplay.textContent = "Project Title";
            if (document.getElementById('addTaskBtn')) {
                document.getElementById('addTaskBtn').outerHTML = '';
            }
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
        //change new task modal window text to reflect add task mode
        let taskModalHeader = document.getElementById('task-modal-header');
        taskModalHeader.textContent = 'Add New Task'
        let addTaskTitle = document.getElementById('task-input-label');
        addTaskTitle.textContent = 'Task Title';
        let addTaskNotes = document.getElementById('task-notes-label');
        addTaskNotes.textContent = 'Notes';
        let addTaskModalBtn = document.getElementById('add-new-task-btn');
        addTaskModalBtn.textContent = "Add Task";
        let taskTitleInput = document.getElementById('task-title-input');
        taskTitleInput.value = '';
        let taskNotesInput = document.getElementById('task-notes-input');
        taskNotesInput.value  = '';


        addTaskModalBtn.removeEventListener('click', editTask);
        addTaskModalBtn.addEventListener('click', addTask);
    }

    const addTask = () => {
        let taskTitleInput = document.getElementById('task-title-input').value;
        let taskNotesInput = document.getElementById('task-notes-input').value;
        if (taskTitleInput.length < 1) {
            M.toast({html: 'The title of this task seems a little short!'});
        } else if (taskTitleInput.length > 30) {
            M.toast({html: 'Shorten up this here task title.'});
        } else if (taskNotesInput.length < 1) {
            M.toast({html: 'Give us some more detail in the notes!'});
        } else if (taskNotesInput.length > 500) {
            M.toast({html: 'Shorten up these here notes!'});
        } else {
            logicController.addTask(logicController.getCurrentProjectIndex(), taskTitleInput, taskNotesInput, false);
            var modalInstance = M.Modal.getInstance(document.getElementById('add-task-modal'));
            modalInstance.close();
            renderTasks();
        }
    }

    const addNewTaskEventListener = () => {
        let addTaskModalBtn = document.getElementById('add-new-task-btn');
        addTaskModalBtn.addEventListener('click', addTask);
    }

    const deleteTask = () => {
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = logicController.getCurrentTaskIndex();
        logicController.deleteTask(projectIndex, taskIndex);
        renderTasks();
    }

    const editTask = () => {
        let projectIndex = logicController.getCurrentProjectIndex();
        let taskIndex = logicController.getCurrentTaskIndex();
        let editedTitle = document.getElementById('task-title-input').value;
        let editedNotes = document.getElementById('task-notes-input').value;
        if (editedTitle.length < 1) {
            M.toast({html: 'The title of this task seems a little short!'});
        } else if (editedNotes.length < 1) {
            M.toast({html: 'Give us some more detail in the notes!'});
        } else {
            logicController.editTaskTitle(projectIndex, taskIndex, editedTitle);
            logicController.editTaskNotes(projectIndex, taskIndex, editedNotes);
            var modalInstance = M.Modal.getInstance(document.getElementById('add-task-modal'));
            modalInstance.close();
            renderTasks();
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
    
    const renderDOM = () => {
        setTutorialProject();
        renderProjectArea();
        addNewProjectEventListener();
        addProjectModalEventListener();
        addNewTaskEventListener();
        materializeCollapsible(); 
        materializeModal(); 
        materializeSideNav();  
        materializeCharacterCount();
    }


    

    return {
        renderDOM
    }

})();

export default DOMController;