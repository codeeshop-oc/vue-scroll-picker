<script>
import Vue from 'vue';
// import VueScrollPicker from '@/vue-scroll-picker.vue';
import ScrollPicker from "@/picker/picker"
import ScrollPickerGroup from "@/picker-group/picker-group"
import "@/picker/picker.scss"

export default Vue.extend({
  name: 'ServeDev',
  components: {
    ScrollPicker
  },
  methods: {
    change(value) {},
  },
  computed: {
    years() {
      const currYear = new Date().getFullYear()
      const lastYear = 1980
      return Array.from({ length: currYear - lastYear + 1 }, (_, index) => lastYear + index).reverse()
    },
    months() {
      return Array.from({ length: 12 }, (_, index) => index + 1)
    },
    days() {
      const lastDay = new Date(this.currentYear, this.currentMonth, 0).getDate()
      return Array.from({ length: lastDay }, (_, index) => index + 1)
    },
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: 1,
      currentDay: 1,
      data1: null,
      data2: 20,
    }
  }
});
</script>

<template>
  <div id="app">
    <p>Date = <strong>{{ currentYear }}-{{ currentMonth }}-{{ currentDay }}</strong></p>
    <div class="picker-group">
      <scroll-picker :options="years" v-model="currentYear" />
      <scroll-picker :options="months" v-model="currentMonth" />
      <scroll-picker :options="days" v-model="currentDay" />
    </div>
  </div>
</template>

<style scoped>
.picker-group {
  display: flex;
}
</style>