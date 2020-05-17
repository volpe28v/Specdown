<template>
  <div class="render">
    <pre v-highlightjs="value"><code :class="format"></code></pre>
  </div>
</template>

<script>
export default {
  name: 'CodeRenderArea',
  props: {
    value: {
      type: String,
      default: null
    },
    format: {
      type: String,
      default: null
    }
  }
}
</script>

<style>
.el-textarea__inner,
code {
  font-family: Menlo, Monaco, 'Courier New', monospace;
  font-size: 14px;
}

.el-textarea__inner {
  height: 100%;
  line-height: 21px;
  padding-top: 8px;
}

.render {
  flex: 1;
  overflow-y: auto;
  margin: 0 10px;
}

code {
  line-height: 18px;
}
</style>
