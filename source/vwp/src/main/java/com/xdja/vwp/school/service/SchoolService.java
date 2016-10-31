package com.xdja.vwp.school.service;

import java.util.List;

import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.school.entity.School;

public interface SchoolService {
	public List<School> loadByName(String name) throws ServiceException;
}
