
import { defineStore } from 'pinia'

export const useUiStateStore = defineStore('ui', {
state: () => ({ loading: 0 }),
  actions: {
    setLoading(v) {
      this.loading = v;
    },
  },
})
