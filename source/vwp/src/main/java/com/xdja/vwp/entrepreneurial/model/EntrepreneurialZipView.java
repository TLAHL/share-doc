package com.xdja.vwp.entrepreneurial.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import com.xdja.vwp.common.util.Constants;
import com.xdja.vwp.common.util.PropertiesManager;
import com.xdja.vwp.common.util.StringTools;
import com.xdja.vwp.common.zip.AbstractZipView;
import com.xdja.vwp.entrepreneurial.entity.EntrepreneurialMember;
import com.xdja.vwp.entrepreneurial.entity.EntrepreneurialTeam;

public class EntrepreneurialZipView extends AbstractZipView{
	private static final String TEMPLATEFILEPATH="/pages/template/youth-detail.html";
	private List<EntrepreneurialTeam> list = null;
	
	public EntrepreneurialZipView(String zipName, List<EntrepreneurialTeam> list) {
		super(zipName);
		this.list=list;
	}

	protected List<Map<String, String>> generateHtmlTemplates(){
		if(list==null||list.size()<1)return null;
		List<Map<String, String>> res=new ArrayList<Map<String, String>>();
        String template=loadHtmlTemplate(TEMPLATEFILEPATH);
   	 	for (int i = 0; i < list.size(); i++) {
   	 		EntrepreneurialTeam entrepreneurialTeam=list.get(i);
   	 		String type=entrepreneurialTeam.getType()==null?"":PropertiesManager.getInstance().getProperty("cons_projecttype", entrepreneurialTeam.getType().toString());
   	 		String education=entrepreneurialTeam.getEducation()==null?"":PropertiesManager.getInstance().getProperty("cons_education", entrepreneurialTeam.getEducation().toString());
   	 		String sendTime=entrepreneurialTeam.getSendTime()==null?"":StringTools.formatDate(entrepreneurialTeam.getSendTime(),"yyyy年MM月dd日");
   	 		String statusAndTime="未审阅";
   	 		if(entrepreneurialTeam.getStatus()!=null&&entrepreneurialTeam.getStatus()==Constants.REVIEW_STATUS_YES){
   	 			if(entrepreneurialTeam.getReviewTime()!=null)statusAndTime="审阅时间:"+StringTools.formatDate(entrepreneurialTeam.getReviewTime(),"yyyy年MM月dd日");
   	 			else statusAndTime="已审阅";
   	 		}
	   	 	String projectTemplate=template.replaceAll("#[{]name[}]", entrepreneurialTeam.getName()==null?"":entrepreneurialTeam.getName())
	   	 			.replaceAll("#[{]type[}]", type==null?"":type)
	   	 			.replaceAll("#[{]target[}]", entrepreneurialTeam.getTarget()==null?"":entrepreneurialTeam.getTarget())
	   	 			.replaceAll("#[{]stage[}]", entrepreneurialTeam.getStage()==null?"":entrepreneurialTeam.getStage())
	   	 			.replaceAll("#[{]contact[}]", entrepreneurialTeam.getContact()==null?"":entrepreneurialTeam.getContact())
	   	 			.replaceAll("#[{]phone[}]", entrepreneurialTeam.getPhone()==null?"":entrepreneurialTeam.getPhone())
	   	 			.replaceAll("#[{]school[}]",  entrepreneurialTeam.getSchool()==null?"":entrepreneurialTeam.getSchool())
	   	 			.replaceAll("#[{]city[}]",  entrepreneurialTeam.getCity()==null?"":entrepreneurialTeam.getCity())
	   	 			.replaceAll("#[{]major[}]",  entrepreneurialTeam.getMajor()==null?"":entrepreneurialTeam.getMajor())
	   	 			.replaceAll("#[{]department[}]", entrepreneurialTeam.getDepartment()==null?"":entrepreneurialTeam.getDepartment())
	   	 			.replaceAll("#[{]education[}]", education==null?"":education)
	   	 			.replaceAll("#[{]email[}]", entrepreneurialTeam.getEmail()==null?"":entrepreneurialTeam.getEmail())
	   	 			.replaceAll("#[{]overview[}]", entrepreneurialTeam.getOverview()==null?"":entrepreneurialTeam.getOverview().replaceAll("(\r\n|\r|\n|\n\r)", "<br/>"))
	   	 			.replaceAll("#[{]sendTime[}]",  sendTime==null?"":sendTime)
	   	 			.replaceAll("#[{]status[}]", entrepreneurialTeam.getStatus()==null?"":entrepreneurialTeam.getStatus().toString())
	 				.replaceAll("#[{]statusAndTime[}]", statusAndTime)
	 				.replaceAll("#[{]members[}]", generateMembersHTML(entrepreneurialTeam.getMembers()));

	    	Map<String, String > templateMap=new HashMap<String, String>();
	    	templateMap.put("name", (i+1)+"-"+"创新创业帮项目报名表-"+ entrepreneurialTeam.getName());
	    	templateMap.put("template", projectTemplate);
	    	res.add(templateMap);
		}
		return res;
	}
	protected String generateMembersHTML(List<EntrepreneurialMember> members){
		StringBuffer membersHTML=new StringBuffer();
		if(members==null||members.size()<1) return membersHTML.toString();
		int num=0;
		for ( ; num < members.size(); num++) {
			EntrepreneurialMember member=members.get(num);
			membersHTML.append("<tr>");
			membersHTML.append("<td>").append(StringTools.isEmpty(member.getName())?"":member.getName()).append("</td>");
			membersHTML.append("<td>").append(StringTools.isEmpty(member.getSexStr())?"":member.getSexStr()).append("</td>");
			membersHTML.append("<td>").append(StringTools.isEmpty(member.getSchool())?"":member.getSchool()).append("</td>");
			membersHTML.append("<td>").append(StringTools.isEmpty(member.getMajor())?"":member.getMajor()).append("</td>");
			membersHTML.append("<td>").append(StringTools.isEmpty(member.getEducationStr())?"":member.getEducationStr()).append("</td>");
			membersHTML.append("<td class=\"role-content\">").append(StringTools.isEmpty(member.getRole())?"":member.getRole()).append("</td>");
			membersHTML.append("</tr>");
		}
		String header="<tr><td rowspan=\""+(num+1)+"\" class=\"title total\">团队成员</td><td class=\"title\">姓名</td><td class=\"title\">性别</td> <td class=\"title\">学校</td><td class=\"title\">专业</td><td class=\"title\">年级</td><td class=\"title\">角色/任务</td></tr>";
		return header+membersHTML.toString();
	}
	protected HSSFWorkbook generateExcel() {
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFSheet sheet = workbook.createSheet("报名表列表");
		sheet.setDefaultColumnWidth((short) 12);
		
		if(list==null||list.size()<1)return workbook;//没有数据时返回空集合
		String[] headers=new String[]{"编号","项目名称","项目联系人","所在城市","学历年级","学校","电话","E-mail"};
		this.creatHeads(workbook, sheet,headers);
		for (int i = 0; i < list.size(); i++) {
			EntrepreneurialTeam entrepreneurialTeam = list.get(i);
			HSSFRow row = sheet.createRow(i + 1);
			row.setHeight((short) 300);
			
			String[] datas=new String[]{
					String.valueOf(i+1),
					entrepreneurialTeam.getName()==null?"":entrepreneurialTeam.getName(),
					entrepreneurialTeam.getContact(),
					entrepreneurialTeam.getCity(),
					entrepreneurialTeam.getEducation()==null?"":PropertiesManager.getInstance().getProperty("cons_education", entrepreneurialTeam.getEducation().toString()),
					entrepreneurialTeam.getSchool(),
					entrepreneurialTeam.getPhone(),
					entrepreneurialTeam.getEmail()
					};
			for (int j = 0; j < datas.length; j++) {
				row.createCell(j).setCellValue(new HSSFRichTextString(datas[j]));
			}
		}
		return workbook;
	}
}
