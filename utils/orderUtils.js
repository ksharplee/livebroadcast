
function getStatuName(dStatus) {
  switch (dStatus) {
    case '1':
      return "待确认"
    case '2':
      return "已取消（买）"
    case '3':
      return "已取消（卖）"
    case '4':
      return "待财务审核"
    case '5':
      return "待发货"
    case '6':
      return "已作废"
    case '7':
      return "部分发货"
    case '8':
      return "完成发货"
    case '9':
      return "已确认收货"
    case '10':
      return "已完成"
  }
}

function getAmontStatuName(amoutStatus) {
  switch (amoutStatus) {
    case '0':
      return "未收款"
    case '2':
      return "部分收款"
    case '3':
      return "完成收款"
  }
}

function getPaymentStatusName(paymentStatus) {
  switch (paymentStatus) {
    case '1':
      return "已驳回"
    case '2':
      return "未审核"
    case '3':
      return "已审核"
    case '4':
      return "已作废"
  }
}

function dateFormat(fmt, date) {
  let ret;
  let opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": date.getMonth().toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

module.exports = {
  getStatuName: getStatuName,
  getAmontStatuName: getAmontStatuName,
  dateFormat: dateFormat,
  getPaymentStatusName: getPaymentStatusName,
}
