package com.xdja.vwp.common.interceptor;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class OriginInterceptor implements HandlerInterceptor{
	private static Logger log = LoggerFactory.getLogger(OriginInterceptor.class);

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
			Object handler) throws Exception {
		// TODO Auto-generated method stub
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");  
        response.setHeader("Access-Control-Allow-Methods", "POST");  
        response.setHeader("Allow", "POST");  
//        printLog(request);
		return true;
	}
	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1,
			Object arg2, ModelAndView arg3) throws Exception {
		// TODO Auto-generated method stub
	}
	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse arg1, Object handler, Exception arg3)
			throws Exception {
	}
	private void printLog(HttpServletRequest request){
		Enumeration<String> e= request.getParameterNames();
		StringBuffer parameters=new StringBuffer("parameters:{");
		while(e.hasMoreElements()){
			String paramName=e.nextElement();
			String value=request.getParameter(paramName).toString();
			parameters.append(paramName).append(":").append(value).append(",");
		}
		if(parameters.lastIndexOf(",")==parameters.length()-1)parameters.deleteCharAt(parameters.length()-1);
		parameters.append("}");
		if(parameters.length()>2) log.info(parameters.toString());
	}
	
}
