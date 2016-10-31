package com.xdja.vwp.sys.service;

import com.xdja.vwp.sys.entity.SysParam;

public interface SysParamService {
	/** 
	* @Title: save 
	* @Description: TODO  添加一个系统属性，如果该属性已存在，会覆盖原先同名属性的值
	* @param @param name
	* @param @param value 
	* @return void 
	* @throws 
	*/ 
	public void save(String name,String value);
	/** 
	* @Title: get 
	* @Description: TODO 根据名称获取某系统属性
	* @param @param name
	* @param @return 
	* @return SysParam 
	* @throws 
	*/ 
	public SysParam get(String name);
	/** 
	* @Title: remove 
	* @Description: TODO 根据名称移除某系统属性
	* @param @param name 
	* @return void 
	* @throws 
	*/ 
	public void remove(String name);
	/** 
	* @Title: increaseUserCount 
	* @Description: TODO  增加用户统计数量
	* @param @return 
	* @return String 
	* @throws 
	*/ 
	public String increaseUserCount();
	/** 
	* @Title: getUserCount 
	* @Description: TODO 获取用户统计数量
	* @param @return 
	* @return String 
	* @throws 
	*/ 
	public String getUserCount();
}
