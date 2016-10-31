package com.xdja.vwp.common.zip;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.mail.internet.MimeUtility;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.view.AbstractView;

import com.xdja.vwp.common.util.FileTools;
import com.xdja.vwp.common.util.PropertiesManager;

public abstract class AbstractZipView extends AbstractView {
	protected static final String TARGETPATH = PropertiesManager.getInstance().getProperty("cons_sys", "targetpath");
	protected String zipName="";
	public AbstractZipView(String zipName) {
		this.zipName=zipName;
	}

	protected abstract List<Map<String, String>> generateHtmlTemplates();
	protected abstract HSSFWorkbook generateExcel();
	
	@Override
	protected void renderMergedOutputModel(Map<String, Object> model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		HSSFWorkbook wb = generateExcel();
		int maxSize=0;
		List<Map<String, String>> templates=generateHtmlTemplates();
		if(templates!=null)maxSize=templates.size();
		File file = getFile();
		ZipUtils.zip(file, wb,templates);
		//输出文件，并删除缓存文件
		response.setContentType("application/octet-stream");
//		String name = URLEncoder.encode(zipName+"【"+maxSize+"】.zip", "UTF-8");
		String name = new String((zipName+"【"+maxSize+"】.zip").getBytes("GBK"),"ISO-8859-1");
		response.setHeader("Content-disposition", "attachment;filename=" + name);
		FileInputStream fis=new FileInputStream(file);
		OutputStream os = response.getOutputStream();
		try {
			IOUtils.copy(fis, os);
		} catch (Exception e) {
			throw e;
		}finally{
			os.flush();
			os.close();
			fis.close();
			file.delete();
		}
	}

	protected File getFile() {
		File file = new File(TARGETPATH);
		if (!file.exists()) {
			file.mkdirs();
		}
		file.setWritable(true, false);
		Date date=new Date();
		String fileName = "temp."+date.getTime()+".zip";
		File f = new File(TARGETPATH + fileName);
		if (!f.exists()) {
			try {
				File.createTempFile("001", ".zip");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return f;
	}
	protected String loadHtmlTemplate(String templateFilepath){
		String read=null;
		InputStreamReader isReader=null;
		FileInputStream fileInputStream=null;
        BufferedReader bufread=null;
        StringBuilder template=new StringBuilder();
   	 	try {
   	 		fileInputStream=new FileInputStream(FileTools.getProjectPath()+templateFilepath);
            isReader=new InputStreamReader(fileInputStream,"UTF-8");
            bufread = new BufferedReader(isReader);
                while ((read = bufread.readLine()) != null) {
                	template.append(read).append("\r\n");
                }
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				bufread.close();
				isReader.close();
				fileInputStream.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
   	 	return template.toString();
	}

	protected void creatHeads(HSSFWorkbook workbook, HSSFSheet sheet,String[] headers) {
		HSSFCellStyle columnHeadStyle = workbook.createCellStyle();
		columnHeadStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 左右居中
		columnHeadStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 上下居中
		columnHeadStyle.setLocked(true);
		columnHeadStyle.setWrapText(true);
		columnHeadStyle.setLeftBorderColor(HSSFColor.BLACK.index);// 左边框的颜色
		columnHeadStyle.setBorderLeft((short) 1);// 边框的大小
		columnHeadStyle.setRightBorderColor(HSSFColor.BLACK.index);// 右边框的颜色
		columnHeadStyle.setBorderRight((short) 1);// 边框的大小
		columnHeadStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN); // 设置单元格的边框为粗体
		columnHeadStyle.setBottomBorderColor(HSSFColor.BLACK.index); // 设置单元格的边框颜色
		columnHeadStyle.setFillBackgroundColor(HSSFColor.GREY_25_PERCENT.index);

		HSSFRow headRow = sheet.createRow(0);
		headRow.setHeight((short) 400);
		
		for (int i = 0; i < headers.length; i++) {
			HSSFCell headCell = headRow.createCell(i);
			headCell.setCellStyle(columnHeadStyle);
			headCell.setCellValue(new HSSFRichTextString(headers[i]));
		}
	}
	protected String encodeFilename(String filename, HttpServletRequest request) {
		/**
		 * 获取客户端浏览器和操作系统信息 在IE浏览器中得到的是：User-Agent=Mozilla/4.0 (compatible; MSIE
		 * 6.0; Windows NT 5.1; SV1; Maxthon; Alexa Toolbar)
		 * 在Firefox中得到的是：User-Agent=Mozilla/5.0 (Windows; U; Windows NT 5.1;
		 * zh-CN; rv:1.7.10) Gecko/20050717 Firefox/1.0.6
		 */
		String agent = request.getHeader("USER-AGENT");
		try {
			if ((agent != null) && (-1 != agent.indexOf("MSIE"))) {
				String newFileName = URLEncoder.encode(filename, "UTF-8");
				newFileName = StringUtils.replace(newFileName, "+", "%20");
				if (newFileName.length() > 150) {
					newFileName = new String(filename.getBytes("GB2312"),
							"ISO8859-1");
					newFileName = StringUtils.replace(newFileName, " ", "%20");
				}
				return newFileName;
			}
			if ((agent != null) && (-1 != agent.indexOf("Mozilla")))
				return MimeUtility.encodeText(filename, "UTF-8", "B");

			return filename;
		} catch (Exception ex) {
			return filename;
		}
	}
}
