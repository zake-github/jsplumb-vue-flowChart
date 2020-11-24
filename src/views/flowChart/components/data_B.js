let dataA = {
    name: '流程A',
    nodeList: [
        {
            id: 'nodeA',
            parentIds: ['nodeE', 'nodeI'],
            childrenIds: ['nodeB'],
            name: '节点A',
            type: 'start',
            left: 160,
            top: 0,
            ico: 'el-icon-user-solid',
            state: 'success'
            // viewOnly: true
        },
        {
            id: 'nodeB',
            parentIds: ['nodeA'],
            childrenIds: ['nodeC', 'nodeJ'],
            name: '节点B',
            type: 'diamond',
            left: 160,
            top: 160,
            ico: 'el-icon-user-solid',
            state: 'warning'
        },
        {
            id: 'nodeC',
            parentIds: ['nodeB'],
            childrenIds: ['nodeD', 'nodeE'],
            name: '节点C',
            type: 'diamond',
            left: 440,
            top: 160,
            ico: 'el-icon-user-solid',
            state: 'running'
        },
        {
            id: 'nodeD',
            parentIds: ['nodeC', 'nodeF'],
            childrenIds: ['nodeJ'],
            name: '节点D',
            type: 'task',
            left: 250,
            top: 330,
            ico: 'el-icon-user-solid',
            state: 'success'
            // viewOnly: true
        },
        {
            id: 'nodeE',
            parentIds: ['nodeC'],
            childrenIds: ['nodeG', 'nodeA'],
            name: '节点E',
            type: 'diamond',
            left: 570,
            top: 300,
            ico: 'el-icon-user-solid',
            state: 'warning'
        },
        {
            id: 'nodeF',
            parentIds: ['nodeG'],
            childrenIds: ['nodeD'],
            name: '节点F',
            type: 'task',
            left: 250,
            top: 460,
            ico: 'el-icon-user-solid',
            state: 'running'
        },
        {
            id: 'nodeG',
            parentIds: ['nodeE'],
            childrenIds: ['nodeF', 'nodeH'],
            name: '节点G',
            type: 'diamond',
            left: 420,
            top: 532,
            ico: 'el-icon-user-solid',
            state: 'running'
        },
        {
            id: 'nodeH',
            parentIds: ['nodeG'],
            childrenIds: ['nodeI'],
            name: '节点H',
            type: 'task',
            left: 650,
            top: 550,
            ico: 'el-icon-user-solid',
            state: 'running'
        },
        {
            id: 'nodeI',
            parentIds: ['nodeH'],
            childrenIds: ['nodeJ', 'nodeA'],
            name: '节点I',
            type: 'task',
            left: 650,
            top: 680,
            ico: 'el-icon-user-solid',
            state: 'running'
        },
        {
            id: 'nodeJ',
            parentIds: ['nodeB', 'nodeD', 'nodeI'],
            childrenIds: [],
            name: '节点J',
            type: 'task',
            left: 130,
            top: 750,
            ico: 'el-icon-user-solid',
            state: 'running'
        }
    ],
    lineList: [
        {
            id: 'line1',
            from: 'nodeA',
            to: 'nodeB',
            anchor: ['Bottom', 'Top'],
            label: '条件A'
        },
        {
            id: 'line2',
            from: 'nodeB',
            to: 'nodeC',
            anchor: ['Right', 'Left'],
            label: '条件B'
        },
        {
            id: 'line3',
            from: 'nodeB',
            to: 'nodeJ',
            anchor: ['Left', 'Left']
        },
        {
            id: 'line4',
            from: 'nodeC',
            to: 'nodeD',
            anchor: ['Bottom', 'Top']
        },
        {
            id: 'line5',
            from: 'nodeC',
            to: 'nodeE',
            anchor: ['Right', 'Top']
        },
        {
            id: 'line6',
            from: 'nodeD',
            to: 'nodeJ',
            anchor: ['Left', 'Top']
        },
        {
            id: 'line7',
            from: 'nodeE',
            to: 'nodeA',
            anchor: ['Right', 'Right']
        },
        {
            id: 'line8',
            from: 'nodeE',
            to: 'nodeG',
            anchor: ['Left', 'Top']
        },
        {
            id: 'line9',
            from: 'nodeF',
            to: 'nodeD',
            anchor: ['Top', 'Bottom']
        },
        {
            id: 'line10',
            from: 'nodeG',
            to: 'nodeF',
            anchor: ['Left', 'Bottom']
        },
        {
            id: 'line11',
            from: 'nodeG',
            to: 'nodeH',
            anchor: ['Right', 'Left']
        },
        {
            id: 'line12',
            from: 'nodeH',
            to: 'nodeI',
            anchor: ['Bottom', 'Top']
        },
        {
            id: 'line13',
            from: 'nodeI',
            to: 'nodeA',
            anchor: ['Right', 'Top']
        },
        {
            id: 'line14',
            from: 'nodeI',
            to: 'nodeJ',
            anchor: ['Bottom', 'Right']
        }
    ]
};

export function getDataA () {
    return dataA;
}
