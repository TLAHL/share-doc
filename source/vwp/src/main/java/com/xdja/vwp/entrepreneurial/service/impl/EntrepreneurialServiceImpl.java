package com.xdja.vwp.entrepreneurial.service.impl;

import java.lang.reflect.InvocationTargetException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

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
import com.xdja.vwp.entrepreneurial.dao.EntrepreneurialDao;
import com.xdja.vwp.entrepreneurial.entity.EntrepreneurialMember;
import com.xdja.vwp.entrepreneurial.entity.EntrepreneurialTeam;
import com.xdja.vwp.entrepreneurial.service.EntrepreneurialMemberService;
import com.xdja.vwp.entrepreneurial.service.EntrepreneurialService;
import com.xdja.vwp.project.entity.Project;

@Service
@Transactional
public class EntrepreneurialServiceImpl implements EntrepreneurialService{
	@Autowired
	private EntrepreneurialDao entrepreneurialDao;
	@Autowired
	private EntrepreneurialMemberService memberService;

	/* (non-Javadoc)
	 * @see com.xdja.vwp.entrepreneurial.service.EntrepreneurialService#save(com.xdja.vwp.entrepreneurial.entity.EntrepreneurialTeam)
	 */
	@Override
	public void save(EntrepreneurialTeam entrepreneurialTeam)
			throws ServiceException {
		// TODO Auto-generated method stub
		EntrepreneurialTeam et=loadByAttributes(entrepreneurialTeam.getName(),entrepreneurialTeam.getContact(),entrepreneurialTeam.getPhone());
		this.checkDatas(entrepreneurialTeam);
		entrepreneurialTeam.setId(null);
		entrepreneurialTeam.setSendTime(new Date());
		entrepreneurialTeam.setStatus(Constants.REVIEW_STATUS_NO);

		if(et!=null){
			entrepreneurialTeam.setId(et.getId());
			try {
				memberService.deleteMembers(et.getMembers());
				PropertyUtils.copyProperties(et, entrepreneurialTeam);
			} catch (IllegalAccessException | InvocationTargetException
					| NoSuchMethodException e) {
				throw new ServiceException();
			}
			et.setReviewTime(null);
			entrepreneurialDao.update(et);
		}else{
			entrepreneurialDao.create(entrepreneurialTeam);
		}
	}

	public EntrepreneurialTeam loadByAttributes(String name,String contact,String phone) throws ServiceException{
		if(StringTools.isEmpty(name)) throw new ServiceException("load", "请输入正确的项目名称");
		if(StringTools.isEmpty(contact)) throw new ServiceException("load", "请输入正确的联系人名称");
		if(StringTools.isEmpty(phone)) throw new ServiceException("load", "请输入正确的联系方式");
		EntrepreneurialTeam entrepreneurialTeam=entrepreneurialDao.getObjectByHQL("from EntrepreneurialTeam where name=? and contact=? and phone=?",new Object[]{name.trim(),contact.trim(),phone.trim()});
		return entrepreneurialTeam;
	}
	/* (non-Javadoc)
	 * @see com.xdja.vwp.entrepreneurial.service.EntrepreneurialService#modifyExamineState(java.lang.Long, java.lang.Integer)
	 */
	@Override
	public void modifyExamineState(Long id, Integer state)
			throws ServiceException {
		// TODO Auto-generated method stub
		EntrepreneurialTeam entrepreneurialTeam=entrepreneurialDao.getObjectById(id);
		if(entrepreneurialTeam==null) throw new ServiceException("examine", "该创业帮报名表不存在");
		if(state==null || (state!=Constants.REVIEW_STATUS_YES && state!=Constants.REVIEW_STATUS_NO))
			throw new ServiceException("examine", "请输入正确的状态值");
		entrepreneurialTeam.setStatus(state);
		entrepreneurialTeam.setReviewTime(new Date());
		entrepreneurialDao.update(entrepreneurialTeam);
	}

	/* (non-Javadoc)
	 * @see com.xdja.vwp.entrepreneurial.service.EntrepreneurialService#loadById(java.lang.Long)
	 */
	@Override
	public EntrepreneurialTeam loadById(Long id) throws ServiceException {
		// TODO Auto-generated method stub
		if(id==null) throw new ServiceException("load", "请输入正确的ID");
		return entrepreneurialDao.getObjectById(id);
	}

	/* (non-Javadoc)
	 * @see com.xdja.vwp.entrepreneurial.service.EntrepreneurialService#search(int, int, java.util.Map, java.util.Date, java.util.Date)
	 */
	@Override
	public PageModel search(int page, int pageSize,
			Map<String, Object> conditions, Date startTime, Date endTime)
			throws ServiceException {
		// TODO Auto-generated method stub
		DetachedCriteria dc=entrepreneurialDao.createDetachedCriteria(conditions);
		if(startTime!=null){
			dc.add(Restrictions.ge("sendTime", startTime));
		}
		if(endTime!=null){
			Calendar endTimeForAfterDay = Calendar.getInstance();
			endTimeForAfterDay.setTime(endTime);
			endTimeForAfterDay.add(Calendar.DATE, 1);
			dc.add(Restrictions.lt("sendTime", endTimeForAfterDay.getTime()));
		}
		return entrepreneurialDao.getPageModelByCriteria(dc, pageSize, page, "sendTime desc");
	}

	/* (non-Javadoc)
	 * @see com.xdja.vwp.entrepreneurial.service.EntrepreneurialService#loadByIds(java.lang.String)
	 */
	@Override
	public List<EntrepreneurialTeam> loadByIds(String downloadIds) {
		// TODO Auto-generated method stub
		String select = "from EntrepreneurialTeam where ENTREPRENEURIAL_TEAM_ID in("+downloadIds+") order by sendTime desc";
		return entrepreneurialDao.getListByHQL(select, null);
	}

	public void checkDatas(EntrepreneurialTeam entrepreneurialTeam)throws ServiceException{
		if(StringTools.isAllEmpty(entrepreneurialTeam.getName()))throw new ServiceException("check","项目名称不能为空");
		if(entrepreneurialTeam.getName().trim().length()>50)throw new ServiceException("check","项目名称不能超过50个字符");

		if(entrepreneurialTeam.getType()==null)throw new ServiceException("check","项目类别不能为空");

		if(StringTools.isAllEmpty(entrepreneurialTeam.getTarget()))throw new ServiceException("check","项目目标不能为空");
		if(entrepreneurialTeam.getTarget().trim().length()>100)throw new ServiceException("check","项目目标不能超过100个字符");
		
		if(StringTools.isAllEmpty(entrepreneurialTeam.getStage()))throw new ServiceException("check","项目阶段不能为空");
		if(entrepreneurialTeam.getStage().trim().length()>100)throw new ServiceException("check","项目阶段不能超过100个字符");

		if(StringTools.isAllEmpty(entrepreneurialTeam.getMajor()))throw new ServiceException("check","专业不能为空");
		if(entrepreneurialTeam.getMajor().trim().length()>50)throw new ServiceException("check","专业不能超过50个字符");
		
		if(StringTools.isAllEmpty(entrepreneurialTeam.getContact()))throw new ServiceException("check","联系人不能为空");
		if(entrepreneurialTeam.getContact().trim().length()>30)throw new ServiceException("check","联系人不能超过30个字符");

		if(StringTools.isAllEmpty(entrepreneurialTeam.getSchool()))throw new ServiceException("check","学校不能为空");
		if(entrepreneurialTeam.getSchool().trim().length()>50)throw new ServiceException("check","学校不能超过50个字符");
		
		if(StringTools.isAllEmpty(entrepreneurialTeam.getCity()))throw new ServiceException("check","所在城市不能为空");
		if(entrepreneurialTeam.getCity().trim().length()>50)throw new ServiceException("check","所在城市不能超过20个字符");
		
		if(entrepreneurialTeam.getEducation()==null)throw new ServiceException("check","年级不能为空");
		
		if(StringTools.isAllEmpty(entrepreneurialTeam.getPhone()))throw new ServiceException("check","电话不能为空");
		if(entrepreneurialTeam.getPhone().trim().length()>20)throw new ServiceException("check","电话不能超过20个字符");

		if(StringTools.isAllEmpty(entrepreneurialTeam.getEmail()))throw new ServiceException("check","邮箱不能为空");
		if(entrepreneurialTeam.getEmail().trim().length()>50)throw new ServiceException("check","邮箱不能超过50个字符");
		
		if(StringTools.isAllEmpty(entrepreneurialTeam.getOverview()))throw new ServiceException("check","项目概述不能为空");
		if(entrepreneurialTeam.getOverview().trim().length()>500)throw new ServiceException("check","项目概述不能超过500个字符");
		
		List<EntrepreneurialMember> members=entrepreneurialTeam.getMembers();
		if(members!=null){
			for (EntrepreneurialMember member : members) {
				member.setEntrepreneurialTeam(entrepreneurialTeam);
				this.checkMember(member);
			}
		}
	}
	public void checkMember(EntrepreneurialMember member) throws ServiceException{
		if(StringTools.isAllEmpty(member.getName()))throw new ServiceException("check","姓名不能为空");
		if(member.getName().trim().length()>30)throw new ServiceException("check","姓名不能超过30个字符");
		
		if(StringTools.isAllEmpty(member.getMajor()))throw new ServiceException("check","专业不能为空");
		if(member.getMajor().trim().length()>50)throw new ServiceException("check","专业不能超过50个字符");
		
		if(StringTools.isAllEmpty(member.getSchool()))throw new ServiceException("check","学校不能为空");
		
		if(member.getEducation()==null)throw new ServiceException("check","年级不能为空");
	}
}
