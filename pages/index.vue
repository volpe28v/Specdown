<template>
  <div class="main">
    <div class="inputter">
      <el-input
        v-model="input"
        :autosize="{ minRows: 100, maxRows: 200 }"
        type="textarea"
        placeholder="Please input"
      />
    </div>
    <div class="render">
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<script>
import converter from '@/services/Converter'

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
      ].join('\n')
    }
  },
  computed: {
    output() {
      return converter(this.input)
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

.inputter {
  flex: 1;
}

.render {
  flex: 1;

  margin: 10px;
}
</style>
