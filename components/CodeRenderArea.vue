<template>
  <div class="CodeRenderArea">
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

<style lang="scss" scoped>
.CodeRenderArea {
  flex: 1;
  overflow-y: auto;
  background-color: black;

  code {
    font-family: Menlo, Monaco, 'Courier New', monospace;
    font-size: 14px;
    line-height: 18px;
  }
}
</style>
