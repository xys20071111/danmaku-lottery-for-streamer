<script setup lang="ts">
import { ref, Ref } from 'vue'
import { Input as AInput, Card as ACard, Button as AButton, Table as ATable } from 'ant-design-vue'
import 'ant-design-vue/es/input/style/css'
import 'ant-design-vue/es/card/style/css'
import 'ant-design-vue/es/table/style/css'
import { IGiftItem } from './IStatus'

const normalGiftColumns = [
  {
    name: '选项',
    dataIndex: 'name',
    key: 'name'
  },
  {
    name: '几率',
    dataIndex: 'chance',
    key: 'chance'
  },
]

const guardGiftColumns = [
  {
    name: '选项',
    dataIndex: 'name',
    key: 'name'
  }
]

const roomIdRef = ref(localStorage.getItem('room') || '')
const targetDanmakuCountRef = ref('0')
const normalGiftNameRef = ref('')
const normalGiftChanceRef = ref('')
const normalGiftPool: Ref<Array<IGiftItem>> = ref([])

const guardGiftPool: Ref<Array<IGiftItem>> = ref([])
const guardGiftNameRef = ref('')

function rollGuardPool() {
  window.ipc.send('roll-guard')
}

function rollNormalPool() {
  window.ipc.send('roll-normal')
}

function connectDanmaku() {
  localStorage.setItem('room', roomIdRef.value)
  window.ipc.send('connect-danmaku', parseInt(roomIdRef.value))
}

function disconnectDanmaku() {
  window.ipc.send('disconnect-danmaku')
}

function updateNormalPool() {
  let totalChance = 0
  for (const item of normalGiftPool.value) {
    totalChance += item.chance
  }
  if (totalChance !== 100 && totalChance !== 0) {
    alert('几率总和不为100%')
    return
  }
  window.ipc.send('update-normal-pool', parseInt(targetDanmakuCountRef.value), JSON.stringify(normalGiftPool.value))
}

function addNormalGift() {
  let totalChance = 0
  for (const item of normalGiftPool.value) {
    totalChance += item.chance
  }
  let chance = parseFloat(normalGiftChanceRef.value)
  if(normalGiftNameRef.value === '') {
    alert('奖项要有个名字')
    return
  }
  if (chance > 100 - totalChance || chance <= 0 || isNaN(chance)) {
    alert('几率超过100%')
    return
  }
  normalGiftPool.value.push({
    name: normalGiftNameRef.value,
    chance
  })
  normalGiftNameRef.value = ''
  normalGiftChanceRef.value = ''
}
function cleanNormalPool() {
  normalGiftPool.value.length = 0
}

function cleanGuardPool() {
  guardGiftPool.value.length = 0
}
function addGuardGift() {
  guardGiftPool.value.push({
    name: guardGiftNameRef.value,
    chance: 0
  })
  guardGiftNameRef.value = ''
}

function updateGuardPool() {
  window.ipc.send('update-guard-pool', JSON.stringify(guardGiftPool.value))
}
</script>

<template>
  <a-card title="房间设置">
    <a-input v-model:value="roomIdRef" prefix="房间号" type="number" /><br />
    <a-button @click="connectDanmaku">连接弹幕</a-button>
    <a-button @click="disconnectDanmaku">断开弹幕</a-button>
    <a-button @click="rollNormalPool">手动触发一次普通池</a-button>
    <a-button @click="rollGuardPool">手动触发一次舰长池</a-button>
  </a-card>
  <a-card title="普通奖池设置">
    <a-input v-model:value="targetDanmakuCountRef" prefix="目标弹幕数量" type="number"></a-input>
    <a-card>
      <a-button @click="updateNormalPool">更新奖池</a-button>
      <a-button @click="cleanNormalPool">清空奖池</a-button>
      <a-input v-model:value="normalGiftNameRef" prefix="名称" />
      <a-input v-model:value="normalGiftChanceRef" prefix="几率" suffix="%" type="number" /><br />
      <a-button @click="addNormalGift">添加</a-button>
      <a-table :columns="normalGiftColumns" :data-source="normalGiftPool">
      </a-table>
    </a-card>
  </a-card>
  <a-card title="上舰奖池设置">
    <a-button @click="updateGuardPool">更新奖池</a-button>
    <a-button @click="cleanGuardPool">清空奖池</a-button>
    <a-input v-model:value="guardGiftNameRef" prefix="名称" />
    <a-button @click="addGuardGift">添加</a-button>
    <a-table :columns="guardGiftColumns" :data-source="guardGiftPool"></a-table>
  </a-card>
</template>

<style scoped>

</style>
