import { axios } from '@/utils/request'
import api from './index'
export function getPurchaseOrder(parameter, urlExtend) {
  const urlAdd = api.FindPurchaseOrder + (urlExtend || '')
  return axios({
    url: urlAdd,
    method: 'get',
    params: parameter
  })
}
export function getPurchaseOrderPost(parameter,body) {
  const urlAdd = api.FindPurchaseOrderPost
  return axios({
    url: urlAdd,
    method: 'post',
    params: parameter,
    data: body
  })
}
export function savePurchaseOrder(order,executor,warehouse) {
  const urlSave = api.SavePurchaseOrder
  return axios({
    url: urlSave,
    method: 'post',
    data: {
      order: order,
      executor: executor,
      warehouse: warehouse
    }
  })
}
export function getItemType(parameter, url) {
  return axios({
    url: url,
    method: 'get',
    params: parameter
  })
}