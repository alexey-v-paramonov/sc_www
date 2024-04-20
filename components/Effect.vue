<template>
  <canvas id="effect"></canvas>
</template>
<script setup>
import Effect from "~/components/visualizer/visualizer.js"
import { ref, onMounted,onUnmounted, onUpdated } from "vue";

const mount = () => {
  function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }
  Effect.destroy()

  Effect.frequencies = []
  Effect.speed = []
  Effect.limits = []
  Effect.fftSize = 148
  Effect.segments = []
  Effect.middles = []
  Effect.mains = []
  Effect.direction = []

  let last=0
  for(let i=250;i<20000;i+=250) {
    Effect.frequencies.push(i)
    last++
  }

  for(let i=0;i<last;i++) {
    Effect.speed.push(getRandomInt(7, 14))
  }

  for(let i=0;i<last;i++) {
    Effect.limits.push({bottom:getRandomInt(0, 60), top:getRandomInt(140, 240)})
  }

  Effect.init('effect')
}
onMounted(mount)
//onUpdated(()=>{mount();console.log('update')})
onUnmounted(() => {
  //Effect.destroy()
})

</script>
