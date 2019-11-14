<template>
  <div>
    <a-modal title="商品批号检索" v-model="visible" ref="selectLotRecord" width="21cm">
      <a-input-search
        type="text"
        placeholder="请输入批号进行检索"
        style="width: 200px"
        v-model="search"
        @search="onSearch"
        autocomplete="off"
        enterButton/><br/><br/>
      <a-table
        ref="table"
        rowKey="id"
        :columns="columns"
        :dataSource="dataLot"
        :customRow="onclickRow"
        :rowSelection="{selectedRowKeys: selectedRowKeys, type: 'radio', width: '2px', onChange: onSelectChange}"
        autocomplete="off"
        >
      </a-table>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" @click="handleOk" >
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
 // import pick from 'lodash.pick'
 import moment from 'moment'
 export default {
    data () {
      return {
        visible: false,
        search: '',
        dataLot: [],
        dataAll: [],
        columns: [
          {
            title: '供应商批号',
            width: '16%',
            dataIndex: 'lot.no',
            scopedSlots: { customRender: 'lot.no' }
          },
          {
            title: '企业批号',
            width: '15%',
            dataIndex: 'batch.no'
          },
          { title: '生产日期',
            width: '17%',
          dataIndex: 'lot.productionDate',
            customRender: (text, row, index) => {
            return moment(text).format('YYYY-MM-DD')
          }
          },
          {
            title: '有效期至',
            width: '17%',
            dataIndex: 'lot.validUntil',
            customRender: (text, row, index) => {
              return moment(text).format('YYYY-MM-DD')
            }
          },

          {
            title: '打印生产日期',
            width: '19%',
            dataIndex: 'lot.printProductionDate'
          },
          {
            title: '打印有效期',
            width: '17%',
            dataIndex: 'lot.printValidUntil'
          }
          ],
        selectedRowKeys: [],
        selectLotRecord: []
      }
    },
    methods: {
      open (record) {
        this.visible = true
        this.axios.get('http://120.27.225.232:8770/resource-dispatcher/sku/findAll?item.id=' + record).then(data => {
          this.dataLot = data.data
          this.dataAll = data.data
        })
      },
      handleOk (e) {
        if (this.selectLotRecord.length !== 0) {
          this.$emit('changexs', this.selectLotRecord)
          this.visible = false
        }
        return this.selectLotRecord
      },
      handleCancel (){
        this.visible = false
      },
      onSearch (value) {
        this.search = value.toLowerCase()

        var list = []
        if (this.search){
          for (var i = 0; i < this.dataLot.length; i++){
            if (String(this.dataLot[i].lot.no).toLowerCase().indexOf(this.search) > -1) {
              list.push(this.dataLot[i])
            }
          }
          this.dataLot = list
          return this.dataLot
        } else {
          this.dataLot = this.dataAll
         return this.dataLot
        }
      },
      onSelectChange (selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        this.selectedRowKeys = selectedRowKeys
      },
      onclickRow (record, index) {
        return {
          on: {
            click: () => {
              this.selectLotRecord = record
              var keys = []
              keys.push(record.id)
              this.selectedRowKeys = keys
            },
            dblclick: () => {
              this.selectLotRecord = record
              this.handleOk()
            }
          }
        }
      }

    }
  }
</script>
<style>
    /* .ant-table-tbody > tr > td{*/
    /*   padding: 0px 1px 0px  0px;*/
    /*}*/

</style>
