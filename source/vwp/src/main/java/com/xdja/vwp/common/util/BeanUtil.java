package com.xdja.vwp.common.util;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.ArrayUtils;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.ContextLoader;

public class BeanUtil {
	private static final Logger log = LoggerFactory.getLogger(BeanUtil.class);
	private static ObjectMapper mapper ;
	private static ApplicationContext context;
	static{
		init();
	}
	private static void init(){
		if(mapper==null)mapper = new ObjectMapper();
		if(context==null)context = ContextLoader.getCurrentWebApplicationContext();
	}
	public static String toJsonStr(Object value) throws Exception{
		return mapper.writeValueAsString(value);
	}
	public static Map<String, Object> jsonToMap(String json) throws JsonParseException, JsonMappingException, IOException{
		return mapper.readValue(json, HashMap.class);
	}
	public static Object getSpringBean(String beanName){
		return context.getBean(beanName);
	}
	public static Object getSpringBean(Class<?> clazz){
		return context.getBean(clazz);
	}
	/** 
	* @Title: copyProperties 
	* @Description: TODO  拷贝相同名称属性的值，包含父类属性
	* @param @param from
	* @param @param to 
	* @return void 
	* @throws 
	*/ 
	public static void copyProperties(Object from, Object to) {
		
		String fileName, str, getName, setName;
		List fields = new ArrayList();
		Method getMethod = null;
		Method setMethod = null;
		try {
			Class c1 = from.getClass();
			Class c2 = to.getClass();
			Field[] fs1 = c1.getDeclaredFields();
			Field[] fs1Super=c1.getSuperclass().getDeclaredFields();
			if(fs1Super!=null&&fs1Super.length>0)
				fs1=(Field[]) ArrayUtils.addAll(fs1, fs1Super);
			Field[] fs2 = c2.getDeclaredFields();
			Field[] fs2Super = c2.getSuperclass().getDeclaredFields();
			if(fs2Super!=null&&fs2Super.length>0)
				fs2=(Field[]) ArrayUtils.addAll(fs2, fs2Super);
			// 两个类属性比较剔除不相同的属性，只留下相同的属性
			for (int i = 0; i < fs2.length; i++) {
				for (int j = 0; j < fs1.length; j++) {
					if (fs1[j].getName().equals(fs2[i].getName())) {
						fields.add(fs1[j]);
						break;
					}
				}
			}
			if (null != fields && fields.size() > 0) {
				for (int i = 0; i < fields.size(); i++) {
					// 获取属性名称
					Field f = (Field) fields.get(i);
					fileName = f.getName();
					// 属性名第一个字母大写
					str = fileName.substring(0, 1).toUpperCase();
					// 拼凑getXXX和setXXX方法名
					getName = "get" + str + fileName.substring(1);
					setName = "set" + str + fileName.substring(1);
					// 获取get、set方法
					getMethod = c1.getMethod(getName, new Class[] {});
					setMethod = c2.getMethod(setName,
							new Class[] { f.getType() });
					// 获取属性值
					Object o = getMethod.invoke(from, new Object[] {});
					// 将属性值放入另一个对象中对应的属性
					if (null != o) {
						setMethod.invoke(to, new Object[] { o });
					}
				}
			}
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
	}
}
