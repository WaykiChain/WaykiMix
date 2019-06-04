<template>
  <div>
    <editor
      v-model="code"
      @init="editorInit"
      @input="change"
      :options="options"
      lang="lua"
      theme="monokai"
      :autoComplete="true"
      width="1000"
      height="600"
    ></editor>
  </div>
</template>
<script>
// import ace from 'vue2-ace-editor'
export default {
  components: {
    editor: require("vue2-ace-editor")
  },
  data() {
    return {
      code: "",
      options: {
        /*vue2-ace-editor编辑器配置自动补全等*/
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true /*自动补全*/
      }
    };
  },
  methods: {
    editorInit: function() {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/lua"); //language
      require("brace/theme/monokai");
      require("brace/snippets/lua"); //snippet
    },
    change(ee,err){
      console.log(ee,err)
    }
  }
};
</script>

<style lang="less" scoped>
</style>
