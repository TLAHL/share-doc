package com.xdja.vwp.common.aspect;

import javax.servlet.http.HttpSession;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.xdja.vwp.common.control.BaseContorl;
import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.user.service.UserService;

@Aspect
@Component
public class LoginAspect extends BaseContorl{
	//配置切入点,该方法无方法体,主要为方便同类中其他方法使用此处配置的切入点
	@Autowired
	private HttpSession session;
	@Autowired
	private UserService userService;
	@Pointcut("! @annotation(com.xdja.vwp.common.annotation.OpenApi)" +
			" && @annotation(org.springframework.web.bind.annotation.RequestMapping)")
	public void aspect(){}
	@Around("aspect()")
	public Object around(ProceedingJoinPoint pjp) throws Throwable {
		Object retVal=null;
		Object userObj=session.getAttribute("loginUser");
		if(userObj!=null){
		    try {
		    	retVal= pjp.proceed(); 
			}catch (Exception e) {
				throw e;
			}
		}else{
			throw new ServiceException("login","操作失败，未登录或不具备相关权限");
		}
	    return retVal;  
	 }
}
