package com.xdja.vwp.sys.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xdja.vwp.common.util.Constants;
import com.xdja.vwp.common.util.StringTools;
import com.xdja.vwp.sys.dao.SysParamDao;
import com.xdja.vwp.sys.entity.SysParam;
import com.xdja.vwp.sys.service.SysParamService;

@Service
@Transactional
public class SysParamServiceImpl implements SysParamService{
	@Autowired
	private SysParamDao sysParamDao;
	/* (non-Javadoc)
	 * @see com.xdja.vback.sys.service.SysParamService#save(java.lang.String, java.lang.String)
	 */
	@Override
	public void save(String name, String value) {
		// TODO Auto-generated method stub
		SysParam entity=this.get(name);
		if(entity==null){
			entity=new SysParam();
			entity.setName(name);
		}
		entity.setValue(value);
		sysParamDao.create(entity);
	}
	@Override
	public String increaseUserCount(){
		long userCount=1l;
		SysParam usercountParam=this.get(Constants.SYS_NAME_USERCOUNT);
		if(usercountParam!=null&&!StringTools.isEmpty(usercountParam.getValue()))userCount=Long.parseLong(usercountParam.getValue())+1;
		this.save(Constants.SYS_NAME_USERCOUNT, String.valueOf(userCount));
		return String.valueOf(userCount);
	}
	@Override
	public String getUserCount(){
		SysParam usercountParam=this.get(Constants.SYS_NAME_USERCOUNT);
		return StringTools.isEmpty(usercountParam.getValue())==null?"0":usercountParam.getValue();
	}
	/* (non-Javadoc)
	 * @see com.xdja.vback.sys.service.SysParamService#get(java.lang.String)
	 */
	@Override
	public SysParam get(String name) {
		// TODO Auto-generated method stub
		return sysParamDao.getObjectByHQL("from SysParam where name =?", new Object[]{name});
	}

	/* (non-Javadoc)
	 * @see com.xdja.vback.sys.service.SysParamService#remove(java.lang.String)
	 */
	@Override
	public void remove(String name) {
		// TODO Auto-generated method stub
		SysParam entity=this.get(name);
		if(entity!=null)sysParamDao.delete(entity);
	}
}
