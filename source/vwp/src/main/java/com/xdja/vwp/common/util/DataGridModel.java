package com.xdja.vwp.common.util;

public class DataGridModel  implements java.io.Serializable {
	
	private static final long serialVersionUID = 7232798260610351343L;
	/** 
	* @Fields page : TODO 当前页,名字必须为page
	*/ 
	private int page;
	/** 
	* @Fields rows : TODO 每页大小,名字必须为rows
	*/ 
	private int rows ;
	/** 
	* @Fields sort : TODO 排序字段
	*/ 
	private String sort;
	/** 
	* @Fields order : TODO 排序规则
	*/ 
	private String order;
	public int getPage() {
		return page;
	}
	public void setPage(int page) {
		this.page = page;
	}
	public int getRows() {
		return rows;
	}
	public void setRows(int rows) {
		this.rows = rows;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	public String getOrder() {
		return order;
	}
	public void setOrder(String order) {
		this.order = order;
	}
	
	
}
