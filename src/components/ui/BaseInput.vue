<!--
  BaseInput Component
  
  Wiederverwendbares Input-Feld mit Label und Error-State
-->

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="input-group" :class="{ 'has-error': error }">
    <label v-if="label" class="label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    
    <input
      class="input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #333;
}

.required {
  color: #dc3545;
}

.input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
}

.input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.has-error .input {
  border-color: #dc3545;
}

.has-error .input:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
}

.error-message {
  font-size: 0.75rem;
  color: #dc3545;
}
</style>
