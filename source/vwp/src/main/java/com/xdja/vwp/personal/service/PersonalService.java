package com.xdja.vwp.personal.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.common.util.PageModel;
import com.xdja.vwp.personal.entity.Personal;

public interface PersonalService {
	public void save(Personal personal)throws ServiceException;
	public Personal loadByCardId(String cardId)throws ServiceException;
	public void checkCardId(String cardId)throws ServiceException;
	public void modifyExamineState(Long id,Integer state)throws ServiceException;
	public Personal loadById(Long id) throws ServiceException;
	public PageModel search(int page,int pageSize,Map<String, Object> conditions,Date startTime,Date endTime)throws ServiceException;
	public List<Personal> loadByIds(String downloadIds);
}
