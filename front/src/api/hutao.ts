import axios from "axios";
import {
  Announcement,
  GachaEntry,
  GithubAuthorizationStatus,
  PassportRequest,
  RedeemCodeWrapper, RedeemResult,
  UserInfo
} from "@/types/hutao";
import {getToken} from "@/utils/auth";

// Passport

/**
 * 登录
 * @param data Passport 数据，需 UserName, Password
 * @returns Homa token
 */
export function login(data: PassportRequest) {
  return axios.post<string>('/Passport/Login', data);
}

/**
 * 获取用户信息
 * @returns UserInfo 用户信息
 */
export function getUserInfo() {
  return axios.get<UserInfo>('/Passport/UserInfo');
}

/**
 * 获取 Github 授权状态
 */
export function getGithubAuthorizationStatus() {
  return axios.get<GithubAuthorizationStatus>('/OAuth/Github/AuthorizationStatus');
}

/**
 * 跳转到 Github 绑定页
 * @todo Homa 仍跳转至 Passport 后端, 建议添加 router 处理返回 Homa token
 * @todo 详见 {@link https://github.com/DGP-Studio/Snap.Hutao.Server/blob/main/src/Snap.Hutao.Server/Snap.Hutao.Server/Controller/GithubAuthorizationController.cs#L183}
 * @deprecated 建议 inline
 */
export function bindGithub() {
  // @ts-ignore
  window.location.href = `https://homa.snapgenshin.com/OAuth/Github/RedirectLogin?token=${encodeURIComponent(getToken())}`
}

/**
 * 解绑 Github
 */
export function unbindGithub() {
  return axios.get('/OAuth/Github/UnAuthorize')
}

/**
 * 重置密码
 * @param data Passport 数据，需 UserName, Password, VerifyCode
 * @returns Homa token
 */
export function resetPassword(data: PassportRequest) {
  return axios.post<string>('/Passport/ResetPassword', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * 注销账号
 * @param data Passport 数据，需 UserName, Password, VerifyCode
 */
export function cancelAccount(data: PassportRequest) {
  return axios.post('/Passport/Cancel', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 获取邮箱验证码
 * @param data Passport 数据，需 UserName, (IsResetPassword 或 IsCancelRegistration)
 */
export function emailCaptcha(data: PassportRequest) {
  return axios.post('/Passport/Verify', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// Hutao cloud

/**
 * 使用兑换码
 * @param code 18位兑换码
 * @returns 兑换结果, 包含兑换码和时长
 */
export function redeem(code: RedeemCodeWrapper) {
  return axios.post<RedeemResult>('https://passport.snapgenshin.cn/api/redemption/use',
    code,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    });
}

/**
 * 获取云端抽卡记录
 * @returns 用户账号上存在的抽卡记录对应的所有 Uid
 */
export function fetchGachaEntries() {
  return axios.get<GachaEntry[]>('/GachaLog/Entries');
}

/**
 * 删除指定 uid 的抽卡记录
 * @param uid 要删除的抽卡记录对应的 uid
 * @returns 删除了多少条 Uid 对应的记录
 */
export function deleteGachaEntry(uid: number) {
  return axios.get<number>(`/GachaLog/Delete?Uid=${uid}`);
}


export function pullGachaData<T>(uid:T,configType:T,count:T,endid?:string){
  let res=null;
  if(typeof endid === "undefined"){
   res =  axios.get(`/GachaLog/LimitedRetrieve?uid=${uid}&configType=${configType}&count=${count}`);
  }else{
    res = axios.get(`/GachaLog/LimitedRetrieve?uid=${uid}&configType=${configType}&count=${count}&endid=${endid}`);
  }
  return res;
}
// Management

/**
 * 全服赠送胡桃云
 * @param days 赠送天数
 */
export function compensateHutaoCloud(days: number) {
  return axios.get(`/Service/GachaLog/Compensation?days=${days}`);
}

/**
 * 向特定用户增加胡桃云时长
 * @param username 用户邮箱
 * @param days 赠送天数
 */
export function designateHutaoCloud(username: string, days: number) {
  return axios.get(`/Service/GachaLog/Designation?userName=${username}&days=${days}`);
}

/**
 * 上传胡桃公告
 * @param ann 公告
 */
export function UploadAnn(ann: Announcement) {
  return axios.post('/Service/Announcement/Upload', ann, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * 强制刷新 Patch 元数据
 * <br>
 * 用于强制触发版本更新
 */
export async function refreshPatchMeta() {
  async function patch(project:string) {
    await axios.patch(`https://api.snapgenshin.com/patch/${project}`)
  }

  await patch("snap-hutao")
  await patch("snap-hutao-deployment")
}

/**
 * 覆盖 Patch 国内源
 * @param key 项目名
 * @param url 国内源地址
 */
export function overwritePatch(key:string, url:string) {
  const data = {key, url}

  // TODO: Passport Backend to avoid exposed API Key
}
