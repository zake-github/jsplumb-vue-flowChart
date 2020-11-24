<template>
  <div class="flow-menu" ref="tool">
    <draggable @end="end" @choose="start" class="menu-wrapper" v-model="menuList" :options="draggableOptions">
      <div v-for="subMenu in menuList" class="ef-node-menu" :class="`ef-mode-${subMenu.type}`" :ref="`node${subMenu.id}`" :key="subMenu.id" :id="`${subMenu.id}`">
        <div style="position: relative;z-index: 9;">
          <i :class="subMenu.ico"></i> {{subMenu.name}}
        </div>
        <div class="ef-node-right-ico">
          <state-icon :state="subMenu.state"></state-icon>
        </div>
            <svg v-if="subMenu.type === 'diamond'" class="diamond"
                 width="150" height="96"><path d="M 75 1 L 149 48 L 75 95 L 1 48 Z" class="inner">
            </path></svg>
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import stateIcon from './stateIcon';

let mousePosition = {
    left: 0,
    top: 0
};

export default {
    data () {
        return {
            // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
            draggableOptions: {
                preventOnFilter: false,
                sort: false,
                disabled: false,
                ghostClass: 'tt',
                // 不使用H5原生的配置
                forceFallback: true
            },
            menuList: [
                {
                    id: '11',
                    type: 'start',
                    name: '节点',
                    ico: 'el-icon-user-solid',
                    state: 'success'
                },
                {
                    id: '12',
                    type: 'task',
                    name: '节点',
                    ico: 'el-icon-user-solid',
                    state: 'success'
                },
                {
                    id: '13',
                    type: 'diamond',
                    name: '节点',
                    ico: 'el-icon-user-solid',
                    state: 'success'
                }
            ],
            nodeMenu: {}
        };
    },
    components: {
        draggable, stateIcon
    },
    created () {
        /**
       * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
       * @param event
       */
        if (this.isFirefox()) {
            document.body.ondrop = function (event) {
                // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
                event.preventDefault();
                event.stopPropagation();
            };
        }
    },
    methods: {
        // 根据类型获取左侧菜单对象
        getMenuByType (id) {
            return this.menuList.find((i) => { return i.id === id; });
        },
        // 拖拽开始时触发
        start (evt, ...args) {
            const id = evt.item.attributes.id.nodeValue;
            const p = this.$refs[`node${id}`][0].getBoundingClientRect();
            mousePosition = {
                left: evt.originalEvent.pageX - p.x,
                top: evt.originalEvent.pageY - p.y
            };
            this.nodeMenu = this.getMenuByType(id);
        },
        // 拖拽结束时触发
        end (evt, e) {
            this.$emit('addNode', evt, this.nodeMenu, mousePosition);
        },
        // 是否是火狐浏览器
        isFirefox () {
            let userAgent = navigator.userAgent;
            return userAgent.indexOf('Firefox') > -1;
        }
    }
};
</script>
