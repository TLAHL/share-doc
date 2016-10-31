package com.xdja.vwp.school.control;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xdja.vwp.common.control.BaseContorl;
import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.school.entity.School;
import com.xdja.vwp.school.service.SchoolService;

@Controller
@Scope(value="prototype")
@RequestMapping(value="/school")
public class SchoolControl extends BaseContorl{
	@Autowired
	private SchoolService schoolService;

	@ResponseBody
	@RequestMapping(value="/load.do",method=RequestMethod.GET)
	public String loadSchool(@RequestParam String name) throws ServiceException{
		String res=null;
		List<School> school=schoolService.loadByName(name);
		try {
			res = new ObjectMapper().writeValueAsString(school);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			throw new ServiceException("error", "获取学校信息失败");
		}
		return res;
	}
}
