import './stateIcon.scss';

const states = {
    success: 'el-icon-circle-check el-node-state-success',
    error: 'el-icon-circle-close el-node-state-error',
    warning: 'el-icon-warning-outline el-node-state-warning',
    running: 'el-icon-loading el-node-state-running'
};

export default {
    render (createElement) {
        this.state = this.state || 'success';
        return createElement('i',
            { class: states[this.state] }
        );
    },
    props: {
        state: {
            type: String,
            required: true
        }
    }
};
