import Enum from "@/utils/Enum";
const enumDesc = {
  OrderStatus: new Enum().add('GENERATED', '刚生成', 0).add('APPLIED', '已提交', 1)
    .add('REJECTED', '已驳回', 2)
    .add('APPROVED', '已审批', 3)
    .add('TERMINATED', '已终止', 99)
}
export default enumDesc
