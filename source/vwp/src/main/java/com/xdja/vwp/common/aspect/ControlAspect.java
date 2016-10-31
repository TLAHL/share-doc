package com.xdja.vwp.common.aspect;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONException;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.xdja.vwp.common.control.BaseContorl;
import com.xdja.vwp.common.exception.ServiceException;

@Aspect
@Component
public class ControlAspect extends BaseContorl{
	@Autowired
	private HttpServletRequest request;
	public ControlAspect() throws ServiceException {
		super();
		// TODO Auto-generated constructor stub
	}
	private static Logger log= LoggerFactory.getLogger(BaseContorl.class);
	//配置切入点,该方法无方法体,主要为方便同类中其他方法使用此处配置的切入点
	@Pointcut("execution(* com.xdja.vwp.*.control..*.*(..)) && @annotation(org.springframework.web.bind.annotation.ResponseBody)")
	public void aspect(){	}
	@Pointcut("execution(* com.xdja.vwp.*.control..*.*(..)) && ! @annotation(org.springframework.web.bind.annotation.ResponseBody) ")
	public void aspectModelAndView(){	}
	@Around("aspect()")
	public Object around(ProceedingJoinPoint pjp) throws Throwable {  
	    Object retVal=null;
	    try {
	    	retVal= pjp.proceed(); 
		}catch(JSONException jsone){
			retVal=this.errorJSON("json", "json数据格式异常");
			log.info(getErrSource(jsone)+"jsonError:"+jsone.getMessage());
		} catch(ServiceException se){
			retVal=this.errorJSON(se.getErrName(), se.getMessage());
			log.info(getErrSource(se)+se.getMessage());
		}catch (Exception e) {
			retVal=this.errorJSON("error", "处理异常");
			log.error(getErrSource(e)+e.getMessage());
		}
	    return retVal;  
	 }
	@Around("aspectModelAndView()")
	public Object aroundModelAndView(ProceedingJoinPoint pjp) throws Throwable {  
	    Object retVal=null;
	    RedirectView rw=new RedirectView("/vwp/pages/404.html");
		Map<String,Object> datas=new HashMap<String, Object>();
	    try {
	    	retVal= pjp.proceed(); 
		}catch(JSONException jsone){
//			datas.put("json", "json数据格式异常");
			retVal=new ModelAndView(rw,datas);
			log.info(getErrSource(jsone)+"jsonError:"+jsone.getMessage());
		} catch(ServiceException se){
//			MappingJackson2JsonView jsonView=new MappingJackson2JsonView();
//			Map<String, String>  attMap=new HashMap<String, String>();
//			attMap.put("ids", "请输入正确的ID集合");
//			jsonView.setAttributesMap(attMap);
//			datas.put("errValue", se.getErrValue());
			retVal=new ModelAndView(rw,datas);
			log.info(getErrSource(se)+se.getMessage());
		}catch (Exception e) {
//			datas.put("error", "处理异常");
			retVal=new ModelAndView(rw,datas);
			log.error(getErrSource(e)+e.getMessage());
		}
	    return retVal;  
	 }
	public String getErrSource(Exception e){
		StringBuffer errSource=new StringBuffer();
		StackTraceElement[] sts=e.getStackTrace();
		if(sts!=null&&sts.length>0){
			String className=sts[0].getClassName();
			String methodName=sts[0].getMethodName();
			int line= sts[0].getLineNumber();
			errSource.append("[");
			errSource.append(className);
			errSource.append(".").append(methodName);
			errSource.append(":").append(line);
			errSource.append("]");
		}
		return errSource.toString();
	}
}
