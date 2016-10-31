package com.xdja.vwp.common.zip;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import com.xdja.vwp.common.util.StringTools;

public class ZipUtils {

	/** 
	* @Title: zip 
	* @Description: TODO 压缩文件，包含一个excal表单和多个html文本模板
	* @param @param targetFile
	* @param @param wb
	* @param @param htmlTemplates 
	* @return void 
	* @throws 
	*/ 
	public static void zip(File targetFile, HSSFWorkbook wb,List<Map<String, String>> htmlTemplates) {
		if (wb == null ) {
			return;
		}
		ZipOutputStream zos = null;
		FileOutputStream fos=null;
		try {
			fos=new FileOutputStream(targetFile);
			zos = new ZipOutputStream(fos,Charset.forName("gbk"));
			ZipEntry wbEntry = new ZipEntry("列表.xls");
			// 设置压缩包的入口
			zos.putNextEntry(wbEntry);
			wb.write(zos);
			zos.flush();
			if(htmlTemplates!=null){
				for (int i = 0; i < htmlTemplates.size(); i++) {
					String htmlTemplate=htmlTemplates.get(i).get("template");
					if(!StringTools.isEmpty(htmlTemplate)){
						ZipEntry htmlEntry = new ZipEntry(htmlTemplates.get(i).get("name")+".html");
						zos.putNextEntry(htmlEntry);
						zos.write(htmlTemplate.getBytes("utf-8"));
						zos.flush();
					}
				}
			}
			zos.closeEntry();
			zos.close();
			fos.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
