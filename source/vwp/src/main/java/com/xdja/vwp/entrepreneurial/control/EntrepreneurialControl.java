package com.xdja.vwp.entrepreneurial.control;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.ezmorph.object.DateMorpher;
import net.sf.json.JSONObject;
import net.sf.json.util.JSONUtils;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.ser.impl.SimpleBeanPropertyFilter;
import org.codehaus.jackson.map.ser.impl.SimpleFilterProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.xdja.vwp.common.annotation.OpenApi;
import com.xdja.vwp.common.control.BaseContorl;
import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.common.util.Constants;
import com.xdja.vwp.common.util.PageModel;
import com.xdja.vwp.common.util.StringTools;
import com.xdja.vwp.entrepreneurial.entity.EntrepreneurialMember;
import com.xdja.vwp.entrepreneurial.entity.EntrepreneurialTeam;
import com.xdja.vwp.entrepreneurial.model.EntrepreneurialZipView;
import com.xdja.vwp.entrepreneurial.service.EntrepreneurialService;

@Controller
@Scope("prototype")
@RequestMapping(value="/entrepreneurial")
public class EntrepreneurialControl extends BaseContorl{
	@Autowired
	private EntrepreneurialService entrepreneurialService;
	@ResponseBody
	@RequestMapping(value="/search.do",method=RequestMethod.GET)
	public String search(String name,@DateTimeFormat(pattern="yyyy-MM-dd") Date startTime,
			@DateTimeFormat(pattern="yyyy-MM-dd") Date endTime,
			String school,Integer type,Integer education,Integer status,
			@RequestParam(defaultValue="0")Integer currentPage,@RequestParam(defaultValue="0")Integer pageSize) throws ServiceException{
		String res=null;
		Map<String , Object> conditions=new HashMap<String, Object>();
		if(!StringTools.isAllEmpty(name)){
			Map<String, Object> orMap=new HashMap<String, Object>();
			orMap.put("name", "%"+name+"%");	
			orMap.put("contact", "%"+name+"%");	
			orMap.put("school", "%"+name+"%");	
			conditions.put("or", orMap);
		}
		if(!StringTools.isAllEmpty(school))conditions.put("school", "%"+school+"%");
		if(type!=null)conditions.put("type",type);
		if(education!=null)conditions.put("education",education);
		if(status!=null)conditions.put("status",education);
		PageModel pageModel=entrepreneurialService.search(currentPage, pageSize, conditions,startTime,endTime);
		try {
			ObjectMapper objectMapper=new ObjectMapper();
	        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd"));
	        SimpleFilterProvider filterProvider = new SimpleFilterProvider();
	        if(pageModel.getCurrentPage()<1||pageModel.getPageSize()<1){
	        	filterProvider.addFilter("nullPageFilter",  
		                SimpleBeanPropertyFilter.serializeAllExcept(Constants.JSON_EXCLUDES_NULL_PAGES));
	        }else{
	        	filterProvider.addFilter("nullPageFilter",  
	                SimpleBeanPropertyFilter.serializeAllExcept(new String[]{}));  
	        }
	        objectMapper.setFilters(filterProvider);  
			res=this.successJSON(objectMapper.writeValueAsString(pageModel));
		} catch (Exception e) {
			throw new ServiceException("json", "json数据格式异常");
		}
		return res;
	}
	@OpenApi
	@ResponseBody
	@RequestMapping(value="/save.do",method=RequestMethod.POST)
	public String save(@RequestBody String datas) throws ServiceException{
		if(StringTools.isEmpty(datas)) throw new ServiceException("json","没有要保存的数据");
		JSONUtils.getMorpherRegistry().registerMorpher(new DateMorpher(new String[] {"yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss"}));
		JSONObject jsonObject=JSONObject.fromObject(datas);
		Map<String , Class> innerClasses=new HashMap<String, Class>();
		innerClasses.put("members", EntrepreneurialMember.class);
		EntrepreneurialTeam entrepreneurialTeam=(EntrepreneurialTeam) JSONObject.toBean(jsonObject, EntrepreneurialTeam.class,innerClasses);
		entrepreneurialService.save(entrepreneurialTeam);
		return this.successJSON();
	}
	@ResponseBody
	@RequestMapping(value="/modifyExamineState.do",method=RequestMethod.POST)
	public String modifyExamineState(@RequestParam Long id,@RequestParam Integer state) throws ServiceException{
		entrepreneurialService.modifyExamineState(id, state);
		return this.successJSON();
	}
	
	@ResponseBody
	@RequestMapping(value="/load.do",method=RequestMethod.GET)
	public String load(@RequestParam Long id) throws ServiceException{
		String res=null;
		EntrepreneurialTeam entrepreneurialTeam=entrepreneurialService.loadById(id);
		if(entrepreneurialTeam==null) throw new ServiceException("load", "您所查询的创业帮报名信息不存在");
		try {
			ObjectMapper objectMapper=new ObjectMapper();
	        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd"));
			res=this.successJSON(objectMapper.writeValueAsString(entrepreneurialTeam));
		} catch (Exception e) {
			throw new ServiceException("json", "json数据格式异常");
		}
		return res;
	}
	@RequestMapping(value="/zipDownload.do",method=RequestMethod.GET)
	public ModelAndView zipDownload(@RequestParam String downloadIds) throws ServiceException{
		if(StringTools.isAllEmpty(downloadIds)) throw new ServiceException("ids","没有要下载的数据");
		if(!downloadIds.matches("(\\d+,)*\\d+")) throw new ServiceException("ids","请输入正确的ID集合");
		List<EntrepreneurialTeam> list=entrepreneurialService.loadByIds(downloadIds);
		if(list==null||list.size()<1) throw new ServiceException("ids","没有要下载的数据");
		EntrepreneurialZipView zipView=new EntrepreneurialZipView("创业帮报名表资料",list);
		return new ModelAndView(zipView);
	}
}
