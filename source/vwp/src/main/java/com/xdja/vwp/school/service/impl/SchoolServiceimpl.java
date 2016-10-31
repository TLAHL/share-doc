package com.xdja.vwp.school.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.common.util.StringTools;
import com.xdja.vwp.school.dao.SchoolDao;
import com.xdja.vwp.school.entity.School;
import com.xdja.vwp.school.service.SchoolService;

@Service 
@Transactional
public class SchoolServiceimpl implements SchoolService{
	@Autowired
	private SchoolDao schoolDao;
	/* (non-Javadoc)
	 * @see com.xdja.vwp.school.service.SchoolService#loadByName(java.lang.String)
	 */
	@Override
	public List<School> loadByName(String name) throws ServiceException {
		// TODO Auto-generated method stub
		if(StringTools.isEmpty(name)) throw new ServiceException("load","学校名称不能为空");
		return schoolDao.getListByHQL("from SCHOOL where name like ?", new Object[]{"%"+name+"%"});
	}

}
