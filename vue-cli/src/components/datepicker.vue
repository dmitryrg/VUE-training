<template>
  <div>
    <input :ref="idRef" type="text" class="form-control" :value="date" />
  </div>
</template>

<script>
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
export default {
  name: 'Datepicker',
  model: {
    prop: 'date',
    event: 'changePicker'
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
        onChange: (selectedDates, dateStr) => {
          this.$emit('changePicker', dateStr)
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
    }
  }
}
</script>

<style scoped></style>
