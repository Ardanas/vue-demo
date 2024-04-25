<script  setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { createEditor } from '@wangeditor/editor'

const props = defineProps({
  loading: Boolean,
  defaultValue: String,
  title: String,
})

const TEST_HTML = `<p><img src="/images/OIP.jpeg" alt="" data-href="" style=""/></p><p>测试文字</p><p>测试文字</p><p>测试文字</p><p><img src="/images/OIP-1.jpeg" alt="" data-href="" style=""/></p><p><br></p><p><br></p><p><img src="/images/OIP-2.jpeg" alt="" data-href="" style=""/></p><p>测试文字</p><p>测试文字测试文字</p><p>测试文字</p><p><img src="/images/OIP-3.jpeg" alt="" data-href="" style=""/></p><p>测试文字</p><p>测试文字</p><p><img src="/images/OIP-4.jpeg" alt="" data-href="" style=""/></p><p>测试文字</p><p>测试文字</p><p>测试文字</p><p>测试文字</p><p><img src="/images/OIP-5.jpeg" alt="" data-href="" style=""/></p><p>测试文字</p><p><img src="/images/OIP-6.jpeg" alt="" data-href="" style=""/></p><p>测试文字</p><p><img src="/images/OIP-7.jpeg" alt="" data-href="" style=""/></p><p>测试文字</p>`

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
  if (!step.value) {
    // eslint-disable-next-line no-alert
    return alert('请输入要按照多少切割文章')
  }

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
  nextTick(() => {
    observeImage('#preview img')
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

function replaceImgSrcWithDataSrc(htmlString) {
  // 使用正则表达式匹配所有img标签的src属性
  const regex = /<img[^>]+src="([^">]+)"/g

  // 将匹配到的src属性替换为data-src属性
  const replacedHtml = htmlString.replace(regex, '<img src="#" data-href="$1"')

  return replacedHtml
}

function queryData() {
  setTimeout(() => {
    const html = replaceImgSrcWithDataSrc(TEST_HTML)
    editorRef.value.setHtml(html)

    nextTick(() => {
      observeImage('#editor img')
    })
  }, 1000)
}

function observeImage(selector) {
  const images = document.querySelectorAll(selector) // 获取所有图片标签元素
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // 判断当前元素是否可见
      if (entry.isIntersecting) {
        // 创建一个自定义属性data-src存放真正要显示的图片路径，原本img自带的src放一张默认图片
        const img = entry.target
        const data_src = img.getAttribute('data-href')
        img.setAttribute('src', data_src)
        // 解除观察，有几张图片就触发几次
        observer.unobserve(img)
      }
    })
  }, { threshold: 0.01 }) // 设置触发加载时的视图交叉比例

  images.forEach((image) => {
    // 对每一个图片对象进行观察
    observer.observe(image)
  })
}

onMounted(() => {
  queryData()
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
          id="editor"
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
      <div id="preview" flex flex-col gap-6 w="1/2">
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
