package com.xdja.vwp.user.control;

import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xdja.vwp.common.annotation.OpenApi;
import com.xdja.vwp.common.control.BaseContorl;
import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.common.util.StringTools;
import com.xdja.vwp.user.entity.User;
import com.xdja.vwp.user.service.UserService;

@Controller
@Scope("prototype")
@RequestMapping(value="/manage")
public class UserControl extends BaseContorl{
	@Autowired
	private UserService userService;

	@OpenApi
	@ResponseBody
	@RequestMapping(value="/login.do", method = RequestMethod.POST)
	public String login(@RequestBody String datas) throws ServiceException{
		String res=null;
		if(StringTools.isEmpty(datas)) throw new ServiceException("json","用户名或密码不能为空");
		JSONObject jsonObject=JSONObject.fromObject(datas);
		User user=userService.loadUser(jsonObject.getString("userName"), jsonObject.getString("passWord"));
		if(user!=null){
			session.setAttribute("loginUser", user);
			res=this.successJSON();
		} 
		else res=this.errorJSON("login", "登录失败，用户名或密码错误");
		return res;
	}
	@OpenApi
	@ResponseBody
	@RequestMapping(value="/logout.do", method = RequestMethod.POST)
	public String logout(){
		session.removeAttribute("loginUser");
		return this.successJSON();
	}
}
