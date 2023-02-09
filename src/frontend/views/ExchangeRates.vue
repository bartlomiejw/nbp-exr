<script lang="ts" setup>
import {ref, defineComponent, onMounted} from 'vue'
import axios from "axios";
import moment from 'moment/moment'
import {extendData} from "@/shared/extendData";
import {getConfig} from '@/shared/pluginHelpers'

defineComponent({
  name: 'ExchangeRates'
})

// <--- REACTIVE ---> //
const dateInput = ref<string>('')
const tableData = ref([])
const selectedRates = getConfig().settings.main_widget_rates
const tableRatesTitle = getConfig().settings.input
const colorTableBorder = getConfig().settings.color_table_border
const colorTableHeader = getConfig().settings.color_table_header
const colorTableStriped = getConfig().settings.color_table_striped
const colorTableText = getConfig().settings.color_table_text

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

// <--- METHODS ---> //
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

// <--- REQUEST ---> //
const getExchangeRates = async () => {
  const beforeSevenDays = moment().subtract(7, 'days').format('YYYY-MM-DD');
  const today = moment().startOf('day');
  for (let m = moment(today); m.diff(beforeSevenDays, 'days') >= 0; m.subtract(1, 'days')) {
    try {
      let response = await axios.get(`https://api.nbp.pl/api/exchangerates/tables/A/${m.format('YYYY-MM-DD')}?format=json`)
      const ratesDifference = getDifference(response.data[0].rates, selectedRates).map((rate: any) => rate.code)
      tableData.value = getDifference(response.data[0].rates, ratesDifference)
      dateInput.value = m.format('YYYY-MM-DD')

      if (response.status === 200) break;
    } catch (err) {
      // console.log(err)
    }
  }
}

const updateExchangeRates = async (date: string) => {
  const fetchDate = moment(date, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
  )
  try {
    let response = await axios.get(`https://api.nbp.pl/api/exchangerates/tables/A/${fetchDate}?format=json`)
    const ratesDifference = getDifference(response.data[0].rates, selectedRates).map((rate: any) => rate.code)
    tableData.value = getDifference(response.data[0].rates, ratesDifference)
  } catch (err) {
    // console.log(err)

    return tableData.value = ([])
  }
}

// <--- LIFECYCLE ---> //
onMounted(() => {
  getExchangeRates()
})
</script>

<template>
  <div class="app-home">
    <el-row class="header" align="middle">
      <el-col :span="12">
        <h3>{{ tableRatesTitle }}</h3>
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
      <el-table :data="tableData" stripe table-layout="fixed" :fit="true" style="width: 100%" row-class-name="no-hover">
        <el-table-column label="Kraj">
          <template #default="scope">
            {{ extendData.filter(item => item.code === scope.row.code).map(({ country }) => country).join() }}
          </template>
        </el-table-column>
        <el-table-column
            align="center">
          <template #default="scope">
            {{ scope.row.currency }}
          </template>
        </el-table-column>
        <el-table-column label="Kod waluty" align="center" header-align="center">
          <template #default="scope">
            {{
              (extendData.filter(item => item.code === scope.row.code).map(({ units }) => units).join() || '1') + ' ' +
              scope.row.code
            }}
          </template>
        </el-table-column>
        <el-table-column label="Kurs średni NBP" align="center" header-align="center">
          <template #default="scope">
            {{
              (Number(extendData.filter(item => item.code === scope.row.code).map(({ units }) => units).join())
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
.header {
  background-color: #F8F8F8;
  border-top: 3px solid v-bind(colorTableBorder);
  padding: 30px 15px;
}

h3 {
  font-size: 24px;
  line-height: 1.3;
  color: v-bind(colorTableHeader);
  font-weight: 700;
}

:deep(.el-input--large) {
  height: 48px;
  font-size: 15px;
}

:deep(.el-table) th.el-table__cell {
  padding: 16px 12px;
  color: #6c6c6c;
  font-weight: 300;
  font-size: 12px;
  letter-spacing: 0;
  text-transform: uppercase;
  vertical-align: bottom;
}

:deep(.el-table) tr td.el-table__cell {
  padding: 16px 12px;
  color: v-bind(colorTableText);
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;
  text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizelegibility;
}

:deep(.el-table) tr td:first-of-type {
  border-right: 1px solid v-bind(colorTableBorder) !important;
}

:deep(.el-table) tr td.el-table__cell:first-of-type {
  color: #444;
  font-weight: 400;
}

:deep(.el-table--striped) .el-table__body tr.el-table__row--striped td.el-table__cell {
  background: v-bind(colorTableStriped)
}
</style>
