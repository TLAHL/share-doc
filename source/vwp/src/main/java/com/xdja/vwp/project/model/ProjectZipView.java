package com.xdja.vwp.project.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.codehaus.jackson.map.ObjectMapper;

import com.xdja.vwp.common.util.Constants;
import com.xdja.vwp.common.util.PropertiesManager;
import com.xdja.vwp.common.util.StringTools;
import com.xdja.vwp.common.zip.AbstractZipView;
import com.xdja.vwp.project.entity.Member;
import com.xdja.vwp.project.entity.Project;

public class ProjectZipView extends AbstractZipView  {

	private static final String TEMPLATEFILEPATH="/pages/template/project-detail.html";
	private List<Project> list = null;
	
	public ProjectZipView(String zipName, List<Project> list) {
		super(zipName);
		this.list=list;
	}

	@Override
	protected List<Map<String, String>> generateHtmlTemplates(){
		if(list==null||list.size()<1)return null;
		List<Map<String, String>> res=new ArrayList<Map<String, String>>();
        String template=loadHtmlTemplate(TEMPLATEFILEPATH);
   	 	for (int i = 0; i < list.size(); i++) {
   	 		Project project=list.get(i);
   	 		String type=project.getType()==null?"":PropertiesManager.getInstance().getProperty("cons_projecttype", project.getType().toString());
   	 		
//   	 		String school=project.getSchool()==null?"":PropertiesManager.getInstance().getProperty("cons_school", project.getSchool().toString());
   	 		String education=project.getEducation()==null?"":PropertiesManager.getInstance().getProperty("cons_education", project.getEducation().toString());
   	 		String sendTime=project.getSendTime()==null?"":StringTools.formatDate(project.getSendTime(),"yyyy年MM月dd日");
   	 		String statusAndTime="未审阅";
   	 		if(project.getStatus()!=null&&project.getStatus()==Constants.REVIEW_STATUS_YES){
   	 			if(project.getReviewTime()!=null)statusAndTime="审阅时间:"+StringTools.formatDate(project.getReviewTime(),"yyyy年MM月dd日");
   	 			else statusAndTime="已审阅";
   	 		}
	   	 	String projectTemplate=template.replaceAll("#[{]name[}]", project.getName()==null?"":project.getName())
	   	 			.replaceAll("#[{]type[}]", type==null?"":type)
	   	 			.replaceAll("#[{]target[}]", project.getTarget()==null?"":project.getTarget())
	   	 			.replaceAll("#[{]stage[}]", project.getStage()==null?"":project.getStage())
	   	 			.replaceAll("#[{]contact[}]", project.getContact()==null?"":project.getContact())
	   	 			.replaceAll("#[{]phone[}]", project.getPhone()==null?"":project.getPhone())
	   	 			.replaceAll("#[{]school[}]",  project.getSchool()==null?"":project.getSchool())
	   	 			.replaceAll("#[{]city[}]",  project.getCity()==null?"":project.getCity())
	   	 			.replaceAll("#[{]major[}]",  project.getMajor()==null?"":project.getMajor())
	   	 			.replaceAll("#[{]department[}]", project.getDepartment()==null?"":project.getDepartment())
	   	 			.replaceAll("#[{]education[}]", education==null?"":education)
	   	 			.replaceAll("#[{]email[}]", project.getEmail()==null?"":project.getEmail())
	   	 			.replaceAll("#[{]overview[}]", project.getOverview()==null?"":project.getOverview().replaceAll("(\r\n|\r|\n|\n\r)", "<br/>"))
	   	 			.replaceAll("#[{]sendTime[}]",  sendTime==null?"":sendTime)
	   	 			.replaceAll("#[{]status[}]", project.getStatus()==null?"":project.getStatus().toString())
	 				.replaceAll("#[{]statusAndTime[}]", statusAndTime)
	 				.replaceAll("#[{]members[}]", generateMembersHTML(project.getMembers()));

	    	Map<String, String > templateMap=new HashMap<String, String>();
	    	templateMap.put("name", (i+1)+"-"+"虚拟职场自带项目报名表-"+ project.getName());
	    	templateMap.put("template", projectTemplate);
	    	res.add(templateMap);
		}
		return res;
	}
	protected String generateMembersHTML(List<Member> members){
		StringBuffer membersHTML=new StringBuffer();
		if(members==null||members.size()<1) return membersHTML.toString();
		int num=0;
		for ( ; num < members.size(); num++) {
			Member member=members.get(num);
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
	@Override
	protected HSSFWorkbook generateExcel() {
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFSheet sheet = workbook.createSheet("报名表列表");
		sheet.setDefaultColumnWidth((short) 12);
		
		if(list==null||list.size()<1)return workbook;//没有数据时返回空集合
		String[] headers=new String[]{"编号","项目名称","项目联系人","所在城市","学历年级","学校","电话","E-mail"};
		this.creatHeads(workbook, sheet,headers);
		for (int i = 0; i < list.size(); i++) {
			Project project = list.get(i);
			HSSFRow row = sheet.createRow(i + 1);
			row.setHeight((short) 300);
			
			String[] datas=new String[]{
					String.valueOf(i+1),
					project.getName()==null?"":project.getName(),
					project.getContact(),
					project.getCity(),
					project.getEducation()==null?"":PropertiesManager.getInstance().getProperty("cons_education", project.getEducation().toString()),
					project.getSchool(),
					project.getPhone(),
					project.getEmail()
					};
			for (int j = 0; j < datas.length; j++) {
				row.createCell(j).setCellValue(new HSSFRichTextString(datas[j]));
			}
		}
		return workbook;
	}

}