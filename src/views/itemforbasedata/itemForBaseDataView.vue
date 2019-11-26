<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <div>
      <a-button type="primary">新增</a-button>
      <a-button>导出</a-button>
      <a-button>刷新</a-button>
      <a-button>保存</a-button>
    </div>
    <a-tabs tabBarGutter="10" v-model="activeKey">
      <a-tab-pane tab="商品列表" key="1">
        <a-table :dataSource="dataGoods" :columns="columnsGoods" :scroll="{ x: '400%', y: '50%' }" :customRow="handleSearchGoods">
          <div
            slot="filterDropdown"
            slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
            style="padding: 8px"
          >
            <a-input
              v-ant-ref="c => searchInput = c"
              :placeholder="`Search ${column.dataIndex}`"
              :value="selectedKeys[0]"
              @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="() => handleSearch(selectedKeys, confirm)"
              style="width: 188px; margin-bottom: 8px; display: block;"
            />
            <a-button
              type="primary"
              @click="() => handleSearch(selectedKeys, confirm)"
              icon="search"
              size="small"
              style="width: 90px; margin-right: 8px"
            >Search</a-button
            >
            <a-button
              @click="() => handleReset(clearFilters)"
              size="small"
              style="width: 90px"
            >Reset</a-button
            >
          </div>
          <a-icon
            slot="filterIcon"
            slot-scope="filtered"
            type="search"
            :style="{ color: filtered ? '#108ee9' : undefined }"
          />
          <template slot="customRender" slot-scope="text">
            <span v-if="searchText">
              <template
                v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
              >
                <mark
                  v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                  :key="i"
                  class="highlight"
                >{{ fragment }}</mark
                >
                <template
                  v-else
                >{{ fragment }}</template
                >
              </template>
            </span>
            <template
              v-else
            >{{ text }}</template
            >
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="商品明细" key="2">
        <a-divider>商品基础信息</a-divider>
        <template>
          <a-form>
            <a-row >
              <a-col :md="8" :sm="24">
                <a-form-item label="*商品编号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
<!--                  <item-base></item-base>-->
                  <a-input v-model="ItemGoods.no"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="商品内码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
<!--                  <item-type></item-type>-->
                  <a-input v-model="ItemGoods.id"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="*中文名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-input v-model="ItemGoods.name"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="英文名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-input v-model="ItemGoods.englishName"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="助记码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-input v-model="ItemGoods.code"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="*产地" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-input v-model="ItemGoods.producingArea"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="批准文号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-input v-model="ItemGoods.approval"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="批准文号效期" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-date-picker @change="onChange" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="*生产厂家" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-input v-model="ItemGoods.manufacturer"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="16" :sm="24">
                <a-form-item label="*货主名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
                  <storer defaultValue="ItemGoods.storer"></storer>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-checkbox v-model="ItemGoods.available" default-checked="true" @change="onChange">是否可用</a-checkbox>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
        <a-divider>其它辅助信息</a-divider>
        <template>
          <a-form>
            <a-row >
              <a-col :md="1" :sm="24">
              </a-col>
              <a-col :md="2" :sm="24">
                <a-form-item>
                  <a-checkbox v-model="ItemGoods.newProduct" @change="onChange">是否新品</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :md="1" :sm="24">
              </a-col>
              <a-col :md="3" :sm="24">
                <a-form-item>
                  <a-checkbox v-model="ItemGoods.valuable" @change="onChange">是否贵重药品</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :md="2" :sm="24">
                <a-form-item>
                  <a-checkbox v-model="ItemGoods.supervised" @change="onChange">是否监管</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :md="1" :sm="24">
              </a-col>
              <a-col :md="2" :sm="24">
                <a-form-item>
                  <a-checkbox disabled @change="onChange">是否称量</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :md="1" :sm="24">
              </a-col>
              <a-col :md="2" :sm="24">
                <a-form-item>
                  <a-checkbox v-model="ItemGoods.controlled" @change="onChange">是否特管</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :md="1" :sm="24">
              </a-col>
              <a-col :md="2" :sm="24">
                <a-form-item>
                  <a-checkbox v-model="ItemGoods.coldChains" @change="onChange">是否冷藏</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :md="1" :sm="24">
              </a-col>
              <a-col :md="2" :sm="24">
                <a-form-item>
                  <a-checkbox v-model="ItemGoods.importable" @change="onChange">是否进口</a-checkbox>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="*商品类型" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <item-type></item-type>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="出库批号数" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-input v-model="ItemGoods.numberOfLot"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="复检天数" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-input v-model="ItemGoods.daysOfInspectionNearly"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="ABC分类" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                   <dictionary param="SALE_CLASSIFICATION"></dictionary>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="偏差系数" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="近效期天数" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="近产期天数" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="存储分类" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
                    <a-select-option value="jack">Jack</a-select-option>
                    <a-select-option value="lucy">Lucy</a-select-option>
                    <a-select-option value="disabled" disabled>Disabled</a-select-option>
                    <a-select-option value="Yiminghe">yiminghe</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="存储环境" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-select defaultValue="lucy" @change="handleChange">
                    <a-select-option value="jack">Jack</a-select-option>
                    <a-select-option value="lucy">Lucy</a-select-option>
                    <a-select-option value="disabled" disabled>Disabled</a-select-option>
                    <a-select-option value="Yiminghe">yiminghe</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="商品类别" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-select defaultValue="lucy" @change="handleChange">
                    <a-select-option value="jack">Jack</a-select-option>
                    <a-select-option value="lucy">Lucy</a-select-option>
                    <a-select-option value="disabled" disabled>Disabled</a-select-option>
                    <a-select-option value="Yiminghe">yiminghe</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="周转方式" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-select defaultValue="lucy" @change="handleChange">
                    <a-select-option value="jack">Jack</a-select-option>
                    <a-select-option value="lucy">Lucy</a-select-option>
                    <a-select-option value="disabled" disabled>Disabled</a-select-option>
                    <a-select-option value="Yiminghe">yiminghe</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="存储条件" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-select defaultValue="lucy" @change="handleChange">
                    <a-select-option value="jack">Jack</a-select-option>
                    <a-select-option value="lucy">Lucy</a-select-option>
                    <a-select-option value="disabled" disabled>Disabled</a-select-option>
                    <a-select-option value="Yiminghe">yiminghe</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="更新时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="创建时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
      </a-tab-pane>
      <a-tab-pane tab="包装信息" key="3">
        <a-layout>
          <a-layout-content>
            <a-table :dataSource="data" :columns="columns">
              <div
                slot="filterDropdown"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                style="padding: 8px"
              >
                <a-input
                  v-ant-ref="c => searchInput = c"
                  :placeholder="`Search ${column.dataIndex}`"
                  :value="selectedKeys[0]"
                  @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                  @pressEnter="() => handleSearch(selectedKeys, confirm)"
                  style="width: 188px; margin-bottom: 8px; display: block;"
                />
                <a-button
                  type="primary"
                  @click="() => handleSearch(selectedKeys, confirm)"
                  icon="search"
                  size="small"
                  style="width: 90px; margin-right: 8px"
                >Search</a-button
                >
                <a-button
                  @click="() => handleReset(clearFilters)"
                  size="small"
                  style="width: 90px"
                >Reset</a-button
                >
              </div>
              <a-icon
                slot="filterIcon"
                slot-scope="filtered"
                type="search"
                :style="{ color: filtered ? '#108ee9' : undefined }"
              />
              <template slot="customRender" slot-scope="text">
                <span v-if="searchText">
                  <template
                    v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
                  >
                    <mark
                      v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                      :key="i"
                      class="highlight"
                    >{{ fragment }}</mark
                    >
                    <template
                      v-else
                    >{{ fragment }}</template
                    >
                  </template>
                </span>
                <template
                  v-else
                >{{ text }}</template
                >
              </template>
            </a-table>
          </a-layout-content>
          <a-layout>
            <a-row>
              <a-col :span="16">
                <a-layout-content>
                  <a-divider orientation="left">详情</a-divider>
                  <template>
                    <a-form>
                      <a-row>
                        <a-col :md="11" :sm="24">
                          <a-form-item label="商品编号" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :md="11" :sm="24">
                          <a-form-item label="商品名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col :md="8" :sm="24">
                          <a-form-item label="货主名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                            <a-select defaultValue="lucy" @change="handleChange">
                              <a-select-option value="jack">Jack</a-select-option>
                              <a-select-option value="lucy">Lucy</a-select-option>
                              <a-select-option value="disabled" disabled>Disabled</a-select-option>
                              <a-select-option value="Yiminghe">yiminghe</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                          <a-form-item label="包装数" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                          <a-form-item label="包装单位" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col :md="5" :sm="24">
                          <a-form-item label="规格" :label-col="{ span: 9 }" :wrapper-col="{ span: 14 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :md="5" :sm="24">
                          <a-form-item label="长（CM）" :label-col="{ span: 11 }" :wrapper-col="{ span: 12 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :md="5" :sm="24">
                          <a-form-item label="宽（CM）" :label-col="{ span: 11 }" :wrapper-col="{ span: 12 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :md="7" :sm="24">
                          <a-form-item label="高（CM）" :label-col="{ span: 9 }" :wrapper-col="{ span: 14 }">
                            <a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
                              <a-select-option value="jack">Jack</a-select-option>
                              <a-select-option value="lucy">Lucy</a-select-option>
                              <a-select-option value="disabled" disabled>Disabled</a-select-option>
                              <a-select-option value="Yiminghe">yiminghe</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col :md="5" :sm="24">
                          <a-form-item label="体积(CM³)" :label-col="{ span: 9 }" :wrapper-col="{ span: 14 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :md="5" :sm="24">
                          <a-form-item label="体积系数" :label-col="{ span: 11 }" :wrapper-col="{ span: 12 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :md="5" :sm="24">
                          <a-form-item label="重量（Kg）" :label-col="{ span: 11 }" :wrapper-col="{ span: 12 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :md="7" :sm="24">
                          <a-form-item label="条码" :label-col="{ span: 9 }" :wrapper-col="{ span: 14 }">
                            <a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
                              <a-select-option value="jack">Jack</a-select-option>
                              <a-select-option value="lucy">Lucy</a-select-option>
                              <a-select-option value="disabled" disabled>Disabled</a-select-option>
                              <a-select-option value="Yiminghe">yiminghe</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col :md="5" :sm="24">
                          <a-form-item label="标签分割量" :label-col="{ span: 11 }" :wrapper-col="{ span: 12 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :md="5" :sm="24">
                          <a-form-item label="包装类型" :label-col="{ span: 11 }" :wrapper-col="{ span: 9 }">
                            <a-select defaultValue="lucy" style="width: 90px" @change="handleChange">
                              <a-select-option value="jack">Jack</a-select-option>
                              <a-select-option value="lucy">Lucy</a-select-option>
                              <a-select-option value="disabled" disabled>Disabled</a-select-option>
                              <a-select-option value="Yiminghe">yiminghe</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                        <a-col :md="5" :sm="24">
                          <a-form-item label="包装外观" :label-col="{ span: 11 }" :wrapper-col="{ span: 9 }">
                            <a-select defaultValue="lucy" style="width: 90px" @change="handleChange">
                              <a-select-option value="jack">Jack</a-select-option>
                              <a-select-option value="lucy">Lucy</a-select-option>
                              <a-select-option value="disabled" disabled>Disabled</a-select-option>
                              <a-select-option value="Yiminghe">yiminghe</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                        <a-col :md="7" :sm="24">
                          <a-form-item label="机械手序列号" :label-col="{ span: 11 }" :wrapper-col="{ span: 12 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col :md="4" :sm="24">
                          <a-form-item label="是否自动码盘" :label-col="{ span: 20 }" :wrapper-col="{ span: 3 }">
                            <a-checkbox></a-checkbox>
                          </a-form-item>
                        </a-col>
                        <a-col :md="3" :sm="24">
                          <a-form-item label="是否收货" :label-col="{ span: 19 }" :wrapper-col="{ span: 4 }">
                            <a-checkbox></a-checkbox>
                          </a-form-item>
                        </a-col>
                        <a-col :md="3" :sm="24">
                          <a-form-item label="是否补货" :label-col="{ span: 19 }" :wrapper-col="{ span: 4 }">
                            <a-checkbox></a-checkbox>
                          </a-form-item>
                        </a-col>
                        <a-col :md="3" :sm="24">
                          <a-form-item label="是否发货" :label-col="{ span: 19 }" :wrapper-col="{ span: 4 }">
                            <a-checkbox></a-checkbox>
                          </a-form-item>
                        </a-col>
                        <a-col :md="3" :sm="24">
                          <a-form-item label="是否盘点" :label-col="{ span: 19 }" :wrapper-col="{ span: 4 }">
                            <a-checkbox></a-checkbox>
                          </a-form-item>
                        </a-col>
                        <a-col :md="3" :sm="24">
                          <a-form-item label="是否主包装" :label-col="{ span: 19 }" :wrapper-col="{ span: 4 }">
                            <a-checkbox></a-checkbox>
                          </a-form-item>
                        </a-col>
                        <a-col :md="3" :sm="24">
                          <a-form-item label="是否移库" :label-col="{ span: 19 }" :wrapper-col="{ span: 4 }">
                            <a-checkbox></a-checkbox>
                          </a-form-item>
                        </a-col>
                        <a-col :md="3" :sm="24">
                          <a-form-item label="是否裹膜" :label-col="{ span: 19 }" :wrapper-col="{ span: 4 }">
                            <a-checkbox></a-checkbox>
                          </a-form-item>
                        </a-col>
                        <a-col :md="3" :sm="24">
                          <a-form-item label="是否称量" :label-col="{ span: 19 }" :wrapper-col="{ span: 4 }">
                            <a-checkbox></a-checkbox>
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col :md="8" :sm="24">
                          <a-form-item label="更新时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                          <a-form-item label="创建时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                            <a-input></a-input>
                          </a-form-item>
                        </a-col>
                      </a-row>
                    </a-form>
                  </template>
                </a-layout-content>
              </a-col>
              <a-col :span="8">
                <a-layout-content>
                  <a-divider orientation="left">标准容器容量</a-divider>
                  <a-table :dataSource="data" :columns="columns">
                    <div
                      slot="filterDropdown"
                      slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                      style="padding: 8px"
                    >
                      <a-input
                        v-ant-ref="c => searchInput = c"
                        :placeholder="`Search ${column.dataIndex}`"
                        :value="selectedKeys[0]"
                        @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                        @pressEnter="() => handleSearch(selectedKeys, confirm)"
                        style="width: 188px; margin-bottom: 8px; display: block;"
                      />
                      <a-button
                        type="primary"
                        @click="() => handleSearch(selectedKeys, confirm)"
                        icon="search"
                        size="small"
                        style="width: 90px; margin-right: 8px"
                      >Search</a-button
                      >
                      <a-button
                        @click="() => handleReset(clearFilters)"
                        size="small"
                        style="width: 90px"
                      >Reset</a-button
                      >
                    </div>
                    <a-icon
                      slot="filterIcon"
                      slot-scope="filtered"
                      type="search"
                      :style="{ color: filtered ? '#108ee9' : undefined }"
                    />
                    <template slot="customRender" slot-scope="text">
                      <span v-if="searchText">
                        <template
                          v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
                        >
                          <mark
                            v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                            :key="i"
                            class="highlight"
                          >{{ fragment }}</mark
                          >
                          <template
                            v-else
                          >{{ fragment }}</template
                          >
                        </template>
                      </span>
                      <template
                        v-else
                      >{{ text }}</template
                      >
                    </template>
                  </a-table>
                </a-layout-content>
              </a-col>
            </a-row>
          </a-layout>
        </a-layout>
      </a-tab-pane>
      <a-tab-pane tab="版本信息" key="4">
        <a-table :dataSource="data" :columns="columns">
          <div
            slot="filterDropdown"
            slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
            style="padding: 8px"
          >
            <a-input
              v-ant-ref="c => searchInput = c"
              :placeholder="`Search ${column.dataIndex}`"
              :value="selectedKeys[0]"
              @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="() => handleSearch(selectedKeys, confirm)"
              style="width: 188px; margin-bottom: 8px; display: block;"
            />
            <a-button
              type="primary"
              @click="() => handleSearch(selectedKeys, confirm)"
              icon="search"
              size="small"
              style="width: 90px; margin-right: 8px"
            >Search</a-button
            >
            <a-button
              @click="() => handleReset(clearFilters)"
              size="small"
              style="width: 90px"
            >Reset</a-button
            >
          </div>
          <a-icon
            slot="filterIcon"
            slot-scope="filtered"
            type="search"
            :style="{ color: filtered ? '#108ee9' : undefined }"
          />
          <template slot="customRender" slot-scope="text">
            <span v-if="searchText">
              <template
                v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
              >
                <mark
                  v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                  :key="i"
                  class="highlight"
                >{{ fragment }}</mark
                >
                <template
                  v-else
                >{{ fragment }}</template
                >
              </template>
            </span>
            <template
              v-else
            >{{ text }}</template
            >
          </template>
        </a-table>
        <a-divider orientation="left">详情</a-divider>
        <template>
          <a-form>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="商品编号" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                  <a-select defaultValue="lucy" @change="handleChange">
                    <a-select-option value="jack">Jack</a-select-option>
                    <a-select-option value="lucy">Lucy</a-select-option>
                    <a-select-option value="disabled" disabled>Disabled</a-select-option>
                    <a-select-option value="Yiminghe">yiminghe</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="商品名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="货主名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="版本名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-form-item label="基础版本" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-form-item label="小版本" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-form-item label="标签" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                  <a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
                    <a-select-option value="jack">Jack</a-select-option>
                    <a-select-option value="lucy">Lucy</a-select-option>
                    <a-select-option value="disabled" disabled>Disabled</a-select-option>
                    <a-select-option value="Yiminghe">yiminghe</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="2" :sm="24">
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="近效期天数" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="近产期天数" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="复检天数" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-select defaultValue="lucy" @change="handleChange">
                    <a-select-option value="jack">Jack</a-select-option>
                    <a-select-option value="lucy">Lucy</a-select-option>
                    <a-select-option value="disabled" disabled>Disabled</a-select-option>
                    <a-select-option value="Yiminghe">yiminghe</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row >
              <a-col :md="1" :sm="24"></a-col>
              <a-col :md="6" :sm="24">
                <a-form-item>
                  <a-checkbox @change="onChange">是否可用</a-checkbox>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="更新时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="创建时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-input></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
      </a-tab-pane>
    </a-tabs>
    <a-layout-content style="padding: 0 50px">
    </a-layout-content>
  </a-layout>
</template>

<script>
  import myModule, { queryAPI } from './itemforbasedata'
  import itemBase from './itemBase'
  import ItemType from '../../components/Selector/ItemType/ItemType'
  import Storer from '../../components/Selector/Storer/Storer'
  import Dictionary from '../../components/Selector/Dictionary/Dictionary'
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Joe Black',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Jim Green',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park'
    }
  ]
  const dataGoods = []
  export default {
    name: 'ItemForBaseDataView',
    components: { Dictionary, Storer, itemBase, ItemType },
    data () {
      return {
        ItemGoods:{},
        activeKey:'1',
        data,
        dataGoods,
        searchText: '',
        searchInput: null,
        columns: [
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'customRender'
            },
            onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus()
                }, 0)
              }
            }
          },
          {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'customRender'
            },
            onFilter: (value, record) => record.age.toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus()
                })
              }
            }
          },
          {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'customRender'
            },
            onFilter: (value, record) => record.address.toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus()
                })
              }
            }
          }
        ],
        columnsGoods: [
          {
            title: '货主名称',
            dataIndex: 'YEZ_NAME',
            width: '4%',
            key: 'YEZ_NAME'
          },
          {
            title: '商品编号',
            dataIndex: 'ZHUJ_CODE',
            width: '4%',
            key: 'ZHUJ_CODE',
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'customRender'
            },
            onFilter: (value, record) => record.ZHUJ_CODE.toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus()
                })
              }
            }
          },
          {
            title: '中文名称',
            dataIndex: 'CHINESE_NAME',
            width: '4%',
            key: 'CHINESE_NAME'
          },
          {
            title: '助词码',
            dataIndex: 'ZHUJ_CODE',
            width: '4%',
            key: 'code',
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'customRender'
            },
            onFilter: (value, record) => record.code.toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus()
                })
              }
            }
          },
          {
            title: '生产厂家',
            dataIndex: 'MAKER',
            width: '4%',
            key: 'maker'
          },
          {
            title: '产地',
            dataIndex: 'CHANDI',
            width: '4%',
            key: 'CHANDI'
          },
          {
            title: '批准文号',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '商品类型',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '批准文号效期',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: 'ABC分类',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '存储环境',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '库存周转方式',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '存储分类',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '是否称量',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '近郊期天数',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '近产期天数',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '复检天数',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '批号数',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '是否进口药品',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '是否贵重药品',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '是否可用',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '是否监管',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '创建时间',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          },
          {
            title: '更新时间',
            dataIndex: 'PIZ_NO',
            width: '4%',
            key: 'PIZ_NO'
          }
        ]
      }
    },
    mounted (){
       myModule.executor.url = 'http://120.27.225.232:8770/admin-dispatcher/query'
       queryAPI().then(
         data => {
               console.log('res=>', data)
               this.dataGoods = data.data
           })
      },
    methods: {
      // clickTab (){
      //   this.activeKey = parseInt(this.activeKey) < 4 ? ((parseInt(this.activeKey) + 1) % 5).toString() : '1'
      // },
      handleSearch (selectedKeys, confirm) {
        confirm()
        this.searchText = selectedKeys[0]
      },
      handleSearchGoods (record, index) {
        return {
          on: {
              click: () => {
              console.log(record, index)
              this.activeKey = '2'
              this.ItemGoods.no = record.SHANGP_NO
              this.ItemGoods.id = record.SHANGP_ID
              this.ItemGoods.name = record.CHINESE_NAME
              this.ItemGoods.code = record.ZHUJ_CODE
              this.ItemGoods.producingArea = record.CHANDI
              this.ItemGoods.englishName = record.ENGLISH_NAME
              this.ItemGoods.approval = record.APPROVAL
              this.ItemGoods.manufacturer = record.MAKER
              this.ItemGoods.storer = record.YEZ_NAME
            }
          }
        }
      },

      handleReset (clearFilters) {
        clearFilters()
        this.searchText = ''
      }
    }
  }
</script>

<style scoped>
  #components-layout-demo-top .logo {
    width: 120px;
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 24px 16px 0;
    float: left;
  }
  .card-container {
    background: #f5f5f5;
    overflow: hidden;
    padding: 24px;
  }
  .card-container > .ant-tabs-card > .ant-tabs-content {
    height: 120px;
    margin-top: -16px;
  }

  .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
    background: #fff;
    padding: 16px;
  }

  .card-container > .ant-tabs-card > .ant-tabs-bar {
    border-color: #fff;
  }

  .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
    border-color: transparent;
    background: transparent;
  }

  .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
    border-color: #fff;
    background: #fff;
  }
</style>
