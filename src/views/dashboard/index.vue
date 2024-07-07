<template>
    <div class="dashboard-container">
        <div>
            <button @click="onPrintText">打印测试-文本</button>
        </div>
        <div style="margin-top: 10px;">
            <button @click="onPrintWebTestPage">打印测试-web测试页面</button>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Dashboard',
    components: {  },
    data() {
        return {
        }
    },
    computed: {

    },
    created() {

    },

    methods: {
        onPrintText() {
            window.electronAPI.print('11111111111111111111')
        },

        onPrintWebTestPage() {
            window.electronAPI.printWebTestPage()
        }
    }
}
</script>

<style scoped lang="scss">

.dashboard-container{
    padding: 20px;
    box-sizing: border-box;
}

</style>
