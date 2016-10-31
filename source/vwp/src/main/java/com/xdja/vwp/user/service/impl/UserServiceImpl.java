package com.xdja.vwp.user.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xdja.vwp.common.exception.ServiceException;
import com.xdja.vwp.common.util.StringTools;
import com.xdja.vwp.user.dao.UserDao;
import com.xdja.vwp.user.entity.User;
import com.xdja.vwp.user.service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService{
	
	@Autowired
	private UserDao userDao;
	@Override
	public User loadUser(String userName, String passWord) throws ServiceException {
		// TODO Auto-generated method stub
		User user=null;
		if(StringTools.isEmpty(userName)||StringTools.isEmpty(passWord)) throw new ServiceException("用户名或密码不能为空");
		String select="from User where userName=?";
		user=userDao.getObjectByHQL(select, new Object[]{userName});
		if(user!=null){
			if(!StringTools.encode("MD5",passWord).equals(user.getPassWord()))user=null;
		}
		return user;
	}

}
