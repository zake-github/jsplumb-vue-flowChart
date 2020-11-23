<template>
  <el-select v-model="val" @change="chg">
    <el-option v-for="i in lineSetData" :key="`key${i.label}`" :label="i.label" :value="i.value"></el-option>
  </el-select>
</template>

<script>
let lineSetData = [];
const label = ['下', '右', '上', '左'];
const value = ['Bottom', 'Right', 'Top', 'Left'];
label.map((l, i) => {
    label.map((r, j) => {
        lineSetData.push({
            label: `${l}-${r}`,
            value: `${value[i]},${value[j]}`
        });
    });
});
export default {
    props: {
        value: {
            type: Array | null | undefined,
            default: () => { return []; }
        }
    },
    computed: {
        val: {
            get () {
                return (this.value && this.value.join(',')) || '';
            },
            set (val) {
                val = val ? val.split(',') : val;
                this.$emit('input', val);
            }
        }
    },
    data () {
        return {
            lineSetData: Object.freeze(lineSetData)
        };
    },
    methods: {
        chg (...v) {
            console.log(v);
        }
    }
};
</script>

<style scoped>

</style>
