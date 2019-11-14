<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="订单类型">
              <a-select v-model="MoveParam.type" placeholder="请选择">
                <a-select-option value="0">不同巷道移库</a-select-option>
                <a-select-option value="1">同巷道移库</a-select-option>
                <a-select-option value="2">拆盘移库</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="货主编号">
              <a-input ref="owner" placeholder="" @dblclick="getData" >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="操作员">
              <a-input v-model="MoveParam.operator" placeholder="" >
              </a-input>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="商品编号">
                <a-input v-model="MoveParam.no" placeholder="" >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="显示货位">
                <a-input v-model="MoveParam.location" placeholder="" >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="容器">
                <a-input v-model="MoveParam.container" placeholder="" >
                </a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button style="margin-right: 8px" @click="resetData">重置</a-button>
              <a-button style="margin-right: 8px" @click="searchData">查询</a-button>
              <a-button type="primary" @click="$refs.table.refresh(true)">确认</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
              <out-bound-modal
                ref="item"
                :modalVisible="addModalVisible"
                @changeXs="changeXs"></out-bound-modal>
            </span>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        :columns="columns"
        :dataSource="data"
        :scroll="{ x: '400%', y: '50%' }"
      >
      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">新增明细</a-button>
    </div>
  </a-card>
</template>

<script>
  import { STable } from '../../components'
  import OutBoundModal from './outMoveModalX'
  export default {
    name: 'MoveOrder',
    components: {
      OutBoundModal,
      STable
    },
    data: function () {
      return {
        // 高级搜索 展开/关闭
        MoveParam:{},
        advanced: true,
        // 表头
        columns: [
          {
            title: '行号',
            dataIndex: 'radium',
            key: 'radium',
            width: '2%',
            filteredValue: [],
            scopedSlots: {
              customRender: 'radium'
            },
            show: false
          },
          {
            title: '巷道',
            dataIndex: 'ROADWAY',
            key: 'ROADWAY',
            width: '4%',
            scopedSlots: {
              customRender: 'ROADWAY'
            },
            show: true
          },
          {
            title: '库房',
            dataIndex: 'KUFANG_NAME',
            key: 'KUFANG_NAME',
            width: '4%',
            scopedSlots: {
              customRender: 'KUFANG_NAME'
            },
            show: true
          },
          {
            title: '区域编号',
            dataIndex: 'QUY_NO',
            key: 'QUY_NO',
            width: '4%',
            scopedSlots: {
              customRender: 'QUY_NO'
            },
            show: true
          },
          {
            title: '商品编号',
            dataIndex: 'ITEM_NO',
            key: 'ITEM_NO',
            width: '4%',
            scopedSlots: {
              customRender: 'ITEM_NO'
            },
            show: true
          },
          {
            title: '商品名称',
            dataIndex: 'ITEM_NAME',
            key: 'ITEM_NAME',
            width: '4%',
            scopedSlots: {
              customRender: 'ITEM_NAME'
            },
            show: true
          },
          {
            title: '包装规格',
            dataIndex: 'SPECIFICATION',
            key: 'SPECIFICATION',
            width: '4%',
            scopedSlots: {
              customRender: 'SPECIFICATION'
            },
            show: true
          },
          {
            title: '版本',
            dataIndex: 'MODEL_NAME',
            key: 'MODEL_NAME',
            width: '4%',
            scopedSlots: {
              customRender: 'MODEL_NAME'
            },
            show: true
          },
          {
            title: '包装单位',
            dataIndex: 'UOM',
            key: 'UOM',
            width: '4%',
            scopedSlots: {
              customRender: 'UOM'
            },
            show: true
          },
          {
            title: '包装数',
            dataIndex: 'FACTOR',
            key: 'FACTOR',
            width: '4%',
            scopedSlots: {
              customRender: 'FACTOR'
            },
            show: true
          },
          {
            title: '企业批号',
            dataIndex: 'BATCH_NO',
            key: 'BATCH_NO',
            width: '4%',
            scopedSlots: {
              customRender: 'BATCH_NO'
            },
            show: true
          },
          {
            title: '库房编号',
            dataIndex: 'KUFANG_NO',
            key: 'KUFANG_NO',
            width: '4%',
            scopedSlots: {
              customRender: 'KUFANG_NO'
            },
            show: true
          },
          {
            title: '显示货位',
            dataIndex: 'LOCATION_NO',
            key: 'LOCATION_NO',
            width: '4%',
            scopedSlots: {
              customRender: 'LOCATION_NO'
            },
            show: true
          },
          {
            title: '容器编号',
            dataIndex: 'CONTAINER_NO',
            key: 'CONTAINER_NO',
            width: '4%',
            scopedSlots: {
              customRender: 'CONTAINER_NO'
            },
            show: true
          },
          {
            title: '件数',
            dataIndex: 'BAOZNUM',
            key: 'BAOZNUM',
            width: '4%',
            scopedSlots: {
              customRender: 'BAOZNUM'
            },
            show: true
          },
          {
            title: '数量',
            dataIndex: 'QUANTITY',
            key: 'QUANTITY',
            width: '4%',
            scopedSlots: {
              customRender: 'QUANTITY'
            },
            show: true
          },
          {
            title: '零散数',
            dataIndex: 'LINGS_NUM',
            key: 'LINGS_NUM',
            width: '4%',
            scopedSlots: {
              customRender: 'LINGS_NUM'
            },
            show: true
          },
          {
            title: '生产日期',
            dataIndex: 'PRODUCTION_DATE',
            key: 'PRODUCTION_DATE',
            width: '4%',
            scopedSlots: {
              customRender: 'PRODUCTION_DATE'
            },
            show: true
          },
          {
            title: '有效期至',
            dataIndex: 'VALID_UNTIL',
            key: 'VALID_UNTIL',
            width: '4%',
            scopedSlots: {
              customRender: 'VALID_UNTIL'
            },
            show: true
          },
          {
            title: '目地货位',
            dataIndex: 'LOCATION_NO_T',
            key: 'LOCATION_NO_T',
            width: '4%',
            scopedSlots: {
              customRender: 'LOCATION_NO_T'
            },
            show: true
          },
          {
            title: '目地库房',
            dataIndex: 'KUFANG_NAME_T',
            key: 'KUFANG_NAME_T',
            width: '4%',
            scopedSlots: {
              customRender: 'KUFANG_NAME_T'
            },
            show: true
          },
          {
            title: '库存状态',
            dataIndex: 'INVENTORY_STATE_NAME',
            key: 'INVENTORY_STATE_NAME',
            width: '4%',
            scopedSlots: {
              customRender: 'INVENTORY_STATE_NAME'
            },
            show: true
          },
          {
            title: '唯一码',
            dataIndex: 'SERIAL_NUMBER',
            key: 'SERIAL_NUMBER',
            width: '4%',
            scopedSlots: {
              customRender: 'SERIAL_NUMBER'
            },
            show: true
          },
          {
            title: '供应商批号',
            dataIndex: 'LOT_NO',
            key: 'LOT_NO',
            width: '4%',
            scopedSlots: {
              customRender: 'LOT_NO'
            },
            show: true
          },
          {
            title: '货主',
            dataIndex: 'YEZ_NAME',
            key: 'YEZ_NAME',
            width: '6%',
            scopedSlots: {
              customRender: 'YEZ_NAME'
            },
            show: true
          }
        ],
        data: []
      }
    },
    methods: {
      changeXs (selectCol) {
        this.$refs.owner.value = selectCol.货主编号
      },
      getData (){
        this.$refs.item.open()
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      searchData (){
        this.data = [
          {
            'LOT_NO': '1111',
            'LOT_ID': 632226229486936064,
            'LOCATION_ID': 389015230277032672,
            'LOCATION_NO': 'WH0111001051',
            'ROADWAY': '06',
            'STORER_ID': 560456239167959045,
            'INVENTORY_STATE': 2,
            'INVENTORY_STATE_NAME': '不合格',
            'QUANTITY': 0.5,
            'QUANTITY1': 0.5,
            'BAOZNUM': 1,
            'LINGS_NUM': 0,
            'ITEM_ID': 557532981205947825,
            'ITEM_NO': 'BSBLMS',
            'ITEM_NAME': '丙酸倍氯米松',
            'MANUFACTURER': '106车间',
            'MNEMONIC_CODE': 'BSBLMS',
            'BATCH_ID': 632232162116034560,
            'BATCH_NO': '111',
            'PACK_ID': 670028215651418880,
            'SPECIFICATION': '0.5KG/箱',
            'UOM': 'KG',
            'FACTOR': 0.5,
            'PRODUCTION_DATE': '2019-10-11',
            'VALID_UNTIL': '2020-10-11',
            'CONTAINER_NO': '4500000002',
            'CONTAINER_ID': 307937182976337016,
            'CONTAINER_NO_T': '4500000002',
            'CONTAINER_ID_T': 307937182976337016,
            'WAREHOUSE_ID': 560456239167959042,
            'WAREHOUSE_NO': 'CPCK',
            'WAREHOUSE_NAME': '成品仓库',
            'SKU_ID': 632232162308972544,
            'KUFANG_NAME': '穿梭车库',
            'KUFANG_NO': 'CPK',
            'KUFANG_ID': 560799890138066956,
            'KUFANG_ID_T': 560799890138066956,
            'YEZ_ID': 560456239167959045,
            'YEZ_NO': 'HZ01',
            'YEZ_NAME': '天津天药药业股份有限公司',
            'QUY_ID': 560825013733814294,
            'QUY_NO': 'CSC',
            'STORAGE_ROOM_TYPE': 4,
            'MODEL_NAME': null,
            'SERIAL_NUMBER': null,
            'SERIAL_NUMBER_ID': null
          },
          {
            'LOT_NO': '1111',
            'LOT_ID': 632226229486936064,
            'LOCATION_ID': 568952524943518679,
            'LOCATION_NO': 'WH0111001052',
            'ROADWAY': '06',
            'STORER_ID': 560456239167959045,
            'INVENTORY_STATE': 2,
            'INVENTORY_STATE_NAME': '不合格',
            'QUANTITY': 0.5,
            'QUANTITY1': 0.5,
            'BAOZNUM': 1,
            'LINGS_NUM': 0,
            'ITEM_ID': 557532981205947825,
            'ITEM_NO': 'BSBLMS',
            'ITEM_NAME': '丙酸倍氯米松',
            'MANUFACTURER': '106车间',
            'MNEMONIC_CODE': 'BSBLMS',
            'BATCH_ID': 632232162116034560,
            'BATCH_NO': '111',
            'PACK_ID': 670028215651418880,
            'SPECIFICATION': '0.5KG/箱',
            'UOM': 'KG',
            'FACTOR': 0.5,
            'PRODUCTION_DATE': '2019-10-11',
            'VALID_UNTIL': '2020-10-11',
            'CONTAINER_NO': '4500000001',
            'CONTAINER_ID': 880310885454751849,
            'CONTAINER_NO_T': '4500000001',
            'CONTAINER_ID_T': 880310885454751849,
            'WAREHOUSE_ID': 560456239167959042,
            'WAREHOUSE_NO': 'CPCK',
            'WAREHOUSE_NAME': '成品仓库',
            'SKU_ID': 632232162308972544,
            'KUFANG_NAME': '穿梭车库',
            'KUFANG_NO': 'CPK',
            'KUFANG_ID': 560799890138066956,
            'KUFANG_ID_T': 560799890138066956,
            'YEZ_ID': 560456239167959045,
            'YEZ_NO': 'HZ01',
            'YEZ_NAME': '天津天药药业股份有限公司',
            'QUY_ID': 560825013733814294,
            'QUY_NO': 'CSC',
            'STORAGE_ROOM_TYPE': 4,
            'MODEL_NAME': null,
            'SERIAL_NUMBER': null,
            'SERIAL_NUMBER_ID': null
          },
          {
            'LOT_NO': '1111',
            'LOT_ID': 632226229486936064,
            'LOCATION_ID': 731250732914752754,
            'LOCATION_NO': 'WH0113001052',
            'ROADWAY': '07',
            'STORER_ID': 560456239167959045,
            'INVENTORY_STATE': 2,
            'INVENTORY_STATE_NAME': '不合格',
            'QUANTITY': 0.5,
            'QUANTITY1': 0.5,
            'BAOZNUM': 1,
            'LINGS_NUM': 0,
            'ITEM_ID': 557532981205947825,
            'ITEM_NO': 'BSBLMS',
            'ITEM_NAME': '丙酸倍氯米松',
            'MANUFACTURER': '106车间',
            'MNEMONIC_CODE': 'BSBLMS',
            'BATCH_ID': 632232162116034560,
            'BATCH_NO': '111',
            'PACK_ID': 670028215651418880,
            'SPECIFICATION': '0.5KG/箱',
            'UOM': 'KG',
            'FACTOR': 0.5,
            'PRODUCTION_DATE': '2019-10-11',
            'VALID_UNTIL': '2020-10-11',
            'CONTAINER_NO': '4500000003',
            'CONTAINER_ID': 877926264256602768,
            'CONTAINER_NO_T': '4500000003',
            'CONTAINER_ID_T': 877926264256602768,
            'WAREHOUSE_ID': 560456239167959042,
            'WAREHOUSE_NO': 'CPCK',
            'WAREHOUSE_NAME': '成品仓库',
            'SKU_ID': 632232162308972544,
            'KUFANG_NAME': '穿梭车库',
            'KUFANG_NO': 'CPK',
            'KUFANG_ID': 560799890138066956,
            'KUFANG_ID_T': 560799890138066956,
            'YEZ_ID': 560456239167959045,
            'YEZ_NO': 'HZ01',
            'YEZ_NAME': '天津天药药业股份有限公司',
            'QUY_ID': 560825013733814294,
            'QUY_NO': 'CSC',
            'STORAGE_ROOM_TYPE': 4,
            'MODEL_NAME': null,
            'SERIAL_NUMBER': null,
            'SERIAL_NUMBER_ID': null
          },
          {
            'LOT_NO': '1111',
            'LOT_ID': 632226229486936064,
            'LOCATION_ID': 137332414239614583,
            'LOCATION_NO': 'WH0113001051',
            'ROADWAY': '07',
            'STORER_ID': 560456239167959045,
            'INVENTORY_STATE': 2,
            'INVENTORY_STATE_NAME': '不合格',
            'QUANTITY': 0.5,
            'QUANTITY1': 0.5,
            'BAOZNUM': 1,
            'LINGS_NUM': 0,
            'ITEM_ID': 557532981205947825,
            'ITEM_NO': 'BSBLMS',
            'ITEM_NAME': '丙酸倍氯米松',
            'MANUFACTURER': '106车间',
            'MNEMONIC_CODE': 'BSBLMS',
            'BATCH_ID': 632232162116034560,
            'BATCH_NO': '111',
            'PACK_ID': 670028215651418880,
            'SPECIFICATION': '0.5KG/箱',
            'UOM': 'KG',
            'FACTOR': 0.5,
            'PRODUCTION_DATE': '2019-10-11',
            'VALID_UNTIL': '2020-10-11',
            'CONTAINER_NO': '4500000005',
            'CONTAINER_ID': 560329229473902503,
            'CONTAINER_NO_T': '4500000005',
            'CONTAINER_ID_T': 560329229473902503,
            'WAREHOUSE_ID': 560456239167959042,
            'WAREHOUSE_NO': 'CPCK',
            'WAREHOUSE_NAME': '成品仓库',
            'SKU_ID': 632232162308972544,
            'KUFANG_NAME': '穿梭车库',
            'KUFANG_NO': 'CPK',
            'KUFANG_ID': 560799890138066956,
            'KUFANG_ID_T': 560799890138066956,
            'YEZ_ID': 560456239167959045,
            'YEZ_NO': 'HZ01',
            'YEZ_NAME': '天津天药药业股份有限公司',
            'QUY_ID': 560825013733814294,
            'QUY_NO': 'CSC',
            'STORAGE_ROOM_TYPE': 4,
            'MODEL_NAME': null,
            'SERIAL_NUMBER': null,
            'SERIAL_NUMBER_ID': null
          },
          {
            'LOT_NO': '1111',
            'LOT_ID': 632226229486936064,
            'LOCATION_ID': 662661182349376410,
            'LOCATION_NO': 'WH0115001051',
            'ROADWAY': '08',
            'STORER_ID': 560456239167959045,
            'INVENTORY_STATE': 3,
            'INVENTORY_STATE_NAME': '入库待验',
            'QUANTITY': 0.5,
            'QUANTITY1': 0.5,
            'BAOZNUM': 1,
            'LINGS_NUM': 0,
            'ITEM_ID': 557532981205947825,
            'ITEM_NO': 'BSBLMS',
            'ITEM_NAME': '丙酸倍氯米松',
            'MANUFACTURER': '106车间',
            'MNEMONIC_CODE': 'BSBLMS',
            'BATCH_ID': 636559454111911936,
            'BATCH_NO': 'ln01',
            'PACK_ID': 670028215651418880,
            'SPECIFICATION': '0.5KG/箱',
            'UOM': 'KG',
            'FACTOR': 0.5,
            'PRODUCTION_DATE': '2019-10-11',
            'VALID_UNTIL': '2020-10-11',
            'CONTAINER_NO': '4500000010',
            'CONTAINER_ID': 432407611661253998,
            'CONTAINER_NO_T': '4500000010',
            'CONTAINER_ID_T': 432407611661253998,
            'WAREHOUSE_ID': 560456239167959042,
            'WAREHOUSE_NO': 'CPCK',
            'WAREHOUSE_NAME': '成品仓库',
            'SKU_ID': 636559454925606912,
            'KUFANG_NAME': '穿梭车库',
            'KUFANG_NO': 'CPK',
            'KUFANG_ID': 560799890138066956,
            'KUFANG_ID_T': 560799890138066956,
            'YEZ_ID': 560456239167959045,
            'YEZ_NO': 'HZ01',
            'YEZ_NAME': '天津天药药业股份有限公司',
            'QUY_ID': 560825013733814294,
            'QUY_NO': 'CSC',
            'STORAGE_ROOM_TYPE': 4,
            'MODEL_NAME': null,
            'SERIAL_NUMBER': null,
            'SERIAL_NUMBER_ID': null
          },
          {
            'LOT_NO': '1111',
            'LOT_ID': 632226229486936064,
            'LOCATION_ID': 965016506340725957,
            'LOCATION_NO': 'WH0111001061',
            'ROADWAY': '06',
            'STORER_ID': 560456239167959045,
            'INVENTORY_STATE': 3,
            'INVENTORY_STATE_NAME': '入库待验',
            'QUANTITY': 0.5,
            'QUANTITY1': 0.5,
            'BAOZNUM': 1,
            'LINGS_NUM': 0,
            'ITEM_ID': 557532981205947825,
            'ITEM_NO': 'BSBLMS',
            'ITEM_NAME': '丙酸倍氯米松',
            'MANUFACTURER': '106车间',
            'MNEMONIC_CODE': 'BSBLMS',
            'BATCH_ID': 636559454111911936,
            'BATCH_NO': 'ln01',
            'PACK_ID': 670028215651418880,
            'SPECIFICATION': '0.5KG/箱',
            'UOM': 'KG',
            'FACTOR': 0.5,
            'PRODUCTION_DATE': '2019-10-11',
            'VALID_UNTIL': '2020-10-11',
            'CONTAINER_NO': '4500000013',
            'CONTAINER_ID': 575228518319838486,
            'CONTAINER_NO_T': '4500000013',
            'CONTAINER_ID_T': 575228518319838486,
            'WAREHOUSE_ID': 560456239167959042,
            'WAREHOUSE_NO': 'CPCK',
            'WAREHOUSE_NAME': '成品仓库',
            'SKU_ID': 636559454925606912,
            'KUFANG_NAME': '穿梭车库',
            'KUFANG_NO': 'CPK',
            'KUFANG_ID': 560799890138066956,
            'KUFANG_ID_T': 560799890138066956,
            'YEZ_ID': 560456239167959045,
            'YEZ_NO': 'HZ01',
            'YEZ_NAME': '天津天药药业股份有限公司',
            'QUY_ID': 560825013733814294,
            'QUY_NO': 'CSC',
            'STORAGE_ROOM_TYPE': 4,
            'MODEL_NAME': null,
            'SERIAL_NUMBER': null,
            'SERIAL_NUMBER_ID': null
          },
          {
            'LOT_NO': '1111',
            'LOT_ID': 632226229486936064,
            'LOCATION_ID': 841265159169416160,
            'LOCATION_NO': 'WH0115001052',
            'ROADWAY': '08',
            'STORER_ID': 560456239167959045,
            'INVENTORY_STATE': 3,
            'INVENTORY_STATE_NAME': '入库待验',
            'QUANTITY': 0.2,
            'QUANTITY1': 0.2,
            'BAOZNUM': 0,
            'LINGS_NUM': 0.2,
            'ITEM_ID': 557532981205947825,
            'ITEM_NO': 'BSBLMS',
            'ITEM_NAME': '丙酸倍氯米松',
            'MANUFACTURER': '106车间',
            'MNEMONIC_CODE': 'BSBLMS',
            'BATCH_ID': 636559454111911936,
            'BATCH_NO': 'ln01',
            'PACK_ID': 670028215651418880,
            'SPECIFICATION': '0.5KG/箱',
            'UOM': 'KG',
            'FACTOR': 0.5,
            'PRODUCTION_DATE': '2019-10-11',
            'VALID_UNTIL': '2020-10-11',
            'CONTAINER_NO': '4500000009',
            'CONTAINER_ID': 715524012704245067,
            'CONTAINER_NO_T': '4500000009',
            'CONTAINER_ID_T': 715524012704245067,
            'WAREHOUSE_ID': 560456239167959042,
            'WAREHOUSE_NO': 'CPCK',
            'WAREHOUSE_NAME': '成品仓库',
            'SKU_ID': 636559454925606912,
            'KUFANG_NAME': '穿梭车库',
            'KUFANG_NO': 'CPK',
            'KUFANG_ID': 560799890138066956,
            'KUFANG_ID_T': 560799890138066956,
            'YEZ_ID': 560456239167959045,
            'YEZ_NO': 'HZ01',
            'YEZ_NAME': '天津天药药业股份有限公司',
            'QUY_ID': 560825013733814294,
            'QUY_NO': 'CSC',
            'STORAGE_ROOM_TYPE': 4,
            'MODEL_NAME': null,
            'SERIAL_NUMBER': 'SN000000000027',
            'SERIAL_NUMBER_ID': 636559623515656192
          },
          {
            'LOT_NO': '1111',
            'LOT_ID': 632226229486936064,
            'LOCATION_ID': 503481968784793009,
            'LOCATION_NO': 'WH0111001062',
            'ROADWAY': '06',
            'STORER_ID': 560456239167959045,
            'INVENTORY_STATE': 3,
            'INVENTORY_STATE_NAME': '入库待验',
            'QUANTITY': 0.3,
            'QUANTITY1': 0.3,
            'BAOZNUM': 0,
            'LINGS_NUM': 0.3,
            'ITEM_ID': 557532981205947825,
            'ITEM_NO': 'BSBLMS',
            'ITEM_NAME': '丙酸倍氯米松',
            'MANUFACTURER': '106车间',
            'MNEMONIC_CODE': 'BSBLMS',
            'BATCH_ID': 636559454111911936,
            'BATCH_NO': 'ln01',
            'PACK_ID': 670028215651418880,
            'SPECIFICATION': '0.5KG/箱',
            'UOM': 'KG',
            'FACTOR': 0.5,
            'PRODUCTION_DATE': '2019-10-11',
            'VALID_UNTIL': '2020-10-11',
            'CONTAINER_NO': '4500000011',
            'CONTAINER_ID': 129781553787094351,
            'CONTAINER_NO_T': '4500000011',
            'CONTAINER_ID_T': 129781553787094351,
            'WAREHOUSE_ID': 560456239167959042,
            'WAREHOUSE_NO': 'CPCK',
            'WAREHOUSE_NAME': '成品仓库',
            'SKU_ID': 636559454925606912,
            'KUFANG_NAME': '穿梭车库',
            'KUFANG_NO': 'CPK',
            'KUFANG_ID': 560799890138066956,
            'KUFANG_ID_T': 560799890138066956,
            'YEZ_ID': 560456239167959045,
            'YEZ_NO': 'HZ01',
            'YEZ_NAME': '天津天药药业股份有限公司',
            'QUY_ID': 560825013733814294,
            'QUY_NO': 'CSC',
            'STORAGE_ROOM_TYPE': 4,
            'MODEL_NAME': null,
            'SERIAL_NUMBER': 'SN000000000029',
            'SERIAL_NUMBER_ID': 636559624052527104
          }
        ]
  },
      resetData (){
        this.data = []
        this.MoveParam = {}
      }
    }
  }

</script>
