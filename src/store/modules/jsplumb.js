const state = {
    activeType: 'node',
    activeNode: {},
    activeLine: {}
};

const mutations = {
    SET_ACTIVETYPE: (state, activeType) => {
        state.activeType = activeType;
    },
    SET_NODE: (state, activeNode) => {
        state.activeNode = activeNode;
    },
    SET_LINE: (state, activeLine) => {
        state.activeLine = activeLine;
    }
};

const actions = {
    setActiveType ({ commit }, activeType) {
        commit('SET_ACTIVETYPE', activeType);
    },
    setActiveNode ({ commit }, activeNode) {
        commit('SET_NODE', activeNode);
    },
    setActiveLine ({ commit }, activeLine) {
        commit('SET_LINE', activeLine);
    }
};

const getters = {
    activeType: state => state.activeType,
    activeNode: state => state.activeNode,
    activeLine: state => state.activeLine
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
