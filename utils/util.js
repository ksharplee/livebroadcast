const oneDay = 1000 * 60 * 60 * 24

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function dateToWeek(index) {
  switch (index) {
    case 1:
      return "周一"
    case 2:
      return "周二"
    case 3:
      return "周三"
    case 4:
      return "周四"
    case 5:
      return "周五"
    case 6:
      return "周六"
    case 7:
      return "周日"
  }
}

function dateToMonthDay(date){
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [month, day].map(formatNumber).join('-')
}

function dateToYearMonth(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1;
  return `${month}月 `
  // return [year, month].map(formatNumber).join('-')
}

function generateWeek(index,count) {
  let result = []
  for (let i = 0; i<count; i++) {
    let dataObje = {
      date: dateToWeek(index),
      key: dateToWeek(index),
    }
    result.push(dataObje)
    index += 1
  }
  return result
}
function generateMonthDay(beginTime, endTime, interval) {
  let result = []
  let dateTime = null
  while (beginTime <= endTime) {
    dateTime = new Date(beginTime)
    let dataObje = {
      date: dateToMonthDay(dateTime),
      key: Date.parse(dateTime)
    }
    result.push(dataObje)
    beginTime += oneDay * interval
  }
  return result
}

function generateYearMonth(beginDate, endDate) {
  let result = []
  let dateTime = null
  let year = beginDate.getFullYear()
  let month = beginDate.getMonth()
  while (beginDate <= endDate) {
    dateTime = new Date(year, month, 1)
    let dataObj = {
      date: dateToYearMonth(dateTime),
    }
    result.push(dataObj)
    month++
    beginDate = (new Date(year, month, 1)).getTime()
  }
  return result
}

/**
   * 获取日期间隔类型
*/
const getDateIntervalType = (beginDate, endDate) => {
  let beginTime = new Date(beginDate).getTime()
  let endTime = new Date(endDate).getTime()
  let value = Math.ceil((endTime - beginTime) / oneDay)
  if (value > 731) {
    return 0;
  }
  value = Math.ceil(value / 60)
  switch (value) {
    case 1:
      return 2
    case 2:
    case 3:
      return 4
    default:
      return 5
  }
}

/**
   * 生产间隔类型结果集
*/
const generateDateSet = (beginDate, endDate, intervalType) => {
  let beginTime = new Date(beginDate).getTime()
  let endTime = new Date(endDate).getTime()
  let value = Math.ceil((endTime - beginTime) / oneDay) + 1

  if (value > 731) {
    return 0;
  }

  let result = []
  let index = 0
  let interval = 0
  //1:周 2:月 3:年 4:3天 5:7天
  switch (intervalType) {
    case 1:
      index = new Date(beginDate).getDay();
      result = generateWeek(index, value)
      break;
    case 2:
      interval = 1
      result = generateMonthDay(beginTime, endTime, interval)
      break;
    case 3:
      result = generateYearMonth(new Date(beginDate), new Date(endDate))
      break;
    case 4:
      interval = 3
      result = generateMonthDay(beginTime, endTime, interval)
      break;
    case 5:
      interval = 7
      result = generateMonthDay(beginTime, endTime, interval)
      break;
  }

  return result
}

/**
   * 获取本周星期一日期
   *
   * @param {*} date
   * @returns
   */
const getFirstDayOfThisWeek = () => {
  const date = new Date()
    let dayOne = date.getDay() || 7;
    date.setDate(date.getDate() - dayOne + 1);
    return formatTime(date)
}

/**
   * 获取上周星期一日期
   *
   * @param {*} date
   * @returns
   */
const getFirstDayOfLastWeek = () => {
    const date = new Date()
    let dayOne = date.getDay() || 7;
    date.setDate(date.getDate() - dayOne - 6);
    return formatTime(date)
}

/**
   * 获取上周星期天日期
   *
   * @param {*} date
   * @returns
   */
const getLastDayOfLastWeek = () => {
  const date = new Date()
  let dayOne = date.getDay() || 7;
  date.setDate(date.getDate() - dayOne);
  return formatTime(date)
}

/**
   * 获取本月第一天日期
   *
   * @param {*} date
   * @returns
   */
const getFirstDayOfThisMonth = () => {
  const date = new Date()
  date.setDate(1);
  return formatTime(date)
}

/**
   * 获取上月第一天日期
   *
   * @param {*} date
   * @returns
   */
const getFirstDayOfLastMonth = () => {
  const date = new Date()
  let year = date.getFullYear();
  let month = date.getMonth();
  if (!month) {
    month = 12;
    year = year - 1;
  } else {
    month = month - 1;
  }
  const newDate = new Date(year, month, 1);
  return formatTime(newDate)
}

/**
   * 获取上月最后一天日期
   * 先获取本月第一天日期，减去一天
   * @param {*} date
   * @returns
   */
const getLastDayOfLastMonth = () => {
  const date = new Date(getFirstDayOfThisMonth())
  const newDate = Date.parse(date) - 1000 * 60 * 60 * 24;
  return formatTime(new Date(newDate))
}

/**
 * 计算两个时间戳相差的天数
 *
 * @param {*} dateOne
 * @param {*} dateTwo
 */
const getDaysBetweenTwoDates = (dateOne, dateTwo) => {
  if (dateOne <= dateTwo) {
    return parseInt((dateTwo - dateOne) / (1000 * 60 * 60 * 24))
  } else {
    return parseInt((dateOne - dateTwo) / (1000 * 60 * 60 * 24))
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const testMobile = v => /^1[3456789]\d{9}$/.test(v)

const testId = v => /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
    v
  )

module.exports = {
  formatTime: formatTime,
  testMobile: testMobile,
  testId: testId,
  getFirstDayOfThisWeek,
  getDaysBetweenTwoDates,
  getFirstDayOfThisMonth,
  getFirstDayOfLastWeek,
  getLastDayOfLastWeek,
  getFirstDayOfLastMonth,
  getLastDayOfLastMonth,
  getDateIntervalType,
  generateDateSet
}
