package com.xdja.vwp.project.service;

import java.util.List;

import com.xdja.vwp.project.entity.Member;

public interface MemberService {
	public void deleteByProjectId(Long id);
	public void deleteMembers(List<Member> members);
}
