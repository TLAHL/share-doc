package com.xdja.vwp.personal.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="T_PERSONAL")
public class Personal {

	@Id   
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="PERSONAL_ID",length=32)
	private Long id;
	/** 
	* @Fields name : TODO 姓名
	*/ 
	@Column(length=30)
	private String name;
	/** 
	* @Fields sex : TODO 性别
	*/ 
	@Column
	private Integer sex;
	/** 
	* @Fields cardId : TODO 身份证号
	*/ 
	@Column(length=30 ,unique=true)
	private String cardId;
	/** 
	* @Fields school : TODO 学校
	*/ 
	@Column
	private String school;
	/** 
	* @Fields admissionTime : TODO 入学时间
	*/ 
	@Column
	private Date admissionTime;
	/** 
	* @Fields department : TODO 院系
	*/ 
	@Column(length=50)
	private String department;
	/** 
	* @Fields major : TODO 专业
	*/ 
	@Column(length=50)
	private String major;
	/** 
	* @Fields education : TODO 年级
	*/ 
	@Column
	private Integer education;
	/** 
	* @Fields phone : TODO 电话
	*/ 
	@Column(length=20)
	private String phone;
	/** 
	* @Fields email : TODO 邮箱
	*/ 
	@Column(length=50)
	private String email;
	/** 
	* @Fields reward : TODO 所获奖励
	*/ 
	@Column(length=200)
	private String reward;
	/** 
	* @Fields ranking : TODO 成绩排名
	*/ 
	@Column(length=200)
	private String ranking;
	/** 
	* @Fields experience : TODO 培训经历
	*/ 
	@Column(length=500)
	private String experience;
	/** 
	* @Fields computerSkills : TODO 计算机技能
	*/ 
	@Column(length=500)
	private String computerSkills;
	/** 
	* @Fields evaluation : TODO 自我评价
	*/ 
	@Column(length=500)
	private String evaluation;
	/** 
	* @Fields sendTime : TODO 提交时间
	*/ 
	@Column
	private Date sendTime;
	/** 
	* @Fields status : TODO 审阅状态
	*/ 
	@Column
	private Integer status;
	/** 
	* @Fields reviewTime : TODO 审阅时间
	*/ 
	@Column
	private Date reviewTime;
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
	public Integer getSex() {
		return sex;
	}
	public void setSex(Integer sex) {
		this.sex = sex;
	}
	public String getCardId() {
		return cardId;
	}
	public void setCardId(String cardId) {
		this.cardId = cardId;
	}
	public String getSchool() {
		return school;
	}
	public void setSchool(String school) {
		this.school = school;
	}
	public Date getAdmissionTime() {
		return admissionTime;
	}
	public void setAdmissionTime(Date admissionTime) {
		this.admissionTime = admissionTime;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getMajor() {
		return major;
	}
	public void setMajor(String major) {
		this.major = major;
	}
	public Integer getEducation() {
		return education;
	}
	public void setEducation(Integer education) {
		this.education = education;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getReward() {
		return reward;
	}
	public void setReward(String reward) {
		this.reward = reward;
	}
	public String getRanking() {
		return ranking;
	}
	public void setRanking(String ranking) {
		this.ranking = ranking;
	}
	public String getExperience() {
		return experience;
	}
	public void setExperience(String experience) {
		this.experience = experience;
	}
	public String getComputerSkills() {
		return computerSkills;
	}
	public void setComputerSkills(String computerSkills) {
		this.computerSkills = computerSkills;
	}
	public String getEvaluation() {
		return evaluation;
	}
	public void setEvaluation(String evaluation) {
		this.evaluation = evaluation;
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
}
