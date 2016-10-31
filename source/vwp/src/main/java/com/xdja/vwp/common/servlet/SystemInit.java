package com.xdja.vwp.common.servlet;

import java.util.Enumeration;

import javax.servlet.http.HttpServlet;
import javax.xml.bind.PropertyException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.xdja.vwp.common.util.PropertiesManager;

public class SystemInit extends HttpServlet {
	/** 
	* @Fields serialVersionUID : TODO 
	*/ 
	
	private static final long serialVersionUID = 1L;
	private static String classPath=null;
	private Logger log=LoggerFactory.getLogger(this.getClass()); 
	public void init(){
		try {
			classPath=getServletContext().getRealPath("/");
			loadProperties();
			log.info("System initialization is complated...");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("System initialization is abnormal...");
			log.error(e.getMessage());
		}
	}
	/** 
	* @Title: loadProperties 
	* @Description: TODO 读取资源文件
	* @param  
	* @return void 
	* @throws 
	*/ 
	@SuppressWarnings("unchecked")
	private void loadProperties(){
		Enumeration<String> initParameterNames=this.getInitParameterNames();
		while(initParameterNames.hasMoreElements()){
			String fileName=initParameterNames.nextElement();
			try {
				PropertiesManager.getInstance().setProperties(fileName, classPath+getInitParameter(fileName));
			} catch (PropertyException e) {
				// TODO Auto-generated catch block
				log.error("Resource file load failed："+fileName);
			}
		}
		log.info("Resource file load complated...");
	}
}
