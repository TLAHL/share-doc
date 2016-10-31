package com.xdja.vwp.sys.control;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xdja.vwp.common.annotation.OpenApi;
import com.xdja.vwp.common.control.BaseContorl;
import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.sys.service.SysParamService;

@Controller
@Scope("prototype")
@RequestMapping(value = "/sys")
public class SystemControl extends BaseContorl{
	@Autowired
	private SysParamService sysParamService;
	@OpenApi
	@ResponseBody
	@RequestMapping(value = "/increaseUserCount.do", method = RequestMethod.POST)
	public String increaseUserCount() throws ServiceException {
		
		return this.successJSON(sysParamService.increaseUserCount());
	}
	@OpenApi
	@ResponseBody
	@RequestMapping(value = "/getUserCount.do", method = RequestMethod.GET)
	public String getUserCount(){
		return this.successJSON(sysParamService.getUserCount());
	} 
}
