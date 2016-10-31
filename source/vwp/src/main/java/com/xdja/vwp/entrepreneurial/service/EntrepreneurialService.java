package com.xdja.vwp.entrepreneurial.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.common.util.PageModel;
import com.xdja.vwp.entrepreneurial.entity.EntrepreneurialTeam;

public interface EntrepreneurialService {
	public void save(EntrepreneurialTeam entrepreneurialTeam)throws ServiceException;
	public void modifyExamineState(Long id,Integer state)throws ServiceException;
	public EntrepreneurialTeam loadById(Long id) throws ServiceException;
	public PageModel search(int page,int pageSize,Map<String, Object> conditions,Date startTime,Date endTime)throws ServiceException;
	public List<EntrepreneurialTeam> loadByIds(String downloadIds);

}
