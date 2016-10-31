package com.xdja.vwp.common.util;


/*weizg 2013-4-16 添加新登录流程，以及SM4算法相关错误代码
 * 
 */
public class ErrorCode {
	public static int LastError = 0; // 系统中出现的最后一个错误
	public static final int ErrBaseNum = 0x2002 * 0x1000;

	public static String ErrMsg = "";// 错误信息
	public static String ErrMsgBrief = "";//简要错误信息

	public static final int Err_None = 0; // 没有错误
	public static final int Err_Server = -1;// 后台返回的错误
    public static String ERRCODE_SID = "0x23020001";
    //0x23020117
    public static String ERRCODE_LOGIN_CARD_NOT_BIND = "0x23020506";
	public static final int Err_MinNum = 16000;
	public static final int Err_TransCharacterEncoding = ErrBaseNum + 1; // 字符编码转换出错
	public static final int Err_FileNotExist = ErrBaseNum + 2; // 文件不存在
	public static final int Err_CreateNewFile = ErrBaseNum + 3; // 创建新文件出错
	public static final int Err_ReadFile = ErrBaseNum + 4; // 读取文件出错
	public static final int Err_OpenFileIOStream = ErrBaseNum + 5; // 打开输入输出流失败
	public static final int Err_CloseFileIOStream = ErrBaseNum + 6; // 关闭输入输出流失败
	public static final int Err_FileLength = ErrBaseNum + 7; // 文件长度不合法
	public static final int Err_WriteFile = ErrBaseNum + 8; // 写文件出错
	public static final int Err_PriKeyEncDataLen = ErrBaseNum + 9;// 私钥签名数据长度不对
	public static final int Err_PriKeyDecDataLen = ErrBaseNum + 10;// 私钥解密数据长度不对
	public static final int Err_ServerRespondError = ErrBaseNum + 11;// 服务器响应出错
	public static final int Err_AlternationError = ErrBaseNum + 12;// 与后台交互异常
	public static final int Err_PriKeyEncData = ErrBaseNum + 13;// 私钥签名数据不对
	public static final int Err_PublicKeyEnc = ErrBaseNum + 14;// 公钥加密错误
	public static final int Err_Base64Enc = ErrBaseNum + 15;// Base64编码错误
	public static final int Err_ObtainCertificateError = ErrBaseNum + 16;// 获取证书错误

	public static final int Err_SignDataLength = ErrBaseNum + 17;// 签名数据长度错误
	public static final int Err_SignData = ErrBaseNum + 18;// 签名数据错误

	public static final int Err_SessionKeyNoFind = ErrBaseNum + 19;// 会话密钥未找到
	public static final int Err_ResponseError = ErrBaseNum + 20;// 后台响应出错

	public static final int Err_GetClientCertSN = ErrBaseNum + 21;// 获取客户端证书SN失败
	public static final int Err_GetSHA1Digest = ErrBaseNum + 22;// 获取SHA1摘要失败
	public static final int Err_GetClientCert = ErrBaseNum + 23;// 获取客户端证书失败
	public static final int Err_SwitchClientCert = ErrBaseNum + 24;// 客户端证书编码失败
	public static final int Err_ServerPk = ErrBaseNum + 25;// 获取服务器端公钥失败
	public static final int Err_Encrypt = ErrBaseNum + 26;// 用服务器公钥加密失败
	public static final int Err_Hello1 = ErrBaseNum + 27;// 第一次握手失败
	public static final int Err_Hello2 = ErrBaseNum + 28;// 第二次握手失败
	public static final int Err_LoginFail = ErrBaseNum + 29;// 登录请求失败
	public static final int Err_GetCACert = ErrBaseNum + 30;// 获取CA证书失败
	public static final int Err_ServCert_invalid = ErrBaseNum + 31;// 后台证书验证失败
	public static final int Err_CertSnLenthErr = ErrBaseNum + 32;// 证书SN号长度有误
	public static final int Err_NotConnectToServer = ErrBaseNum + 33;// 普通登录，连接后台服务器失败


	public static final int Err_OpenTFFail = ErrBaseNum + 34;// 普通登录，连接后台服务器失败

	// 网络连接错误
	public static final int Err_Net_ResponseEntityNull = ErrBaseNum + 35; // 未从服务器取到数据
	public static final int Err_Net_ResponseStatusCodeNOOK = ErrBaseNum + 36; // 尝试连接服务器失败，服务器响应失败
	public static final int Err_Net_ServUrlInvalid = ErrBaseNum + 37; // 服务器地址有误 33562680 33562624
	public static final int Err_Net_ServConnectFail = ErrBaseNum + 38; // 尝试服务器失败
	public static final int Err_Net_ConnectTimeout = ErrBaseNum + 39; // 连接服务器超时

	public static final int Err_CreatCacheDirFaild = ErrBaseNum + 40;// 创建缓存目录失败
	
	//验证TF卡口令错误
	public static final int Err_CheckTFPwd_pwdNull = ErrBaseNum + 41; //口令为空
	public static final int Err_CheckTFPwd_cardNotFound = ErrBaseNum + 42; //TF卡不可用，TF卡未找到
	public static final int Err_CheckTFPwd_cardOpenFail = ErrBaseNum + 43; //TF打开失败
	
	//组装注册用户xml出错
	public static final int Err_Regitser_xml = ErrBaseNum + 44; //组装注册用户xml出错
	//注册用户-建立安全通道-第一次握手解析返回值失败
	public static final int Err_Regitser_hello1_resPar = ErrBaseNum + 45; 
	
	//取tf序列号
	public static final int Err_GetCardId = ErrBaseNum + 46; //取TF卡序列号出错
	
	//建立安全通道服务器证书编码失败
	public static final int Err_ServCertX509Fail = ErrBaseNum + 47; 
	
	//建立安全通道后台返回HMAC_SM3与客户端发送的不一致
	public static final int Err_Hello2_HMAC_SM3 = ErrBaseNum + 48;

   //发送数据获取失败
	public static final int Err_AsynoTask_sendDataNUll = ErrBaseNum + 49;
	
	//获取邮箱列表解析错误
	public static final int Err_MailList_xmlDoc_null = ErrBaseNum + 50;
	public static final int Err_MailList_xmlBox_null = ErrBaseNum + 51; //返回数据解析box标签数据是出错
	public static final int Err_MailList_xmlBox_zero = ErrBaseNum + 52; //返回数据无box标签数据
	
	public static final int Err_ParseServerXml = ErrBaseNum + 53;//解析服务器返回的数据出错
	

	//weizg 2013-4-16 添加新登录流程，以及SM4算法相关错误代码
	public static final int Err_GetRandomStr_Null = ErrBaseNum + 54; // 向代理请求挑战值（随机数）请求字符串为空
	public static final int Err_getRandomRes = ErrBaseNum + 55; //代理返回挑战值字符串有误
	public static final int Err_getPkcs7Str = ErrBaseNum + 56; //获取pkcs7签名字符串错误
	
	public static final int Err_VerifySignature_fail = ErrBaseNum + 57; //验证签名出错
	public static final int Err_UnLoginOrSessionTimeout_fail = ErrBaseNum + 58; //未登录或会话超时
	
	public static final int Err_Session_Encrypt_fail = ErrBaseNum + 59; //应用请求加密失败
	public static final int Err_Session_Decrypt_fail = ErrBaseNum + 60; //应用回执解密失败
	public static final int Err_Update_Pubkey_fail = ErrBaseNum + 61; //更新公钥请求失败
	public static final int Err_Update_Pubkey_DB_fail = ErrBaseNum + 62; //更新公钥数据库异常失败
	public static final int Err_Cloud_DB_Operate_fail = ErrBaseNum + 63; //更新公钥数据库异常失败
	public static final int Err_Update_Pubkey_Not_Updated=ErrBaseNum+ 64;  //公钥无更新
	
	public static final int Err_PubKeyDecDataParError = ErrBaseNum + 65;// 公钥解密参数为空
	public static final int Err_PriKeyDecDataParError = ErrBaseNum + 66;// 私钥解密参数为空
	
	
	//信大云存储错误码
	public static final int Err_ERRCODE_SID_fail = ErrBaseNum + 101; 
	public static final int Err_ERRCODE_LOGIN_NAME_NOT_EXIST_fail = ErrBaseNum + 102; 
	public static final int Err_ERRCODE_LOGIN_NOT_LOGIN_fail = ErrBaseNum + 103;
	public static final int Err_ERRCODE_LOGIN_NAME_STOP_fail = ErrBaseNum + 104; 
	public static final int Err_ERRCODE_LOGIN_CARD_NOT_BIND_fail = 0x23020506;
	public static final int Err_ERRCODE_HELLO2_CERT_fail = ErrBaseNum + 106; 
	public static final int Err_ERRCODE_HELLO2_VERIFY_fail = ErrBaseNum + 107; 
	public static final int Err_ERRCODE_HELLO2_NOSN_fail = ErrBaseNum + 108; 
	public static final int Err_ERRCODE_HELLO2_SIG_fail = ErrBaseNum + 109; 
	public static final int Err_ERRCODE_HELLO2_KRAND_fail = ErrBaseNum + 110; 
	public static final int Err_ERRCODE_HELLO2_HMAC_fail = ErrBaseNum + 111; 
	public static final int Err_ERRCODE_HELLO2_PKEY_fail = ErrBaseNum + 112; 
	public static final int Err_ERRCODE_NOT_SUPPORTED_PUBLIC_ALGO_fail = ErrBaseNum + 113; 
	public static final int Err_ERRCODE_NOT_SUPPORTED_SESSION_KEY_ALGO_fail = ErrBaseNum + 114; 
	public static final int Err_ERRCODE_NOT_SUPPORTED_INTERFACE_VERSION_fail = ErrBaseNum + 115; 
	public static final int Err_ERRCODE_NOT_SUPPORTED_RIGISTER_fail = ErrBaseNum + 116; 
	public static final int Err_ERRCODE_HELLO2_INFO_ENT_fail = ErrBaseNum + 117; 
	public static final int Err_ERRCODE_DECRYPT_PROC_fail = ErrBaseNum + 118; 
	public static final int Err_ERRCODE_ENCRYPT_PROC_fail = ErrBaseNum + 119; 
	public static final int Err_ERRCODE_DECRYPT_BASE64_fail = ErrBaseNum + 120; 
	public static final int Err_ERRCODE_DECRYPT_UTF8_fail = ErrBaseNum + 121; 
	public static final int Err_ERRCODE_XML_fail = ErrBaseNum + 122; 
	public static final int Err_ERRCODE_XML_ROOT_NOT_DEFINED_fail = ErrBaseNum + 123;
	public static final int Err_ERRCODE_XML_NODE_CHK_fail = ErrBaseNum + 124; 
	public static final int Err_ERRCODE_XML_MESSAGE_FORMAT_fail = ErrBaseNum + 125; 
	public static final int Err_ERRCODE_DB_CONN_fail = ErrBaseNum + 126; 
	public static final int Err_ERRCODE_DB_SQL_EXECUTE_fail = ErrBaseNum + 127; 	
	public static final int Err_ERRCODE_USER_NAME_USED_SER_fail = ErrBaseNum + 128; 	
	public static final int Err_ERRCODE_CARD_USED_SER_fail = ErrBaseNum + 129; 	
	public static final int Err_ERRCODE_MAIL_BINDED_SER_fail = ErrBaseNum + 130; 
	public static final int Err_ERRCODE_MAIL_UNBIND_NOT_EXSIT_SER_fail = ErrBaseNum + 131; 	
	public static final int Err_ERRCODE_OLD_PASS_ERROR_SER_fail = ErrBaseNum + 132; 
	public static final int Err_ERRCODE_USER_NAME_NOT_EXSIT_SER_fail = ErrBaseNum + 133; 	
	public static final int Err_ERRCODE_CLIENT_CERT_VERIFY_FAIL_SER_fail = ErrBaseNum + 134; 	
	public static final int Err_ERRCODE_TRANS_AND_SUBMIT_CERT_DIFF_SER_fail = ErrBaseNum + 135;
	public static final int Err_ERRCODE_TRANS_DB_CERT_ERROR_SER_fail = ErrBaseNum + 136; 	
	public static final int Err_ERRCODE_CERT_AND_SUBMIT_CARD_DIFF_SER_fail = ErrBaseNum + 137; 	
	public static final int Err_ERRCODE_PKCS7_RANDOM_ERROR_SER_fail = ErrBaseNum + 138; 	
	public static final int Err_ERRCODE_PKCS7_SIGN_ERROR_SER_fail = ErrBaseNum + 139;
	public static final int Err_ERRCODE_CARD_NOT_EXIST_SER_fail = ErrBaseNum + 140;
	public static final int Err_ERRCODE_USER_NAME_ERROR_SER_fail = ErrBaseNum + 141; 
	public static final int Err_ERRCODE_UNDEF_fail = ErrBaseNum + 142; 
	public static final int Err_ERRCODE_SMP_JNI_fail = ErrBaseNum + 143; 
	public static final int Err_ERRCODE_NOT_SUPPORTED_SYNC_ENTERPRISE_ADDRESS_LIST_fail = ErrBaseNum + 144; 	
	public static final int Err_ERRCODE_ENTERPRISE_NOT_SUPPORTED_REGISTER_fail = ErrBaseNum + 145; 	
	public static final int Err_ERRCODE_INVOKE_fail = ErrBaseNum + 146; 	
	public static final int Err_ERRCODE_FRAMEWORK_fail = ErrBaseNum + 147; 	
	public static final int Err_ERRCODE_INVOKE_UMS_API_CONNECTION_fail = ErrBaseNum + 148; 
	public static final int Err_ERRCODE_INVOKE_UMS_API_ERROR_fail = ErrBaseNum + 149;


    public static final int Err_ERRCODE_SYSTEMTIME_INCORRECT = ErrBaseNum + 160;
    public static final int Err_ERRCODE_MEMORY_CLEAR = ErrBaseNum + 161;//缓存清理
    public static final int Err_ERRCODE_NET_ERROR = ErrBaseNum + 162;//网络异常,请检查网络设置
    public static final int Err_ERRCODE_REQUEST_TIMEOUT = ErrBaseNum + 163;
    public static final int Err_ERRCODE_REQUEST_SERVER_FAILED = ErrBaseNum + 164;
    public static final int Err_ERRCODE_CLOUD_BACKUP_NONE = ErrBaseNum + 165;//云端没有备份文件
    public static final int Err_ERRCODE_DEVICE_BACKUP_NONE = ErrBaseNum + 166;//本地没有备份文件
    public static final int Err_ERRCODE_CARD_NOT_BIND_fail = ErrBaseNum + 167;//安全卡未绑定账号
    public static final int Err_ERRCODE_NOBUCKET = ErrBaseNum + 168;//bucket不存在
	public static final int Err_ERRCODE_NOKEY = ErrBaseNum + 169;//key不存在
    public static final int Err_ERRCODE_SOCKET_CLOSED = ErrBaseNum + 170;//请求关闭
    public static final int Err_ERRCODE_CANCEL = ErrBaseNum + 171;//取消
	public static final int Err_ERRCODE_BACKUP_CANCEL = ErrBaseNum + 172;//备份取消
    public static final int Err_ERRCODE_RESTORE_CANCEL = ErrBaseNum + 173;//恢复取消
	public static final int Err_ERRCODE_PHOTO_ERROR = ErrBaseNum + 174;//图片错误
	public static final int Err_ERRCODE_ACCOUNT_IS_NOT_EXIST = ErrBaseNum + 175;//账户不存在
	public static final int Err_ERRCODE_REQUEST_QUEP_ERROR = ErrBaseNum + 176;//获取安通账户KUEP信息出错
    public static final int Err_ERRCODE_OTHER_ERROR = ErrBaseNum + 177;//其它错误

    /**
	 * 根据错误代码errCode返回对应错误信息
	 * 
	 * @param errCode
	 * @return
	 */
	public static String GetErrMsg(int errCode) {
		if(errCode < (ErrBaseNum+100)){
		switch (errCode) {
		case Err_TransCharacterEncoding:
			ErrMsg = "字符编码转换出错";
			break;
		case Err_FileNotExist:
			ErrMsg = "文件不存在";
			break;
		case Err_CreateNewFile:
			ErrMsg = "创建新文件出错";
			break;
		case Err_ReadFile:
			ErrMsg = "读取文件出错";
			break;
		case Err_OpenFileIOStream:
			ErrMsg = "打开输入输出流失败";
			break;
		case Err_CloseFileIOStream:
			ErrMsg = "关闭输入输出流失败";
			break;
		case Err_FileLength:
			ErrMsg = "文件长度不合法";
			break;
		case Err_WriteFile:
			ErrMsg = "写文件出错";
			break;
		case Err_PriKeyEncDataLen:
			ErrMsg = "私钥签名数据长度不对";
			break;
		case Err_PriKeyDecDataLen:
			ErrMsg = "私钥解密数据长度不对";
			break;
		case Err_ServerRespondError:
			ErrMsg = "服务器响应出错";
			break;
		case Err_AlternationError:
			ErrMsg = "与后台交互异常";
			break;
		case Err_PriKeyEncData:
			ErrMsg = "私钥签名数据不对";
			break;
		case Err_PublicKeyEnc:
			ErrMsg = "公钥加密失败";
			break;
		case Err_Base64Enc:
			ErrMsg = "Base64编码错误";
			break;
		case Err_ObtainCertificateError:
			ErrMsg = "获取证书错误";
			break;
		case Err_SignDataLength:
			ErrMsg = "签名数据长度错误";
			break;
		case Err_SignData:
			ErrMsg = "签名数据错误";
			break;
		case Err_SessionKeyNoFind:
			ErrMsg = "会话密钥未找到";
			break;
		case Err_ResponseError:
			ErrMsg = "后台响应出错";
			break;
		case Err_GetClientCertSN:
			ErrMsg = "获取客户端证书SN失败";
			break;
		case Err_GetSHA1Digest:
			ErrMsg = "获取SHA1摘要失败";
			break;
		case Err_GetClientCert:
			ErrMsg = "获取客户端证书失败";
			break;
		case Err_SwitchClientCert:
			ErrMsg = "客户端证书编码失败";
			break;
		case Err_ServerPk:
			ErrMsg = "获取服务器端公钥失败";
			break;
		case Err_Encrypt:
			ErrMsg = "用服务器公钥加密失败";
			break;
		case Err_Hello1:
//			ErrMsg = "第一次握手失败：连接服务器失败";
			ErrMsg = "网络异常";
			break;
		case Err_Hello2:
			ErrMsg = "第二次握手失败";
			break;
		case Err_LoginFail:
			ErrMsg = "登录请求失败";
			break;
		case Err_GetCACert:
			ErrMsg = "获取CA证书失败";
			break;
		case Err_ServCert_invalid:
			ErrMsg = "后台证书验证失败";
			break;
		case Err_CertSnLenthErr:
			ErrMsg = "证书SN号长度有误";
			break;
		case Err_NotConnectToServer:
			ErrMsg = "普通登录，连接后台服务器失败";
			break;
		
		case Err_OpenTFFail:
			ErrMsg = "打开安全TF卡失败";
			break;
		
		case Err_Net_ResponseEntityNull:
			ErrMsg = "未从服务器取到数据(code:" + Err_Net_ResponseEntityNull + ")";
			break;
		case Err_Net_ResponseStatusCodeNOOK:
			ErrMsg = "尝试连接服务器失败(code:" + Err_Net_ResponseStatusCodeNOOK + ")";
			break;
		case Err_Net_ServUrlInvalid:
			ErrMsg = "服务器地址不合法(code:" + Err_Net_ServUrlInvalid + ")";
			break;
		case Err_Net_ServConnectFail:
			ErrMsg = "连接服务器失败，网络异常(code:" + Err_Net_ServConnectFail + ")";
			break;
		case Err_Net_ConnectTimeout:
			ErrMsg = "连接服务器失败，连接服务器超时(code:" + Err_Net_ConnectTimeout + ")";
			break;
		case Err_CreatCacheDirFaild:
			ErrMsg = "创建缓存目录失败";
			break;
		case Err_CheckTFPwd_pwdNull:
			ErrMsg = "口令有误，请重新输入";
			break;
		case Err_CheckTFPwd_cardNotFound:
			ErrMsg = "未插入存储卡，请检查存储卡是否存在，重启客户端";
			break;
		case Err_CheckTFPwd_cardOpenFail:
			ErrMsg = "打开TF卡失败";
			break;
		case Err_Regitser_xml:
			ErrMsg = "注册新用户请求字符串组装出错";
			break;
		case Err_GetCardId:
			ErrMsg = "取TF卡序列号出错";
			break;
		case Err_Regitser_hello1_resPar:
			ErrMsg = "注册用户建立安全通道有误，第一次握手失败 (code:" + Err_Regitser_hello1_resPar + ")";
			break;
		case Err_ServCertX509Fail:
			ErrMsg = "建立安全通道--服务器证书编码失败(code:" + Err_ServCertX509Fail + ")";
			break;
		case Err_Hello2_HMAC_SM3:
			ErrMsg = "建立安全通道失败，第二次握手错误(code:" + Err_Hello2_HMAC_SM3 + ")";
			break;
		case Err_AsynoTask_sendDataNUll:
		    ErrMsg = "发送数据获取为空(code:" + Err_AsynoTask_sendDataNUll + ")";
		    break;
		case Err_MailList_xmlDoc_null:
		    ErrMsg = "邮箱列表数据解析异常(code:" + Err_MailList_xmlDoc_null + ")";
		    break;
		case Err_MailList_xmlBox_null:
		    ErrMsg = "邮箱列表数据解析异常(code:" + Err_MailList_xmlBox_null + ")";
		    break;
		
		case Err_GetRandomStr_Null:
			ErrMsg = "请求随机数字符串为空(code:"+Err_GetRandomStr_Null+")";
			break;
		case Err_getRandomRes:
			ErrMsg = "代理返回随机数字符串有误(code:"+Err_getRandomRes+")";
			break;
		case Err_getPkcs7Str:
			ErrMsg = "获取pkcs7签名字符串出错(code:"+Err_getPkcs7Str+")";
			break;
		case Err_UnLoginOrSessionTimeout_fail:
			ErrMsg = "未登录或会话超时";
			break;
		case Err_Session_Encrypt_fail:
			ErrMsg = "应用请求加密失败";
			break;
		case Err_Session_Decrypt_fail:
			ErrMsg = "应用回执解密失败";
			break;
		case Err_Update_Pubkey_fail:
			ErrMsg = "更新公钥请求失败";
			break;
		case Err_Update_Pubkey_DB_fail:
			ErrMsg ="更新公钥数据库异常";
			break;
		case Err_Cloud_DB_Operate_fail:
			ErrMsg = "云网盘数据库操作异常";
			break;
		case -9:
//			ErrMsg = XDJASafeTF.getInstance().getErrorInfo(errCode);
			break;
		default:
			ErrMsg = "未知错误";
			break;
		}
		}else if(errCode < (ErrBaseNum+200)){
			switch (errCode) {
			case Err_ERRCODE_SID_fail:
				ErrMsg = "连接过期，请重启客户端";
				break;
			case Err_ERRCODE_LOGIN_NAME_NOT_EXIST_fail:
				ErrMsg = "用户不存在";
				break;
			case Err_ERRCODE_LOGIN_NOT_LOGIN_fail:
				ErrMsg = "未登录";
				break;
			case Err_ERRCODE_LOGIN_NAME_STOP_fail:
				ErrMsg = "用户已暂停";
				break;
			case Err_ERRCODE_LOGIN_CARD_NOT_BIND_fail:
				ErrMsg = "安全卡未绑定用户，请先注册或将该卡绑定至自己已有的用户名";
				break;
			case Err_ERRCODE_HELLO2_CERT_fail:
				ErrMsg = "客户端证书格式异常";
				break;
			case Err_ERRCODE_HELLO2_VERIFY_fail:
				ErrMsg = "客户端证书未通过验证";
				break;
			case Err_ERRCODE_HELLO2_NOSN_fail:
				ErrMsg = "证书未登记";
				break;
			case Err_ERRCODE_HELLO2_SIG_fail:
				ErrMsg = "用户验签未通过";
				break;
			case Err_ERRCODE_HELLO2_KRAND_fail:
				ErrMsg = "获取KRandom16异常";
				break;
			case Err_ERRCODE_HELLO2_HMAC_fail:
				ErrMsg = "验证HMAC_SM3异常";
				break;
			case Err_ERRCODE_HELLO2_PKEY_fail:
				ErrMsg = "获取用户公钥异常";
				break;
			case Err_ERRCODE_NOT_SUPPORTED_PUBLIC_ALGO_fail:
				ErrMsg = "不支持的公钥算法";
				break;
			case Err_ERRCODE_NOT_SUPPORTED_SESSION_KEY_ALGO_fail:
				ErrMsg = "不支持的会话私钥算法";
				break;
			case Err_ERRCODE_NOT_SUPPORTED_INTERFACE_VERSION_fail:
				ErrMsg = "请升级、或安装最新的客户端";
				break;
			case Err_ERRCODE_NOT_SUPPORTED_RIGISTER_fail:
				ErrMsg = "请升级邮件客户端，或通过 www.safecenter.com 网站注册";
				break;
			case Err_ERRCODE_HELLO2_INFO_ENT_fail:
				ErrMsg = "建立加密通道失败，请先进行HELLO1";
				break;
			case Err_ERRCODE_DECRYPT_PROC_fail:
				ErrMsg = "报文解密处理失败";
				break;
			case Err_ERRCODE_ENCRYPT_PROC_fail:
				ErrMsg = "报文加密处理失败";
				break;
			case Err_ERRCODE_DECRYPT_BASE64_fail:
				ErrMsg = "报文Base64格式异常";
				break;
			case Err_ERRCODE_DECRYPT_UTF8_fail:
				ErrMsg = "报文UTF-8格式异常";
				break;
			case Err_ERRCODE_XML_fail:
				ErrMsg = "XML格式异常";
				break;
			case Err_ERRCODE_XML_ROOT_NOT_DEFINED_fail:
				ErrMsg = "未定义的XML消息";
				break;
			case Err_ERRCODE_XML_NODE_CHK_fail:
				ErrMsg = "XML节点项是否存在检测未通过";
				break;
			case Err_ERRCODE_XML_MESSAGE_FORMAT_fail:
				ErrMsg = "XML内消息格式错误";
				break;
			case Err_ERRCODE_DB_CONN_fail:
				ErrMsg = "数据库连接异常";
				break;
			case Err_ERRCODE_DB_SQL_EXECUTE_fail:
				ErrMsg = "服务器数据库执行异常";
				break;
			case Err_ERRCODE_USER_NAME_USED_SER_fail:
				ErrMsg = "用户名占用";
				break;
			case Err_ERRCODE_CARD_USED_SER_fail:
				ErrMsg = "安全卡已使用";
				break;
			case Err_ERRCODE_MAIL_BINDED_SER_fail:
				ErrMsg = "邮箱已绑定";
				break;
			case Err_ERRCODE_MAIL_UNBIND_NOT_EXSIT_SER_fail:
				ErrMsg = "请求解绑的绑定关系不存在";
				break;
			case Err_ERRCODE_OLD_PASS_ERROR_SER_fail:
				ErrMsg = "旧密码错误";
				break;
			case Err_ERRCODE_USER_NAME_NOT_EXSIT_SER_fail:
				ErrMsg = "用户不存在";
				break;
			case Err_ERRCODE_CLIENT_CERT_VERIFY_FAIL_SER_fail:
				ErrMsg = "客户端证书验证失败";
				break;
			case Err_ERRCODE_TRANS_AND_SUBMIT_CERT_DIFF_SER_fail:
				ErrMsg = "通道与提交的证书不一致";
				break;
			case Err_ERRCODE_TRANS_DB_CERT_ERROR_SER_fail:
				ErrMsg = "数据库中保存的证书错误";
				break;
			case Err_ERRCODE_CERT_AND_SUBMIT_CARD_DIFF_SER_fail:
				ErrMsg = "证书与提交的卡号不一致";
				break;
			case Err_ERRCODE_PKCS7_RANDOM_ERROR_SER_fail:
				ErrMsg = "PKCS7挑战值错误";
				break;
			case Err_ERRCODE_PKCS7_SIGN_ERROR_SER_fail:
				ErrMsg = "PKCS7签名错误";
				break;
			case Err_ERRCODE_CARD_NOT_EXIST_SER_fail:
				ErrMsg = "安全卡不存在";
				break;
			case Err_ERRCODE_USER_NAME_ERROR_SER_fail:
				ErrMsg = "用户名错误";
				break;
			case Err_ERRCODE_UNDEF_fail:
				ErrMsg = "未定义异常";
				break;
			case Err_ERRCODE_SMP_JNI_fail:
				ErrMsg = "调用加密卡失败";
				break;
			case Err_ERRCODE_NOT_SUPPORTED_SYNC_ENTERPRISE_ADDRESS_LIST_fail:
				ErrMsg = "不支持企业通讯录同步功能";
				break;
			case Err_ERRCODE_ENTERPRISE_NOT_SUPPORTED_REGISTER_fail:
				ErrMsg = "不支持注册功能";
				break;
			case Err_ERRCODE_INVOKE_fail:
				ErrMsg = "业务执行失败";
				break;
			case Err_ERRCODE_FRAMEWORK_fail:
				ErrMsg = "框架处理失败";
				break;
			case Err_ERRCODE_INVOKE_UMS_API_CONNECTION_fail:
				ErrMsg = "UMS连接异常";
				break;
			case Err_ERRCODE_INVOKE_UMS_API_ERROR_fail:
				ErrMsg = "UMS调用失败";
				break;
            case Err_ERRCODE_MEMORY_CLEAR:
                ErrMsg = "应用缓存被清除";
                break;
            case Err_ERRCODE_SYSTEMTIME_INCORRECT:
            case Err_ERRCODE_REQUEST_TIMEOUT:
                ErrMsg = "系统时间与北京时间不一致，当前操作存在风险，请您设置后重试！";
                break;
            case Err_ERRCODE_NET_ERROR:
                ErrMsg = "网络异常,请检查网络设置";
                break;
            case Err_ERRCODE_REQUEST_SERVER_FAILED:
                ErrMsg = "远程服务调用失败";
                break;
            case Err_ERRCODE_CLOUD_BACKUP_NONE:
                ErrMsg = "云端无备份记录";
                break;
            case Err_ERRCODE_CARD_NOT_BIND_fail:
                ErrMsg = "安全卡未绑定账号";
                break;
            case Err_ERRCODE_NOBUCKET:
                ErrMsg = "bucket不存在，请与管理员联系";
                break;
			case Err_ERRCODE_NOKEY:
				ErrMsg = "key不存在";
				break;
            case Err_ERRCODE_SOCKET_CLOSED:
                ErrMsg = "请求关闭";
                break;
            case Err_ERRCODE_CANCEL:
                ErrMsg = "取消";
                break;
			case Err_ERRCODE_BACKUP_CANCEL:
				ErrMsg = "备份取消";
				break;
            case Err_ERRCODE_RESTORE_CANCEL:
                ErrMsg = "恢复取消";
                break;
			case Err_ERRCODE_PHOTO_ERROR:
				ErrMsg = "图片错误";
				break;
			case Err_ERRCODE_ACCOUNT_IS_NOT_EXIST:
				ErrMsg = "账户不存在";
				break;
			case Err_ERRCODE_REQUEST_QUEP_ERROR:
				ErrMsg = "获取安通账户KUEP信息出错";
				break;
            case Err_ERRCODE_OTHER_ERROR:
                ErrMsg = "其它错误";
                break;
			default:
				ErrMsg = "未知错误";
				break;
			}
		}

		return ErrMsg;
	}

	/**
	 * 返回错误代码LastError对应的错误信息
	 */
	
	public static void GetErrMsg() {

		ErrMsg=GetErrMsg(LastError);
	}
}
