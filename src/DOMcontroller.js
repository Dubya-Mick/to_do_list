import logicController from './logicController';
import Collapsible from 'materialize-css';


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
            
            //add classes/types to main collapsible componenents for task list
            taskHeader.classList.add('collapsible-header');
            taskBody.classList.add('collapsible-body');
            edtBtn.classList.add('waves-effect', 'waves-light', 'btn');
            dltBtn.classList.add('waves-effect', 'waves-light', 'btn');
            edtIcon.classList.add('material-icons');
            dltIcon.classList.add('material-icons');
            edtIcon.textContent = 'edit';
            dltIcon.textContent = 'delete';

            //append icons to buttons
            edtBtn.appendChild(edtIcon);
            dltBtn.appendChild(dltIcon);
            
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
            taskBody.appendChild(edtBtn);
            taskBody.appendChild(dltBtn);

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

        addTaskBtn.classList.add('waves-effect', 'waves-light', 'btn');
        addTaskBtn.textContent = 'Add Task';
        addTaskBtn.setAttribute('id', 'addTaskBtn');

        addTaskBtn.appendChild(addTaskIcon);
        //add event listener for btn to open modal window on click
        addTaskBtn.addEventListener('click', addTaskModalOpen);

        if (document.querySelector('#addTaskBtn') != null) {
            return
        } else {
            taskWrapper.appendChild(addTaskBtn);
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

    const collapsibleTest = () => {
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, true);
          });
    }
    
    const renderDOM = () => {
        setTutorialProject();
        renderProjectArea();
        addProjectDropDownEventListener();
        addNewProjectEventListener();
        addTaskModalCloseEventListener();    
        collapsibleTest();    
    }


    

    return {
        renderDOM
    }

})();

export default DOMController;