<script  setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { createEditor } from '@wangeditor/editor'

const props = defineProps({
  loading: Boolean,
  defaultValue: String,
  title: String,
})

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p></p>')

const paragraphs = ref([])

const step = ref(3)

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

const editorConfig = { placeholder: '请输入内容...', scroll: false, autoFocus: true }

// 编辑器回调函数
function handleCreated(editor) {
  editorRef.value = editor
}

function customPaste(_editor, _event, callback) {
  // console.log('ClipboardEvent 粘贴事件对象', event)

  // 自定义插入内容
  // editor.insertText('xxx')

  // 返回值（注意，vue 事件的返回值，不能用 return）
  // callback(false) // 返回 false ，阻止默认粘贴行为
  callback(true) // 返回 true ，继续默认的粘贴行为
}

function pgeneralDataJSON() {
  const isEmpty = editorRef.value.isEmpty()
  if (isEmpty)
    // eslint-disable-next-line no-alert
    return alert('请先输入内容')
  const dataJSON = editorRef.value.children
  const _step = step.value
  let s = 0
  let e = _step
  const result = []
  while (dataJSON[e]) {
    const sliceData = dataJSON.slice(s, e)
    result.push(sliceData)
    s += _step
    e += _step
  }
  result.push(dataJSON.slice(s))
  return result
}

function handlePreview() {
  if (!step.value)
    // eslint-disable-next-line no-alert
    return alert('请输入要按照多少切割文章')

  handleSave()
}

function handleSave() {
  const dataJSONArr = pgeneralDataJSON()
  paragraphs.value = dataJSONArr.map((content) => {
    const editor = createEditor({
      content,
    })
    return editor.getHtml()
  })
}

function handleKeyDown(event) {
  if ((event.ctrlKey || event.metaKey) && event.code === 'KeyS') {
    // 执行保存操作
    event.preventDefault() // 阻止默认的保存行为
    handleSave()
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
  <div>
    <header flex items-center gap-2>
      <div flex-center gap-2 text-4>
        <label for="cutting">设置切割的间隔</label>
        <input id="cutting" v-model="step" type="number" min="1" border-1 rounded-1 focus-visible:outline-none>
      </div>

      <button class="h-9 inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-medium shadow transition-colors disabled:pointer-events-none hover:bg-primary/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" @click="handlePreview">
        预览
      </button>
    </header>
    <div flex gap-4>
      <div h-full min-h-full w="1/2" overflow-hidden>
        <Toolbar
          :editor="editorRef"
          border-b="1px solid #e8e8e8"
          mode="simple"
        />
        <Editor
          v-model="valueHtml"
          min-h-xl
          :default-config="editorConfig"
          v-bind="$attrs"
          mode="simple"
          @click="handleClick"
          @on-created="handleCreated"
          @custom-paste="customPaste"
          v-on="$attrs"
        />
      </div>
      <div border />
      <div flex flex-col gap-6 w="1/2">
        <div v-for="(html, i) in paragraphs" :key="i">
          <div text-xl text-red-5 font-bold>
            paragraphs {{ i + 1 }}
          </div>
          <div prose v-html="html" />
          <div border-b="3" />
        </div>
      </div>
    </div>
  </div>
</template>
