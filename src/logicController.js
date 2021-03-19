import { parse } from 'date-fns';

const logicController = (() => {

    let currentProject = null;
    let currentTask = null;

    let projects = [];

    const projectFactory = (title) => {
        let tasks = [];
        return {title, tasks};
    }

    const taskFactory = (title, notes, isComplete, dueDate) => {
        return {title, notes, isComplete, dueDate};
    }

    const addProject = (title) => {
        projects.push(projectFactory(title));

    }

    const editProject = (projectIndex, title) => {
        projects[projectIndex].title = title;
    }

    const deleteProject = (projectIndex) => {
        projects.splice(projectIndex, 1);
    }


    const setCurrentProject = (index) => {
        currentProject = projects[index];
    }

    const getCurrentProjectIndex = () => {
        return projects.indexOf(currentProject);
    }

    const getCurrentProjectTitle = () => {
        return currentProject.title;
    }

    const setCurrentTask = (index) => {
        currentTask = currentProject.tasks[index];
    }

    const getCurrentTaskIndex = () => {
        return currentProject.tasks.indexOf(currentTask);
    }

    const getCurrentTaskTitle = () => {
        return currentTask.title;
    }


    const addTask = (projectIndex, title, notes, isComplete, dueDate) => {
        projects[projectIndex].tasks.push(taskFactory(title, notes, isComplete, dueDate));
    }

    const editTaskTitle = (projectIndex, taskIndex, title) => {
        projects[projectIndex].tasks[taskIndex].title = title;
    }

    const deleteTask = (projectIndex, taskIndex) => {
        projects[projectIndex].tasks.splice(taskIndex, 1);
    }


    const editTaskNotes = (projectIndex, taskIndex, notes) => {
        projects[projectIndex].tasks[taskIndex].notes = notes;
    }

    const editTaskDueDate = (projectIndex, taskIndex, dueDate) => {
        projects[projectIndex].tasks[taskIndex].dueDate = dueDate;
    }

    const toggleComplete = (projectIndex, taskIndex) => {
        if (projects[projectIndex].tasks[taskIndex].isComplete == false) {
            projects[projectIndex].tasks[taskIndex].isComplete = true;
        } else {
            projects[projectIndex].tasks[taskIndex].isComplete = false;
        }
    }

    const sortTasksRecentFirst = () => {
        let projIndex = getCurrentProjectIndex();

        if (projects[projIndex].tasks.length > 1) {
            projects[projIndex].tasks = projects[projIndex].tasks.sort((a,b) => {
                let aDate = parse(a.dueDate.replace(/,/g, ''), 'MMM d yyyy', new Date());
                let bDate = parse(b.dueDate.replace(/,/g, ''), 'MMM d yyyy', new Date());
                return aDate.valueOf() - bDate.valueOf();
                
            })
        }
    }

    const sortTasksRecentLast = () => {
        let projIndex = getCurrentProjectIndex();

        if (projects[projIndex].tasks.length > 1) {
            projects[projIndex].tasks = projects[projIndex].tasks.sort((a,b) => {
                let aDate = parse(a.dueDate.replace(/,/g, ''), 'MMM d yyyy', new Date());
                let bDate = parse(b.dueDate.replace(/,/g, ''), 'MMM d yyyy', new Date());
                return bDate.valueOf() - aDate.valueOf();
                
            })
        }
    }



    return {
        projects,
        setCurrentProject,
        getCurrentProjectIndex,
        getCurrentProjectTitle,
        setCurrentTask,
        getCurrentTaskIndex,
        getCurrentTaskTitle,
        addProject,
        editProject,
        deleteProject,
        addTask,
        editTaskTitle,
        deleteTask,
        editTaskNotes,
        editTaskDueDate,
        toggleComplete,
        sortTasksRecentFirst,
        sortTasksRecentLast
    }

})();


export default logicController;