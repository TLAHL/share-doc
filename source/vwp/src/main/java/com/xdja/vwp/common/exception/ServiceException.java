package com.xdja.vwp.common.exception;

public class ServiceException extends Exception {

	/** 
	* @Fields serialVersionUID : TODO 
	*/ 
	private String errName="error";
	private String errValue;
	private static final long serialVersionUID = 1L;
	public ServiceException(){
		super();
	}
	public ServiceException(String info){
		super(info);
		this.errValue=info;
	}
	public ServiceException(String code,String info){
		super(info);
		this.errName=code;
		this.errValue=info;
	}
	public String getErrName() {
		return errName;
	}
	public void setErrName(String errName) {
		this.errName = errName;
	}
	public String getErrValue() {
		return errValue;
	}
	public void setErrValue(String errValue) {
		this.errValue = errValue;
	}
}
