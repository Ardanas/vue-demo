<script  setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const props = defineProps({
  loading: Boolean,
  defaultValue: String,
  title: String,
})

const emits = defineEmits(['change', 'save'])

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p></p>')

const title = ref('')

const stopWatchTitle = watch(
  () => props.title,
  (newValue) => {
    if (!newValue)
      return
    title.value = newValue
    stopWatchTitle()
  },
)
const stopWatchValue = watch(
  () => props.defaultValue,
  (newValue) => {
    if (!newValue)
      return
    valueHtml.value = newValue
    stopWatchValue()
  },
)

const toolbarConfig = {
  excludeKeys: ['fullScreen', 'codeBlock', 'uploadVideo', 'uploadImage'],
}
const editorConfig = { placeholder: '请输入内容...', scroll: false, autoFocus: true }

// 编辑器回调函数
function handleCreated(editor) {
  editorRef.value = editor
}

function handleChange(editor) {
  emits('change', editor.isEmpty() ? '' : editor.getHtml())
}

function customAlert(info, type) {
}

function customPaste(_editor, _event, callback) {
  // console.log('ClipboardEvent 粘贴事件对象', event)

  // 自定义插入内容
  // editor.insertText('xxx')

  // 返回值（注意，vue 事件的返回值，不能用 return）
  // callback(false) // 返回 false ，阻止默认粘贴行为
  callback(true) // 返回 true ，继续默认的粘贴行为
}

function handleKeyDown(event) {
  if ((event.ctrlKey || event.metaKey) && event.code === 'KeyS') {
    // 执行保存操作
    event.preventDefault() // 阻止默认的保存行为
    emits('save', title.value, valueHtml.value)
  }
}

function handleClick() {
  editorRef.value.focus()
}
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)

  const editor = editorRef.value
  if (editor == null)
    return

  editor.destroy()
})
</script>

<template>
  <div max-w="1448px" mx-auto h-full min-h-full overflow-hidden>
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      border-b="1px solid #e8e8e8"
    />
    <Editor
      v-model="valueHtml"
      min-h-xl
      :default-config="editorConfig"
      v-bind="$attrs"
      @click="handleClick"
      @on-created="handleCreated"
      @on-change="handleChange"
      @custom-alert="customAlert"
      @custom-paste="customPaste"
      v-on="$attrs"
    />
  </div>
</template>
