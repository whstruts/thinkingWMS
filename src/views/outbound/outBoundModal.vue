<template>
  <div>
    <a-modal title="商品资料检索" v-model="visible" width="20cm" ref="selectcol" autocomplete="off">
      <a-input-search
        type="text"
        placeholder="请输入编号或者是名称"
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
        :dataSource="data1"
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
  import { STable } from '@/components'
  // import api from '@/api'
  export default {
    components: { STable },
    data () {
      return {
        search: '',
        searchData: '',
        visible: false,
        loading: false,
        selectcol: [],
        data1: [],
        columns: [
          {
            title: '用户ID',
            dataIndex: 'id',
            scopedSlots: { customRender: 'id' }
          },
          {
            title: '用户名',
            dataIndex: 'username',
            scopedSlots: { customRender: 'username' }
          },
          {
            title: '密码',
            dataIndex: 'password'
          },
          {
            title: '是否活动',
            dataIndex: 'isActive'
          }
        ]
      }
    },
    methods: {
      open () {
        this.visible = true
        this.axios.get('http://10.2.6.196:8080/hello/getAllStaff').then(data => {
          this.data1 = data
        })
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
      onSearch: function () {
        var search1 = this.search
        var arrByZM = []
        if (search1) {
          for (var i = 0; i < this.data1.length; i++) {
            if (String(this.data1[i].id).toLowerCase().indexOf(search1) > -1) {
              arrByZM.push(this.data1[i])
            }
          }
          this.data1 = arrByZM
          return this.data1
        } else {
          this.open()
        }
      },
      ondblclick (record, index) {
        return {
          on: {
            dblclick: () => {
              this.selectcol = record
              this.$emit('changexs', this.selectcol)
              this.visible = false
              console.log(this.selectcol)
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
