<script lang="ts" setup>
import {ref, defineComponent, onMounted} from 'vue'
import axios from "axios";
import moment from 'moment/moment'
import {extendData} from "~src/shared/extendData";
import {getConfig} from '~src/shared/pluginHelpers'

defineComponent({
  name: 'ExchangeRates'
})

// Reactive --->
const dateInput = ref<string>('')
const tableData = ref([])
const selectedRates = ['USD', 'AUD', 'GBP']
const shortcuts = [
  {
    text: 'Dzisiaj',
    value: new Date(),
  },
  {
    text: 'Wczoraj',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: 'Tydzień temu',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]

// Methods --->
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

function getDifference(array1: any, array2: any) {
  return array1.filter((object1: any) => {
    return !array2.some((object2: any) => {
      return object1.code === object2;
    });
  });
}

// Request --->
const getExchangeRates = async () => {
  const beforeSevenDays = moment().subtract(7, 'days').format('YYYY-MM-DD');
  const today = moment().startOf('day');
  let i = 0;
  for (let m = moment(today); m.diff(beforeSevenDays, 'days') >= 0; m.subtract(1, 'days')) {
    console.log("i: " + i + " " + m.format('YYYY-MM-DD'));
    i += 1;
    try {
      let response = await axios.get(`https://api.nbp.pl/api/exchangerates/tables/A/${m.format('YYYY-MM-DD')}?format=json`)

      tableData.value = getDifference(response.data[0].rates, selectedRates)
      dateInput.value = m.format('YYYY-MM-DD')

      if (response.status === 200) break;
    } catch (err) {
      console.log(err)
    }
  }
}

const updateExchangeRates = async (date: Date) => {
  const fetchDate = moment(date, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
  )
  try {
    let response = await axios.get(`https://api.nbp.pl/api/exchangerates/tables/A/${fetchDate}?format=json`)
    console.log(response)
    return tableData.value = getDifference(response.data[0].rates, selectedRates)
  } catch (err) {
    console.log(err)

    return tableData.value = ([])
  }
}
console.log(getConfig())
onMounted(() => {
  getExchangeRates()
})
</script>

<template>
  <div class="app-home">
    <el-row class="mb-4">
      <el-col :span="12">
        Kursy walut
      </el-col>
      <el-col class="text-right" :span="12">
        <el-date-picker
            v-model="dateInput"
            type="date"
            placeholder="Wybierz datę"
            :disabled-date="disabledDate"
            :shortcuts="shortcuts"
            size="large"
            @change="updateExchangeRates(dateInput)"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column label="Kraj" width="180">
          <template #default="scope">
            {{ extendData.filter(item => item.code === scope.row.code).map(({ country }) => country).join() }}
          </template>
        </el-table-column>
        <el-table-column
            v-if="tableData.filter((o) => o.hasOwnProperty('currency')).length > 0"
            label="Waluta"
            width="180">
          <template #default="scope">
            {{ scope.row.currency }}
          </template>
        </el-table-column>
        <el-table-column label="Kod waluty">
          <template #default="scope">
            {{
              (extendData.filter(item => item.code === scope.row.code).map(({ units }) => units).join() || '1') + ' ' +
              scope.row.code
            }}
          </template>
        </el-table-column>
        <el-table-column label="Kurs średni NBP">
          <template #default="scope">
            {{
              (extendData.filter(item => item.code === scope.row.code).map(({ units }) => units).join()
                  * scope.row.mid).toFixed(4)
            }}
          </template>
        </el-table-column>
        <template #empty>Brak danych archiwalnych.</template>
      </el-table>
    </el-row>
  </div>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
