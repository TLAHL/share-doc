package com.xdja.vwp.project.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xdja.vwp.project.dao.MemberDao;
import com.xdja.vwp.project.entity.Member;
import com.xdja.vwp.project.service.MemberService;

@Service 
@Transactional
public class MemberServiceImpl implements MemberService {
	@Autowired
	private MemberDao memberDao;

	/* (non-Javadoc)
	 * @see com.xdja.vwp.project.service.MemberService#deleteByProjectId(java.lang.Long)
	 */
	@Override
	public void deleteByProjectId(Long id) {
		// TODO Auto-generated method stub
		memberDao.excute("delete from t_member where PROJECT_ID="+id);
	}

	/* (non-Javadoc)
	 * @see com.xdja.vwp.project.service.MemberService#deleteMembers(java.util.List)
	 */
	@Override
	public void deleteMembers(List<Member> members) {
		// TODO Auto-generated method stub
		if(members!=null){
			for (Member member : members) {
				memberDao.delete(member);
			}
		}
	}
	
}
