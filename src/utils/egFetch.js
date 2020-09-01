/*
 * @Author: lynshir 
 * @Date: 2019-08-13 10:26:43 
 * @Last Modified by: lynshir
 * @Last Modified time: 2019-10-18 14:43:31
 */
import { message } from 'antd'

export default async function egFetch(...args) {
  console.log(...args, '进入egFetch', process.env.NODE_ENV)
  const response = await fetch(...args)
  if (!response.ok) {
    message.error('网络错误，请检查！')
    return
  }
  try {
    const result = await response.json()
    if (result.status === 'Unauthenticated') {
      message.error('未登录，请重新登录！')
      // 返回结果，可处理跳转
      return (window.top.location.href = '/login', false)
    }
    // if (process.env.NODE_ENV !== 'development') {
    //   if (result.status === 'redirected') {
    //     return (window.top.location.href = result.data, false)
    //   }
    // }
    return result
  } catch (e) { }
}

/**
 * 公共的post方法 ，此方法为标准post方法所用
 * @param {*} url 请求接口
 * @param {*} data 数据，传对象即可，在这个方法内JSON.stringify
 * @param {*} tipMsg 错误信息提示
 */
export async function commonPost(url, data, options, FailedMsg = '网络错误：操作失败，请联系管理员！') {
  const myInit = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(data),
    ...(options || {})
  }
  const response = await egFetch(url, myInit)
  const result = response || { status: 'Failed', data: FailedMsg }
  return result
}

/**
 * 公共的post方法 ，此方法为标准Put方法所用
 * @param {*} url 请求接口
 * @param {*} data 数据，传对象即可，在这个方法内JSON.stringify
 * @param {*} tipMsg 错误信息提示
 */
export async function commonPut(url, data, options, FailedMsg = '网络错误：操作失败，请联系管理员！') {
  const myInit = {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(data),
    ...(options || {})
  }
  const response = await egFetch(url, myInit)
  const result = response || { status: 'Failed', data: FailedMsg }
  return result
}

//查询common字典
export async function commonGet(url, options, FailedMsg = '网络错误：获取数据失败，请联系管理员！') {
  const myInit = {
    method: 'GET',
    credentials: 'include',
    ...(options || {})
  }
  const response = await egFetch(url, myInit)
  let result = response || { status: 'Failed', data: FailedMsg }
  return result
}

//查询common字典
export async function commonDelete(url, options, FailedMsg = '网络错误：获取数据失败，请联系管理员！') {
  const myInit = {
    method: 'DELETE',
    credentials: 'include',
    ...(options || {})
  }
  const response = await egFetch(url, myInit)
  let result = response || { status: 'Failed', data: FailedMsg }
  return result
}
/**
 * post方式且编码格式x-www-form方式的传输都用此方法
 * @param {*} url 传输url
 * @param {*} data 请求数据 字符串
 */
export async function commonPostString(url, data, FailedMsg = '网络错误：操作失败，请联系管理员！') {
  const myInit = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: data
  }

  const response = await egFetch(url, myInit)
  let result = response || { status: 'Failed', data: FailedMsg }
  return result
}