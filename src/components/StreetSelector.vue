<!-- StreetSelector.vue -->
<template>
  <div class="form-group">
    <input 
      class="street-input" 
      type="text" 
      v-model="streetInput" 
      @input="search" 
      placeholder="Nom de la rue" 
    />
    <div v-if="showDropdown" class="dropdown">
      <div 
        v-for="street in filteredStreets" 
        :key="street.RUE"
        class="dropdown-item"
        @click="selectStreet(street)"
      >
        {{ street.RUE }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const streetInput = ref('')
const showDropdown = ref(false)
const streets = ref([])
const filteredStreets = ref([])

onMounted(async () => {
  try {
    const response = await fetch('/addresses.json')
    const data = await response.json()
    streets.value = data
  } catch (error) {
    console.error('Error loading street data:', error)
  }
})

const search = () => {
  if (streetInput.value.length < 2) {
    showDropdown.value = false
    filteredStreets.value = []
    return
  }

  filteredStreets.value = streets.value
    .filter(street => street.RUE && street.RUE.toLowerCase().includes(streetInput.value.toLowerCase()))
    .slice(0, 10)

  showDropdown.value = filteredStreets.value.length > 0
  emit('update:modelValue', streetInput.value)
}

const selectStreet = (street) => {
  streetInput.value = street.RUE
  emit('update:modelValue', street.RUE)
  showDropdown.value = false
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== streetInput.value) {
    streetInput.value = newValue
  }
})
</script>

<style scoped>
.form-group {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.street-input {
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

.street-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.street-input:focus {
  outline: none;
  background-color: rgba(0, 0, 0, 0.6);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 4px;
  margin-top: 5px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
  color: #333;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}
</style>