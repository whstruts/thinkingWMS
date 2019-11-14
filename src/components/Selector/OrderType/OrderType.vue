<template>
  <a-select
    ref="selectOrderType"
    showSearch
    labelInValue
    :value="value"
    placeholder="请选择"
    style="width: 100%"
    :filterOption="filterOption"
    @search="fetchOrderType"
    @change="handleChange"
    :notFoundContent="fetching ? undefined : null"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
    <a-select-option v-for="d in data" :key="d.value">{{d.text}}</a-select-option>
  </a-select>
</template>
<script>
import jsonp from 'fetch-jsonp'
import querystring from 'querystring'
import debounce from 'lodash/debounce'
import api from '@/api'

export default {
  name: 'OrderType',
  data () {
    this.lastFetchId = 0;
    this.fetchOrderType = debounce(this.fetchOrderType, 800);
    return {
      data: [],
      value: String,      
      fetching: false,
      orderTypeId: "0",
      orderType: {}
    }
  },
  props:{
      operationType: {
          type: String
      }
  },
  methods: {
    fetchOrderType (value) {
      console.log('fetching orderType', value);
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.data = []
      this.fetching = true
      //http://localhost:8770/resource-dispatcher/orderType/findAll
      fetch(api.FindAllOrderType+'?operationType='+ this.operationType)
        .then(response => response.json())
        .then((body) => {
          if (fetchId !== this.lastFetchId) { // for fetch callback order
            return;
          }
          if(!body){
            return;
          }
          const data = body.data.map(t => ({
            //text: `${t.name.first} ${user.name.last}`,
            text: t.name,
            value: t.id
          }));
          this.data = data
          this.fetching = false
        });
    },
    handleChange (value) {
      Object.assign(this, {
        value,
        data: [],
        fetching: false
      })
      this.orderTypeId = this.value.key
      this.orderType = {id: this.value.key}
      console.log('orderTypeId', this.value.key);
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
