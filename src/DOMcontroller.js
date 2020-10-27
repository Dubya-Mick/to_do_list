import logicController from './logicController';

const DOMController = (() => {

    const renderProjectTitles = () => {
        let testDiv = document.getElementById('projectList');
        let allProjectTitles = document.createDocumentFragment();
        for(let i= 0; i < logicController.projects.length; i++) {
            let projectTitle = document.createElement('ul');
            projectTitle.setAttribute('data-projNum', `${i}`);
            projectTitle.textContent = logicController.projects[i].title;
            projectTitle.addEventListener('click', (e) => {
                renderTaskTitles(e);
            })
            allProjectTitles.appendChild(projectTitle);
        }
        testDiv.appendChild(allProjectTitles);
    }

    const renderTaskTitles = (e) => {
        let projectIndex = e.target.getAttribute('data-projNum');
        let projTitleDisplay = document.querySelector('#projTitle');
        projTitleDisplay.textContent = e.target.textContent;
        let taskList = document.querySelector('#taskList');
        clearDisplay(taskList);
        

        let allTaskTitles = document.createDocumentFragment();
        for(let i = 0; i < logicController.projects[projectIndex].tasks.length; i++) {
            let taskTitle = document.createElement('div');
            taskTitle.textContent = logicController.projects[projectIndex].tasks[i].title;
            taskTitle.setAttribute('data-taskNum', `${i}`);
            allTaskTitles.appendChild(taskTitle);
        }
        taskList.appendChild(allTaskTitles);

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