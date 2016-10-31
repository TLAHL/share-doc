package com.xdja.vwp.common.dao.handle;

import java.io.Serializable;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Property;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.xdja.vwp.common.util.PageModel;
import com.xdja.vwp.common.util.StringTools;

@Repository
public class SpringHandle implements IHandle{

	@Autowired
	protected JdbcTemplate jdbcTemplate;
	@Resource(name = "sessionFactory")
	protected SessionFactory sessionFactory;
	public Session getSession(){
		Session session = sessionFactory.getCurrentSession();
//		session.setFlushMode(FlushMode.MANUAL);
		return session;
	}
	@Override
	public void create(Object entity) {
		// TODO Auto-generated method stub
		this.getSession().saveOrUpdate(entity);
	}

	@Override
	public void delete(Object entity) {
		// TODO Auto-generated method stub
		this.getSession().delete(entity);
	}

	@Override
	public void update(Object entity) {
		// TODO Auto-generated method stub
		this.getSession().saveOrUpdate(entity);
	}

	@Override
	public Object getObjectByHQL(final String select, final Object[] values) {
		// TODO Auto-generated method stub
		Query query = this.getSession().createQuery(select);
		if (values != null) {
			for (int i = 0; i < values.length; i++)
				query.setParameter(i, values[i]);
		}
		return query.uniqueResult();
	}

	@Override
	public Object getObjectByHQLAsCache(final String select, final Object[] values) {
		// TODO Auto-generated method stub
		Query query = this.getSession().createQuery(select);
		query.setCacheable(true);
		if (values != null) {
			for (int i = 0; i < values.length; i++)
				query.setParameter(i, values[i]);
		}
		return query.uniqueResult();
	}

	@Override
	public Object getObjectById(Serializable id,Class<?> clazz) {
		// TODO Auto-generated method stub
		return this.getSession().get(clazz, id);
	}
	private List<?> getListByHQL(final String select, final Object[] values,
			final PageModel page) {
		Query query = this.getSession().createQuery(select);
		if (values != null) {
			for (int i = 0; i < values.length; i++)
				query.setParameter(i, values[i]);
		}
		if (page != null) {
			return query.setFirstResult(page.getOffset())
					.setMaxResults(page.getPageSize()).list();
		} else
			return query.list();
	}
	public List<?> getList(final int pageSize, final int page,Map<String, Object> conditions,Class<?> clazz) {
		PageModel pageModel=null;
		StringBuffer selectCount=new StringBuffer("select count(*) from ").append(clazz.getSimpleName()).append(" u");
		StringBuffer select=new StringBuffer("select u from ").append(clazz.getSimpleName()).append(" u");
		StringBuffer where=new StringBuffer(" where 1=1 ");
		for (String key : conditions.keySet()) {
			where.append(" and ").append(key).append("=").append(conditions.get(key));
		}
		selectCount.append(where);
		select.append(where);
		Long count = (Long) getObjectByHQL(selectCount.toString(), null);
		if(pageSize>0&&page>0) pageModel=PageModel.newPageModel(pageSize, page, count.intValue());
		return getListByHQL(select.toString(), null, pageModel);
	}
	@Override
	public PageModel getPageModel(final int pageSize, final int page,Class<?> clazz,String orderCls,String sortType) {
		// TODO Auto-generated method stub
		PageModel pageModel=null;
		StringBuffer selectCount=new StringBuffer("select count(*) from ").append(clazz.getSimpleName());
		StringBuffer select=new StringBuffer("select u from ").append(clazz.getSimpleName()).append(" u");
		StringBuffer order=new StringBuffer(" order by ").append(orderCls);
		if(!StringTools.isEmpty(sortType))order.append(" ").append(sortType);
		if(!StringTools.isEmpty(orderCls))select.append(order);
		Long count = (Long) getObjectByHQL(selectCount.toString(), null);
		if(pageSize>0&&page>0) {
			pageModel=PageModel.newPageModel(pageSize, page, count.intValue());
			List<?> list=getListByHQL(select.toString(), null, pageModel);
			pageModel.setDataList(list);
		}
		return pageModel;
	}
	
	@Override
	public PageModel getPageModelByCriteria(final DetachedCriteria dc,int pageSize, int page,
			String orderCls) {
		// TODO Auto-generated method stub
		Criteria criteria = dc.getExecutableCriteria(this.getSession());
		PageModel pageModel=PageModel.newPageModel(0, 0, 0);
		if (pageSize>0&&page>0) {
			criteria.setProjection(Projections.rowCount());
			int count = Integer.parseInt(this.getObjectByCriteria(dc).toString());
			pageModel=PageModel.newPageModel(pageSize, page, count);
		}
		// 处理排序字段
		if (orderCls != null) {
			String[] aOrderBys = orderCls.trim().split(",");
			for (int i = 0; i < aOrderBys.length; i++) {
				String[] aOrderBy = aOrderBys[i].trim().split(" ");
				// 字段为空则不处理
				if (StringUtils.isBlank(aOrderBy[0]))
					continue;

				if (aOrderBy.length > 1 &&aOrderBy[1].equalsIgnoreCase("desc")) {// 有倒序参数
                    criteria.addOrder(Property.forName(aOrderBy[0]).desc());
//					criteria.addOrder(new GBKOrder(aOrderBy[0], false));//自定义ORDER支持mysql中文排序
				} else {
					criteria.addOrder(Property.forName(aOrderBy[0]).asc());
//					criteria.addOrder(new GBKOrder(aOrderBy[0], true));
				}
			}
		}
		criteria.setProjection(null);
		if (pageModel != null) {
			if(pageModel.getCurrentPage()>0&&pageModel.getPageSize()>0){
				criteria.setFirstResult(pageModel.getOffset())
				.setMaxResults(pageModel.getPageSize())
				.setFetchSize(pageModel.getPageSize());
			}
			criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
			pageModel.setDataList(criteria.list());
		}
		return pageModel;
	}
	@Override
	public PageModel getPageModel(int pageSize, int page,
			Map<String, Object> conditions, Class<?> clazz,String orderCls,String sortType) {
		// TODO Auto-generated method stub
		PageModel pageModel=PageModel.newPageModel(0, 0, 0);
		StringBuffer selectCount=new StringBuffer("select count(*) from ").append(clazz.getSimpleName()).append(" u");
		StringBuffer select=new StringBuffer("select u from ").append(clazz.getSimpleName()).append(" u");
		StringBuffer where=new StringBuffer(" where 1=1 ");
		StringBuffer order=new StringBuffer(" order by ").append(orderCls);
		if(conditions!=null){
			for (String key : conditions.keySet()) {
				Object value=conditions.get(key);
				where.append(" and ").append(key);
				if(value instanceof String) 
					where.append(" like ").append("'").append(value).append("'");
				else
					where.append("=").append(value);
			}
		}
		selectCount.append(where);
		select.append(where);
		if(!StringTools.isEmpty(sortType))order.append(" ").append(sortType);
		if(!StringTools.isEmpty(orderCls))select.append(order);
		Long count = (Long) getObjectByHQL(selectCount.toString(), null);
		if(pageSize>0&&page>0){
			pageModel=PageModel.newPageModel(pageSize, page, count.intValue());
			List<?> list=getListByHQL(select.toString(), null, pageModel);
			pageModel.setDataList(list);
		}
		return pageModel;
	}
	
	@Override
	public List<?> getList(final int pageSize, final int page,Class<?> clazz) {
		// TODO Auto-generated method stub
		PageModel pageModel=PageModel.newPageModel(0, 0, 0);
		String selectCount="select count(*) from "+clazz.getSimpleName();
		String select="select u from "+clazz.getSimpleName() +" u";
		Long count = (Long) getObjectByHQL(selectCount, null);
		if(pageSize>0&&page>0) pageModel=PageModel.newPageModel(pageSize, page, count.intValue());
		return getListByHQL(select, null, pageModel);
	}

	@Override
	public List<?> getListByHQL(String selectCount, String select,
			Object[] values, PageModel page) {
		// TODO Auto-generated method stub
		if (selectCount != null && !selectCount.equals("")) {
			if (page != null) {
				Long count = (Long) getObjectByHQL(selectCount, values);
				page.setTotalPage(count.intValue());
				if (page.getTotalRecord() < 1)
					return Collections.EMPTY_LIST;
			}

		}
		return getListByHQL(select, values, page);
	}

	@Override
	public List<?> getListByHQL(String select, Object[] values) {
		// TODO Auto-generated method stub
		return this.getListByHQL(select, values, null);
	}

	@Override
	public Object getObjectByCriteria(final DetachedCriteria dc) {
		// TODO Auto-generated method stub
		Criteria criteria = dc.getExecutableCriteria(this.getSession());
		// criteria.setProjection(Projections.rowCount());
		return criteria.uniqueResult();
	}

	@Override
	public List<?> getListByCriteria(final DetachedCriteria dc, String orderBy,
			final PageModel page) {
		// TODO Auto-generated method stub
		if (page != null) {
			dc.setProjection(Projections.rowCount());
			int i = Integer.parseInt(this.getObjectByCriteria(dc).toString());
			page.setTotalPage(i);
			if (page.getTotalRecord() < 1)
				return Collections.EMPTY_LIST;
		}
		// 处理排序字段
		if (orderBy != null) {
			String[] aOrderBys = orderBy.trim().split(",");
			for (int i = 0; i < aOrderBys.length; i++) {
				String[] aOrderBy = aOrderBys[i].trim().split(" ");
				// 字段为空则不处理
				if (StringUtils.isBlank(aOrderBy[0]))
					continue;

				if (aOrderBy.length > 1) {// 有正反序参数
					if (aOrderBy[1].equalsIgnoreCase("desc")) {
						dc.addOrder(Property.forName(aOrderBy[0]).desc());
					} else {
						dc.addOrder(Property.forName(aOrderBy[0]).asc());
					}
				} else {// 无正反序参数
					dc.addOrder(Property.forName(aOrderBy[0]).asc());
				}
			}
		}
		Criteria criteria = dc.getExecutableCriteria(this.getSession());
		criteria.setProjection(null);
		criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
		if (page != null) {
			criteria.setFirstResult(page.getOffset())
					.setMaxResults(page.getPageSize())
					.setFetchSize(page.getPageSize());
		}
		return criteria.list();
	}

	@Override
	public Object getObjectBySQL(final String select, final Object[] values) {
		// TODO Auto-generated method stub
		Query query = this.getSession().createSQLQuery(select);
		if (values != null) {
			for (int i = 0; i < values.length; i++)
				query.setParameter(i, values[i]);
		}
		return query.uniqueResult();
	}
	private List<?> getListBySQL(final String select, final Object[] values,
			final PageModel page,final Class<?> clazz) {
		// select:
		Session session=this.getSession();
		Query query;
		if (clazz == null)
			query = session.createSQLQuery(select);
		else {
			Map<?, ?> map = session.getSessionFactory()
					.getAllClassMetadata();
			if (map.containsKey(clazz.getName())) {
				query = session.createSQLQuery(select).addEntity(clazz);
			} else {
				query = session.createSQLQuery(select)
						.setResultTransformer(
								Transformers.aliasToBean(clazz));
			}
		}
		if (values != null) {
			for (int i = 0; i < values.length; i++)
				query.setParameter(i, values[i]);
		}
		if (page != null) {
			return query.setFirstResult(page.getOffset())
					.setMaxResults(page.getPageSize()).list();
		} else
			return query.list();
	}

	@Override
	public List<?> getListBySQL(String selectCount, String select,
			Object[] values, PageModel page,Class<?> clazz) {
		// TODO Auto-generated method stub
		if (selectCount != null && !selectCount.equals("") && page != null) {
			String count = getObjectBySQL(selectCount, values).toString();
			page.setTotalPage(Integer.parseInt(count));
			if (page.getTotalRecord() < 1)
				return Collections.EMPTY_LIST;
		}
		return getListBySQL(select, values, page,clazz);
	}

	@Override
	public List<?> getListBySQL(String select, Object[] values,Class<?> clazz) {
		// TODO Auto-generated method stub
		return getListBySQL(select, values, null, clazz);
	}

	@Override
	public Object updateBySql(final String sqlUpdate, final Object[] values) {
		// TODO Auto-generated method stub
		Query query = this.getSession().createSQLQuery(sqlUpdate);
		if (values != null) {
			for (int i = 0; i < values.length; i++)
				query.setParameter(i, values[i]);
		}
		return new Integer(query.executeUpdate());
	}

	@Override
	public void merge(Object o) {
		// TODO Auto-generated method stub
		this.getSession().merge(o);
	}

	@Override
	public List<?> getTopListByHQL(final String select, final Object[] values, final int topnum) {
		// TODO Auto-generated method stub
		Query query = this.getSession().createQuery(select);
		if (values != null) {
			for (int i = 0; i < values.length; i++)
				query.setParameter(i, values[i]);
		}
		if (topnum != -1) {
			return query.setFirstResult(0).setMaxResults(topnum).list();
		} else {
			return query.list();
		}
	}

	private List<?> getListByHQLAsCache(final String select,
			final Object[] values, final PageModel page) {
		// select:
		Query query = this.getSession().createQuery(select);
		query.setCacheable(true);
		if (values != null) {
			for (int i = 0; i < values.length; i++)
				query.setParameter(i, values[i]);
		}
		if (page != null) {
			return query.setFirstResult(page.getOffset())
					.setMaxResults(page.getPageSize()).list();
		} else
			return query.list();
	}
	@Override
	public List<?> getListByHQLAsCache(String select, Object[] values) {
		// TODO Auto-generated method stub
		return this.getListByHQLAsCache(select, values, null);
	}

	@Override
	public String getSingleValue(String sqlString) {
		// TODO Auto-generated method stub
		String rst = null;
		try {
			rst = jdbcTemplate.queryForObject(sqlString, String.class);
		} catch (Exception e) {
		}
		return rst;
	}

	@Override
	public Object jdbcTemplateExcute(CallableStatementCreator csc,
			CallableStatementCallback<?> action) throws DataAccessException {
		// TODO Auto-generated method stub
		return jdbcTemplate.execute(csc, action);
	}

	@Override
	public List<Map<String, Object>> jdbcTemplateQureyForList(String sqlStr)
			throws RuntimeException {
		// TODO Auto-generated method stub
		return jdbcTemplate.queryForList(sqlStr);
	}

	@Override
	public List<?> excuteProcedure(String sql) {
		// TODO Auto-generated method stub
		List<?> list = (List<?>) jdbcTemplate.execute(sql,
				new CallableStatementCallback<Object>() {
					public Object doInCallableStatement(CallableStatement cs)
							throws SQLException, DataAccessException {
						cs.registerOutParameter(1, java.sql.Types.VARCHAR);
						cs.execute();
						ResultSet rs = (ResultSet) cs.getObject(1);
						List<?> recordsList = getResultSet(rs);
						return recordsList;
					}
				});
		return list;
	}
	
	@Override
	public void excute(String sql) {
		// TODO Auto-generated method stub
		jdbcTemplate.execute(sql);
	}
	
	private  List<Map<String, Object>> getResultSet(ResultSet rs)throws  SQLException{  
        List<Map<String, Object>> list = new  ArrayList<Map<String, Object>>();  
        try  {  
            ResultSetMetaData rsmd = rs.getMetaData();  
             //每循环一次遍历出来1条记录，记录对应的所有列值存放在map中(columnName:columnValue)   
            while (rs.next()){  
                Map<String, Object> map = new  HashMap<String, Object>();   
                int  columnCount = rsmd.getColumnCount();  
                for (int i=0 ;i<columnCount;i++){  
                    String columnName = rsmd.getColumnName(i+1 );  
                    map.put(columnName, rs.getObject(i+1 ));  
                }  
                list.add(map);  
            }  
        } catch  (SQLException e) {  
        }  
        return  list;  
    }  
	@Override
	public Object queryForObject(String sql, Class<?> requiredType,
			Object... args) {
		// TODO Auto-generated method stub
		return jdbcTemplate.queryForObject(sql, requiredType, args);
	}
}
