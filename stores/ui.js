
import { defineStore } from 'pinia'

export const useUiStateStore = defineStore('ui', {
state: () => ({ loading: 0 }),
  actions: {
    setLoading(v) {
      if(v){
        this.loading += 1;
      }
      else if (this.loading > 0){
        this.loading -= 1;
      }
      
    },
  },
})
