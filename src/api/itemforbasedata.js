// 调用服务 20191118 whstruts
export function queryapi (url, body) {
  const Client = require('node-rest-client').Client
  const client = new Client()
  // const body = {}
  // const args = {}
  // const executor = {}
  // const warehouse = {}
  // executor.available = false
  // executor.mnemonicCode = null
  // executor.name = 'ADMIN'
  // executor.no = 'ADMIN'
  // executor.company = null
  // executor.department = null
  // executor.fingerPrints = null
  // executor.posts = null
  // executor.roles = null
  // executor.menus = null
  // executor.warehouseAuthorities = null
  // executor.storerAuthorities = null
  // executor.itemTypeAuthorities = null
  // executor.orderTypeAuthorities = null
  // executor.numberOfContainers = 0
  // executor.numberOfPackages = 0
  // executor.password = null
  // executor.username = null
  // executor.numberOfCase = null
  // executor.numberOfEach = null
  // executor.numberOfOrder = null
  // executor.userpwd = null
  // executor.signatureType = null
  // executor.categories = null
  // executor.methods = null
  // executor.admin = null
  // executor.lastModifiedTime = null
  // executor.id = '499524467564535808'
  // executor.version = 0
  // args.warehouse_id = '560456239167959042'
  // args.id = ''
  // args.employee_id = '499524467564535808'
  // warehouse.id = 560456239167959042
  // body.no = 'getStorer'
  // body.warehouse = warehouse
  // body.query = false
  // body.args = args
  // body.executor = executor
  const args = {
    // data: { 'no':'getItemTypeForCombox', 'warehouse':'{"id":560456239167959042}', 'query':false, 'args':'{"id":"","no":"","name":"","employee_id":""}', 'executor':{ 'available':false, 'mnemonicCode':null, 'name':'ADMIN', 'no':'ADMIN', 'company':null, 'department':null, 'fingerPrints':null, 'posts':null, 'roles':null, 'menus':null, 'warehouseAuthorities':null, 'storerAuthorities':null, 'itemTypeAuthorities':null, 'orderTypeAuthorities':null, 'numberOfContainers':0, 'numberOfPackages':0, 'password':null, 'username':null, 'numberOfCase':null, 'numberOfEach':null, 'numberOfOrder':null, 'userpwd':null, 'signatureType':null, 'categories':null, 'methods':null, 'admin':true, 'lastModifiedTime':null, 'id':'499524467564535808', 'version':0 } },
    data: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  }
  // registering remote methods
  // client.registerMethod('postMethod', 'http://120.27.225.232:8770/admin-dispatcher/query', 'POST')
  client.registerMethod('postMethod', url, 'POST')

  client.methods.postMethod(args, function (data, response) {
    // parsed response body as js object
    // console.log(data)
    return data
    // raw response
    // console.log(response)
  })
}
