package com.xdja.vwp.entrepreneurial.entity;


import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="T_ENTREPRENEURIAL_TEAM")
public class EntrepreneurialTeam {
	@Id   
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ENTREPRENEURIAL_TEAM_ID",length=32)
	private Long id;
	/** 
	* @Fields name : TODO 名称
	*/ 
	@Column(length=50)
	private String name;
	/** 
	* @Fields type : TODO 类别 
	*/ 
	@Column
	private Integer type;
	/** 
	* @Fields target : TODO 目标方向
	*/ 
	@Column(length=100)
	private String target;
	/** 
	* @Fields major : TODO 专业
	*/ 
	@Column(length=50)
	private String major;
	/** 
	* @Fields stage : TODO 阶段及项目 
	*/ 
	@Column(length=100)
	private String stage;
	/** 
	* @Fields contact : TODO 联系人 
	*/ 
	@Column(length=30)
	private String contact;
	/** 
	* @Fields phone : TODO 电话
	*/ 
	@Column(length=20)
	private String phone;
	/** 
	* @Fields school : TODO 学校 
	*/ 
	@Column
	private String school;
	/** 
	* @Fields city : TODO 所在城市 
	*/ 
	@Column
	private String city;
	/** 
	* @Fields department : TODO 院系
	*/ 
	@Column(length=50)
	private String department;
	/** 
	* @Fields education : TODO 年级
	*/ 
	@Column
	private Integer education;
	/** 
	* @Fields email : TODO 邮箱
	*/ 
	@Column(length=50)
	private String email;
	/** 
	* @Fields overview : TODO 项目概述
	*/ 
	@Column(length=500)
	private String overview;
	/** 
	* @Fields sendtime : TODO 
	*/ 
	@Column
	private Date sendTime;
	/** 
	* @Fields status : TODO 
	*/ 
	@Column
	private Integer status;
	/** 
	* @Fields reviewTime : TODO 
	*/ 
	@Column
	private Date reviewTime;
	
	@OneToMany(mappedBy = "entrepreneurialTeam", cascade = CascadeType.ALL, fetch = FetchType.LAZY)  
	private List<EntrepreneurialMember> members;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public String getTarget() {
		return target;
	}
	public void setTarget(String target) {
		this.target = target;
	}
	/**
	 * @return the major
	 */
	public String getMajor() {
		return major;
	}
	/**
	 * @param major the major to set
	 */
	public void setMajor(String major) {
		this.major = major;
	}
	public String getStage() {
		return stage;
	}
	public void setStage(String stage) {
		this.stage = stage;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getSchool() {
		return school;
	}
	public void setSchool(String school) {
		this.school = school;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public Integer getEducation() {
		return education;
	}
	public void setEducation(Integer education) {
		this.education = education;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getOverview() {
		return overview;
	}
	public void setOverview(String overview) {
		this.overview = overview;
	}
	public Date getSendTime() {
		return sendTime;
	}
	public void setSendTime(Date sendTime) {
		this.sendTime = sendTime;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Date getReviewTime() {
		return reviewTime;
	}
	public void setReviewTime(Date reviewTime) {
		this.reviewTime = reviewTime;
	}
	public List<EntrepreneurialMember> getMembers() {
		return members;
	}
	public void setMembers(List<EntrepreneurialMember> members) {
		this.members = members;
	}
}
