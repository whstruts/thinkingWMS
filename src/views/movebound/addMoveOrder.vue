<template>
  <div>
    <a-card class="card" title="单据头信息" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="采购员" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model="addModalVisible"/>
<!--  v-decorator="['a', {rules: [{required: true, min: 2, message: '请输入采购员姓名！'}]}]"           -->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="货主" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <storer ref="storer"> </storer>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="订单类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <order-type ref="orderType" :operationType="operationType"> </order-type>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="往来单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <customer ref="customer"> </customer>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="商品类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <item-type ref="itemType"> </item-type>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="8" :sm="24">
                            <select-page :list="iTypeCols"></select-page>
                        </a-col> -->
          <a-col :md="8" :sm="24">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['notes', {rules: [{required: false}]}]" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card class="card" title="单据明细" :bordered="false">
      <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="memberLoading" :scroll="{ x: '130%',y:'50%' }">
        <template v-for="(col, i) in cols" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            v-if="record.editable&columns[i].show"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i].title"
            @change="e => handleChange(e.target.value, record.key, col)"
            @dblclick="e=>handleSearch(e.target.value, record.key, col)"/>
          <template v-else>{{ text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancel(record.key)">取消</a>
            </span>
          </template>
          <span v-else>
            <a @click="toggle(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>

      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">新增明细</a-button>
    </a-card>
    <!-- fixed footer toolbar -->
    <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
      <span class="popover-wrapper">
        <a-popover title="表单校验信息" overlayClassName="antd-pro-pages-forms-style-errorPopover" trigger="click" :getPopupContainer="trigger => trigger.parentNode">
          <template slot="content">
            <li v-for="item in errors" :key="item.key" @click="scrollToField(item.key)" class="antd-pro-pages-forms-style-errorListItem">
              <a-icon type="cross-circle-o" class="antd-pro-pages-forms-style-errorIcon" />
              <div class="">{{ item.message }}</div>
              <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
            </li>
          </template>
          <span class="antd-pro-pages-forms-style-errorIcon" v-if="errors.length > 0">
            <a-icon type="exclamation-circle" />{{ errors.length }}
          </span>
        </a-popover>
        <out-bound-modal
          ref="item"
          :modalVisible="addModalVisible"
          @changexs="changexs"></out-bound-modal>
      </span>
      <a-button type="primary" @click="mysubmit" :loading="loading">提交</a-button>
      <a-divider type="vertical" />
      <a-button type="primary" @click="validate" :loading="loading">保存</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
  import OrderType from '@/components/Selector/OrderType'
  import ItemType from '@/components/Selector/ItemType'
  import Storer from '@/components/Selector/Storer'
  import Customer from '@/components/Selector/Customer'
  import FooterToolBar from '@/components/FooterToolbar'
  import { STable } from '@/components'
  import pick from 'lodash.pick'
  import OutBoundModal from './outMoveModal'
  import CreateForm from '@/views/list/modules/CreateForm'
  import {
    mixin,
    mixinDevice
  } from '@/utils/mixin'
  import {
    savePurchaseOrder
  } from '@/api/inbound'
  import {
    axios
  } from '@/utils/request'
  import { postSaleOrder } from '../../api/outbound'
  export default {
    mixins: [mixin, mixinDevice],
    components: {
      OutBoundModal,
      CreateForm,
      OrderType,
      ItemType,
      Storer,
      Customer,
      STable,
      FooterToolBar
    },
    data () {
      return {
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 7
          }
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 13
          }
        },
        zjm: '',
        filterType: '',
        itemInfo: false,
        visible: false,
        confirmLoading: false,
        maskClosable: false,
        memberLoading: false,
        centered: false,
        form: this.$form.createForm(this),
        operationType: 'OUTBOUND',
        order: {},
        executor: {},
        warehouse: {},
        columnItem:[
          {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
            width: '1%',
            scopedSlots: {
              customRender: 'id'
            }
          },
          {
            title: '名称',
            dataIndex: 'username',
            key: 'username',
            width: '1%',
            scopedSlots: {
              customRender: 'username'
            }
            // show: false
          }
        ],
        // table
        columns: [
          {
            title: '行号',
            dataIndex: 'rownum',
            key: 'rownum',
            width: '1%',
            filteredValue: [],
            scopedSlots: {
              customRender: 'rownum'
            },
            show: false
          },
          {
            title: '商品编号',
            dataIndex: 'itemNo',
            key: 'itemNo',
            width: '10%',
            scopedSlots: {
              customRender: 'itemNo'
            },
            show: true
          },
          {
            title: '商品名称',
            dataIndex: 'itemName',
            key: 'itemName',
            width: '10%',
            scopedSlots: {
              customRender: 'itemName'
            },
            show: true
          },
          {
            title: '规格',
            dataIndex: 'specification',
            key: 'specification',
            width: '10%',
            scopedSlots: {
              customRender: 'specification'
            },
            show: true
          },
          {
            title: '件数',
            dataIndex: 'cases',
            key: 'cases',
            width: '5%',
            scopedSlots: {
              customRender: 'cases'
            },
            show: true
          },
          {
            title: '零散数',
            dataIndex: 'eachs',
            key: 'eachs',
            width: '5%',
            scopedSlots: {
              customRender: 'eachs'
            },
            show: true
          },
          {
            title: '数量',
            dataIndex: 'planQuantity',
            key: 'planQuantity',
            width: '5%',
            scopedSlots: {
              customRender: 'planQuantity'
            },
            show: true
          },
          {
            title: '供应商批号',
            dataIndex: 'lotNo',
            key: 'lotNo',
            width: '6%',
            scopedSlots: {
              customRender: 'lotNo'
            },
            show: true
          },
          {
            title: '企业批号',
            dataIndex: 'batchNo',
            key: 'batchNo',
            width: '5%',
            scopedSlots: {
              customRender: 'batchNo'
            },
            show: true
          },
          {
            title: '生产日期',
            dataIndex: 'productionDate',
            key: 'productionDate',
            width: '5%',
            scopedSlots: {
              customRender: 'productionDate'
            },
            show: true
          },
          {
            title: '有效期至',
            dataIndex: 'validUntil',
            key: 'validUntil',
            width: '5%',
            scopedSlots: {
              customRender: 'validUntil'
            },
            show: true
          },
          {
            title: '操作',
            key: 'action',
            width: '10%',
            scopedSlots: {
              customRender: 'operation'
            },
            show: false
          },
          {
            // title: '商品ID',
            colSpan: '0',
            dataIndex: 'itemId',
            key: 'itemId',
            width: '0.1%',
            scopedSlots: {
              customRender: 'itemId'
            },
            show: false
          },
          {
            // title: '规格ID',
            dataIndex: 'packId',
            key: 'packId',
            width: '0.000001%',
            colSpan: '0',
            scopedSlots: {
              customRender: 'packId'
            },
            show: false
          }
        ],
        cols: ['rownum', 'itemNo', 'itemName', 'specification', 'cases', 'eachs', 'planQuantity', 'lotNo', 'batchNo', 'productionDate', 'validUntil', 'itemId', 'packId'],
        data: [],
        iTypeCols: Array,
        errors: [],
        item: [],
        searchColumn:'',
        searchValue:'',
        searchKey: '',
        addModalVisible: '',

        showItem1: parameter => {
          console.log('host', this.HOST)
          return this.$http.get('http://10.2.6.196:8080/hello/getStaff', {
            params: Object.assign(parameter, this.queryParam)
          })
        },
        showItem: (parameter, body) => {
          console.log('loadData.parameter', parameter)
          body = {
            no: 'CGD00000000009'
          }
          return postSaleOrder(Object.assign(parameter, this.queryParam), body)
            .then(res => {
              // this.goods = res.data.content
              // console.log('aa', this.goods)
              return res.data
            })
        },
        computed: {
          showItem1 () {
            return this.data.filter((item) => {
              var reg = new RegExp(this.zjm, 'i')
              return !this.zjm || reg.test(item.id) || reg.test(item.username.join(' '))
            }).filter((item) => {
              return this.filterType === '' || item.id === this.filterType
            })
          }
        }
      }
    },
    methods: {
      changeVisible (value) {
        this.addModalVisible = value
        this.$refs.addModalVisible.value = value
      },
      add () {
        this.visible = true
        axios({
          url: 'http://120.27.225.232:8770/resource-dispatcher/itemType/findAll',
          method: 'get',
          params: ''
        }).then(res => {
          this.iTypeCols = res.data
          console.log('data', res.data)
          console.log('iTypeCols', this.iTypeCols)
        })
      },
      mysubmit () {
        console.log('data', this.data)
      },
      handleSubmit () {
        const {
          form: {
            validateFields
          }
        } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            setTimeout(() => {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', values)
            }, 1500)
          } else {
            this.confirmLoading = false
          }
        })
        console.log('notes', this.form.getFieldValue('notes'))

        this.order = {
          storer: this.$refs.storer.storer,
          buyer: this.form.getFieldValue('buyer'),
          orderType: this.$refs.orderType.orderType,
          itemType: this.$refs.itemType.itemType,
          customer: this.$refs.customer.customer,
          dataSource: 4,
          notes: this.form.getFieldValue('notes')
        }
        this.executor = this.$root.executor
        // {
        //   id: "499524467564535808",
        //   name: "ADMIN"
        // }
        this.warehouse = {
          id: '560456239167959042'
        }
        savePurchaseOrder(this.order, this.executor, this.warehouse)
      },
      handleCancel () {
        this.visible = false
      },
      edit (record) {
        this.visible = true
        const {
          form: {
            setFieldsValue
          }
        } = this
        this.$nextTick(() => {
          setFieldsValue(pick(record, []))
        })
      },
      newMember () {
        const length = this.data.length
        this.data.push({
          key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
          itemId: '',
          itemNo: '',
          itemName: '',
          packId: '',
          specification: '',
          cases: '0',
          eachs: '0',
          planQuantity: '0',
          lotNo: '',
          batchNo: '',
          productionDate: '',
          validUntil: '',
          editable: true,
          isNew: true
        })
      },
      remove (key) {
        const newData = this.data.filter(item => item.key !== key)
        this.data = newData
      },
      saveRow (record) {
        this.memberLoading = true
        const {
          key,
          name,
          workId,
          department
        } = record
        if (!name || !workId || !department) {
          this.memberLoading = false
          this.$message.error('请填写完整成员信息。')
          return
        }
        // 模拟网络请求、卡顿 800ms
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              loop: false
            })
          }, 800)
        }).then(() => {
          const target = this.data.filter(item => item.key === key)[0]
          target.editable = false
          target.isNew = false
          this.memberLoading = false
        })
      },
      toggle (key) {
        const target = this.data.filter(item => item.key === key)[0]
        target.editable = !target.editable
      },
      getRowByKey (key, newData) {
        const data = this.data
        return (newData || data).filter(item => item.key === key)[0]
      },
      cancel (key) {
        const target = this.data.filter(item => item.key === key)[0]
        target.editable = false
      },
      handleChange (value, key, column) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target[column] = value
          this.data = newData
        }
      },
      handleSearch (value, key, column){
        if (key && column){
          this.searchColumn = column
          this.searchKey = key
          if (column === 'itemNo'){
            this.$refs.item.open()
          }
        }
      },
      changexs (selectcol) {
        const newData = [...this.data]
        const target = newData.filter(item => this.searchKey === item.key)[0]
        if (this.searchColumn === 'itemNo'){
          if (target) {
            target[this.searchColumn] = selectcol.username
            target['itemName'] = selectcol.id
            this.data = newData
          }
        }
      },
      getItemType (parameter, url) {
        return axios({
          url: url,
          method: 'get',
          params: parameter
        }).then(res => {
          return res.data
        })
      },
      handleOk (e) {
        this.itemInfo = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .card {
    margin-bottom: 24px;
  }

  .popover-wrapper {
    /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
      min-width: 256px;
      max-height: 290px;
      padding: 0;
      overflow: auto;
    }
  }

  .antd-pro-pages-forms-style-errorIcon {
    user-select: none;
    margin-right: 24px;
    color: #f5222d;
    cursor: pointer;

    i {
      margin-right: 4px;
    }
  }

  .antd-pro-pages-forms-style-errorListItem {
    padding: 8px 16px;
    list-style: none;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all .3s;

    &:hover {
      background: #e6f7ff;
    }

    .antd-pro-pages-forms-style-errorIcon {
      float: left;
      margin-top: 4px;
      margin-right: 12px;
      padding-bottom: 22px;
      color: #f5222d;
    }

    .antd-pro-pages-forms-style-errorField {
      margin-top: 2px;
      color: rgba(0, 0, 0, .45);
      font-size: 12px;
    }
  }
</style>
