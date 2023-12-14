import { defineStore } from 'pinia'
import { TimeFormat } from '@/enums/time-format'
import { ref } from 'vue'

export const useTimeFormat = defineStore('timeFormat', () => {
  const timeFormat = ref<TimeFormat>(TimeFormat.H24)

  const setTimeFormat = (format: TimeFormat) => {
    timeFormat.value = format
  }

  return { timeFormat, setTimeFormat }
})
