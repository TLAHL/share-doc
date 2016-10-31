package com.xdja.vwp.common.util;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.xml.bind.PropertyException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class PropertiesManager {
	/** 
	* @Fields propertyFiles : TODO 资源文件集合  ，其中key为文件名称
	*/ 
	private static Map<String,String> propertyPathes;
	private static Map<String,Properties> propertyFiles;
	private Logger log=LoggerFactory.getLogger(this.getClass()); 
	private static PropertiesManager instance=null;
	private PropertiesManager(){
		propertyPathes=new HashMap<String, String>();
		propertyFiles=new HashMap<String, Properties>();
	}
	public static PropertiesManager getInstance(){
		if(instance==null)instance=new PropertiesManager();
		return instance;
	}
	/** 
	* @Title: getProperties
	* @Description: TODO  根据文件名称获取对应资源文件
	* @param @param fileName 文件名称
	* @param @return 
	* @return Properties 
	* @throws 
	*/ 
	public Properties getProperties(String fileName){
		Properties res=propertyFiles.get(fileName);
		if(res==null) res=propertyFiles.put(fileName, new Properties());
		return res;
	}
	/**
	 * @throws PropertyException 
	* @Title: setProperties
	* @Description: TODO  配置资源文件
	* @param @param fileName
	* @param @param realPath 
	* @return void 
	* @throws 
	*/ 
	public void setProperties(String fileName,String realPath) throws PropertyException{
		FileInputStream fis=null;
		try {
			fis=new FileInputStream(realPath);
			Properties prop=new Properties();
			prop.load(fis);
			propertyPathes.put(fileName, realPath);
			propertyFiles.put(fileName, prop);
		}catch (Exception e) {
			throw new PropertyException(fileName+"文件读取失败");
			// TODO: handle exception
		}finally{
			if(fis!=null){
				try {
					fis.close();
					fis=null;
				} catch (IOException e) {
					// TODO Auto-generated catch block
					log.error("资源文件读取时，文件流关闭失败。");
				}
			}
		}
	}
	/** 
	* @Title: getProperty
	* @Description: TODO  根据文件名称和资源文件的属性名获取对应属性值
	* @param @param fileName 文件名称
	* @param @param key 属性值
	* @param @return 
	* @return String 
	* @throws 
	*/ 
	public String getProperty(String fileName,String key){
		String res=null;
		Properties prop=propertyFiles.get(fileName);
		if(prop!=null) res=prop.getProperty(key);
		return res;
	}
	/**
	 * @throws PropertyException  
	* @Title: setProperty
	* @Description: TODO  设置某资源文件的属性 
	* @param @param fileName 文件名称
	* @param @param key 属性名
	* @param @param value 属性值
	* @return void 
	* @throws 
	*/ 
	public void setProperty(String fileName,String key,String value) throws PropertyException{
		String filePath=propertyPathes.get(fileName);
		Properties prop=propertyFiles.get(fileName);
		FileOutputStream oFile=null;
		if(prop!=null&&filePath!=null){
			try{
				prop.setProperty(key,value);
				oFile = new FileOutputStream(filePath);
				prop.store(oFile,null);
			}catch(Exception e){
				throw new PropertyException(fileName+"文件中"+key+"属性存储失败");
			}finally{
				if(oFile!=null){
					try {
						oFile.close();
						oFile=null;
					} catch (IOException e) {
						// TODO Auto-generated catch block
						log.error("资源文件修改时，文件流关闭失败。");
					}
				}
			}
		}
	}
}
