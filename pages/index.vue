<template>
  <div class="main">
    <div class="header">
      <div class="logo">
        SpecDown
      </div>
      <div class="right-controller">
        <el-select
          v-model="render"
          value-key="name"
          placeholder="Select"
          @change="updateSpec"
        >
          <el-option
            v-for="render in renders"
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
        <el-input
          v-model="input"
          type="textarea"
          placeholder="Please input as markdown"
          @input="onInput"
          @keydown.tab.prevent.native="tabber($event)"
          @keydown.enter.prevent.native="enter($event)"
        />
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
import converter from '@/services/Converter'
import specRenders from '@/services/SpecRenders'

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
  data() {
    return {
      input: sampleMarkdown.join('\n'),
      output: '',
      render: specRenders[0],
      renders: specRenders
    }
  },
  computed: {
    format() {
      return this.render.format
    }
  },
  mounted() {
    this.output = converter(this.input, this.render)
  },
  methods: {
    onInput: debounce(function() {
      this.updateSpec()
    }, 500),
    updateSpec() {
      this.output = converter(this.input, this.render)
    },
    onCopy() {
      this.$message('Copied!')
    },
    enter(event) {
      if (event.keyCode !== 13) return

      const text = this.input
      const originalSelectionStart = event.target.selectionStart

      const [linePos, lineAll] = this._getCursorLinePos(
        originalSelectionStart,
        text
      )

      const matches = lineAll[linePos].match(/(^[ ]*([-][ ]?)).*/)
      if (matches) {
        const prefix = matches[1]
        lineAll.splice(linePos + 1, 0, prefix)
        this.input = lineAll.join('\n')
        this.$nextTick(() => {
          event.target.selectionEnd = originalSelectionStart + prefix.length + 1
        })
      } else {
        lineAll.splice(linePos + 1, 0, '')
        this.input = lineAll.join('\n')
        this.$nextTick(() => {
          event.target.selectionEnd = originalSelectionStart + 1
        })
      }

      this.updateSpec()
    },
    tabber(event) {
      const text = this.input
      const originalSelectionStart = event.target.selectionStart

      const [linePos, lineAll] = this._getCursorLinePos(
        originalSelectionStart,
        text
      )

      const spaceNumber = 4
      const spaces = ' '.repeat(spaceNumber)

      if (event.shiftKey) {
        const listReg = new RegExp('^' + spaces + '(.*)')
        const matches = lineAll[linePos].match(listReg)
        if (matches) {
          lineAll[linePos] = matches[1]

          this.input = lineAll.join('\n')
          this.$nextTick(() => {
            event.target.selectionEnd = originalSelectionStart - spaceNumber
          })
        }
      } else {
        lineAll[linePos] = spaces + lineAll[linePos]

        this.input = lineAll.join('\n')
        this.$nextTick(() => {
          event.target.selectionEnd = originalSelectionStart + spaceNumber
        })
      }
      this.updateSpec()
    },
    // ref: https://qiita.com/legokichi/items/ed2629b037e72c6cd639
    _getCursorLinePos(pos, text) {
      const lines = text.split('\n')
      const charCounts = lines.map((line) => line.length + 1)
      if (charCounts.length > 0 && charCounts[0] > 0) {
        charCounts[0] -= 1
      }
      let cur = 0
      let sum = 0
      for (let i = 0; i < charCounts.length; i++) {
        sum += charCounts[i]
        if (pos <= sum) {
          cur = i + 1
          break
        }
      }
      return [cur - 1, lines]
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
