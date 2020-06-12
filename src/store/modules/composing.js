let composing = {
    namespaced: true,
    state: {
        order: {},
        visible: false,
        details: [],
        sampleUnit: null,
        editDetails: []
    },
    mutations: {
        SET_ORDER: (state, val) => {
            state.order = val;
        },
        SET_VISIBLE: (state, val) => {
            state.visible = val;
        },
        SET_DETAILS: (state, val) => {
            state.details = val;
        },
        SET_SAMPLE_UNIT: (state, val) => {
            state.sampleUnit = val;
        },
        SET_EDIT_DETAILS: (state, val) => {
            state.editDetails = val;
        },
    },
    actions: {
        orderAction(ctx, val) {
            ctx.commit('SET_ORDER', val);
        },
        visibleAction(ctx, val) {
            ctx.commit('SET_VISIBLE', val);
        },
        detailsAction(ctx, val) {
            ctx.commit('SET_DETAILS', val);
        },
        sampleUnitAction(ctx, val) {
            ctx.commit('SET_SAMPLE_UNIT', val);
        },
        editDetailsAction(ctx, val) {
            ctx.commit('SET_EDIT_DETAILS', val);
        },
    },
    getters: {
        order: state => state.order, // 选择的订单
        visible: state => state.visible, // drawer
        details: state => state.details, // 添加-表格
        sampleUnit: state => state.sampleUnit, // 收样单位
        editDetails: state => state.editDetails // 编辑-表格
    }
};

export default composing;
