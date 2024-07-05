<template>
    <div class="dashboard-container">
        <button @click="onPrintText">打印测试-文本</button>
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
        }
    }
}
</script>
