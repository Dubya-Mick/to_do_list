const logicController = (() => {

    let projects = [];

    const projectFactory = (title) => {
        let tasks = [];
        return {title, tasks};
    }

    const taskFactory = (title, notes, isComplete) => {
        return {title, notes, isComplete};
    }

    const addProject = (title) => {
        projects.push(projectFactory(title));

    }

    const editProject = (projectIndex, title) => {
        projects[projectIndex].title = title;
    }


    const addTask = (projectIndex, title, notes, isComplete) => {
        projects[projectIndex].tasks.push(taskFactory(title, notes, isComplete));
    }

    const editTaskTitle = (projectIndex, taskIndex, title) => {
            projects[projectIndex].tasks[taskIndex].title = title;
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
        editTaskNotes,
        toggleComplete
    }

})();


export default logicController;