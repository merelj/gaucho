"use strict";

const Suite = require('../../common/suite');
const TasksHandler = require('../tasks_handler');
const TaskImporter = require('../../common/task_importer');

const AppConfig = require('../../app_config.json');

module.exports = {
    state: {
        suites: []
    },
    getters: {
        suites(state) {
            return state.suites;
        },
        canAddSuite(state) {
            return state.suites.length < AppConfig.maxSuites;
        },
        maxTasksPerSuite() {
            return AppConfig.maxTasksPerSuite;
        },
        totalTasks(state) {
            return state.suites.reduce((total, s) => {
                return total + s.length;
            }, 0);
        }
    },
    mutations: {
        addSuite(state, suite) {
            if (state.suites.length < AppConfig.maxSuites) {
                if(!suite) {
                    suite = new Suite(`Suite ${(state.suites.length + 1)}`);
                }
                state.suites.push(suite);
            }
        },
        addTask(state, {index, task}) {
            if(state.suites[index].length < AppConfig.maxTasksPerSuite) {
                state.suites[index].addTask(task);
            }
        },
        _setSuites(state, suites) {
            state.suites.splice(0, state.suites.length);
            suites.forEach((suite) => {
                state.suites.push(suite);
            });
        }
    },
    actions: {
        saveTasks(context) {
            TasksHandler.saveTasks(context.getters.suites);
        },
        loadTasks(context) {
            const loadedSuites = TasksHandler.loadTasksFromConfig();
            context.commit("_setSuites", loadedSuites);
        },
        stopAllTasks(context) {
            const promises = context.getters.suites.map((s) => s.stopAll());
            return Promise.all(promises);
        },
        clearTasks(context) {
            return context.dispatch("stopAllTasks").then(() => {
                context.commit("_setSuites", [new Suite("Suite 1")]);
            });
        },
        importTasks(context, filename) {
            return TaskImporter.import(filename).then((data) => {
                const loadedSuites = TasksHandler.loadTasksFromData(data);
                return context.dispatch("stopAllTasks").then(() => {
                    context.commit("_setSuites", loadedSuites);
                    context.dispatch("saveTasks");
                });
            });
        },
        exportTasks(context, filename) {
            return TaskImporter.export(filename, context.getters.suites, context.getters.version);
        }
    }
};