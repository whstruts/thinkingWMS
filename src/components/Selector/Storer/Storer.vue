<template>
  <a-select
    showSearch
    labelInValue
    :value="value"   
    placeholder="请选择"
    style="width: 100%"
    :filterOption="filterOption"
    @search="fetchOption"
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
  name: 'Storer', 
  data() {
    this.lastFetchId = 0;
    this.fetchOption = debounce(this.fetchOption, 800);
    return {
      data: [],
      value:'',      
      fetching: false,
      storerId: "0",
      storer:{}
    }
  },

  props:{
  },

  methods: {
    fetchOption (value) {
      console.log('fetching Storer', value);
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.data = []
      this.fetching = true
      fetch(api.FindAllStorer)
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
        fetching: false
      })
      this.storerId = this.value.key
      this.storer={id: this.value.key}
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>