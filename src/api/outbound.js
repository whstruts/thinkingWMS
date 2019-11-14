import { axios } from '@/utils/request'

const api = { FindSaleOrder: 'http://localhost:8770/resource-dispatcher/purchaseOrder/findPage' }
export function getSaleOrder (parameter) {
  return axios({
    url: api.FindSaleOrder,
    method: 'get',
    params: parameter
  })
}
const ap = { FindSaleOrder: 'http://localhost:8770/resource-dispatcher/purchaseOrder/findPagePost' }
export function postSaleOrder (parameter, body) {
  return axios({
    url: ap.FindSaleOrder,
    method: 'post',
    params: parameter,
    data: body
  })
}
const Ap = {
  FindData: 'http://localhost:8770/resource-dispatcher/purchaseOrder/findOne'
}
export function getData (parameter) {
  return axios({
    url: Ap.FindData,
    method: 'get',
    params: parameter
  })
}
