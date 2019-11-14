const api = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info',
  //selector
  FindAllOrderType: 'http://120.27.225.232:8770/resource-dispatcher/orderType/findAll',
  FindAllItemType: 'http://120.27.225.232:8770/resource-dispatcher/itemType/findAll',
  FindAllStorer: 'http://120.27.225.232:8770/resource-dispatcher/storer/findAll',
  FindAllCustomer: 'http://120.27.225.232:8770/resource-dispatcher/customer/findAll',
  //inbound
  FindPurchaseOrder: 'http://120.27.225.232:8770/resource-dispatcher/purchaseOrder/findPage',
  FindPurchaseOrderPost: 'http://120.27.225.232:8770/resource-dispatcher/purchaseOrder/findPagePost',
  SavePurchaseOrder: 'http://120.27.225.232:8770/receiving-dispatcher/plan/save'
}
export default api
