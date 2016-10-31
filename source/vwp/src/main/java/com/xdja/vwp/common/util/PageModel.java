package com.xdja.vwp.common.util;

import java.util.List;

import org.codehaus.jackson.map.annotate.JsonFilter;

/** 
* @ClassName: PageModel 
* @Description: TODO 分页对象 
* @author liutao
* @date 2015-10-22 下午2:38:57  
*/ 
@JsonFilter("nullPageFilter")
public class PageModel{  
      
    /** 
    * @Fields currentPage : TODO 当前页  
    */ 
    private int currentPage;
      
    /** 
    * @Fields pageSize : TODO 每页显示条数  
    */ 
    private int pageSize;
      
    /** 
    * @Fields totalPage : TODO 总页数  
    */ 
    private int totalPage;
      
    /** 
    * @Fields totalRecord : TODO 总记录数
    */ 
    private int totalRecord;
      
    /** 
    * @Fields dataList : TODO 分页数据
    */ 
    private List<?> dataList;
      
    private PageModel(){  
          
    }  
      
    private PageModel(final int pageSize,final int page,final int totalRecord){  
          
        this.pageSize = pageSize;  
        this.totalRecord = totalRecord;  
        setTotalPage();  
        setCurrentPage(page);  
          
    }  
      
    /** 
    * @Title: newPageModel 
    * @Description: TODO 创建该类实例
    * @param @param pageSize 每页条数
    * @param @param page 当前页码
    * @param @param totalRecord 总记录数
    * @param @return 
    * @return PageModel 
    * @throws 
    */ 
    public static PageModel newPageModel(final int pageSize,final int page,final int totalRecord){  
        return new PageModel(pageSize, page, totalRecord);  
    }  
  
    /** 
    * @Title: setCurrentPage
    * @Description: TODO 设置当前页码
    * @param @param page 当前页码
    * @return void 
    * @throws 
    */ 
    public void setCurrentPage(int page){  
          
        currentPage = page;  
  
        if(currentPage>totalPage){  
            currentPage=totalPage;  
        }
        if(currentPage<1){  
        	currentPage =1;  
        }  
    }  
      
    /** 
    * @Title: setTotalPage 
    * @Description: TODO 设置总页码数
    * @param  
    * @return void 
    * @throws 
    */ 
    private void setTotalPage(){  
    	if(pageSize<=0){
    		totalPage=0;
    	}else if(totalRecord%pageSize==0){  
            totalPage = totalRecord/pageSize;  
        }else{  
            totalPage = totalRecord/pageSize+1;  
        }  
    }  
      
    /** 
    * @Title: getOffset 
    * @Description: TODO 获取起始查询位置
    * @param @return  起始查询位置
    * @return int
    * @throws 
    */ 
    public int getOffset(){  
        return (currentPage-1)*pageSize;  
    }  
      
    /** 
    * @Title: getFirst 
    * @Description: TODO 获取第一页页码 
    * @param @return  第一页页码
    * @return int
    * @throws 
    */ 
    public int getFirst(){  
        return 1;  
    }  
      
    /** 
    * @Title: getPrevious 
    * @Description: TODO 获取上一页页码
    * @param @return  上一页页码
    * @return int
    * @throws 
    */ 
    public int getPrevious(){ 
    	int previous=currentPage-1;
    	if(previous<1)previous=1;
        return previous;  
    }  
      
    /** 
    * @Title: getNext 
    * @Description: TODO 获取下一页页码
    * @param @return 下一页页码
    * @return int 
    * @throws 
    */ 
    public int getNext(){  
    	int next=currentPage+1;
    	if(next>totalPage)next=totalPage;
        return next;  
    }  
      
    /** 
    * @Title: getLast 
    * @Description: TODO 获取最后一页页码
    * @param @return 最后一页页码
    * @return int 
    * @throws 
    */ 
    public int getLast(){  
        return totalPage;  
    }  
  
    public int getCurrentPage() {  
        return currentPage;  
    }  
  
    public int getPageSize() {  
        return pageSize;  
    }  
  
    public void setPageSize(int pageSize) {  
        this.pageSize = pageSize;  
    }  
  
    public int getTotalPage() {  
        return totalPage;  
    }  
  
    public void setTotalPage(int totalPage) {  
        this.totalPage = totalPage;  
    }  
  
    public int getTotalRecord() {  
        return totalRecord;  
    }  
  
    public void setTotalRecord(int totalRecord) {  
        this.totalRecord = totalRecord;  
    }  
  
    public List<?> getDataList() {  
        return dataList;  
    }  
  
    public void setDataList(List<?> dataList) {  
        this.dataList = dataList;  
    }  
      
}  