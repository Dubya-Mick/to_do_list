const logicController = (() => {

    let projects = [];

    const projectFactory = (title) => {
        let tasks = [];
        return {title, tasks};
    }

    const taskFactory = (title, description, notes, isComplete) => {
        return {title, description, notes, isComplete};
    }

    const addProject = (title) => {
        projects.push(projectFactory(title));

    }

    const editProject = (projectIndex, title) => {
        projects[projectIndex].title = title;
    }


    const addTask = (projectIndex, title, description, notes, isComplete) => {
        projects[projectIndex].tasks.push(taskFactory(title, description, notes, isComplete));
    }

    const editTaskTitle = (projectIndex, taskIndex, title) => {
            projects[projectIndex].tasks[taskIndex].title = title;
    }

    const editTaskDesc = (projectIndex, taskIndex, description) => {
        project[projectIndex].tasks[taskIndex].description = description;
    }

    const editTaskNotes = (projectIndex, taskIndex, notes) => {
        project[projectIndex].tasks[taskIndex].notes = notes;
    }

    const toggleComplete = (projectIndex, taskIndex) => {
        if (project[projectIndex].tasks[taskIndex].isComplete) {
            project[projectIndex].tasks[taskIndex].isComplete = false;
        } else {
            project[projectIndex].tasks[taskIndex].isComplete = true;
        }
    }

    return {
        projects,
        addProject,
        editProject,
        addTask,
        editTaskTitle,
        editTaskDesc,
        editTaskNotes,
        toggleComplete
    }

})();


export default logicController;