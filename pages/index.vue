<template>
  <div class="main">
    <div class="left-pane">
      <div class="inputter">
        <el-input
          v-model="input"
          :autosize="{ minRows: 100, maxRows: 200 }"
          type="textarea"
          placeholder="Please input as markdown"
        />
      </div>
    </div>
    <div class="right-pane">
      <el-select v-model="render" value-key="name" placeholder="Select">
        <el-option
          v-for="render in renders"
          :label="render.name"
          :key="render.name"
          :value="render"
        />
      </el-select>
      <div class="render">
        <pre v-highlightjs="output"><code></code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import converter from '@/services/Converter'
import specRenders from '@/services/SpecRenders'

export default {
  data() {
    return {
      input: [
        '- d: description',
        '    - c: context1',
        '        - i: expect1',
        '        - i: expect2',
        '            - comment',
        '        - i: expect3',
        '    - c: context2',
        '        - i: expect1',
        '            - comment',
        '        - i: expect2',
        '        - i: expect3'
      ].join('\n'),
      render: specRenders[0],
      renders: specRenders
    }
  },
  computed: {
    output() {
      return converter(this.input, this.render)
    }
  }
}
</script>

<style>
.main {
  display: flex;

  height: 100%;
  overflow: hidden;
}

.left-pane {
  flex: 1;
}

.inputter {
  flex: 1;
}

.right-pane {
  flex: 1;
  flex-direction: column;
}

.render {
  flex: 1;
  margin: 10px;
}
</style>
