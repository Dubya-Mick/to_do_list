import logicController from './logicController';

const DOMController = (() => {

    const renderProjectTitles = () => {
        //grab div containing list of projects
        let projList = document.getElementById('projectList');
        //clear display before repopulating
        clearDisplay(projList);
        
        let allProjectTitles = document.createDocumentFragment();
        //render those project titles to the DOM
        //adding event listeners as the divs are added
        for(let i= 0; i < logicController.projects.length; i++) {
            let projectTitle = document.createElement('div');
            projectTitle.setAttribute('data-projNum', `${i}`);
            projectTitle.textContent = logicController.projects[i].title;
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
        logicController.setCurrentProject(projectIndex);
    }

    //sets the current task for later retrieval of index
    const setCurrentTaskOnClick = (e) => {
        let taskIndex = e.target.getAttribute('data-taskNum');
        logicController.setCurrentTask(taskIndex);
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
                logicController.addProject(newProjTitle);
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

export default DOMController;