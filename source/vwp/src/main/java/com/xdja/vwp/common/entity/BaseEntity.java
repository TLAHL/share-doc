package com.xdja.vwp.common.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
@MappedSuperclass
public abstract class BaseEntity implements Serializable {
	
    /** 
    * @Fields id : TODO 主键，采用UUID作为主键生成策略
    */ 
    @Id   
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ID",length=32)
    protected Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
    
}
