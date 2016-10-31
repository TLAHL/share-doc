package com.xdja.vwp.user.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="T_USER")
public class User implements Serializable{
	@Id   
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="USER_ID",length=32)
	private Long id;
	/** 
	* @Fields userName : TODO 用户名 
	*/ 
	@Column(unique=true)
	private String userName;
	/** 
	* @Fields passWord : TODO 密码 
	*/ 
	@Column
	private String passWord;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassWord() {
		return passWord;
	}
	public void setPassWord(String passWord) {
		this.passWord = passWord;
	}
	
}
