<template>
  <div class="SpecSelect">
    <el-select
      v-model="specRender"
      value-key="name"
      placeholder="Select"
      @change="changeSpecRender"
    >
      <el-option
        v-for="render in specRenders"
        :key="render.name"
        :label="render.name"
        :value="render"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SpecSelect',
  props: {
    value: {
      type: Object,
      required: true
    },
    specRenders: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      specRender: this.value
    }
  },
  methods: {
    changeSpecRender() {
      this.$emit('input', this.specRender)
    }
  }
}
</script>

<style lang="scss" scoped>
.SpecSelect {
  margin-right: 5px;
}
</style>
