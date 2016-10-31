package com.xdja.vwp.project.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.common.util.PageModel;
import com.xdja.vwp.project.entity.Project;

public interface ProjectService {
	public void save(Project project)throws ServiceException;
	public void modifyExamineState(Long id,Integer state)throws ServiceException;
	public Project loadById(Long id) throws ServiceException;
	public PageModel search(int page,int pageSize,Map<String, Object> conditions,Date startTime,Date endTime)throws ServiceException;
	public List<Project> loadByIds(String downloadIds);
}
