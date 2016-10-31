package com.xdja.vwp.common.dao.handle;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.hibernate.criterion.DetachedCriteria;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;

import com.xdja.vwp.common.util.PageModel;

public interface IHandle {
	public static String SORTTYPE_ASC="asc";
	public static String SORTTYPE_DESC="desc";
	/**
     * 将一个新的对象持久到数据库
     * @param entity
     * @return 持久化后的对象,有主键值
     */
    public void create(Object entity);
    
    /**
     * 从数据库删除对象o,该对象需要是persistent(持久化)状态的
     * @param entity
     */
    public void delete(Object entity) ;
    /**
     * 更新对象entity,该对象需要是persistent(持久化)状态的
     * @param entity
     */
    public void update(Object entity) ;
   
    /**
     * 根据HQL获得一个对象
     * @param select
     * @param values
     * @return 
     */
    public Object getObjectByHQL(final String select, final Object[] values) ;

    /**
     * 根据HQL获得一个对象(支持查询缓存)
     * @param select
     * @param values
     * @return 
     */
    public Object getObjectByHQLAsCache(final String select, final Object[] values) ;
    
	/**
	 * 根据ID查找对象
	 * @param c 返回对象的Class
	 * @param id 
	 * @return 从数据库找到的域对象
	 * 
	 */
	public Object getObjectById(final Serializable id,Class<?> clazz);
	/** 
	* @Title: getList 根据分页条件和查询条件获取结果集合
	* @Description: TODO 
	* @param @param pageSize 每页行数
	* @param @param page 查询页页码
	* @param @param conditions 查询条件集合
	* @param @param clazz 对应类
	* @param @return 
	* @return List<?> 
	* @throws 
	*/ 
	public List<?> getList(int pageSize, final int page,Map<String, Object> conditions,Class<?> clazz);
	/** 
	* @Title: getList 根据分页条件获取结果集合
	* @Description: TODO 
	* @param @param pageSize 每页行数
	* @param @param page 查询页页码
	* @param @param clazz 对应类
	* @param @return 
	* @return List<?> 
	* @throws 
	*/ 
	public List<?> getList(int pageSize, int page,Class<?> clazz);
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
	public List<?> getListByHQL(final String selectCount, final String select
			, final Object[] values, final PageModel page);
	/**
	 * 
	 * HQL不分页查询
	 * 返回全部列表，
	 * @param select HQL for "select * from ..." and should return object list.
	 * @param values For prepared statements.
	 * @return 结果集
	 */
	public List<?> getListByHQL(final String select, final Object[] values);
	
	/**
	 * 得到一条记录，主要用于查询总数.也可用于查询单个对象,如果返回多个对象,抛出异常
	 * @param dc
	 * @return 单个对象
	 */
	public Object getObjectByCriteria(final DetachedCriteria dc);
	/**
	 * DetachedCriteria列表查询
	 * 之所以不把排序字段放在DetachedCriteria内传入，是为了兼容所有数据库，有的数据库在查总数据时如果有排序字段会出错
	 * @param dc
	 * @param orderBy 排序字段 "fa desc,fb,fc asc" 
	 * @param page 为空时不分页，非空时分页
	 * @return 结果集
	 * 
	 */
	public List<?> getListByCriteria(final DetachedCriteria dc, final String orderBy, final PageModel page);
	
	
	/**
	 * 得到一条记录，主要用于查询总数.也可用于查询单个对象,如果返回多个对象,抛出异常
	 * 
	 * @param select SQL for "select * from ..." 
	 * @param values For prepared statements.
	 */
	public Object getObjectBySQL(final String select, final Object[] values);
	
	/**
     * SQL分页查询
     * 根据查询总数的SQL和查询记录的SQL,设置了页码的page,返回查询列表，同时设置PAGE总数。
     * @param selectCount SQL for "select count(*) from ..."
     * @param select SQL for "select * from ..." and should return object list.
     * @param values For prepared statements.
     * @param page Page 
     * @param c 非空时每条结果记录封装成对应的对象，空时为对象数组
     */
	 public List<?> getListBySQL(final String selectCount, final String select, Object[] values, final PageModel page,final Class<?> clazz);

    /**
     * SQL不分页查询
     * @param select SQL for "select * from ..." and should return object list.
     * @param values For prepared statements.
     * @param c 非空时每条结果记录封装成对应的对象，空时为对象数组
     */
	 public List<?> getListBySQL(String select,Object[] values,Class<?> clazz);

	/**
	 * 批量更新，如果使用HQL会出错（更新的是子类时）
     * @param sqlUpdate
     * @param values
     * @return 
     */
    public Object updateBySql(final String sqlUpdate,final Object[] values);
	/**
	 * 保存对象,调用后对象仍然保持原来的状态,详见HIBERNAObjectE的merge方法
	 * @param o
	 */
	public void merge(Object o);
	/**
	 * 获得符合条件查询的前几条记录
	 * @param select
	 * @param values
	 * @param topnum 要获得的记录数
	 * @return
	 */
	public List<?> getTopListByHQL(final String select, final Object[] values, final int topnum);

	
	/**
	 * 方法描述：根据HQL获得list(支持查询缓存)
	 * @param select
	 * @param values
	 * @return
	 */
	public List<?> getListByHQLAsCache(final String select, final Object[] values);  
	/**
	 * 
	 * 方法描述：可以由于查询clob字段。
	 * @param sqlString
	 * @return
	 */
	public String getSingleValue(String sqlString) ;
	
	/**
	 * 方法描述：使用jdbcTemplate执行存储过程
	 * @param csc
	 * @param action
	 * @return
	 * @throws DataAccessException
	 */
	public Object jdbcTemplateExcute(CallableStatementCreator csc, CallableStatementCallback<?> action) throws DataAccessException;
	
	/**
	 * 方法描述：使用jdbcTemplate执行自定义Sql语句
	 * @param sqlString
	 * @return
	 */
	public List<Map<String, Object>> jdbcTemplateQureyForList(String sqlStr) throws RuntimeException;
	
	/**
	 * 方法描述：执行存储过程，返回List
	 * @param sql
	 * @return
	 */
	public List<?> excuteProcedure(String sql);
	/** 
	* @Title: excute 
	* @Description: TODO 执行sql语句
	* @param @param sql 
	* @return void 
	* @throws 
	*/ 
	public void excute(String sql);
	
	/**
	 * 方法描述：使用jdbcTemplate执行自定义Sql语句
	 * @param sql
	 * @param requiredType
	 * @param args
	 * @return
	 */
	public Object queryForObject(String sql, Class<?> requiredType, Object... args) ;
	/** 
	* @Title: getPageModel
	* @Description: TODO  根据分页条件获取分页对象
	* @param @param pageSize 每页行数
	* @param @param page 查询页页码
	* @param @param clazz 对应类
	* @param @return 
	* @return PageModel 
	* @throws 
	*/ 
	public PageModel getPageModel(int pageSize, int page, Class<?> clazz,String orderCls,String sortType);
	/** 
	* @Title: getPageModel 
	* @Description: TODO  根据分页条件获取分页对象
	* @param @param pageSize 每页行数
	* @param @param page 查询页页码
	* @param @param conditions 查询条件集合
	* @param @param clazz 对应类
	* @param @return 
	* @return PageModel 
	* @throws 
	*/ 
	public PageModel getPageModel(int pageSize, final int page,Map<String, Object> conditions,Class<?> clazz,String orderCls,String sortType);
	public PageModel getPageModelByCriteria(final DetachedCriteria dc,int pageSize, final int page,String orderCls);
	
}
