package com.xdja.vwp.entrepreneurial.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xdja.vwp.entrepreneurial.dao.EntrepreneurialDao;
import com.xdja.vwp.entrepreneurial.dao.EntrepreneurialMemberDao;
import com.xdja.vwp.entrepreneurial.entity.EntrepreneurialMember;
import com.xdja.vwp.entrepreneurial.service.EntrepreneurialMemberService;
import com.xdja.vwp.project.entity.Member;

@Service
@Transactional
public class EntrepreneurialMemberServiceImple implements
		EntrepreneurialMemberService {
	@Autowired
	private EntrepreneurialMemberDao entrepreneurialMemberDao;

	@Override
	public void deleteMembers(List<EntrepreneurialMember> members) {
		// TODO Auto-generated method stub
		if(members!=null){
			for (EntrepreneurialMember member : members) {
				entrepreneurialMemberDao.delete(member);
			}
		}
	}

}
