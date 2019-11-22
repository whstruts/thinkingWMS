import { axios } from '@/utils/request'
const body = {}
const args = {}
const executor = {}
const warehouse = {}
executor.available = false
executor.mnemonicCode = null
executor.name = 'ADMIN'
executor.no = 'ADMIN'
executor.company = null
executor.department = null
executor.fingerPrints = null
executor.posts = null
executor.roles = null
executor.menus = null
executor.warehouseAuthorities = null
executor.storerAuthorities = null
executor.itemTypeAuthorities = null
executor.orderTypeAuthorities = null
executor.numberOfContainers = 0
executor.numberOfPackages = 0
executor.password = null
executor.username = null
executor.numberOfCase = null
executor.numberOfEach = null
executor.numberOfOrder = null
executor.userpwd = null
executor.signatureType = null
executor.categories = null
executor.methods = null
executor.admin = null
executor.lastModifiedTime = null
executor.id = '499524467564535808'
executor.version = 0
executor.url = 'http://120.27.225.232:8770/admin-dispatcher/query'
args.no = ''
args.id = ''
args.item_type_id = ''
args.storer_id = ''
args.employee_id = '499524467564535808'
warehouse.id = '560456239167959042'
body.no = 'getItemForBaseData'
body.warehouse = warehouse
body.query = false
body.args = args
body.executor = executor

const myModule = {
  executor: executor,
  args: args,
  body:body,
  warehouse:warehouse
}
export function queryAPI () {
  return axios.post(executor.url, body)
}


export default myModule
