import { createRouter, createWebHashHistory } from 'vue-router'
// import { setupLayouts } from 'virtual:generated-layouts'
// import generatedRoutes from 'virtual:generated-pages'
import routes from '~pages'
// export const routes = setupLayouts(generatedRoutes)

const options = {
  history: createWebHashHistory(),
  routes,
}

const router = createRouter(options)

export default router
