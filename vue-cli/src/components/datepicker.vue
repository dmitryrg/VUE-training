<template lang="pug">
  div
    input(
      :ref="idRef"
      type="text"
      :value="date"
    )
    button(
      type="button"
      @click="clickDatepicker"
    ) календарь
</template>

<script>
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
export default {
  name: 'Datepicker',
  model: {
    prop: 'date',
    event: 'change-picker'
  },
  props: {
    date: {
      type: String,
      required: true
    },
    idRef: {
      type: String,
      required: true
    }
  },
  data: () => ({
    fp: null
  }),
  watch: {
    date: 'updateDatepicker'
  },
  mounted() {
    this.initCalendar()
  },
  beforeDestroy() {
    this.destroyCalendar()
  },
  methods: {
    initCalendar() {
      this.fp = flatpickr(this.$refs[this.idRef], {
        dateFormat: 'd.m.Y',
        clickOpens: false,
        onChange: (selectedDates, dateStr) => {
          this.$emit('change-picker', dateStr)
        }
      })
    },
    updateDatepicker() {
      if (this.fp && this.date) {
        this.fp.setDate(this.date)
      }
    },
    destroyCalendar() {
      if (this.fp) {
        this.fp.destroy()
      }
    },
    clickDatepicker() {
      this.fp.open()
    }
  }
}
</script>
