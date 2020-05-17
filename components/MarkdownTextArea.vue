<template>
  <el-input
    v-model="input"
    type="textarea"
    placeholder="Please input as markdown"
    @input="updateValue"
    @keydown.tab.prevent.native="onTab($event)"
    @keydown.enter.prevent.native="onEnter($event)"
  />
</template>

<script>
export default {
  name: 'MarkdownTextArea',
  props: {
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      input: this.value
    }
  },
  methods: {
    updateValue() {
      this.$emit('input', this.input)
    },
    onEnter(event) {
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

      this.updateValue()
    },
    onTab(event) {
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
      this.updateValue()
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
.el-textarea__inner {
  font-family: Menlo, Monaco, 'Courier New', monospace;
  font-size: 14px;
}

.el-textarea__inner {
  height: 100%;
  line-height: 21px;
  padding-top: 8px;
}
</style>
