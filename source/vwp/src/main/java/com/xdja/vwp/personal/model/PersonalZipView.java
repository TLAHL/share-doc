package com.xdja.vwp.personal.model;

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
import com.xdja.vwp.personal.entity.Personal;

public class PersonalZipView extends AbstractZipView  {

	private static final String TEMPLATEFILEPATH="/pages/template/personal-detail.html";
	private List<Personal> list = null;
	
	public PersonalZipView(String zipName, List<Personal> list) {
		super(zipName);
		this.list=list;
	}

	@Override
	protected List<Map<String, String>> generateHtmlTemplates(){
		if(list==null||list.size()<1)return null;
		List<Map<String, String>> res=new ArrayList<Map<String, String>>();
        String template=loadHtmlTemplate(TEMPLATEFILEPATH);
   	 	for (int i = 0; i < list.size(); i++) {
   	 		Personal personal=list.get(i);
   	 		String sex=Constants.SEX_CONSTANTS.get(personal.getSex());
//   	 		String school=personal.getSchool()==null?"":PropertiesManager.getInstance().getProperty("cons_school", personal.getSchool().toString());
   	 		String admissionTime=personal.getAdmissionTime()==null?"":StringTools.formatDate(personal.getAdmissionTime());
   	 		String education=personal.getEducation()==null?"":PropertiesManager.getInstance().getProperty("cons_education", personal.getEducation().toString());
   	 		String sendTime=personal.getSendTime()==null?"":StringTools.formatDate(personal.getSendTime(),"yyyy年MM月dd日");
   	 		String statusAndTime="未审阅";
   	 		if(personal.getStatus()!=null&&personal.getStatus()==Constants.REVIEW_STATUS_YES){
   	 			if(personal.getReviewTime()!=null)statusAndTime="审阅时间:"+StringTools.formatDate(personal.getReviewTime(),"yyyy年MM月dd日");
   	 			else statusAndTime="已审阅";
   	 		}
   	 		
	   	 	String personalTemplate=template.replaceAll("#[{]name[}]", personal.getName()==null?"":personal.getName())
	   	 			.replaceAll("#[{]sex[}]", sex==null?"":sex)
	   	 			.replaceAll("#[{]cardId[}]", personal.getCardId()==null?"":personal.getCardId())
	   	 			.replaceAll("#[{]school[}]", personal.getSchool()==null?"":personal.getSchool())
	   	 			.replaceAll("#[{]admissionTime[}]", admissionTime==null?"":admissionTime)
	   	 			.replaceAll("#[{]department[}]", personal.getDepartment()==null?"":personal.getDepartment())
	   	 			.replaceAll("#[{]major[}]", personal.getMajor()==null?"":personal.getMajor())
	   	 			.replaceAll("#[{]education[}]", education==null?"":education)
	   	 			.replaceAll("#[{]phone[}]", personal.getPhone()==null?"":personal.getPhone())
	   	 			.replaceAll("#[{]email[}]", personal.getEmail()==null?"":personal.getEmail())
	   	 			.replaceAll("#[{]reward[}]", personal.getReward()==null?"":personal.getReward().replaceAll("(\r\n|\r|\n|\n\r)", "<br/>"))
	   	 			.replaceAll("#[{]ranking[}]", personal.getRanking()==null?"":personal.getRanking().replaceAll("(\r\n|\r|\n|\n\r)", "<br/>"))
	   	 			.replaceAll("#[{]experience[}]", personal.getExperience()==null?"":personal.getExperience().replaceAll("(\r\n|\r|\n|\n\r)", "<br/>"))
	   	 			.replaceAll("#[{]computerSkills[}]", personal.getComputerSkills()==null?"":personal.getComputerSkills().replaceAll("(\r\n|\r|\n|\n\r)", "<br/>"))
	   	 			.replaceAll("#[{]evaluation[}]", personal.getEvaluation()==null?"":personal.getEvaluation().replaceAll("(\r\n|\r|\n|\n\r)", "<br/>"))
	   	 			.replaceAll("#[{]sendTime[}]", sendTime==null?"":sendTime)
	   	 			.replaceAll("#[{]status[}]", personal.getStatus()==null?"":personal.getStatus().toString())
	   	 			.replaceAll("#[{]statusAndTime[}]", statusAndTime);
	    	Map<String, String > templateMap=new HashMap<String, String>();
	    	templateMap.put("name", (i+1)+"-"+"虚拟职场个人报名表-"+ personal.getName());
	    	templateMap.put("template", personalTemplate);
	    	res.add(templateMap);
		}
		return res;
	}
	@Override
	protected HSSFWorkbook generateExcel() {
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFSheet sheet = workbook.createSheet("报名表列表");
		sheet.setDefaultColumnWidth((short) 12);
		
		if(list==null||list.size()<1)return workbook;//没有数据时返回空集合
		String[] headers=new String[]{"编号","姓名","性别","学历年级","学校","电话","E-mail"};
		this.creatHeads(workbook, sheet,headers);
		for (int i = 0; i < list.size(); i++) {
			Personal personal = list.get(i);
			HSSFRow row = sheet.createRow(i + 1);
			row.setHeight((short) 300);
			
			String[] datas=new String[]{
					String.valueOf(i+1),
					personal.getName()==null?"":personal.getName(),
					Constants.SEX_CONSTANTS.get(personal.getSex()),
					personal.getEducation()==null?"":PropertiesManager.getInstance().getProperty("cons_education", personal.getEducation().toString()),
					personal.getSchool(),
					personal.getPhone(),
					personal.getEmail()
					};
			for (int j = 0; j < datas.length; j++) {
				row.createCell(j).setCellValue(new HSSFRichTextString(datas[j]));
			}
		}
		return workbook;
	}
}