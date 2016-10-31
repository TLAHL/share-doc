package com.xdja.vwp.school.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="SCHOOL")
public class School {
	@Id   
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id",length=32)
	private Long id;
	@Column
	private String name;
	@Column
	private String place;
	@Column
	private String type;
	@Column
	private String properties;
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
	 * @return the place
	 */
	public String getPlace() {
		return place;
	}
	/**
	 * @param place the place to set
	 */
	public void setPlace(String place) {
		this.place = place;
	}
	/**
	 * @return the type
	 */
	public String getType() {
		return type;
	}
	/**
	 * @param type the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}
	/**
	 * @return the properties
	 */
	public String getProperties() {
		return properties;
	}
	/**
	 * @param properties the properties to set
	 */
	public void setProperties(String properties) {
		this.properties = properties;
	}
	
}
