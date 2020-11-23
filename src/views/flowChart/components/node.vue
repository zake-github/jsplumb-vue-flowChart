<template>
    <div
        ref="node"
        :style="nodeContainerStyle"
        @click="clickNode"
        @mouseup="changeNodeSite"
        :class="nodeContainerClass"
    >
        <!-- 节点名称 -->
        <div class="ef-node-text" :show-overflow-tooltip="true">
            <i :class="nodeIcoClass"></i>
            {{node.name}}
        </div>
        <!-- 节点状态图标 -->
        <div class="ef-node-right-ico">
            <state-icon :state="node.state"></state-icon>
        </div>
        <svg
          v-if="node.type === 'diamond'"
          class="diamond"
          width="150" height="96"><path d="M 75 1 L 149 48 L 75 95 L 1 48 Z" class="inner">
        </path></svg>
    </div>
</template>

<script>
import mixInStore from './mixInStore';
import stateIcon from './stateIcon';
import * as $utils from '@/utils/index';
export default {
    props: {
        node: Object
    },
    components: { stateIcon },
    data () {
        return {};
    },
    mixins: [mixInStore],
    computed: {
        nodeContainerClass () {
            return `ef-node-container ef-mode-${this.node.type} ${this.activeNode.nodeId === this.node.id ? 'ef-node-active' : ''}`;
            // {
            //     'ef-node-container': true,
            //     'ef-node-active': this.activeNode.nodeId === this.node.id,
            //     `ef-mode-${subMenu.type}`: true,
            // };
        },
        // 节点容器样式
        nodeContainerStyle () {
            return {
                top: `${this.node.top}px`,
                left: `${this.node.left}px`
            };
        },
        nodeIcoClass () {
            let nodeIcoClass = {};
            nodeIcoClass[this.node.ico] = true;
            // 添加该class可以推拽连线出来，viewOnly 可以控制节点是否运行编辑
            nodeIcoClass['flow-node-drag'] = !this.node.viewOnly;
            return nodeIcoClass;
        }
    },
    methods: {
        // 点击节点
        clickNode () {
            this.setActiveType('node');
            this.setActiveNode($utils.deepClone(this.node));
        },
        // 鼠标移动后抬起
        changeNodeSite () {
            // 避免抖动
            if (this.node.left === this.$refs.node.style.left && this.node.top === this.$refs.node.style.top) {
                return;
            }
            const nodeNow = Object.assign(this.node, {
                left: this.$refs.node.style.left,
                top: this.$refs.node.style.top
            });
            // this.$emit('update:node', nodeNow);
            this.$emit('updateNode', nodeNow);
        }
    }
};
</script>
