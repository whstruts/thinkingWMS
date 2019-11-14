// import Storerss from '@/views/outbound/Storerss'
import ItemType from '@/views/outbound/ItemType'
import Pack from '@/views/outbound/Pack'
function ItemDTO (ob, mnemonicCode) {
  this.storer = ob
  this.universalName = ''
  this.mnemonicCode = ''
  this.manufacturer = ''
  this.producingArea = ''
  this.approval = ''
  this.approvalValidUntil = ''
  this.itemType = ItemType
  this.packs = Pack
}

export default ItemDTO
