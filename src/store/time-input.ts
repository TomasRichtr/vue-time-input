import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useTimeFormat } from '@/store/time-format'
import { PartOfDay, TimeFormat } from '@/enums/time-format'

export const useTimeInput = defineStore('timeInput', () => {
  const timeToSave = ref('')
  const { timeFormat } = storeToRefs(useTimeFormat())
  const setTimeToSave = (timeString: string) => {
    if (timeFormat.value === TimeFormat.H24) {
      timeToSave.value = timeString
      return
    }

    const [time, modifier] = timeString.split(' ')
    let [hours, minutes]: number[] | string[] = time.split(':')

    hours = parseInt(hours, 10)
    minutes = parseInt(minutes, 10)

    if (hours === 12) hours = 0
    if (modifier?.toLowerCase() === PartOfDay.PM) hours = hours + 12
    if (hours < 10) hours = '0' + hours

    if (!hours || !minutes) {
      timeToSave.value = ''
      return
    }
    timeToSave.value = `${hours}:${minutes.toString().padStart(2, '0')}`
  }

  return { timeToSave, setTimeToSave }
})
