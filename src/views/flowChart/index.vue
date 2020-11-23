<template>
    <div v-if="easyFlowVisible" class="page">
      <div style="position: fixed;left: 300px;top: 10px;z-index: 999">
        <el-button @click="edit">编辑</el-button>
      </div>
      <div class="wrapper">
        <div v-if="isEdit" class="side-left">
          <node-menu @addNode="addNode" ref="nodeMenu"></node-menu>
        </div>
        <div class="content" ref="content" id="content" @wheel="scale" @mousedown="moveContainerStart" @mouseup="moveContainerEnd">
          <div style="position: absolute;width: 100%;height: 100%;z-index: 99;" v-if="!isEdit"></div>
          <div :style="{transform: `translate(${position.left}px, ${position.top}px)`}" style="width: 0;height: 0;">
            <div id="efContainer" ref="efContainer" class="container" :style="{transform: `scale(${this.scaleN})`}">
            <template v-for="nodeItem in data.nodeList">
              <flow-node
                :id="nodeItem.id"
                :key="nodeItem.id"
                :node="nodeItem"
                @updateNode="updateNode"
              >
              </flow-node>
            </template>
          </div>
          </div>
        </div>
<!--    右侧表单-->
        <div v-if="isEdit" class="side-right">
          <flow-node-form
            ref="nodeForm"
            @setLine="setLine"
            @repaintEverything="repaintEverything"
            @removeLine="removeLine"
            @remove="removeEverything"></flow-node-form>
        </div>
      </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import { jsPlumb } from 'jsplumb';
import * as $utils from '@/utils/index';
import { easyFlowMixin } from './components/mixins';
import mixInStore from './components/mixInStore';
import flowNode from './components/node';
import flowNodeForm from './components/node_form';
import nodeMenu from './components/node_menu';
import lodash from 'lodash';
import { getDataB, getDataA } from './components/data_B';
const sourceEndpoint = {
    endpoint: 'Dot',
    paintStyle: {
        stroke: '#7AB02C',
        radius: 7,
        strokeWidth: 1
    },
    isSource: true,
    isTarget: true,
    connector: [ 'Flowchart', { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
    dragOptions: {}
};
const nodeDef = {
    id: null,
    parentIds: [],
    childrenIds: [],
    name: null,
    type: 'task',
    left: null,
    top: null,
    ico: null,
    state: null
};
const contectPoints = ['TopCenter', 'BottomCenter', 'LeftMiddle', 'RightMiddle'];
const stateColors = {
    success: {
        pain: '#8BDC64',
        hoverPain: '#67c23a'
    },
    running: {
        pain: '#8BDC64',
        hoverPain: '#67c23a'
    }
};
const nodeDefW = 300; // 每个节点默认宽度
const nodeDefH = 180; // 每个节点默认宽度
export default {
    data () {
        return {
            isEdit: true,
            // jsPlumb 实例
            jsPlumb: null,
            // 控制画布销毁
            easyFlowVisible: true,
            // 控制流程数据显示与隐藏
            flowInfoVisible: false,
            // 是否加载完毕标志位
            loadEasyFlowFinish: false,
            flowHelpVisible: false,
            // 数据
            data: {},
            position: {
                left: 90,
                top: 60
            },
            scaleN: 1
        };
    },
    // 一些基础配置移动该文件中
    mixins: [easyFlowMixin, mixInStore],
    components: {
        draggable, flowNode, flowNodeForm, nodeMenu
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            this.jsPlumb = jsPlumb.getInstance();
            this.$nextTick(() => {
            // 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
            // this.dataReload(getDataB());
                this.dataReload(getDataA());
            });
        },
        // 初始化配置
        jsPlumbInit () {
            this.jsPlumb.ready(() => {
                // 导入默认配置
                this.jsPlumb.importDefaults(this.jsplumbSetting);
                // 会使整个jsPlumb立即重绘。
                this.jsPlumb.setSuspendDrawing(false, true);
                // 初始化节点
                this.jsPlumb.batch(() => {
                    this.loadEasyFlow();
                });
                // 单点击了连接线
                this.jsPlumb.bind('click', (conn, originalEvent) => {
                    const line = this.data.lineList.find((v) => { return (v.from === conn.sourceId && v.to === conn.targetId); });
                    this.setActiveType('line');
                    this.setActiveLine($utils.deepClone(line));
                });
                // 连线完成回调
                this.jsPlumb.bind('connection', (evt) => {
                    let from = evt.source.id;
                    let to = evt.target.id;
                    if (this.loadEasyFlowFinish && !this.hasLine(from, to)) {
                        if (from === this.activeLine.from && to === this.activeLine.to) {
                            this.data.lineList.push(this.activeLine);
                        } else {
                            this.data.lineList.push({
                                from,
                                to
                            });
                        }
                    }
                });

                // 删除连线回调
                this.jsPlumb.bind('connectionDetached', (evt) => {
                    this.deleteLine(evt.sourceId, evt.targetId);
                });

                // 改变线的连接节点
                this.jsPlumb.bind('connectionMoved', (evt) => {
                    this.changeLine(evt.originalSourceId, evt.originalTargetId);
                });

                // 连线右击
                this.jsPlumb.bind('contextmenu', (evt) => {
                    console.log('contextmenu', evt);
                });

                // 连线
                this.jsPlumb.bind('beforeDrop', (evt) => {
                    let from = evt.sourceId;
                    let to = evt.targetId;
                    if (from === to) {
                        this.$message.error('节点不支持连接自己');
                        return false;
                    }
                    if (this.hasLine(from, to)) {
                        this.$message.error('该关系已存在,不允许重复创建');
                        return false;
                    }
                    if (this.hashOppositeLine(from, to)) {
                        this.$message.error('不支持两个节点之间连线回环');
                        return false;
                    }
                    this.$message.success('连接成功');
                    return true;
                });

                // beforeDetach
                this.jsPlumb.bind('beforeDetach', (evt) => {
                    console.log('beforeDetach', evt);
                });
            });
        },
        // 加载流程图
        loadEasyFlow () {
        // 初始化节点
            this.data.nodeList.map((node) => {
                this.initNode(node);
            });
            // 初始化连线
            this.data.lineList.map((line) => {
                this.drawLine(line);
            });
            this.$nextTick(function () {
                this.loadEasyFlowFinish = true;
                // 初始绘线后获取当前自适应连接点（自适应绘线 连接端点出现偏差） 按照获取连接点重新绘线
                this.data.lineList = this.data.lineList.reduce((list, line) => {
                    if(!line.anchor) {
                      let conn = this.jsPlumb.getConnections({
                        source: line.from,
                        target: line.to
                      })[0];
                      const strTrans = (str) => { const Str = `${str.slice(0, 1).toLocaleUpperCase()}${str.slice(1)}`; return Str; };
                      let anchor = null;
                      let endpoint1 = conn.endpoints[0]._continuousAnchorEdge;
                      let endpoint2 = conn.endpoints[1]._continuousAnchorEdge;
                      if (endpoint1 && endpoint2) {
                        anchor = [strTrans(endpoint1), strTrans(endpoint2)];
                      }
                      line.anchor = anchor;
                      this.jsPlumb.deleteConnection(conn);
                      this.drawLine(line);
                    }
                    list.push(line);
                    return list;
                }, []);
            });
        },
        // 初始化节点
        initNode (node) {
            // 设置源点，可以拖出线连接其他节点
            this.jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}));
            // // 设置目标点，其他源点拖出的线可以连接该节点
            this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions);
            if (!node.viewOnly && this.isEdit) {
                this.jsPlumb.draggable(node.id, {
                    grid: [10, 10],
                    // 是否允许拖动超出所在组
                    stop: (el) => {
                        // 拖拽节点结束后的对调
                        console.log('拖拽结束: ', el);
                        const nodeidx = this.data.nodeList.findIndex((node) => {
                            return node.id === el.el.id;
                        });
                        this.data.nodeList[nodeidx].left = el.finalPos[0];
                        this.data.nodeList[nodeidx].top = el.finalPos[1];
                    }
                });
            }
            this.addEndpoints(node.id, contectPoints);
        },
        // 重绘连线
        setLine () {
            // 删除连线
            this.removeLine();
            // 重新添加连线
            this.drawLine(this.activeLine);
        },
        // 删除连线
        removeLine () {
            // 获取当前连线
            let conn = this.jsPlumb.getConnections({
                source: this.activeLine.from,
                target: this.activeLine.to
            })[0];
            // 删除当前连线
            this.jsPlumb.deleteConnection(conn);
        },
        // 绘制连线
        drawLine (line) {
            const stateFrom = this.data.nodeList.find((v) => { return v.id === line.from; }).state;
            const stateTo = this.data.nodeList.find((v) => { return v.id === line.to; }).state;
            const state = stateColors[stateFrom] && stateColors[stateTo] ? 'success' : null;
            const paintStyle = Object.assign(
                {},
                this.jsplumbSetting.PaintStyle,
                {
                    stroke: stateColors[state] ? stateColors[state].pain : '#E0E3E7'
                }
            );
            const connParam = {
                source: line.from,
                target: line.to,
                label: line.label ? line.label : '',
                connector: line.connector ? line.connector : 'Flowchart',
                anchors: line.anchor ? line.anchor : undefined,
                paintStyle: paintStyle
            };
            const content = this.jsPlumb.connect(connParam, this.jsplumbConnectOptions);
            content.setHoverPaintStyle({
                stroke: stateColors[state] ? stateColors[state].hoverPain : '#b0b2b5',
                strokeWidth: 2
            });
        },
        // 删除激活的元素
        deleteElement () {
            if (this.activeType === 'node') {
                this.deleteNode(this.activeNode.nodeId);
            } else if (this.activeType === 'line') {
                this.$confirm('确定删除所点击的线吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let conn = this.jsPlumb.getConnections({
                        source: this.activeLine.from,
                        target: this.activeLine.targetId
                    })[0];
                    this.jsPlumb.deleteConnection(conn);
                }).catch(() => {
                });
            }
        },
        // 删除线
        deleteLine (from, to) {
            this.data.lineList = this.data.lineList.filter(function (line) {
                return (line.from !== from || line.to !== to);
            });
        },
        // 改变连线
        changeLine (oldFrom, oldTo) {
            this.deleteLine(oldFrom, oldTo);
        },
        // 是否具有该线
        hasLine (from, to) {
            const idx = this.data.lineList.findIndex((v) => {
                return v.from === from && v.to === to;
            });
            return idx > -1;
        },
        // 是否含有相反的线
        hashOppositeLine (from, to) {
            return this.hasLine(to, from);
        },
        // 节点数据编辑保存 重绘
        repaintEverything () {
            this.data.nodeList.filter((node) => {
                if (node.id === this.activeNode.id) {
                    node.name = this.activeNode.name;
                    node.left = this.activeNode.left;
                    node.top = this.activeNode.top;
                    node.ico = this.activeNode.ico;
                    node.state = this.activeNode.state;
                    this.jsPlumb.repaint();
                }
            });
        },
        // 节点数据编辑保存 重绘
        removeEverything () {
            this.data.nodeList = this.data.nodeList.filter((node) => {
                return node.id !== this.activeNode.id;
            });
            this.jsPlumb.remove(this.activeNode.id);
        },
        // 加载流程图
        dataReload (data) {
            if (sessionStorage.getItem('data1')) { data = JSON.parse(sessionStorage.getItem('data1')); }
            this.easyFlowVisible = false;
            this.data.nodeList = [];
            this.data.lineList = [];
            this.setActiveType('node');
            this.setActiveNode($utils.deepClone(data.nodeList[0]));
            this.$nextTick(() => {
                this.data = $utils.deepClone(data);
                this.easyFlowVisible = true;
                this.$nextTick(() => {
                    this.jsPlumb = jsPlumb.getInstance();
                    this.$nextTick(() => {
                        this.jsPlumbInit();
                    });
                });
            });
        },
        /**
       * 拖拽结束后添加新的节点
       * @param evt
       * @param nodeMenu 被添加的节点对象
       * @param mousePosition 鼠标拖拽结束的坐标
       */
        addNode (evt, nodeMenu, mousePosition) {
            const efContainer = this.$refs.content;
            const containerRect = efContainer.getBoundingClientRect();
            const pageX = evt.originalEvent.pageX;
            const pageY = evt.originalEvent.pageY;
            // 计算是否拖入到容器中
            if (pageX < containerRect.x || pageX > containerRect.width + containerRect.x || pageY < containerRect.y || pageY > containerRect.y + containerRect.height) {
                this.$message.error('请把节点拖入到画布中');
                return;
            }
            // 鼠标位置 - 画布容器位置 - 画布移动位置 - 克隆元素拖动时点击点的位置
            let left = pageX - containerRect.x - this.position.left - mousePosition.left;
            let top = pageY - containerRect.y - this.position.top - mousePosition.top;
            // 消除缩放影响
            left = (left / this.scaleN).toFixed(2) * 1;
            top = (top / this.scaleN).toFixed(2) * 1;

            // 动态生成名字\
            let nodeId = $utils.createUniqueString();
            let node = {
                ...nodeDef,
                ...nodeMenu,
                ...{
                    id: nodeId,
                    left: left,
                    top: top
                }
            };
            /**
         * 这里可以进行业务判断、是否能够添加该节点
         */
            this.data.nodeList.push(node);
            this.$nextTick(function () {
                this.initNode(node);
            });
        },
        // 添加连线端点
        addEndpoints (toId, sourceAnchors) {
            if (!this.isEdit) { return; }
            for (let i = 0; i < sourceAnchors.length; i++) {
                let sourceUUID = toId + sourceAnchors[i];
                this.jsPlumb.addEndpoint(toId, sourceEndpoint, {
                    anchor: sourceAnchors[i], uuid: sourceUUID
                });
            }
        },
        updateNode (node) {
            let nodeList = this.data.nodeList.reduce((list, nodeItem) => {
                if (nodeItem.id === node.id) { nodeItem = node; }
                list.push(nodeItem);
                return list;
            }, []);
            this.data = {...this.data, nodeList};
        },
        // 移动整个画布
        moveContainerStart ($event) {
            const [leftS, topS] = [$event.pageX, $event.pageY];
            const position = this.position;
            document.onmousemove = ($evt) => {
                const [leftN, topN] = [$evt.pageX - leftS, $evt.pageY - topS];
                this.position = {
                    left: position.left + leftN,
                    top: position.top + topN
                };
            };
        },
        // 画布移动结束
        moveContainerEnd () {
            document.onmousemove = null;
        },
        // 缩放整个图例
        scale ($evt) {
            if (this.isEdit) { return; }
            this.scaleN = (this.scaleN * ($evt['deltaY'] > 0 ? 0.9 : 1.1)).toFixed(2) * 1;
        },
        edit() {
          this.scaleN = 1;
          this.isEdit = !this.isEdit;this.init();
        }
    }
};
</script>
<style lang="scss" scoped>
  $sss: 150px;
  @import "components/index";
</style>
