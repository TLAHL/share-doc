package com.xdja.vwp.site.control;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xdja.vwp.common.annotation.OpenApi;
import com.xdja.vwp.common.control.BaseContorl;
import com.xdja.vwp.common.exception.ServiceException;

@Controller
@Scope("prototype")
@RequestMapping(value="/site")
public class SiteControl extends BaseContorl{
	@Autowired
	private HttpServletRequest request;
	@OpenApi
	@ResponseBody
	@RequestMapping(value="/register.do", method = RequestMethod.POST)
	public String register(Integer school) throws ServiceException{
		if(school==null) throw new ServiceException("site","学校不能为空");
		ServletContext context=request.getSession(true).getServletContext();
		context.setAttribute("school", school);
		return this.successJSON();
	}
	@OpenApi
	@ResponseBody
	@RequestMapping(value="/get.do", method = RequestMethod.GET)
	public String get() throws ServiceException{
		ServletContext context=request.getSession(true).getServletContext();
		Object schoolObj=context.getAttribute("school");
		if(schoolObj==null)throw new ServiceException("site","没有站点信息");
		Integer school=(Integer) schoolObj;
		return this.successJSON(school.toString());
	}
}
