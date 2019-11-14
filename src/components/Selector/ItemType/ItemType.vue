<template>
  <a-select
    showSearch
    labelInValue
    :value="value"   
    placeholder="请选择"
    style="width: 100%"
    :filterOption="filterOption"
    @search="fetchItemType"
    @change="handleChange"
    :notFoundContent="fetching ? undefined : null"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
    <a-select-option v-for="d in data" :key="d.value">{{d.text}}</a-select-option>
  </a-select>
</template>
<script>
import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import debounce from 'lodash/debounce';
import api from '@/api';

export default {
  name: 'ItemType', 
  data() {
    this.lastFetchId = 0;
    this.fetchItemType = debounce(this.fetchItemType, 800);
    return {
      data: [],
      value:'',      
      fetching: false,
      itemTypeId: "0",
      itemType:{}
    }
  },

  props:{
  },

  methods: {
    fetchItemType (value) {
      console.log('fetching itemType', value);
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.data = []
      this.fetching = true
      fetch(api.FindAllItemType)
        .then(response => response.json())
        .then((body) => {
          if (fetchId !== this.lastFetchId) { // for fetch callback order
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
        fetching: false,
      })
      this.itemTypeId=this.value.key
      this.itemType={id:this.value.key}
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>