package com.xdja.vwp.common.dao;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Map;

import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Property;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;

import com.xdja.vwp.common.dao.handle.IHandle;
import com.xdja.vwp.common.util.PageModel;

public class BaseDao<T> {
	@Autowired
	private IHandle handle;
	
	private Class<T> clazz;

	@SuppressWarnings("unchecked")
	public BaseDao() {
		clazz = (Class<T>) ((ParameterizedType) getClass()
				.getGenericSuperclass()).getActualTypeArguments()[0];
	}
	public Criterion[] createCriterions(Map<String, Object> map){
		if(map==null)return null;
		Criterion[] crits=new Criterion[map.size()];
		int k=0;
		for (String key : map.keySet()) {
			Object value=map.get(key);
			if(value instanceof String) 
				crits[k]=Property.forName(key).like(value);
			else
				crits[k]=Property.forName(key).eq(value);
			k++;
		}
		return crits;
	}
	public DetachedCriteria createDetachedCriteria(Map<String, Object> conditions){
		DetachedCriteria dc=DetachedCriteria.forClass(clazz);
		if(conditions!=null){
			for (String key : conditions.keySet()) {
				Object value=conditions.get(key);
				if("or".equalsIgnoreCase(key)){
					if(value instanceof Map){
						Map<String, Object> orValues=(Map<String, Object>)value;
						Criterion[] crits=createCriterions(orValues);
						dc.add(Restrictions.or(crits));
					} 
				}else if("and".equalsIgnoreCase(key)){
					if(value instanceof Map){
						Map<String, Object> orValues=(Map<String, Object>)value;
						Criterion[] crits=createCriterions(orValues);
						dc.add(Restrictions.and(crits));
					} 
				}else{
					if(value instanceof String) 
						dc.add(Property.forName(key).like(value));
					else
						dc.add(Property.forName(key).eq(value));
				}
				
			}
		}
		return dc;
	}
	/**
     * 将一个新的对象持久到数据库
     * @param entity
     * @return 持久化后的对象,有主键值
     */
    public void create(T entity){
    	handle.create(entity);
    }
    
    /**
     * 从数据库删除对象o,该对象需要是persistent(持久化)状态的
     * @param entity
     */
    public void delete(T entity){
    	handle.delete(entity);
    }
    /**
     * 更新对象entity,该对象需要是persistent(持久化)状态的
     * @param entity
     */
    public void update(T entity){
    	handle.update(entity);
    }
   
    /**
     * 根据HQL获得一个对象
     * @param select
     * @param values
     * @return 
     */
    @SuppressWarnings("unchecked")
	public T getObjectByHQL(final String select, final Object[] values){
    	return (T) handle.getObjectByHQL(select, values);
    }

    /**
     * 根据HQL获得一个对象(支持查询缓存)
     * @param select
     * @param values
     * @return 
     */
    @SuppressWarnings("unchecked")
	public T getObjectByHQLAsCache(final String select, final Object[] values){
    	return (T) handle.getObjectByHQLAsCache(select, values);
    }
    
	/**
	 * 根据ID查找对象
	 * @param c 返回对象的Class
	 * @param id 
	 * @return 从数据库找到的域对象
	 * 
	 */
	@SuppressWarnings("unchecked")
	public T getObjectById(final Serializable id){
		return (T) handle.getObjectById(id, clazz);
	}

	public List<T> getList(int pageSize, int page,Map<String, Object> conditions){
		return (List<T>)handle.getList(pageSize, page, conditions, clazz);
	}
	public List<T> getList(int pageSize, int page){
		return (List<T>)handle.getList(pageSize, page, clazz);
	}
	public PageModel getPageModel(int pageSize, int page, Map<String, Object> conditions, String orderCls, String sortType){
		return handle.getPageModel(pageSize, page, conditions, clazz, orderCls, sortType);
	}
	public PageModel getPageModel(int pageSize, int page, String orderCls, String sortType){
		return handle.getPageModel(pageSize, page, clazz, orderCls, sortType);
	}
	public PageModel getPageModelByCriteria(DetachedCriteria dc,int pageSize, final int page,String orderCls){
		return handle.getPageModelByCriteria(dc,pageSize, page, orderCls);
	}
	/**
	 * HQL分页查询
	 * 根据查询总数的HQL和查询记录的HQL以及设置了指定页码的Page对象，返回指定页的LIST对象
	 * 同时设置PAGE总数。
	 * 
	 * @param selectCount HQL for "select count(*) from ..." and should return a Long.
	 * @param select HQL for "select * from ..." and should return object list.
	 * @param values For prepared statements.
	 * @param page 设置了指定页码的Page对象
	 */
	public List<T> getListByHQL(final String selectCount, final String select
			, final Object[] values, final PageModel page){
		return (List<T>) handle.getListByHQL(selectCount, select, values, page);
	}
	/**
	 * 
	 * HQL不分页查询
	 * 返回全部列表，
	 * @param select HQL for "select * from ..." and should return object list.
	 * @param values For prepared statements.
	 * @return 结果集
	 */
	public List<T> getListByHQL(final String select, final Object[] values) {
		return (List<T>) handle.getListByHQL(select, values);
	}
	
	/**
	 * 得到一条记录，主要用于查询总数.也可用于查询单个对象,如果返回多个对象,抛出异常
	 * @param dc
	 * @return 单个对象
	 */
	public T getObjectByCriteria(final DetachedCriteria dc) {
		return (T) handle.getObjectByCriteria(dc);
	}
	/**
	 * DetachedCriteria列表查询
	 * 之所以不把排序字段放在DetachedCriteria内传入，是为了兼容所有数据库，有的数据库在查总数据时如果有排序字段会出错
	 * @param dc
	 * @param orderBy 排序字段 "fa desc,fb,fc asc" 
	 * @param page 为空时不分页，非空时分页
	 * @return 结果集
	 * 
	 */
	public List<T> getListByCriteria(final DetachedCriteria dc, final String orderBy, final PageModel page) {
		return (List<T>) handle.getListByCriteria(dc, orderBy, page);
	}
	
	
	/**
	 * 得到一条记录，主要用于查询总数.也可用于查询单个对象,如果返回多个对象,抛出异常
	 * 
	 * @param select SQL for "select * from ..." 
	 * @param values For prepared statements.
	 */
	public T getObjectBySQL(final String select, final Object[] values) {
		Object obj= handle.getObjectBySQL(select, values);
		if(obj!=null)
			return (T)obj;
		else
			return null;
	}
	
	/**
     * SQL分页查询
     * 根据查询总数的SQL和查询记录的SQL,设置了页码的page,返回查询列表，同时设置PAGE总数。
     * @param selectCount SQL for "select count(*) from ..."
     * @param select SQL for "select * from ..." and should return object list.
     * @param values For prepared statements.
     * @param page Page 
     * @param c 非空时每条结果记录封装成对应的对象，空时为对象数组
     */
	 public List<T> getListBySQL(final String selectCount, final String select, Object[] values, final PageModel page) {
		return (List<T>) handle.getListBySQL(selectCount, select, values, page, clazz);
	}

    /**
     * SQL不分页查询
     * @param select SQL for "select * from ..." and should return object list.
     * @param values For prepared statements.
     * @param c 非空时每条结果记录封装成对应的对象，空时为对象数组
     */
	 public List<T> getListBySQL(final String select,final Object[] values) {
		return (List<T>) handle.getListBySQL(select, values, clazz);
	}

	/**
	 * 批量更新，如果使用HQL会出错（更新的是子类时）
     * @param sqlUpdate
     * @param values
     * @return 
     */
    public T updateBySql(final String sqlUpdate,final Object[] values) {
		return (T) handle.updateBySql(sqlUpdate, values);
	}
	/**
	 * 保存对象,调用后对象仍然保持原来的状态,详见HIBERNATE的merge方法
	 * @param o
	 */
	public void merge(T o) {
		handle.merge(o);
	}
	/**
	 * 获得符合条件查询的前几条记录
	 * @param select
	 * @param values
	 * @param topnum 要获得的记录数
	 * @return
	 */
	public List<T> getTopListByHQL(final String select, final Object[] values, final int topnum) {
		return (List<T>) handle.getTopListByHQL(select, values, topnum);
	}

	
	/**
	 * 方法描述：根据HQL获得list(支持查询缓存)
	 * @param select
	 * @param values
	 * @return
	 */
	public List<T> getListByHQLAsCache(final String select, final Object[] values) {
		return (List<T>) handle.getListByHQLAsCache(select, values);
	}  
	/**
	 * 
	 * 方法描述：可以由于查询clob字段。
	 * @param sqlString
	 * @return
	 */
	public String getSingleValue(String sqlString) {
		return handle.getSingleValue(sqlString);
	}
	
	/**
	 * 方法描述：使用jdbcTemplate执行存储过程
	 * @param csc
	 * @param action
	 * @return
	 * @throws DataAccessException
	 */
	public Object jdbcTemplateExcute(CallableStatementCreator csc, CallableStatementCallback<?> action) throws DataAccessException {
		return handle.jdbcTemplateExcute(csc, action);
	}
	
	/**
	 * 方法描述：使用jdbcTemplate执行自定义Sql语句
	 * @param sqlString
	 * @return
	 */
	public List<Map<String, Object>> jdbcTemplateQureyForList(String sqlStr) throws RuntimeException {
		return handle.jdbcTemplateQureyForList(sqlStr);
	}
	
	/**
	 * 方法描述：执行存储过程，返回List
	 * @param sql
	 * @return
	 */
	public List<?> excuteProcedure(String sql) {
		return handle.excuteProcedure(sql);
	}
	/** 
	* @Title: excute 
	* @Description: TODO 执行sql 
	* @param @param sql 
	* @return void 
	* @throws 
	*/ 
	public void excute(String sql){
		handle.excute(sql);
	}
	/**
	 * 方法描述：使用jdbcTemplate执行自定义Sql语句
	 * @param sql
	 * @param requiredType
	 * @param args
	 * @return
	 */
	public <T> T queryForObject(String sql, Class<T> requiredType, Object... args) {
		return (T) handle.queryForObject(sql, requiredType, args);
	}
}
