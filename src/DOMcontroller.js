import logicController from './logicController';

const DOMController = (() => {

    let testDiv = document.getElementById('testWrapper');

    const renderProjects = () => {
        let projectDisplay = document.createDocumentFragment();
        logicController.projects.forEach((project) => {
            let projectTitle = document.createElement('ul');
            projectTitle.textContent = project.title;

            let taskInfo = document.createDocumentFragment();
            for (let i = 0; i < project.tasks.length; i ++) {
                let taskDetail = document.createElement('li');
                taskDetail.textContent = project.tasks[i].title;
                taskInfo.appendChild(taskDetail);
            }

            projectTitle.appendChild(taskInfo);

            projectDisplay.appendChild(projectTitle);

        })




        testDiv.appendChild(projectDisplay);
    }


    return {
        renderProjects
    }

})();

export default DOMController;