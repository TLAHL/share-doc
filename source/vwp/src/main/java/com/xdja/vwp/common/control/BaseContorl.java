package com.xdja.vwp.common.control;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;

public abstract class BaseContorl {
	@Autowired
	protected HttpSession session;
	@Autowired
	protected HttpServletResponse response;
	/** 
	* @Fields errors : TODO 错误信息集合
	*/ 
	protected Map<String , String > errors=new HashMap<String, String>();
	public String errorJSON(String errorName,String errorValue){
		StringBuffer resJSON=new StringBuffer();
		resJSON.append("{");
		resJSON.append("\"result\":\"error\"");
		resJSON.append(",");
		resJSON.append("\"errName\":\"").append(errorName).append("\"");
		resJSON.append(",");
		resJSON.append("\"errValue\":\"").append(errorValue).append("\"");
		resJSON.append("}");
		return resJSON.toString();
	}
	public String errorJSON(){
		String errorName="error";
		String errorValue="error";
		Iterator<String> i=errors.keySet().iterator();
		if(i.hasNext()){
			errorName=i.next();
			errorValue=errors.get(errorName);
		}
		return errorJSON(errorName,errorValue);
	}
	public String successJSON(){
		StringBuffer resJSON=new StringBuffer();
		resJSON.append("{");
		resJSON.append("\"result\":\"success\"");
		resJSON.append("}");
		return resJSON.toString();
	}
	public String successJSON(String value){
		StringBuffer resJSON=new StringBuffer();
		resJSON.append("{");
		resJSON.append("\"result\":\"success\"");
		resJSON.append(",");
		resJSON.append("\"value\":").append(value).append("");
		resJSON.append("}");
		return resJSON.toString();
	}
	public String loadRequstBody(HttpServletRequest request) throws IOException{
		BufferedReader in = new BufferedReader(new InputStreamReader(
				request.getInputStream()));
		StringBuffer sb = new StringBuffer();
		String line = null;
		while ((line = in.readLine()) != null) {
			sb.append(line);
		}
		return sb.toString();
	}
}
