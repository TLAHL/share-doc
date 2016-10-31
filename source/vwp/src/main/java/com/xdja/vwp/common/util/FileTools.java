package com.xdja.vwp.common.util;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.net.URLDecoder;

public class FileTools {
	/**
	 * @throws UnsupportedEncodingException  
	* @Title: getProjectPath 
	* @Description: TODO 获取项目根目录
	* @param @return 
	* @return String 
	* @throws 
	*/ 
	public static String getProjectPath() throws UnsupportedEncodingException{
		File classFile=new File(FileTools.class.getClassLoader().getResource("/").getPath());
		return URLDecoder.decode(classFile.getParentFile().getParent(),"utf-8");
	}
	/** 
	* @Title: getFileBasePath 
	* @Description: TODO 获取文件根目录
	* @param @return 
	* @return String 
	* @throws 
	*/ 
	public static String getFileBasePath(){
		return getServBasePath()+"\\vwp_files";
	}
	/** 
	* @Title: getServBasePath 
	* @Description: TODO 获取服务器webapp根目录
	* @param @return 
	* @return String 
	* @throws 
	*/ 
	public static String getServBasePath(){
		String servBasePath="";
		try {
			File classFile = new File(FileTools.class.getClassLoader().getResource("/").toURI());
			servBasePath=classFile.getParentFile().getParentFile().getParent();
		} catch (URISyntaxException e) {
		}
		return servBasePath;
	}
}
