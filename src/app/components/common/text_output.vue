<template>
    <div class="text-container" ref="text-container" @scroll="onScroll">
        <pre>{{text}}</pre>
    </div>
</template>


<script>
"use strict";

module.exports = {
    props: ['text'],
    data() {
        return {
            follow: true
        };
    },
    methods: {
        onScroll(ev) {
            const target = ev.target;
            if (target.scrollTop + target.clientHeight < target.scrollHeight) {
                this.follow = false;
            } else this.follow = true;
        }
    },
    watch: {
        text: {
            immediate: true,
            handler() {
                if (this.follow) {
                    this.$nextTick(() => {
                        const container = this.$refs["text-container"];
                        container.scrollTop = container.scrollHeight;
                    });
                }
                if (!this.text) {
                    this.follow = true;
                }
            }
        }
    }
};
</script>


<style lang="scss" scoped>
.text-container {
    background-color: #eeeeee;
    overflow: auto;
    height: 200px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-color: #e2e2e2;
    pre {
        width: fit-content;
        overflow: visible;
        white-space: pre-wrap;
        background-color: transparent;
        padding: 0.75rem;
    }
}
</style>
