package com.xdja.vwp.personal.service.impl;

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
import com.xdja.vwp.personal.dao.PersonalDao;
import com.xdja.vwp.personal.entity.Personal;
import com.xdja.vwp.personal.service.PersonalService;

@Service 
@Transactional
public class PersonalServcieImpl implements PersonalService{
	@Autowired
	PersonalDao personalDao;

	@Override
	public void save(Personal personal)throws ServiceException {
		// TODO Auto-generated method stub
		this.checkDatas(personal);
		Personal pl=loadByCardId(personal.getCardId());
//		checkSendTime(pl);
		personal.setId(null);
		personal.setSendTime(new Date());
		personal.setStatus(Constants.REVIEW_STATUS_NO);
		
		if(pl!=null){//cardid重复时覆盖对象
			personal.setId(pl.getId());
			try {
				PropertyUtils.copyProperties(pl, personal);
			} catch (IllegalAccessException | InvocationTargetException
					| NoSuchMethodException e) {
				throw new ServiceException();
			}
			pl.setReviewTime(null);
			personalDao.update(pl);
		}else{
			personalDao.create(personal);
		}
	}
	@Override
	public Personal loadByCardId(String cardId) throws ServiceException {
		// TODO Auto-generated method stub
		if(StringTools.isAllEmpty(cardId))throw new ServiceException("cardId","身份证号不能为空");
		Personal personal=personalDao.getObjectByHQL("from Personal where cardId=?",new Object[]{cardId.trim()});
		return personal;
	}
	@Override
	public void checkCardId(String cardId) throws ServiceException {
		// TODO Auto-generated method stub
		if(StringTools.isAllEmpty(cardId))throw new ServiceException("check","身份证号不能为空");
		if(cardId.trim().length()>30)throw new ServiceException("check","身份证号不能超过30个字符");
		
//		Personal personal=loadByCardId(cardId);
//		checkSendTime(personal);
	}
	public void checkSendTime(Personal personal) throws ServiceException {
		if(personal!=null){
			String sendTime=StringTools.formatDate(personal.getSendTime());
			String nowTime=StringTools.formatDate(new Date());
			if(nowTime.equals(sendTime)) throw new ServiceException("cardId","对不起，今日提交次数已用完。");
		}
	}
	
	@Override
	public void modifyExamineState(Long id, Integer state) throws ServiceException {
		// TODO Auto-generated method stub
		Personal personal=personalDao.getObjectById(id);
		if(personal==null) throw new ServiceException("examine", "该个人报名表不存在");
		if(state==null || (state!=Constants.REVIEW_STATUS_YES && state!=Constants.REVIEW_STATUS_NO))
			throw new ServiceException("examine", "请输入正确的状态值");
		personal.setStatus(state);
		personal.setReviewTime(new Date());
		personalDao.update(personal);
	}
	@Override
	public Personal loadById(Long id) throws ServiceException {
		// TODO Auto-generated method stub
		if(id==null) throw new ServiceException("loadPersonal", "请输入正确的ID");
		return personalDao.getObjectById(id);
	}
	
	@Override
	public PageModel search(int page,int pageSize,Map<String, Object> conditions,Date startTime,Date endTime) throws ServiceException {
		// TODO Auto-generated method stub
		DetachedCriteria dc=personalDao.createDetachedCriteria(conditions);
		if(startTime!=null){
			dc.add(Restrictions.ge("sendTime", startTime));
		}
		if(endTime!=null){
			Calendar endTimeForAfterDay = Calendar.getInstance();
			endTimeForAfterDay.setTime(endTime);
			endTimeForAfterDay.add(Calendar.DATE, 1);
			dc.add(Restrictions.lt("sendTime", endTimeForAfterDay.getTime()));
		}
		return personalDao.getPageModelByCriteria(dc, pageSize, page, "sendTime desc");
	}
	@Override
	public List<Personal> loadByIds(String downloadIds) {
		// TODO Auto-generated method stub
		String select = "from Personal where PERSONAL_ID in("+downloadIds+") order by sendTime desc";
		return personalDao.getListByHQL(select, null);
	}
	public void checkDatas(Personal personal)throws ServiceException{
		if(StringTools.isAllEmpty(personal.getName()))throw new ServiceException("check","姓名不能为空");
		if(personal.getName().trim().length()>30)throw new ServiceException("check","姓名不能超过30个字符");
		
		if(StringTools.isAllEmpty(personal.getCardId()))throw new ServiceException("check","身份证号不能为空");
		if(personal.getCardId().trim().length()>30)throw new ServiceException("check","身份证号不能超过30个字符");
		
		if(StringTools.isAllEmpty(personal.getSchool()))throw new ServiceException("check","学校不能为空");
		if(personal.getSchool().trim().length()>50)throw new ServiceException("check","学校不能超过50个字符");
		
		if(StringTools.isAllEmpty(personal.getMajor()))throw new ServiceException("check","专业不能为空");
		if(personal.getMajor().trim().length()>50)throw new ServiceException("check","专业不能超过50个字符");
		
		if(personal.getEducation()==null)throw new ServiceException("check","年级不能为空");
		
		if(StringTools.isAllEmpty(personal.getPhone()))throw new ServiceException("check","电话不能为空");
		if(personal.getPhone().trim().length()>20)throw new ServiceException("check","电话不能超过20个字符");
		
		if(StringTools.isAllEmpty(personal.getEmail()))throw new ServiceException("check","邮箱不能为空");
		if(personal.getEmail().trim().length()>50)throw new ServiceException("check","邮箱不能超过50个字符");
		
		if(StringTools.isAllEmpty(personal.getComputerSkills()))throw new ServiceException("check","计算机技能不能为空");
		if(personal.getComputerSkills().trim().length()>500)throw new ServiceException("check","计算机技能不能超过500个字符");
		
		if(StringTools.isAllEmpty(personal.getEvaluation()))throw new ServiceException("check","自我评价不能为空");
		if(personal.getEvaluation().trim().length()>500)throw new ServiceException("check","自我评价不能超过500个字符");
	}
	
}
