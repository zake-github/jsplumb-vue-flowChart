import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapActions } = createNamespacedHelpers('jsplumb');
export default {
    computed: {
        ...mapGetters(['activeType', 'activeNode', 'activeLine'])
    },
    methods: {
        ...mapActions(['setActiveNode', 'setActiveLine', 'setActiveType'])
    }
};
