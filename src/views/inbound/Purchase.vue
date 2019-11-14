<template>
    <a-row :gutter="0">
        <a-card>
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="8" :sm="24">
                        <a-form-item label="单据编号">
                            <a-input v-model="queryParam.no" placeholder="" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="24">
                        <a-form-item label="单据状态">
                            <a-select placeholder="请选择" default-value="">
                                <a-select-option v-for="item in purchaseStatus" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="24">
                        <a-form-item label="订单类型">
                            <order-type ref="orderType1" :operationType="operationType"> </order-type>
                        </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="24">
                        <a-form-item label="货主">
                            <storer> </storer>
                        </a-form-item>
                    </a-col>
                    <template v-if="advanced">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="往来单位">
                                <customer> </customer>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="商品类型">
                                <item-type> </item-type>
                            </a-form-item>
                        </a-col>
                    </template>
                    <a-col :md="!advanced && 8 || 24" :sm="24">
                        <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                            <a @click="toggleAdvanced" style="margin-left: 8px">
                                {{ advanced ? '收起' : '展开' }}
                                <a-icon :type="advanced ? 'up' : 'down'" />
                            </a>
                        </span>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        </a-card>
        <div class="table-operator">
            <a-button type="primary" icon="plus" @click="editPO()">新建</a-button>
            <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>
            <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
                <a-menu slot="overlay">
                    <a-menu-item key="1">
                        <a-icon type="delete" />删除</a-menu-item>
                    <!-- lock | unlock -->
                    <a-menu-item key="2">
                        <a-icon type="lock" />锁定</a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px">
                    批量操作
                    <a-icon type="down" />
                </a-button>
            </a-dropdown>
        </div>
        <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :alert="options.alert" :rowSelection="options.rowSelection" showPagination="auto">
            <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
            </span>
            <span slot="orderStatus" slot-scope="orderStatus">
                <a-badge :status="orderStatus | statusTypeFilter" :text="orderStatus | statusFilter" />
            </span>
            <span slot="description" slot-scope="text">
                <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
            </span>

            <span slot="action" slot-scope="text, record">
                <template>
                    <a @click="handleEdit(record)">编辑</a>
                    <a-divider type="vertical" />
                    <a @click="handleSub(record)">添加明细</a>
                </template>
            </span>
        </s-table>
        <step-by-step-modal ref="modal" @ok="handleOk" />
    </a-row>
</template>

<script>
import moment from 'moment'
import {
    STable,
    Ellipsis,
} from '@/components'
import StepByStepModal from '../list/modules/StepByStepModal'
import CreatePO from '../list/modules/CreatePO'
import {
    getRoleList
} from '@/api/manage'
import OrderType from '@/components/Selector/OrderType'
import ItemType from '@/components/Selector/ItemType'
import Storer from '@/components/Selector/Storer'
import Customer from '@/components/Selector/Customer'
import {
    getPurchaseOrderPost
} from '@/api/inbound'
//import enums from '../../utils/enums'
import enumDesc from '@/utils/enums'
export default {
    name: 'Purchase',
    components: {
        STable,
        Ellipsis,
        StepByStepModal,
        OrderType,
        ItemType,
        Storer,
        Customer
    },
    data() {
        return {
            mdl: {},
            // 高级搜索 展开/关闭
            advanced: false,
            orderTypeId: String,
            urlOrderType: String,
            // 查询参数
            queryParam: {},
            orderType: {
                id: String
            },
            // 表头
            columns: [{
                    title: '#',
                    scopedSlots: {
                        customRender: 'serial'
                    }
                },
                {
                    title: '单据编号',
                    dataIndex: 'no'
                },
                {
                    title: '订单类型',
                    dataIndex: 'orderType.name',
                    scopedSlots: {
                        customRender: 'orderType'
                    }
                },
                // {
                //   title: '服务调用次数',
                //   dataIndex: 'callNo',
                //   sorter: true,
                //   needTotal: true,
                //   customRender: (text) => text + ' 次'
                // },
                {
                    title: '状态',
                    dataIndex: 'orderStatus',
                    key: 'orderStatus',
                    scopedSlots: {
                        customRender: 'orderStatus'
                    }
                },
                {
                    title: '备注',
                    dataIndex: 'notes'
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    width: '150px',
                    scopedSlots: {
                        customRender: 'action'
                    }
                }
            ],
            // 加载数据方法 必须为 Promise 对象
            loadData: parameter => {
                this.orderTypeId = this.$refs.orderType1.orderTypeId
                console.log('orderTypeId', this.orderTypeId)
                console.log('loadData.parameter', parameter)
                let body = {
                    orderTypeId: this.orderTypeId
                }
                return getPurchaseOrderPost(Object.assign(parameter, this.queryParam), body)
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
            operationType: 'INBOUND',
            purchaseStatus: enumDesc.OrderStatus
        }
    },
    // watch:{
    //   getOrderType(){
    //     //this.orderType = {id: this.orderTypeId},
    //     this.queryParam.orderType = Qs.stringify({ id: this.orderTypeId })
    //   }
    // },
    // filters: {
    //   statusFilter (type) {
    //     return statusMap[type].text
    //   },
    //   statusTypeFilter (type) {
    //     return statusMap[type].status
    //   }
    // },
    filters: {
        statusFilter(orderStatus) {
            return enumDesc.OrderStatus.getLabelByValue(orderStatus)
        },
        statusTypeFilter(orderStatus) {
            return enumDesc.OrderStatus.getLabelByValue(orderStatus)
        }
    },
    created() {
        this.tableOption()
        getRoleList({
            t: new Date()
        })
    },
    methods: {
        tableOption() {
            if (!this.optionAlertShow) {
                this.options = {
                    alert: {
                        show: true,
                        clear: () => {
                            this.selectedRowKeys = []
                        }
                    },
                    rowSelection: {
                        selectedRowKeys: this.selectedRowKeys,
                        onChange: this.onSelectChange,
                        getCheckboxProps: record => ({
                            props: {
                                disabled: record.no === 'No 2', // Column configuration not to be checked
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

        handleEdit(record) {
            console.log(record)
            this.$refs.modal.edit(record)
        },
        handleSub(record) {
            // if (record.status !== 0) {
            //     this.$message.info(`${record.no} 订阅成功`)
            // } else {
            //     this.$message.error(`${record.no} 订阅失败，规则已关闭`)
            // }
            this.$refs.createDetail.edit(record)
        },
        handleOk() {
            this.$refs.table.refresh()
        },
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
        },
        toggleAdvanced() {
            this.advanced = !this.advanced
        },
        resetSearchForm() {
            this.queryParam = {
                date: moment(new Date())
            }
        },
        editPO() {
            this.$router.push({
                path: '/inbound/poedit'
            })
        }
    }
}
</script>
