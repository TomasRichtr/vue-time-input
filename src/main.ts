import { createPinia } from 'pinia'
import TimeInput from '@/components/TimeInput.vue'

export default {
  install: (app, options) => {
    const pinia = createPinia()
    app.use(pinia)
    app.component('TimeInput', TimeInput)
  }
}
