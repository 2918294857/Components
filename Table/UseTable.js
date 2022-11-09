import { PC_ZYL_table } from "../Table/PCTable.js";
var data = {
    HtmlID: 'newstable',//添加位置
    TheadData: ['最新技术', '计划学习'],//表头
    IsDataSeq: 'Seq2',//排序 1.翻页重置 Seq2   2.不重置Seq1  3.其他值则不显示排序(默认 为不显示时可不写此属性)
    TheadSeqName:'',//序号的表头名默认为空，若是不需要名称可不写此属性
    TheadBtnName:'',//操作的表头名 默认为空，若是不需要名称可不写此属性
    IsEditBtn: true,//是否有编辑按钮(默认为false 为false时可不写此属性) 当为true时 function `${HtmlID}`_table_BtnEdit(data)
    IsDelBtn: true,//是否有删除按钮(默认为false 为false时可不写此属性) 当为true时 function `${HtmlID}`_table_BtnDel(data)
    TbodyDataLength: 7,//一共多少条数据 当不填时默认为TbodyData.length
    TbodyPageCount: '5',//每页有多少条 值为'All'(默认为All 为All时可不写此属性)时 不分页
    TbodyData: [] //数据
}
PC_ZYL_table(data)
function newstable_table_BtnDel(data) { console.log(data) }//名称是  data.HtmlID  +  _table_BtnDel 
function newstable_table_BtnEdit(data) { console.log(data) }//名称是  data.HtmlID  +  _table_BtnEdit
export {
    newstable_table_BtnDel,
    newstable_table_BtnEdit
}

