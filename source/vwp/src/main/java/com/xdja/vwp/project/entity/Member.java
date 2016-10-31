package com.xdja.vwp.project.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.xdja.vwp.common.util.Constants;
import com.xdja.vwp.common.util.PropertiesManager;

@Entity
@Table(name="T_MEMBER")
public class Member {
	@Id   
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="MEMBER_ID",length=32)
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
	* @Fields school : TODO 学校
	*/ 
	@Column
	private String school;
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
	* @Fields role : TODO 角色
	*/ 
	@Column(length=20)
	private String role;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name="PROJECT_ID", referencedColumnName="PROJECT_ID")
	private Project project;
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
	public String getSchool() {
		return school;
	}
	public void setSchool(String school) {
		this.school = school;
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
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public Project getProject() {
		return project;
	}
	public void setProject(Project project) {
		this.project = project;
	}
	//getter
	public String getSexStr(){
		return Constants.SEX_CONSTANTS.get(this.sex);
	}
	public String getSchoolStr(){
		return this.school==null?"":PropertiesManager.getInstance().getProperty("cons_school", this.school.toString());
	}
	public String getEducationStr(){
		return this.education==null?"":PropertiesManager.getInstance().getProperty("cons_education", this.education.toString());
	}
}
