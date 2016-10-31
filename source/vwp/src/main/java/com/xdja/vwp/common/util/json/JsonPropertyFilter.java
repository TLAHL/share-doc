package com.xdja.vwp.common.util.json;

import net.sf.json.util.PropertyFilter;

/** 
* @ClassName: JsonPropertyFilter 
* @Description: TODO 数据为空时不添加到json串中
* @author liutao
* @date 2016-3-10 上午9:15:46  
*/ 
public class JsonPropertyFilter implements PropertyFilter{
	@Override
	public boolean apply(Object source, String name, Object value) {
		// TODO Auto-generated method stub
		return value==null;
	}
}
