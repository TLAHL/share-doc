package com.xdja.vwp.sys.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="T_SYSPARAM")
public class SysParam {
	@Id   
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ROLE_ID",length=32)
	private Long id;
	/** 
	* @Fields name : TODO 参数名称
	*/ 
	@Column(unique=true)
	private String name;
	/** 
	* @Fields value : TODO 参数值
	*/ 
	@Column
	private String value;
	/** 
	* @Fields info : TODO 参数描述
	*/ 
	@Column
	private String info;
	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the value
	 */
	public String getValue() {
		return value;
	}
	/**
	 * @param value the value to set
	 */
	public void setValue(String value) {
		this.value = value;
	}
	/**
	 * @return the info
	 */
	public String getInfo() {
		return info;
	}
	/**
	 * @param info the info to set
	 */
	public void setInfo(String info) {
		this.info = info;
	}
}
