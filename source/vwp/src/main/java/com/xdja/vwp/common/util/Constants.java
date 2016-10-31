package com.xdja.vwp.common.util;

import java.util.HashMap;
import java.util.Map;

public class Constants {
	/** 
	* @Fields REVIEW_STATUS_NO : TODO 审阅状态（未审阅）
	*/ 
	public final static int REVIEW_STATUS_NO = 0;
	/** 
	* @Fields REVIEW_STATUS_YES : TODO 审阅状态（已审阅）
	*/ 
	public final static int REVIEW_STATUS_YES = 1;
	
	/** 
	* @Fields USERCOUNT_NAME : TODO 系统参数名称（用户统计数量）
	*/ 
	public final static String SYS_NAME_USERCOUNT="usercount";

	public final static Map<Integer, String> SEX_CONSTANTS=new HashMap<Integer, String>(){{
		put(0, "男");
		put(1, "女");
		}};
	/** 
	* @Fields EXCLUDES_NULL_PAGES : TODO 无分页参数时的json过滤字段集
	*/ 
	public final static String[] JSON_EXCLUDES_NULL_PAGES=new String[]{"currentPage","pageSize","totalPage","totalRecord","first","last","next","offset","previous"};
	private Constants() {}
}
