<template>
  <div class="main">
    <div class="header">
      <div class="logo">
        SpecDown
      </div>
      <div class="right-controller">
        <el-select
          v-model="specRender"
          value-key="name"
          placeholder="Select"
          @change="updateSpec"
        >
          <el-option
            v-for="render in specRenders"
            :key="render.name"
            :label="render.name"
            :value="render"
          />
        </el-select>
        <el-button v-clipboard:copy="output" type="primary" @click="onCopy">
          <i class="el-icon-copy-document"></i>
        </el-button>
      </div>
    </div>
    <div class="body">
      <div class="left-pane">
        <MarkdownTextArea v-model="input" @input="onInput" />
      </div>
      <div class="right-pane">
        <div class="render">
          <pre v-highlightjs="output"><code :class="format"></code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import Converter from '@/services/Converter'
import specRenders from '@/services/SpecRenders'
import MarkdownTextArea from '@/components/MarkdownTextArea'

const sampleMarkdown = [
  '- d: description',
  '    - c: context1',
  '        - b: setup',
  '            - comment',
  '        - i: expect1',
  '        - i: expect2',
  '            - comment',
  '        - i: expect3',
  '        - a: tear down',
  '    - c: context2',
  '        - i: expect1',
  '            - comment',
  '        - i: expect2',
  '        - i: expect3'
]

export default {
  components: {
    MarkdownTextArea
  },
  data() {
    return {
      input: sampleMarkdown.join('\n'),
      output: '',
      specRender: specRenders[0],
      specRenders
    }
  },
  computed: {
    format() {
      return this.specRender.format
    }
  },
  mounted() {
    this.output = Converter.convertToSpec(this.input, this.specRender)
  },
  methods: {
    onInput: debounce(function() {
      this.updateSpec()
    }, 500),
    updateSpec() {
      this.output = Converter.convertToSpec(this.input, this.specRender)
    },
    onCopy() {
      this.$message('Copied!')
    }
  }
}
</script>

<style>
html,
body,
#__nuxt,
#__layout,
.main,
#__layout > div {
  width: 100%;
  height: 100%;
}

.main {
  display: flex;
  overflow: hidden;
  flex-direction: column;
}

.header {
  display: flex;
  padding: 5px;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 25px;
  font-weight: bold;
  margin-left: 10px;
}

.body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-pane {
  display: flex;
  flex: 1;
}

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

.right-pane {
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: black;
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
