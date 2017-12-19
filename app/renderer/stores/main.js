"use strict";

const Vuex = require('vuex');

const TaskStore = require('./task_store');
const ConfigStore = require('./config_store');

const version = require('../../../package.json').version;

module.exports = new Vuex.Store({
    modules: {
        userConfig: ConfigStore,
        tasks: TaskStore
    },
    state: {
        editMode: false,
        activeSuite: 0
    },
    getters: {
        version() {
            return version;
        }
    },
    mutations: {
        toggleEdit(state) {
            state.editMode = !state.editMode;
        },
        toggleActiveSuite(state, suite) {
            state.activeSuite = suite; // TODO: make checks
        }
    }
});