/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/** @format */
import { Collapsible, Modal, Toasts, Sidenav, CharacterCounter, Datepicker } from 'materialize-css';
import firebaseController from './firebaseController';
import logicController from './logicController';

const DOMController = (() => {
  // render projects, edit, and delete buttons for projects
  const renderProjectArea = () => {
    // grab div containing list of projects
    const projList = document.getElementById('project-list');
    // clear display before repopulating
    const sideNav = document.getElementById('sidenav-project-wrapper');
    clearDisplay(sideNav);
    clearDisplay(projList);

    const sideNavProjects = document.createDocumentFragment();
    const allProjectTitles = document.createDocumentFragment();
    // render those project titles to the DOM
    // adding event listeners as the divs are added
    for (let i = 0; i < logicController.projects.length; i++) {
      // create div for project and add event listeners
      const projectTitle = document.createElement('div');
      projectTitle.textContent = logicController.projects[i].title;
      projectTitle.classList.add('project');

      // create edit button
      const editButton = document.createElement('a');
      editButton.classList.add('waves-effect', 'waves-light', 'btn', 'projectEditButton', 'modal-trigger');
      editButton.href = '#add-proj-modal';

      // create edit icon
      const editIcon = document.createElement('i');
      editIcon.classList.add('material-icons');
      editIcon.textContent = 'edit';
      editButton.appendChild(editIcon);

      // create delete button
      const deleteButton = document.createElement('a');
      deleteButton.classList.add('waves-effect', 'waves-light', 'btn', 'modal-trigger', 'proj-delete-button');
      deleteButton.href = '#delete-modal';

      // create delete icon
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('material-icons');
      deleteIcon.textContent = 'delete';
      deleteButton.appendChild(deleteIcon);

      // add data-attributes so items can be tracked
      projectTitle.setAttribute('data-projNum', `${i}`);
      editButton.setAttribute('data-projNum', `${i}`);
      editIcon.setAttribute('data-projNum', `${i}`);
      deleteButton.setAttribute('data-projNum', `${i}`);
      deleteIcon.setAttribute('data-projNum', `${i}`);

      // clone components for sidenav
      const sideProj = projectTitle.cloneNode(true);
      const sideEdit = editButton.cloneNode(true);
      const sideDelete = deleteButton.cloneNode(true);

      // append items to the document frag before appending to DOM
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
  };

  // add event listeners for project titles, edit and delete buttons
  const addProjectAreaEventListeners = () => {
    const projectTitles = [...document.querySelectorAll('.project')];
    for (let i = 0; i < projectTitles.length; i++) {
      projectTitles[i].addEventListener('click', (e) => {
        setCurrentProjectOnClick(e);
        displayCurrentProjectTitle();
        renderTaskArea(e);
        renderAddTaskBtn();
      });
    }

    const projectEditButtons = [...document.querySelectorAll('.projectEditButton')];
    for (let i = 0; i < projectEditButtons.length; i++) {
      projectEditButtons[i].addEventListener('click', (e) => {
        editProjectModalOpen(e);
      });
    }

    const projectDeleteButtons = [...document.querySelectorAll('.proj-delete-button')];
    for (let i = 0; i < projectDeleteButtons.length; i++) {
      projectDeleteButtons[i].addEventListener('click', (e) => {
        deleteProjectModalOpen(e);
      });
    }
  };

  // render task area in materialize collapsible format
  const renderTaskArea = () => {
    // grab tasklist div
    const taskList = document.querySelector('#task-list');
    // grab index of project
    const projectIndex = logicController.getCurrentProjectIndex();
    // clear previous task list before rendering new one
    clearDisplay(taskList);

    // render current task titles (shown) and task details (hidden)
    const allTasks = document.createDocumentFragment();
    for (let i = 0; i < logicController.projects[projectIndex].tasks.length; i++) {
      // create collapsible components for task list
      const taskContainer = document.createElement('li');
      const taskHeader = document.createElement('div');
      const taskTitle = document.createElement('span');
      const taskBody = document.createElement('div');
      const taskText = document.createElement('span');
      const edtBtn = document.createElement('a');
      const dltBtn = document.createElement('a');
      const edtIcon = document.createElement('i');
      const dltIcon = document.createElement('i');
      const edtDltWrapper = document.createElement('div');

      // create completion checkbox
      const checkBoxWrapper = document.createElement('label');
      checkBoxWrapper.classList.add('check-box-wrapper');
      const checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      const checkBoxText = document.createElement('span');
      checkBoxText.textContent = 'Complete?';
      checkBoxWrapper.appendChild(checkBox);
      checkBoxWrapper.appendChild(checkBoxText);

      // create span to contain due date for task
      const dueDate = document.createElement('span');
      dueDate.classList.add('due-date');
      if (logicController.projects[projectIndex].tasks[i].dueDate) {
        dueDate.textContent = `Due: ${logicController.projects[projectIndex].tasks[i].dueDate}`;
      } else {
        dueDate.textContent = 'Due Date: None';
      }

      // logic to control display of already completed tasks
      if (logicController.projects[projectIndex].tasks[i].isComplete == true) {
        checkBox.checked = true;
        checkBox.nextSibling.textContent = 'Complete!';
      } else {
        checkBox.checked = false;
        checkBox.nextSibling.textContent = 'Complete?';
      }

      // add classes/types to main collapsible components for task list
      taskHeader.classList.add('collapsible-header');
      taskTitle.classList.add('task-title');
      taskBody.classList.add('collapsible-body');
      taskText.classList.add('task-notes');
      edtBtn.classList.add('waves-effect', 'waves-light', 'btn', 'modal-trigger', 'task-btn');
      edtBtn.href = '#add-task-modal'; // link edit button to update task modal
      dltBtn.classList.add('waves-effect', 'waves-light', 'btn', 'modal-trigger', 'task-btn');
      dltBtn.href = '#delete-modal';
      edtIcon.classList.add('material-icons');
      dltIcon.classList.add('material-icons');
      edtIcon.textContent = 'edit';
      dltIcon.textContent = 'delete';

      // add a little style to muh edit/delete buttons
      dltBtn.style.margin = '2px';
      edtBtn.style.margin = '2px';
      edtDltWrapper.classList.add('edt-dlt-wrapper');

      // append icons to buttons, buttons to wrapper
      edtBtn.appendChild(edtIcon);
      dltBtn.appendChild(dltIcon);
      edtDltWrapper.appendChild(edtBtn);
      edtDltWrapper.appendChild(dltBtn);

      // add data attributes for tracing of task indices
      taskHeader.setAttribute('data-taskNum', `${i}`);
      checkBox.setAttribute('data-taskNum', `${i}`);
      taskTitle.setAttribute('data-taskNum', `${i}`);
      dueDate.setAttribute('data-taskNum', `${i}`);

      // fill textContent for task title and notes
      taskTitle.textContent = logicController.projects[projectIndex].tasks[i].title;
      taskText.textContent = logicController.projects[projectIndex].tasks[i].notes;

      // add event listeners to components
      taskHeader.addEventListener('click', (e) => {
        setCurrentTaskOnClick(e);
      });
      checkBox.addEventListener('click', (e) => {
        toggleTaskComplete(e);
        checkBoxLabelComplete(e);
      });
      checkBoxWrapper.addEventListener('click', (e) => {
        // prevent collapsible event from triggering
        e.stopPropagation();
      });
      dltBtn.addEventListener('click', deleteTaskModalOpen);
      edtBtn.addEventListener('click', editTaskModalOpen);

      // append task notes and edit/delete buttons to body of collapsible
      taskBody.appendChild(taskText);
      taskBody.appendChild(edtDltWrapper);

      // append title, checkbox, and due date to task header
      taskHeader.appendChild(checkBoxWrapper);
      taskHeader.appendChild(taskTitle);

      taskHeader.appendChild(dueDate);

      // append task header and body to task container
      taskContainer.appendChild(taskHeader);
      taskContainer.appendChild(taskBody);

      allTasks.appendChild(taskContainer);
    }
    renderSortBar();
    taskList.appendChild(allTasks);
  };

  // display title of project above task list
  const displayCurrentProjectTitle = () => {
    const projTitleDisplay = document.querySelector('#proj-title');
    const currentProjIndex = logicController.getCurrentProjectIndex();
    projTitleDisplay.textContent = logicController.projects[currentProjIndex].title;
  };

  // sets the current project for later retrieval of index
  const setCurrentProjectOnClick = (e) => {
    const projectIndex = e.target.getAttribute('data-projNum');
    logicController.setCurrentProject(projectIndex);
  };

  // sets the current task for later retrieval of index
  const setCurrentTaskOnClick = (e) => {
    const taskIndex = e.target.getAttribute('data-taskNum');
    logicController.setCurrentTask(taskIndex);
  };

  // creates the button for adding tasks
  const renderAddTaskBtn = () => {
    if (document.querySelector('#add-task-btn')) {
      return;
    } else {
      const taskWrapper = document.querySelector('.task-list-wrapper');
      const addTaskBtn = document.createElement('a');
      const addTaskIcon = document.createElement('i');

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
  };

  const renderSortBar = () => {
    if (document.querySelector('#sort-bar')) {
      return;
    }
    const taskArea = document.getElementById('task-area');

    const sortBar = document.createElement('div');
    sortBar.setAttribute('id', 'sort-bar');

    const clearComplete = document.createElement('a');
    clearComplete.href = '#complete-modal';
    clearComplete.setAttribute('id', 'clear-complete');
    clearComplete.classList.add('sort-button', 'modal-trigger');
    clearComplete.textContent = 'Clear Completed';
    clearComplete.href = '#complete-modal';

    const alphaSort = document.createElement('a');
    alphaSort.setAttribute('id', 'alpha-sort');
    alphaSort.classList.add('sort-button');
    alphaSort.textContent = 'A-Z';
    alphaSort.addEventListener('click', sortAtoZ);

    const dateSort = document.createElement('a');
    dateSort.setAttribute('id', 'date-sort');
    dateSort.classList.add('sort-button');
    dateSort.textContent = 'Date';
    dateSort.addEventListener('click', () => {
      sortByDate();
    });

    const dateSortIcon = document.createElement('i');
    dateSortIcon.classList.add('material-icons', 'right', 'date-icon');
    dateSortIcon.textContent = 'keyboard_arrow_down';
    dateSort.appendChild(dateSortIcon);

    sortBar.appendChild(clearComplete);
    sortBar.appendChild(alphaSort);
    sortBar.appendChild(dateSort);
    taskArea.insertBefore(sortBar, taskArea.childNodes[2]);
  };

  // updates project modal window to reflect editing mode
  const addNewProjectModalOpen = () => {
    // update project modal to reflect addition mode
    const projTitleInput = document.getElementById('proj-title-input');
    projTitleInput.value = '';
    const projectModalHeader = document.getElementById('project-modal-header');
    projectModalHeader.textContent = 'Add Project';
    const editProjectLabel = document.getElementById('proj-input-label');
    editProjectLabel.classList.remove('active');
    const editProjectModalBtn = document.getElementById('add-new-proj-btn');
    editProjectModalBtn.textContent = 'Add New Project';
    editProjectModalBtn.removeEventListener('click', editProject);
    editProjectModalBtn.addEventListener('click', addNewProject);
  };

  // adds event listener to for opening modal windows for project addition
  const addProjectModalEventListener = () => {
    const addProjectModalOpenBtn = document.getElementById('add-project-modal-open-btn');
    addProjectModalOpenBtn.addEventListener('click', addNewProjectModalOpen);
    const sidenavAddProjBtn = document.getElementById('sidenav-modal-addproj-btn');
    sidenavAddProjBtn.addEventListener('click', addNewProjectModalOpen);
  };

  // adds new project and renders result to DOM
  const addNewProject = () => {
    const newProjTitle = document.querySelector('#proj-title-input').value;
    if (newProjTitle.length == 0) {
      M.toast({ html: 'Give us a project title!' });
    } else if (newProjTitle.length > 20) {
      M.toast({ html: 'Shorten up this here title.' });
    } else {
      const modalInstance = M.Modal.getInstance(document.getElementById('add-proj-modal'));
      logicController.addProject(newProjTitle); // add project
      renderProjectArea();
      modalInstance.close();
      document.querySelector('#proj-title-input').value = ''; // empty text input
      updateStorage();
    }
  };

  // adds event listener for adding project in modal window
  const addNewProjectEventListener = () => {
    const addProjBtn = document.querySelector('#add-new-proj-btn');
    addProjBtn.addEventListener('click', addNewProject);
  };

  // updates modal window to reflect project editing mode
  const editProjectModalOpen = (e) => {
    // change add project modal to reflect edit mode
    const projectIndex = e.target.getAttribute('data-projNum');
    const projectTitle = logicController.projects[projectIndex].title;
    const projectModalHeader = document.getElementById('project-modal-header');
    projectModalHeader.textContent = 'Edit Project';
    const projectTitleInput = document.getElementById('proj-title-input');
    projectTitleInput.value = `${projectTitle}`;
    const editProjectLabel = document.getElementById('proj-input-label');
    editProjectLabel.classList.add('active');
    const editProjectModalBtn = document.getElementById('add-new-proj-btn');
    editProjectModalBtn.textContent = 'Update Project Title';
    editProjectModalBtn.removeEventListener('click', addNewProject);
    editProjectModalBtn.addEventListener('click', editProject);
  };

  // updates project info and renders result to DOM
  const editProject = () => {
    const projectIndex = logicController.getCurrentProjectIndex();
    const newProjTitle = document.querySelector('#proj-title-input').value;
    if (newProjTitle.length == 0) {
      M.toast({ html: 'Give us a project title!' });
    } else if (newProjTitle.length > 20) {
      M.toast({ html: 'Shorten up this here title.' });
    } else {
      const modalInstance = M.Modal.getInstance(document.getElementById('add-proj-modal'));
      logicController.editProject(projectIndex, newProjTitle); // update project title
      renderProjectArea();
      modalInstance.close();
      document.querySelector('#proj-title-input').value = ''; // empty text input
      updateStorage();
    }
  };

  const cancelButtonEventListeners = () => {
    const cancelButtonArray = [...document.querySelectorAll('.cancel-modal-btn')];
    cancelButtonArray.forEach((cancelButton) => {
      cancelButton.addEventListener('click', () => {
        let modal = M.Modal.getInstance(cancelButton.closest('.modal'));
        modal.close();
      });
    });
  };

  // updates deletion modal to reflect deletion of project
  const deleteProjectModalOpen = (e) => {
    const projectIndex = e.target.getAttribute('data-projNum');
    const projectTitle = logicController.projects[projectIndex].title;
    const deleteProjectHeader = document.getElementById('delete-modal-header');
    deleteProjectHeader.textContent = `Delete "${projectTitle}?"`;
    const deleteProjectButton = document.getElementById('delete-modal-btn');
    deleteProjectButton.textContent = 'Delete Project';

    deleteProjectButton.removeEventListener('click', deleteTask);
    deleteProjectButton.addEventListener('click', deleteProject);
  };

  // deletes project and renders result to DOM
  const deleteProject = () => {
    // grab corresponding index of proj from data-attribute of trash button
    // grab div for proper removal of DOM elements as projects are deleted
    const projectIndex = logicController.getCurrentProjectIndex();
    const numberOfProjects = logicController.projects.length;
    const taskList = document.querySelector('#task-list');
    const projTitleDisplay = document.querySelector('#proj-title');
    const modalInstance = M.Modal.getInstance(document.getElementById('delete-modal'));

    // reset task list if no projects remain after deleting last one
    if (numberOfProjects == 1) {
      logicController.deleteProject(projectIndex);
      renderProjectArea();
      clearDisplay(taskList);
      projTitleDisplay.textContent = 'Project Title';
      if (document.getElementById('add-task-btn')) {
        document.getElementById('add-task-btn').outerHTML = '';
      }

      if (document.getElementById('sort-bar')) {
        document.getElementById('sort-bar').outerHTML = '';
      }
      // if to-be-deleted project is the current active project,
      // update the current project to first in the list and display
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
  };

  // update task modal window to reflect addition mode
  const addTaskModalOpen = () => {
    // change new task modal window text to reflect add task mode
    const taskModalHeader = document.getElementById('task-modal-header');
    taskModalHeader.textContent = 'Add New Task';
    const addTaskTitle = document.getElementById('task-input-label');
    addTaskTitle.textContent = 'Task Title';
    addTaskTitle.classList.remove('active');
    const addTaskNotes = document.getElementById('task-notes-label');
    addTaskNotes.textContent = 'Notes';
    addTaskNotes.classList.remove('active');
    const datePickerLabel = document.getElementById('date-picker-label');
    datePickerLabel.classList.remove('active');
    const addTaskModalBtn = document.getElementById('add-new-task-btn');
    addTaskModalBtn.textContent = 'Add Task';
    const taskTitleInput = document.getElementById('task-title-input');
    taskTitleInput.value = '';
    const taskNotesInput = document.getElementById('task-notes-input');
    taskNotesInput.value  = '';
    const datePicker = document.getElementById('date-picker');
    datePicker.value = '';

    addTaskModalBtn.removeEventListener('click', editTask);
    addTaskModalBtn.addEventListener('click', addTask);
  };

  // adds task and renders result to DOM
  const addTask = () => {
    const taskTitleInput = document.getElementById('task-title-input').value;
    const taskNotesInput = document.getElementById('task-notes-input').value;
    const taskDueDate = document.getElementById('date-picker').value;

    if (taskTitleInput.length < 1) {
      M.toast({ html: 'The title of this task seems a little short!' });
    } else if (taskTitleInput.length > 30) {
      M.toast({ html: 'Shorten up this here task title.' });
    } else if (taskNotesInput.length < 1) {
      M.toast({ html: 'Give us some more detail in the notes!' });
    } else if (taskNotesInput.length > 500) {
      M.toast({ html: 'Shorten up these here notes!' });
    } else {
      logicController.addTask(logicController.getCurrentProjectIndex(), taskTitleInput, taskNotesInput, false, taskDueDate);
      const modalInstance = M.Modal.getInstance(document.getElementById('add-task-modal'));
      modalInstance.close();
      renderTaskArea();
      updateStorage();
    }
  };

  // adds event listener to add task button in modal window
  const addNewTaskEventListener = () => {
    const addTaskModalBtn = document.getElementById('add-new-task-btn');
    addTaskModalBtn.addEventListener('click', addTask);
  };

  // updates delete modal to reflect deletion of task
  const deleteTaskModalOpen = () => {
    const taskTitle = logicController.getCurrentTaskTitle();
    const deleteTaskHeader = document.getElementById('delete-modal-header');
    deleteTaskHeader.textContent = `Delete "${taskTitle}?"`;
    const deleteTaskButton = document.getElementById('delete-modal-btn');
    deleteTaskButton.textContent = 'Delete Task';

    deleteTaskButton.removeEventListener('click', deleteProject);
    deleteTaskButton.addEventListener('click', deleteTask);
  };

  // deletes task and renders result to DOM
  const deleteTask = () => {
    const projectIndex = logicController.getCurrentProjectIndex();
    const taskIndex = logicController.getCurrentTaskIndex();
    const modalInstance = M.Modal.getInstance(document.getElementById('delete-modal'));
    logicController.deleteTask(projectIndex, taskIndex);
    renderTaskArea();
    modalInstance.close();
    updateStorage();
  };

  // edits task and redners result to DOM
  const editTask = () => {
    const projectIndex = logicController.getCurrentProjectIndex();
    const taskIndex = logicController.getCurrentTaskIndex();
    const editedTitle = document.getElementById('task-title-input').value;
    const editedNotes = document.getElementById('task-notes-input').value;
    const editedDueDate = document.getElementById('date-picker').value;
    if (editedTitle.length < 1) {
      M.toast({ html: 'The title of this task seems a little short!' });
    } else if (editedNotes.length < 1) {
      M.toast({ html: 'Give us some more detail in the notes!' });
    } else {
      logicController.editTaskTitle(projectIndex, taskIndex, editedTitle);
      logicController.editTaskNotes(projectIndex, taskIndex, editedNotes);
      logicController.editTaskDueDate(projectIndex, taskIndex, editedDueDate);
      const modalInstance = M.Modal.getInstance(document.getElementById('add-task-modal'));
      modalInstance.close();
      renderTaskArea();
      updateStorage();
    }
  };

  // change the modal window for adding tasks into one for editing tasks
  const editTaskModalOpen = () => {
    // grab current indices
    const projectIndex = logicController.getCurrentProjectIndex();
    const taskIndex = logicController.getCurrentTaskIndex();
    // change text of modal window to reflect editing mode
    const taskModalHeader = document.getElementById('task-modal-header');
    taskModalHeader.textContent = 'Edit Task';
    const editTaskTitle = document.getElementById('task-input-label');
    editTaskTitle.classList.add('active');
    editTaskTitle.textContent = 'Edit Title';
    const editTaskNotes = document.getElementById('task-notes-label');
    editTaskNotes.classList.add('active');
    editTaskNotes.textContent = 'Edit Notes';
    const editTaskModalBtn = document.getElementById('add-new-task-btn');
    editTaskModalBtn.textContent = 'Edit Task';
    const datePickerLabel = document.getElementById('date-picker-label');
    datePickerLabel.classList.add('active');
    // display current title for editing
    const editTitleInput = document.getElementById('task-title-input');

    editTitleInput.value = logicController.projects[projectIndex].tasks[taskIndex].title;
    // display current notes for editing
    const editNotesInput = document.getElementById('task-notes-input');
    editNotesInput.value = logicController.projects[projectIndex].tasks[taskIndex].notes;

    // display current date for editing
    const datePicker = document.getElementById('date-picker');
    datePicker.value = logicController.projects[projectIndex].tasks[taskIndex].dueDate;
    // remove add task event listener and replace with edit task event listener
    editTaskModalBtn.removeEventListener('click', addTask);
    editTaskModalBtn.addEventListener('click', editTask);
  };

  // controls toggling of task completion checkbox
  const toggleTaskComplete = (e) => {
    const projectIndex = logicController.getCurrentProjectIndex();
    const taskIndex = e.target.getAttribute('data-taskNum');
    logicController.toggleComplete(projectIndex, taskIndex);
    updateStorage();
  };

  // updates checkbox label to reflect completion
  const checkBoxLabelComplete = (e) => {
    const projectIndex = logicController.getCurrentProjectIndex();
    const taskIndex = e.target.getAttribute('data-taskNum');
    const checkBoxLabel = e.target.nextSibling;
    if (logicController.projects[projectIndex].tasks[taskIndex].isComplete == true) {
      checkBoxLabel.textContent = 'Complete!';
    } else {
      checkBoxLabel.textContent = 'Complete?';
    }
  };
  // sort tasks by date
  const sortByDate = () => {
    const dateSortIcon = document.querySelector('.date-icon');
    if (dateSortIcon.textContent == 'keyboard_arrow_down') {
      logicController.sortTasksRecentLast();
      renderTaskArea();
      dateSortIcon.textContent = 'keyboard_arrow_up';
    } else {
      logicController.sortTasksRecentFirst();
      renderTaskArea();
      dateSortIcon.textContent = 'keyboard_arrow_down';
    }
  };
  // sort tasks alphabetically
  const sortAtoZ = () => {
    const alphaSortButton = document.getElementById('alpha-sort');
    if (alphaSortButton.textContent == 'A-Z') {
      alphaSortButton.textContent = 'Z-A';
      logicController.sortTasksZtoA();
      renderTaskArea();
    } else {
      alphaSortButton.textContent = 'A-Z';
      logicController.sortTasksAtoZ();
      renderTaskArea();
    }
  };

  const clearCompleteEventListener = () => {
    const clearBtn = document.getElementById('clear-modal-btn');
    clearBtn.addEventListener('click', () => {
      logicController.clearCompleteTasks();
      renderTaskArea();
      const modalInstance = M.Modal.getInstance(document.getElementById('complete-modal'));
      modalInstance.close();
    });
  };

  const clearDisplay = (parent) => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  // sets default project/task on load
  const setTutorialProject = () => {
    logicController.addProject('Example Project');
    logicController.setCurrentProject(0);
    logicController.addTask(0, 'Example Task: Click me!', 'The left pane is for adding projects and this pane displays the tasks associated with an active project. Use the buttons to add, edit, and delete projects and tasks.', false, 'Feb 13, 2020');
  };
  // update local or firebase storage depending on the case
  const updateStorage = () => {
    if (logicController.storageIsLocal) {
      logicController.populateStorage();
    } else if (firebaseController.isUserSignedIn()) {
      firebaseController.updateFirestore();
    }
  };

  // check if user has projects stored in local storage
  const checkForStoredProjects = () => {
    if (!localStorage.getItem('toDoProjects')) {
      setTutorialProject();
      logicController.populateStorage();
    } else {
      logicController.getProjectsFromLocalStorage();
      logicController.setCurrentProject(0);
    }
  };

  // check if local storage is avilable 
  const checkLocalStoreCapability = () => {
    if (logicController.storageAvailable('localStorage')) {
      logicController.storageIsLocal = true;
      checkForStoredProjects();
      renderDOM();
      const elem = M.Modal.getInstance(document.getElementById('storage-modal'));
      elem.close();
    } else {
      M.toast({ html: 'Sorry, no local storage capability.' });
    }
  };

  // open the modal for choice of storage method on load
  const storageModal = () => {
    document.addEventListener('DOMContentLoaded', () => {
      const elem = document.getElementById('storage-modal');
      const instance = M.Modal.init(elem, {
        dismissible: false,
      });
      instance.open();
    });
  };

  // display the simple no-save demo
  const demoMode = () => {
    renderNormal();
    const elem = M.Modal.getInstance(document.getElementById('storage-modal'));
    elem.close();
  };

  const storageEventListeners = () => {
    document.getElementById('local-storage-btn').addEventListener('click', checkLocalStoreCapability);
    document.getElementById('cloud-storage-btn').addEventListener('click', firebaseController.signIn);
    document.getElementById('sign-out').addEventListener('click', firebaseController.signOut);
    document.getElementById('no-storage-btn').addEventListener('click', demoMode);
  };

  const initFirebaseAuth = () => {
    firebase.auth().onAuthStateChanged(authStateObserver);
  };

  // handle login (display projects) and logout (clear display) state changes
  const authStateObserver = (user) => {
    const userNameElement = document.getElementById('user-name');
    const signOutButton = document.getElementById('sign-out');
    // if user is signed in
    if (user) {
      // display user name and sign out button
      const userName = firebaseController.getUserName();
      userNameElement.textContent = userName;
      // unhide user name and sign out button DOM elements
      userNameElement.classList.remove('hide');
      signOutButton.classList.remove('hide');
      getProjectsFromFirestore(user);
      const elem = M.Modal.getInstance(document.getElementById('storage-modal'));
      elem.close();
    } else {
      userNameElement.classList.add('hide');
      signOutButton.classList.add('hide');
      refreshAfterLogout();
    }
  };

  const getProjectsFromFirestore = (user) => {
    const loadingSpinner = document.querySelector('.spinner');
    loadingSpinner.style.display = 'block'; // display loading animation
    const userProjectsRef = firebase.firestore().collection('users').doc(user.uid);
    userProjectsRef.get().then((doc) => {
      if (doc.exists) {
        doc.data().projects.forEach((project) => {
          logicController.projects.push(project);
        });
        logicController.setCurrentProject(0);
        loadingSpinner.style.display = 'none';
        renderDOM();
      } else {
        setTutorialProject();
        loadingSpinner.style.display = 'none';
        renderDOM();
      }
    }).catch(() => {
      loadingSpinner.style.display = 'none';
      throwErrorMessage();
    });
  };

  const throwErrorMessage = () => {
    const elem = document.getElementById('error-modal');
    const errorModal = M.Modal.init(elem, {
      dismissible: false,
    });
    errorRestart();
    errorModal.open();
  };

  const errorRestart = () => {
    const restartButton = document.getElementById('error-btn');
    restartButton.addEventListener('click', () => {
      firebaseController.signOut();
      const errorModal = M.Modal.getInstance(document.getElementById('error-modal'));
      errorModal.close();
      refreshAfterLogout();
    });
  };

  const refreshAfterLogout = () => {
    clearDisplay(document.getElementById('sidenav-project-wrapper'));
    clearDisplay(document.getElementById('project-list'));
    clearDisplay(document.getElementById('task-list'));
    logicController.projects.length = 0;
    const elem = M.Modal.getInstance(document.getElementById('storage-modal'));
    elem.open();
  };

  // initialize materialize components 
  const initMaterialize = () => {
    document.addEventListener('DOMContentLoaded', () => {
      const elems = document.querySelectorAll('.collapsible');
      M.Collapsible.init(elems, true);
    });

    document.addEventListener('DOMContentLoaded', () => {
      const elems = document.querySelectorAll('.modal');
      M.Modal.init(elems, true);
    });

    document.addEventListener('DOMContentLoaded', () => {
      const elems = document.querySelectorAll('.sidenav');
      M.Sidenav.init(elems, true);
    });

    document.addEventListener('DOMContentLoaded', () => {
      const textNeedCount = document.querySelectorAll('#proj-title-input, #task-title-input, #task-notes-input');
      M.CharacterCounter.init(textNeedCount);
    });

    document.addEventListener('DOMContentLoaded', () => {
      const elems = document.querySelectorAll('.datepicker');
      M.Datepicker.init(elems, {
        container: document.getElementsByTagName('body'), // sets container div for date picker
      });
    });
  };

  const initEventListeners = () => {
    addNewProjectEventListener();
    addProjectModalEventListener();
    addNewTaskEventListener();
    cancelButtonEventListeners();
    clearCompleteEventListener();
  };

  const initialLoad = () => {
    initMaterialize();
    storageModal();
    storageEventListeners();
    firebaseController.firebaseInit();
    initFirebaseAuth();
  };

  const renderDOM = () => {
    renderProjectArea();
    renderTaskArea();
    renderAddTaskBtn();
    displayCurrentProjectTitle();
    initEventListeners();
  };

  const renderNormal = () => {
    setTutorialProject();
    renderProjectArea();
    renderTaskArea();
    renderAddTaskBtn();
    displayCurrentProjectTitle();
    initEventListeners();
  };

  return {
    initialLoad,
  };
})();

export default DOMController;
