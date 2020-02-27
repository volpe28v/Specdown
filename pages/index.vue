<template>
  <div class="main">
    <div class="left-pane">
      <editor v-model="input" @init="editorInit"></editor>

      <!-- <el&#45;input -->
      <!--   v&#45;model="input" -->
      <!--   :autosize="{ minRows: 100, maxRows: 200 }" -->
      <!--   type="textarea" -->
      <!--   placeholder="Please input as markdown" -->
      <!-- /> -->
    </div>
    <div class="right-pane">
      <div class="right-header">
        <el-select v-model="render" value-key="name" placeholder="Select">
          <el-option
            v-for="render in renders"
            :key="render.name"
            :label="render.name"
            :value="render"
          />
        </el-select>
        <el-button v-clipboard:copy="output" type="primary" @click="onCopy">
          Copy
        </el-button>
      </div>
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
  components: {
    editor: require('vue2-ace-editor')
  },
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
  },
  methods: {
    editorInit(editor) {
      require('brace/ext/language_tools')
      require('brace/theme/chaos')

      editor.setOptions({
        showPrintMargin: false
      })
      editor.setFontSize(14)
      editor.setTheme('ace/theme/chaos')
      editor.getSession().setUseWrapMode(true)
      editor.$blockScrolling = Infinity
      editor.session.setOptions({
        tabSize: 4,
        useSoftTabs: false
      })
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
  background-color: black;
}

.main {
  display: flex;
  overflow: hidden;
}

.left-pane {
  display: flex;
  flex: 1;
}

.right-pane {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.right-header {
  flex-direction: row;
  margin: 4px;
}

.render {
  flex: 1;
}
</style>
