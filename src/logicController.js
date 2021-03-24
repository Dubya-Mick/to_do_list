import { parse } from 'date-fns';

const logicController = (() => {

    let storageIsLocal = false;

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

    const sortTasksAtoZ = () => {
        let projIndex = getCurrentProjectIndex();
        
        if (projects[projIndex].tasks.length > 1) {
            projects[projIndex].tasks = projects[projIndex].tasks.sort((a,b) => {
                let taskA = a.title.toLowerCase();
                let taskB = b.title.toLowerCase();
                return (taskA < taskB) ? -1 : (taskA > taskB) ? 1 : 0;
            })
        }
    }

    const sortTasksZtoA = () => {
        let projIndex = getCurrentProjectIndex();
        if (projects[projIndex].tasks.length > 1) {
            projects[projIndex].tasks = projects[projIndex].tasks.sort((a,b) => {
                let taskA = a.title.toLowerCase();
                let taskB = b.title.toLowerCase();
                return (taskA > taskB) ? -1 : (taskA < taskB) ? 1 : 0;
            })
        }
    }

    const clearCompleteTasks = () => {
        let projIndex = getCurrentProjectIndex();
        //loop backward to avoid indexing bugs / skipping tasks to be deleted
        for (let i = projects[projIndex].tasks.length - 1; i >= 0; i--) {
            if (projects[projIndex].tasks[i].isComplete) {
                projects[projIndex].tasks.splice(i, 1);
            }
        }
    }

    const storageAvailable = (type) => {
        var storage;
        try {
            storage = window[type];
            var x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    }

    

    const populateStorage = () => {
        localStorage.setItem('toDoProjects', JSON.stringify(projects));
    }

    const getProjectsFromLocalStorage = () => {
        let retrievedProjects = JSON.parse(localStorage.getItem('toDoProjects'));
        retrievedProjects.forEach((project) => {
            projects.push(project);
        })
    }

   

    const storeProjectsIfChanged = () => {

    }
    



    return {
        projects,
        storageIsLocal,
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
        sortTasksRecentLast,
        sortTasksAtoZ,
        sortTasksZtoA,
        clearCompleteTasks,
        storageAvailable,
        populateStorage,
        getProjectsFromLocalStorage
    }

})();


export default logicController;