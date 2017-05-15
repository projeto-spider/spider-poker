<template>
  <div class='control has-icon'>
    <input
      v-if="type === 'email'"
      type="email"
      class="input"
      :class="inputClass"
      v-model="inputValue"
      @input="input"
      :placeholder="placeholder"
    />

    <input
      v-if="type === 'password'"
      type="password"
      class="input"
      :class="inputClass"
      v-model="inputValue"
      @input="input"
      :placeholder="placeholder"
    />

    <input
      v-if="type === 'text'"
      type="text"
      class="input"
      :class="inputClass"
      v-model="inputValue"
      @input="input"
      :placeholder="placeholder"
    />

    <textarea
      v-if="type === 'textarea'"
      class="textarea"
      :class="inputClass"
      v-model="inputValue"
      @input="input"
      :placeholder="placeholder"
    >
    </textarea>

    <span v-if="type !== 'textarea'" class="icon is-small">
      <i class="fa" :class="iconClass"></i>
    </span>

    <span v-for="error in errors" class="help is-danger">
      {{error}}
    </span>
  </div>
</template>

<script src="./form-control.js"></script>
