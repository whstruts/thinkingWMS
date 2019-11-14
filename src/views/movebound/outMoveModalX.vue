<template>
  <div>
    <a-modal title="资料检索方案" v-model="visible" width="20cm" ref="selectCol" autocomplete="off">
      <a-input-search
        type="text"
        placeholder=""
        style="width: 200px"
        v-model="search"
        @search="onSearch"
        autocomplete="off"
        enterButton/>
      <br/><br/>
      <a-table
        highlight-current-row
        key="key"
        ref="table"
        rowKey="id"
        :columns="columns"
        :dataSource="data"
        :customRow="ondblclick"
        onRow="onClickRow"
        rowClassName="setRowClassName"
        bordered>
      </a-table>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
  import { STable } from '../../components'
  // import api from '@/api'
  export default {
    components: { STable },
    data () {
      return {
        search: '',
        searchData: '',
        visible: false,
        loading: false,
        selectCol: [],
        data: [],
        columns: [
          {
            title: '货主编号',
            dataIndex: '货主编号',
            scopedSlots: { customRender: '货主内码' }
          },
          {
            title: '货主名称',
            dataIndex: '货主名称',
            scopedSlots: { customRender: '货主名称' }
          },
          {
            title: '助记码',
            dataIndex: '助记码',
            scopedSlots: { customRender: '助记码' }
          }
        ]
      }
    },
    methods: {
      open () {
        this.visible = true
        const body = { 'no':'getStorer', 'warehouse':'{"id":560456239167959042}', 'query':false, 'args':'{"warehouse_id":"560456239167959042","id":null,"employee_id":"499524467564535808"}', 'executor':{ 'available':false, 'mnemonicCode':null, 'name':'ADMIN', 'no':'ADMIN', 'company':null, 'department':null, 'fingerPrints':null, 'posts':null, 'roles':null, 'menus':null, 'warehouseAuthorities':null, 'storerAuthorities':null, 'itemTypeAuthorities':null, 'orderTypeAuthorities':null, 'numberOfContainers':0, 'numberOfPackages':0, 'password':null, 'username':null, 'numberOfCase':null, 'numberOfEach':null, 'numberOfOrder':null, 'userpwd':null, 'signatureType':null, 'categories':null, 'methods':null, 'admin':true, 'lastModifiedTime':null, 'id':499524467564535808, 'version':0 } }
        body.executor.id = '499524467564535808'
        this.axios.post('http://120.27.225.232:8770/admin-dispatcher/query', body)
          .then(data => {
            console.log('res=>', data)
            this.data = data.data
          })
      },
      handleCancel () {
        this.visible = false
      },
      handleOk () {
        if (this.selectCol.length !== 0) {
          this.$emit('changeXs', this.selectCol)
          this.visible = false
        }
        return this.selectCol
      },
      getVal () {
        return this.selectCol
      },
      ondblclick (record, index) {
        return {
          on: {
            dblclick: () => {
              this.selectCol = record
              this.$emit('changeXs', this.selectCol)
              this.visible = false
              console.log(this.selectCol)
            }
          }
        }
      },
      onClickRow (record) {
        return {
          on: {
            onClick: () => {
              this.setState({
                rowId: record.id
              })
            }
          }
        }
      },
      setRowClassName (record) {
        return record.id === this.state.rowId ? 'clickRowStyl' : ''
      }
    }
  }
</script>
<style lang="less" scoped>
  // 被选中的表格行的样式
  .clickRowStyl {
    padding: 8px 16px;
    list-style: none;

    &:hover {
      background: #00b4ed;
    }
  }
</style>
