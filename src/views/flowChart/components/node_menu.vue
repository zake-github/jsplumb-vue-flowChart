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
                // 拖拽的时候样式
                // fallbackClass: 'flow-node-draggable'
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
                // mousePosition.left = event.layerX;
                // mousePosition.top = event.clientY - 50;
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
            // debugger;
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

<!--<template>-->
<!--    <div class="flow-menu" ref="tool">-->
<!--        <div v-for="menu  in  menuList" :key="menu.id">-->
<!--            <span class="ef-node-pmenu" @click="menu.open = !menu.open"><i :class="{'el-icon-caret-bottom': menu.open,'el-icon-caret-right': !menu.open}"></i>&nbsp;{{menu.name}}</span>-->
<!--            <ul v-show="menu.open" class="ef-node-menu-ul">-->
<!--                <draggable @end="end" @start="move" v-model="menu.children" :options="draggableOptions">-->
<!--                    <li v-for="subMenu in menu.children" class="ef-node-menu-li" :key="subMenu.id" :type="subMenu.type">-->
<!--                        <i :class="subMenu.ico"></i> {{subMenu.name}}-->
<!--                    </li>-->
<!--                </draggable>-->
<!--            </ul>-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->
<!--<script>-->
<!--import draggable from 'vuedraggable';-->

<!--var mousePosition = {-->
<!--    left: -1,-->
<!--    top: -1-->
<!--};-->

<!--export default {-->
<!--    data () {-->
<!--        return {-->
<!--            activeNames: '1',-->
<!--            // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html-->
<!--            draggableOptions: {-->
<!--                preventOnFilter: false,-->
<!--                sort: false,-->
<!--                disabled: false,-->
<!--                ghostClass: 'tt',-->
<!--                // 不使用H5原生的配置-->
<!--                forceFallback: true-->
<!--                // 拖拽的时候样式-->
<!--                // fallbackClass: 'flow-node-draggable'-->
<!--            },-->
<!--            // 默认打开的左侧菜单的id-->
<!--            defaultOpeneds: ['1', '2'],-->
<!--            menuList: [-->
<!--                {-->
<!--                    id: '1',-->
<!--                    type: 'group',-->
<!--                    name: '开始节点',-->
<!--                    ico: 'el-icon-video-play',-->
<!--                    open: true,-->
<!--                    children: [-->
<!--                        {-->
<!--                            id: '11',-->
<!--                            type: 'timer',-->
<!--                            name: '数据接入',-->
<!--                            ico: 'el-icon-time',-->
<!--                            // 自定义覆盖样式-->
<!--                            style: {}-->
<!--                        }, {-->
<!--                            id: '12',-->
<!--                            type: 'task',-->
<!--                            name: '接口调用',-->
<!--                            ico: 'el-icon-odometer',-->
<!--                            // 自定义覆盖样式-->
<!--                            style: {}-->
<!--                        }-->
<!--                    ]-->
<!--                },-->
<!--                {-->
<!--                    id: '2',-->
<!--                    type: 'group',-->
<!--                    name: '结束节点',-->
<!--                    ico: 'el-icon-video-pause',-->
<!--                    open: true,-->
<!--                    children: [-->
<!--                        {-->
<!--                            id: '21',-->
<!--                            type: 'end',-->
<!--                            name: '流程结束',-->
<!--                            ico: 'el-icon-caret-right',-->
<!--                            // 自定义覆盖样式-->
<!--                            style: {}-->
<!--                        }, {-->
<!--                            id: '22',-->
<!--                            type: 'over',-->
<!--                            name: '数据清理',-->
<!--                            ico: 'el-icon-shopping-cart-full',-->
<!--                            // 自定义覆盖样式-->
<!--                            style: {}-->
<!--                        }-->
<!--                    ]-->
<!--                }-->
<!--            ],-->
<!--            nodeMenu: {}-->
<!--        };-->
<!--    },-->
<!--    components: {-->
<!--        draggable-->
<!--    },-->
<!--    created () {-->
<!--        /**-->
<!--             * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题-->
<!--             * @param event-->
<!--             */-->
<!--        if (this.isFirefox()) {-->
<!--            document.body.ondrop = function (event) {-->
<!--                // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题-->
<!--                mousePosition.left = event.layerX;-->
<!--                mousePosition.top = event.clientY - 50;-->
<!--                event.preventDefault();-->
<!--                event.stopPropagation();-->
<!--            };-->
<!--        }-->
<!--    },-->
<!--    methods: {-->
<!--        // 根据类型获取左侧菜单对象-->
<!--        getMenuByType (type) {-->
<!--            for (let i = 0; i < this.menuList.length; i++) {-->
<!--                let children = this.menuList[i].children;-->
<!--                for (let j = 0; j < children.length; j++) {-->
<!--                    if (children[j].type === type) {-->
<!--                        return children[j];-->
<!--                    }-->
<!--                }-->
<!--            }-->
<!--        },-->
<!--        // 拖拽开始时触发-->
<!--        move (evt, a, b, c) {-->
<!--            var type = evt.item.attributes.type.nodeValue;-->
<!--            this.nodeMenu = this.getMenuByType(type);-->
<!--        },-->
<!--        // 拖拽结束时触发-->
<!--        end (evt, e) {-->
<!--            this.$emit('addNode', evt, this.nodeMenu, mousePosition);-->
<!--        },-->
<!--        // 是否是火狐浏览器-->
<!--        isFirefox () {-->
<!--            var userAgent = navigator.userAgent;-->
<!--            if (userAgent.indexOf('Firefox') > -1) {-->
<!--                return true;-->
<!--            }-->
<!--            return false;-->
<!--        }-->
<!--    }-->
<!--};-->
<!--</script>-->
