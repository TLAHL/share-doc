package com.xdja.vwp.user.service;

import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.user.entity.User;

public interface UserService {
	public User loadUser(String userName,String passWord) throws ServiceException;
}
