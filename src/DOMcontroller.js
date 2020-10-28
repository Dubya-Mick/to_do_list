import logicController from './logicController';

const DOMController = (() => {

    const renderProjectTitles = () => {
        //grab div containing list of projects
        let projList = document.getElementById('projectList');
        let allProjectTitles = document.createDocumentFragment();

        //render those project titles to the DOM
        //adding event listeners as the divs are added
        for(let i= 0; i < logicController.projects.length; i++) {
            let projectTitle = document.createElement('ul');
            projectTitle.setAttribute('data-projNum', `${i}`);
            projectTitle.textContent = logicController.projects[i].title;
            projectTitle.classList.add('project');
            projectTitle.addEventListener('click', (e) => {
                setCurrentProjectOnClick(e);
                displayActiveProject(e);
                renderTaskTitles(e);
                
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

            //task notes
            let notes = document.createElement('div');
            notes.textContent = logicController.projects[projectIndex].tasks[i].notes;

            //task completion y/n
            let isComplete = document.createElement('div');
            isComplete.textContent = logicController.projects[projectIndex].tasks[i].isComplete;

            //wrapper for task details
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
        let taskDeets = e.target.querySelector('.taskDetails');
        taskDeets.classList.toggle('hidden');
        
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



    const clearDisplay = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    
    }
    

    return {
        renderProjectTitles
    }

})();

export default DOMController;