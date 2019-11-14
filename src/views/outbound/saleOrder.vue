<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="36">
          <a-col :span="5">
            <!--            <a-form-item label="单据编号" @click="onFilter(9,record)">-->
            <a-form-item label="单据编号" @click="onFilter('',record)">
              <a-input ref="djno" v-model="queryParam.no" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="客户名称">
              <a-input v-model="queryParam.custom" placeholder="" >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="订单类型">
              <!--              <a-input v-model="queryParam.OrderType" placeholder="" ></a-input>-->
              <order-type :operationType="operationType" > </order-type >
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="订单状态">
              <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                <a-select-option value="0">初始化</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
                <a-select-option value="3">完成</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="商品类型">
              <item-type > </item-type >
            </a-form-item>
          </a-col>
          <!--          <template v-if="advanced">-->
          <!--          <a-col :md="8" :sm="24">-->
          <!--            <a-form-item label="调用次数">-->
          <!--              <a-input-number v-model="queryParam.callNo" style="width: 100%"/>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <a-col :span="6">
          <a-form-item label="开始日期">
            <a-date-picker placeholder="选择开始日期" :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')" :showToday="false"/>
          </a-form-item>
        </a-col>
          <a-col :span="6">
            <a-form-item label="结束日期">
              <a-date-picker placeholder="选择结束日期" :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')" :showToday="false"/>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="操作员">
              <a-input v-model="queryParam.employee" placeholder="" >
              </a-input>
            </a-form-item>
          </a-col>
<!--          <a-col :span="5">-->
<!--            <a-form-item label="商品编号">-->
<!--              <a-input v-model="queryParam.goodsNo" placeholder="" >-->
<!--              </a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--          <a-col :span="5">-->
<!--            <a-form-item label="商品名称">-->
<!--              <a-input v-model="queryParam.goodsName" placeholder="" >-->
<!--              </a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
          <!--          <a-col :md="8" :sm="24">-->
          <!--            <a-form-item label="使用状态">-->
          <!--              <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">-->
          <!--                <a-select-option value="0">全部</a-select-option>-->
          <!--                <a-select-option value="1">关闭</a-select-option>-->
          <!--                <a-select-option value="2">运行中</a-select-option>-->
          <!--              </a-select>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <!--          <a-col :md="8" :sm="24">-->
          <!--            <a-form-item label="使用状态">-->
          <!--              <a-select placeholder="请选择" default-value="0">-->
          <!--                <a-select-option value="0">全部</a-select-option>-->
          <!--                <a-select-option value="1">关闭</a-select-option>-->
          <!--                <a-select-option value="2">运行中</a-select-option>-->
          <!--              </a-select>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <!--          </template>-->
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <!--                            <a @click="toggleAdvanced" style="margin-left: 8px">-->
              <!--                {{ advanced ? '收起' : '展开' }}-->
              <!--                <a-icon :type="advanced ? 'up' : 'down'"/>-->
              <!--              </a>-->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="AddSaleOrder()">新建</a-button>
      <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>
      <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <!--      -->
    <s-table
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="description" slot-scope="text">
        <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">配置</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">订阅报警</a>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
    <step-by-step-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import { STable, Ellipsis } from '@/components'
  import StepByStepModal from '../list/modules/StepByStepModal'
  import CreateForm from '../list/modules/CreateForm'
  import { getRoleList } from '@/api/manage'
  // import { getServiceList } from '@/api/manage'
  import OrderType from '@/components/Selector/OrderType'
  import ItemType from '@/components/Selector/ItemType'
  import { postSaleOrder } from '../../api/outbound'
  const statusMap = {
    0: {
      status: 'default',
      text: '关闭'
    },
    1: {
      status: 'processing',
      text: '运行中'
    },
    2: {
      status: 'success',
      text: '已上线'
    },
    3: {
      status: 'error',
      text: '异常'
    }
  }
  const order = {
    0: {
      status: 'default',
      text: '初始化'
    },
    3: {
      status: 'success',
      text: '完成'
    }
  }
  export default {
    name: 'SaleOrder',
    components: {
      STable,
      Ellipsis,
      CreateForm,
      StepByStepModal,
      OrderType,
      ItemType
    },
    data: function () {
      return {
        mdl: {},
        // 高级搜索 展开/关闭
        advanced: true,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '#',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '单据编号',
            dataIndex: 'no'
            // filteredValue: filteredInfo.name || null,
            // onFilter: (value, record) => record.no.includes(value)
          },
          {
            title: '订单类型',
            dataIndex: 'orderType.name',
            scopedSlots: { customRender: 'orderType' }
          },
          {
            title: '服务调用次数',
            dataIndex: 'callNo',
            sorter: true,
            needTotal: true,
            customRender: (text) => 2 + ' 次'
          },
          {
            title: '状态',
            sorter: true,
            dataIndex: 'orderStatus',
            customRender: (text) => order[text].text
          },
          {
            title: '更新时间',
            dataIndex: 'invoiceTime',
            sorter: true,
            Render: val => { moment(val).format('YYYY-MM-DD HH:mm:ss') }
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
          }
        ],
        body: {},
        // columns: [
        //   {
        //     title: '#',
        //     scopedSlots: { customRender: 'serial' }
        //   },
        //   {
        //     title: '单据编号',
        //     dataIndex: 'parameter.no'
        //   },
        //   {
        //     title: '开票时间',
        //     dataIndex: 'invoiceTime',
        //     sorter: true
        //   },
        //   {
        //     title: '订单类型',
        //     dataIndex: 'orderType.name',
        //     scopedSlots: { customRender: 'orderType' },
        //     sorter: true
        //   },
        //   {
        //     title: '订单状态',
        //     dataIndex: 'orderStatus',
        //     sorter: true
        //   },
        //   {
        //     title: '业务员',
        //     dataIndex: 'businessman',
        //     sorter: true
        //   },
        //   {
        //     title: '客户编号',
        //     dataIndex: 'customer.no',
        //     sorter: true
        //   },
        //   {
        //     title: '客户名称',
        //     dataIndex: 'customer.name',
        //     sorter: true
        //   },
        //   {
        //     title: '操作',
        //     dataIndex: 'action',
        //     width: '150px',
        //     scopedSlots: { customRender: 'action' }
        //   }
        // ],
        // 加载数据方法 必须为 Promise 对象
        loadData: (parameter, body) => {
          console.log('loadData.parameter', parameter)
          body = {
            no: this.$refs.djno.value
          }
          return postSaleOrder(Object.assign(parameter, this.queryParam), body)
            .then(res => {
              return res.data
            })
        },

        selectedRowKeys: [],
        selectedRows: [],

        // custom table alert & rowSelection
        options: {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        },
        optionAlertShow: false,
        operationType: 'OUTBOUND',
        menuKey: 1
      }
    },
    filters: {
      statusFilter (type) {
        return statusMap[type].text
      },
      statusTypeFilter (type) {
        return statusMap[type].status
      }
    },
    onFilter: (value, record) => {
      console.log(value, 'value') // 浙江省 value
      console.log(record, 'record')// {key: "2", name: "李四", age: 42, address: "湖南省湘潭市"} 遍历数据
      return record.no.includes(value)// 所有的数据中 包含value(浙江省)的筛选出来
    },
    created () {
      this.tableOption()
      getRoleList({ t: new Date() })
    },
    methods: {
      tableOption () {
        if (!this.optionAlertShow) {
          this.options = {
            alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
            rowSelection: {
              selectedRowKeys: this.selectedRowKeys,
              onChange: this.onSelectChange,
              getCheckboxProps: record => ({
                props: {
                  // disabled: record.no === 'No 2', // Column configuration not to be checked
                  name: record.no
                }
              })
            }
          }
          this.optionAlertShow = true
        } else {
          this.options = {
            alert: false,
            rowSelection: null
          }
          this.optionAlertShow = false
        }
      },

      handleEdit (record) {
        console.log(record)
        this.$refs.modal.edit(record)
      },
      handleSub (record) {
        if (record.status !== 0) {
          this.$message.info(`${record.no} 订阅成功`)
        } else {
          this.$message.error(`${record.no} 订阅失败，规则已关闭`)
        }
      },
      handleOk () {
        this.$refs.table.refresh()
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      },
      watch: {
        handleGoBack () {
          ++this.menuKey
        }
      },
      moment,
      getCurrentData () {
        return new Date().toLocaleDateString()
      },
      AddSaleOrder () {
        this.$router.push({
          path: '/outbound/addSaleOrder'
        })
      }
      // handleGoBack (parameter) {
      //   const newLoadData = [...this.loadData]
      //   const target = getData(Object.assign(parameter, { no: 'CGD00000000009' }))
      //   if (target) {
      //     this.loadData = newLoadData
      //     // this.cacheData = newLoadData.map(item => ({ ...item }))
      //   }
      // }
      // handleGoBack (parameter) {
      //   return getData(Object.assign(parameter, { no: 'CGD00000000009' }))
      //     .then(res => {
      //       return res.data
      //     })
      // }
      // handleGoBack () {
      //   this.loadData = (parameter) => {
      //     console.log(parameter)
      //     return getData(Object.assign(parameter, { no: 'CGD00000000009' }))
      //       .then(res => {
      //         return res.data
      //       })
      //   }
      // }
    }
  }

</script>
