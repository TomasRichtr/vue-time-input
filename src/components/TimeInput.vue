<template>
  <div>
    <label class="label">time:</label>
    <span class="input-wrapper" :class="{ 'input-wrapper-focus': userInputFocus }">
      <span class="custom-placeholder" v-html="displayPlaceholder" ref="timeInputPlaceholder" />
      <input
        class="monospace-input"
        v-model="userInput"
        ref="timeInput"
        @blur="setAmPm"
        @focus="userInputFocus = true"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useTimeFormat } from '@/store/time-format'
import { TimeFormat, TimePlaceholder } from '@/enums/time-format'
import { useTimeInput } from '@/store/time-input'

const { timeFormat } = storeToRefs(useTimeFormat())
const { setTimeToSave } = useTimeInput()

const userInput = ref('')
const userInputFocus = ref(false)
const previousInput = ref('')

const validateAndFormatInput = (input: string) => {
  if (input.length < previousInput.value.length) {
    previousInput.value = input
    return input
  }

  const numbersOnly = input.replace(/[^\d]/g, '')

  let hours = numbersOnly.substring(0, 2)
  let minutes = numbersOnly.substring(2, 4)

  if (hours.length === 2) {
    let maxHours = timeFormat.value === TimeFormat.H24 ? 23 : 12
    hours = Math.min(parseInt(hours) || 0, maxHours)
      .toString()
      .padStart(2, '0')
  }

  if (minutes.length === 2) {
    minutes = Math.min(parseInt(minutes) || 0, 59)
      .toString()
      .padStart(2, '0')
  }

  let formatted = hours
  if (hours.length === 2 && minutes.length > 0) {
    formatted += `:${minutes}`
  }

  if (timeFormat.value === TimeFormat.H12 && formatted.length >= 5) {
    if (input.toLowerCase().includes('a')) {
      formatted += ' am'
    } else if (input.toLowerCase().includes('p')) {
      formatted += ' pm'
    }
  }

  previousInput.value = formatted
  return formatted
}

watch(userInput, (newValue) => {
  userInput.value = validateAndFormatInput(newValue)
  setTimeToSave(userInput.value)
})
watch(timeFormat, async () => {
  userInput.value = ''
  timeInput.value?.focus()

  await nextTick()
  alignInputWidthWithPlaceholder()
})

const placeholderText = computed(() => {
  return timeFormat.value === TimeFormat.H24 ? TimePlaceholder.H24 : TimePlaceholder.H12
})

const displayPlaceholder = computed(() => {
  let maskedPlaceholder = placeholderText.value.split('')
  for (let i = 0; i < userInput.value.length; i++) {
    if (userInput.value[i] !== ' ') {
      maskedPlaceholder[i] = '&nbsp;' // Replace with a non-breaking space
    }
  }
  return maskedPlaceholder.join('')
})

const timeInput = ref<HTMLInputElement>()
onMounted(() => {
  alignInputWidthWithPlaceholder()
  timeInput.value?.focus()
})

const setAmPm = () => {
  userInputFocus.value = false
  if (timeFormat.value === TimeFormat.H24) return

  if (
    !userInput.value.toLowerCase().includes('p') &&
    !userInput.value.toLowerCase().includes('a')
  ) {
    userInput.value += 'a'
  }
}

const timeInputPlaceholder = ref<HTMLDivElement>()

const alignInputWidthWithPlaceholder = () => {
  if (!timeInput.value || !timeInputPlaceholder.value) return

  timeInput.value.style.width = `${timeInputPlaceholder.value?.clientWidth}px`
  timeInputPlaceholder.value.style.height = `${timeInput.value?.clientHeight}px`
}
</script>

<style scoped>
.input-wrapper {
  position: relative;
  padding: 0.5rem;
  display: flex;
  justify-items: center;
  justify-content: center;
  border-bottom: 1px solid gray;
}

.monospace-input {
  font-family: 'Courier New', Courier, monospace;
  font-size: 2rem;
  background-color: transparent;
  border: none;
}
.monospace-input:focus {
  outline: none;
  border: none;
}

.custom-placeholder {
  position: absolute;
  top: 0;
  padding-top: 0.5rem;
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
  color: #aaa;
  pointer-events: none;
  white-space: pre; /* Preserve spaces and layout */
}

.label {
  font-style: italic;
  text-align: left;
  width: 100%;
}
</style>
