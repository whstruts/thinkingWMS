<template>
  <div>
    <a-modal
      title="商品资料检索"
      v-model="visible"
      width="22cm"
      ref="selectcol"
      :destroyOnClose="true"
      :maskClosable="false"
    >
      <a-input-search
        type="text"
        placeholder="请输入助记码或商品编号"
        style="width: 300px"
        v-model="search"
        @search="onSearch"
        autocomplete="off"
        enterButton/><br/><br/>
      <a-table
        ref="table"
        rowKey="id"
        :columns="columns"
        :dataSource="data1"
        :customRow="onclickRow"
        :rowSelection="{selectedRowKeys: selectedRowKeys, type: 'radio', onChange: onSelectChange}"
        autocomplete="off"
        >
        <template slot="id" slot-scope="text, record" >
          <template v-if="record.show" style="display: none"></template>
        </template>
      </a-table>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk" >
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { STable } from '@/components'
// import api from '@/api'
  export default {
    components: { STable },
    data () {
      return {
        show: false,
        selectedRowKeys: [],
        search: '',
        visible: false,
        loading: false,
        maskClosable: false,
        selectcol: [],
        data1: [],
        columns: [
          {
            title: '商品编号',
            dataIndex: 'no',
            width: '12%',
            scopedSlots: { customRender: 'no' },
            show: true
          },
          {
            title: '商品名称',
            width: '20%',
            dataIndex: 'name',
            show: true
          },
          {
            title: '助记码',
            width: '15%',
            dataIndex: 'mnemonicCode',
            scopedSlots: { customRender: 'mnemonicCode' },
            show: true
          },
          {
            title: '生产厂家',
            width: '20%',
            dataIndex: 'manufacturer',
            show: true
          },
          {
            // title: '商品ID',
            dataIndex: 'id',
            colSpan: '0',
            width: '0.00000000000000000000000000000000000001%',
            scopedSlots: { customRender: 'id' },
            show: false
          },
          {
            title: '商品类型',
            dataIndex: 'itemType.name',
            show: true
          }
        ],
        searchStorer: '',
        searchItemType: ''
      }
    },
    methods: {
      open (value, storer, itemType) {
        this.visible = true
        this.axios.get('http://120.27.225.232:8770/resource-dispatcher/item/findAll?storer=' + storer + '&itemType=' + itemType).then(data => {
          this.data1 = data.data
        })
         // this.onSearch(value)
        this.search = value
        this.searchStorer = storer
        this.searchItemType = itemType
      },
      handleCancel () {
        this.visible = false
      },
      handleOk () {
        if (this.selectcol.length !== 0) {
          this.$emit('changexs', this.selectcol)
          this.visible = false
        }
        return this.selectcol
      },
      getVal () {
        return this.selectcol
      },
      onSearch (value, searchStorer, searchItemType) {
        console.log(value)
        searchStorer = this.searchStorer
        searchItemType = this.searchItemType
        this.search = value
        this.search = value.toLowerCase()
        // eslint-disable-next-line eqeqeq
        if (this.search !== '') {
         var list = []
          this.data1.filter((item) => {
            if (String(item['mnemonicCode']).toLowerCase().indexOf(this.search) > -1 || String(item['no']).toLowerCase().indexOf(this.search) > -1) {
              list.push(item)
            }
            this.data1 = list
            return this.data1
          })
        } else {
             return this.open(value, searchStorer, searchItemType)
         }
      },
      onclickRow (record, index) {
        return {
          on: {
            click: () => {
              this.selectcol = record
              var keys = []
              keys.push(record.id)
              this.selectedRowKeys = keys
            },
         dblclick: () => {
           this.selectcol = record
           this.handleOk()
         }
          }
        }
      },
      onSelectChange (selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        this.selectedRowKeys = selectedRowKeys
      }
    }
  }
</script>
<style>
  clickRowStyl {
    background-color: red;
  }
  .ant-table-tbody>.clickRowStyl:hover>td
  background-color #00b4ed
</style>
