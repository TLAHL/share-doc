package com.xdja.vwp.project.service.impl;

import java.lang.reflect.InvocationTargetException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import net.sf.cglib.beans.BeanCopier;

import org.apache.commons.beanutils.PropertyUtils;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.common.util.Constants;
import com.xdja.vwp.common.util.PageModel;
import com.xdja.vwp.common.util.StringTools;
import com.xdja.vwp.personal.entity.Personal;
import com.xdja.vwp.project.dao.MemberDao;
import com.xdja.vwp.project.dao.ProjectDao;
import com.xdja.vwp.project.entity.Member;
import com.xdja.vwp.project.entity.Project;
import com.xdja.vwp.project.service.MemberService;
import com.xdja.vwp.project.service.ProjectService;

@Service 
@Transactional
public class ProjectServiceImpl implements ProjectService{
	@Autowired
	private ProjectDao projectDao;
	@Autowired
	private MemberService memberService;

	@Override
	public void save(Project project) throws ServiceException {
		// TODO Auto-generated method stub
		this.checkDatas(project);
		Project po=loadByAttributes(project.getName(),project.getContact(),project.getPhone());
		project.setId(null);
		project.setSendTime(new Date());
		project.setStatus(Constants.REVIEW_STATUS_NO);

		if(po!=null){
			project.setId(po.getId());
			try {
				memberService.deleteMembers(po.getMembers());
				PropertyUtils.copyProperties(po, project);
			} catch (IllegalAccessException | InvocationTargetException
					| NoSuchMethodException e) {
				throw new ServiceException();
			}
			po.setReviewTime(null);
			projectDao.update(po);
		}else{
			projectDao.create(project);
		}
	}
	@Override
	public void modifyExamineState(Long id, Integer state)
			throws ServiceException {
		Project project=projectDao.getObjectById(id);
		if(project==null) throw new ServiceException("examine", "该项目报名表不存在");
		if(state==null || (state!=Constants.REVIEW_STATUS_YES && state!=Constants.REVIEW_STATUS_NO))
			throw new ServiceException("examine", "请输入正确的状态值");
		project.setStatus(state);
		project.setReviewTime(new Date());
		projectDao.update(project);
	}
	@Override
	public Project loadById(Long id) throws ServiceException {
		// TODO Auto-generated method stub
		if(id==null) throw new ServiceException("loadProject", "请输入正确的ID");
		return projectDao.getObjectById(id);
	}
	public Project loadByAttributes(String name,String contact,String phone) throws ServiceException{
		if(StringTools.isEmpty(name)) throw new ServiceException("load", "请输入正确的项目名称");
		if(StringTools.isEmpty(contact)) throw new ServiceException("load", "请输入正确的联系人名称");
		if(StringTools.isEmpty(phone)) throw new ServiceException("load", "请输入正确的联系方式");
		Project project=projectDao.getObjectByHQL("from Project where name=? and contact=? and phone=?",new Object[]{name.trim(),contact.trim(),phone.trim()});
		return project;
	}
	@Override
	public PageModel search(int page, int pageSize,
			Map<String, Object> conditions, Date startTime, Date endTime)
			throws ServiceException {
		// TODO Auto-generated method stub
		DetachedCriteria dc=projectDao.createDetachedCriteria(conditions);
		if(startTime!=null){
			dc.add(Restrictions.ge("sendTime", startTime));
		}
		if(endTime!=null){
			Calendar endTimeForAfterDay = Calendar.getInstance();
			endTimeForAfterDay.setTime(endTime);
			endTimeForAfterDay.add(Calendar.DATE, 1);
			dc.add(Restrictions.lt("sendTime", endTimeForAfterDay.getTime()));
		}
		return projectDao.getPageModelByCriteria(dc, pageSize, page, "sendTime desc");
	}
	
	@Override
	public List<Project> loadByIds(String downloadIds) {
		// TODO Auto-generated method stub
		String select = "from Project where PROJECT_ID in("+downloadIds+") order by sendTime desc";
		return projectDao.getListByHQL(select, null);
	}
	public void checkDatas(Project project)throws ServiceException{
		if(StringTools.isAllEmpty(project.getName()))throw new ServiceException("check","项目名称不能为空");
		if(project.getName().trim().length()>50)throw new ServiceException("check","项目名称不能超过50个字符");

//		if(project.getType()==null)throw new ServiceException("check","项目类别不能为空");
//
//		if(StringTools.isAllEmpty(project.getTarget()))throw new ServiceException("check","项目目标不能为空");
//		if(project.getTarget().trim().length()>100)throw new ServiceException("check","项目目标不能超过100个字符");
//		
//		if(StringTools.isAllEmpty(project.getStage()))throw new ServiceException("check","项目阶段不能为空");
//		if(project.getStage().trim().length()>100)throw new ServiceException("check","项目阶段不能超过100个字符");

		if(StringTools.isAllEmpty(project.getMajor()))throw new ServiceException("check","专业不能为空");
		if(project.getMajor().trim().length()>50)throw new ServiceException("check","专业不能超过50个字符");
		
		if(StringTools.isAllEmpty(project.getContact()))throw new ServiceException("check","联系人不能为空");
		if(project.getContact().trim().length()>30)throw new ServiceException("check","联系人不能超过30个字符");

		if(StringTools.isAllEmpty(project.getSchool()))throw new ServiceException("check","学校不能为空");
		if(project.getSchool().trim().length()>50)throw new ServiceException("check","学校不能超过50个字符");
		
		if(StringTools.isAllEmpty(project.getCity()))throw new ServiceException("check","所在城市不能为空");
		if(project.getCity().trim().length()>50)throw new ServiceException("check","所在城市不能超过50个字符");
		
		if(project.getEducation()==null)throw new ServiceException("check","年级不能为空");
		
		if(StringTools.isAllEmpty(project.getPhone()))throw new ServiceException("check","电话不能为空");
		if(project.getPhone().trim().length()>20)throw new ServiceException("check","电话不能超过20个字符");

		if(StringTools.isAllEmpty(project.getEmail()))throw new ServiceException("check","邮箱不能为空");
		if(project.getEmail().trim().length()>50)throw new ServiceException("check","邮箱不能超过50个字符");
		
		if(StringTools.isAllEmpty(project.getOverview()))throw new ServiceException("check","项目概述不能为空");
		if(project.getOverview().trim().length()>500)throw new ServiceException("check","项目概述不能超过500个字符");
		
		List<Member> members=project.getMembers();
		if(members!=null){
			for (Member member : members) {
				member.setProject(project);
				this.checkMember(member);
			}
		}
	}
	public void checkMember(Member member) throws ServiceException{
		if(StringTools.isAllEmpty(member.getName()))throw new ServiceException("check","姓名不能为空");
		if(member.getName().trim().length()>30)throw new ServiceException("check","姓名不能超过30个字符");
		
		if(StringTools.isAllEmpty(member.getMajor()))throw new ServiceException("check","专业不能为空");
		if(member.getMajor().trim().length()>50)throw new ServiceException("check","专业不能超过50个字符");
		
		if(StringTools.isAllEmpty(member.getSchool()))throw new ServiceException("check","学校不能为空");
		
		if(member.getEducation()==null)throw new ServiceException("check","年级不能为空");
	}
}
