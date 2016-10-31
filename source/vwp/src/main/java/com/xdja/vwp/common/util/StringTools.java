package com.xdja.vwp.common.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sourceforge.pinyin4j.PinyinHelper;

public class StringTools {
	private static SimpleDateFormat sdf;
	public static Boolean isEmpty(String str) {
		if (str == null || "".equals(str))
			return true;
		else
			return false;
	}
	public static Boolean isAllEmpty(String str) {
		if (str == null || "".equals(str.trim()) || "null".equals(str.trim().toLowerCase()))
			return true;
		else
			return false;
	}
	/** 
	* @Title: isJSONString 
	* @Description: TODO 是否为json格式字符串
	* @param @param str
	* @param @return 
	* @return Boolean 
	* @throws 
	*/ 
	public static Boolean isJSONString(String str){
		boolean res=true;
		try {
			JSONObject.fromObject(str);
		} catch (Exception e) {
			try {
				JSONArray.fromObject(str);
			} catch (Exception e1) {
				res=false;
			}
		}
		return res;
	}
	/**
	 * @Title: formatJSON
	 * @Description: TODO 将字串中特殊字符替换为json所能识别的字符
	 * @param @param str
	 * @param @return
	 * @return String
	 * @throws
	 */
	public static String formatJSON(String str) {
		if (isEmpty(str))
			return "";
		// String res=str.replaceAll("\"",
		// "\\\"").replaceAll("(\r\n|\r|\n|\n\r)", "<br>");
		String res = str.replaceAll("\"", "\\\"").replaceAll(
				"(\r\n|\r|\n|\n\r)", "\\\\r\\\\n");
		return res;
	}

	/**
	 * @Title: formatDateTime
	 * @Description: TODO 将日期格式化为yyyy-MM-dd HH:mm:ss
	 * @param @param date
	 * @param @return
	 * @return String
	 * @throws
	 */
	public static String formatDateTime(Date date) {
		return formatDate(date, "yyyy-MM-dd HH:mm:ss");
	}

	/**
	 * @Title: formatDate
	 * @Description: TODO 将日期格式化为yyyy-MM-dd
	 * @param @param date
	 * @param @return
	 * @return String
	 * @throws
	 */
	public static String formatDate(Date date) {
		return formatDate(date, "yyyy-MM-dd");
	}

	/**
	 * @Title: formatDate
	 * @Description: TODO 将日期格式化为指定格式
	 * @param @param date
	 * @param @param pattern
	 * @param @return
	 * @return String
	 * @throws
	 */
	public static String formatDate(Date date, String pattern) {
		sdf = new SimpleDateFormat(pattern);
		if (date == null)
			return null;
		else
			return sdf.format(date);
	}
	public static Date parseDate(String date, String pattern) {
		Date res=null;
		sdf = new SimpleDateFormat(pattern);
		if (!isEmpty(date)){
			try {
				res=sdf.parse(date);
			} catch (ParseException e) {
			}
		}
		return res;
	}

	public static String formatURL(String url) {
		if (isEmpty(url))
			return "";
		String res = url.replaceAll("\\\\", "/");
		return res;
	}

	public static String formatHTML(String url) {
		if (isEmpty(url))
			return "";
		String res = url.replaceAll("\"", "\'").replaceAll("\"", "\\\"")
				.replaceAll("(\r\n|\r|\n|\n\r)", " ");
		return res;
	}

	/**
	 * @Title: convertToHex
	 * @Description: TODO 将十进制转换为指定位数的十六进制，不足位数前部补0
	 * @param @param decimal
	 * @param @param units
	 * @param @return
	 * @return String
	 * @throws
	 */
	public static String convertToHex(int decimal, int units) {
		String hex = Integer.toHexString(decimal);
		String head = "";
		if (hex.length() < units) {
			for (int i = 0; i < units - hex.length() % units; i++) {
				head += "0";
			}
		}
		return head + hex;
	}

	/**
	 * @Title: convertToInteger
	 * @Description: TODO 十六进制转换为10进制数值
	 * @param @param hex
	 * @param @return
	 * @return Integer
	 * @throws
	 */
	public static Integer convertToInteger(String hex) {
		return Integer.parseInt(hex, 16);
	}
	/** 
	* @Title: getFirstPinYin 
	* @Description: TODO 获取字串中第一个字符，如果为汉字则返回拼音
	* @param @return 
	* @return char 
	* @throws 
	*/ 
	public static String getFirstPinYin(String str){
		String res=null;
		if(isEmpty(str)||str.length()<1)return res;
		Character first=str.toCharArray()[0];
		if(!isChinese(first)){
			res=String.valueOf(Character.toUpperCase(first));
		}else{
			String[] pinyins=null;
			pinyins = PinyinHelper.toHanyuPinyinStringArray(first);
			if(pinyins!=null&&pinyins.length>0)
				res=pinyins[0];
		}
		return res;
	}
	/** 
	* @Title: isChinese 
	* @Description: TODO 判断字符是否为中文
	* @param @param c
	* @param @return 
	* @return boolean 
	* @throws 
	*/ 
	public static boolean isChinese(char c) {
        Character.UnicodeBlock ub = Character.UnicodeBlock.of(c);
        if (ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS || ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A || ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_B
                || ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION || ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS
                || ub == Character.UnicodeBlock.GENERAL_PUNCTUATION) {
            return true;
        }
        return false;
    }
	/** 
	* @Title: getEncoding 
	* @Description: TODO 判断字串属于什么编码格式
	* @param @param str
	* @param @return 
	* @return String 
	* @throws 
	*/ 
	public static String getEncoding(String str) {
		String encode = "GB2312";
		try {
			if (str.equals(new String(str.getBytes(encode), encode))) {
				String s = encode;
				return s;
			}
		} catch (Exception exception) {
		}
		encode = "ISO-8859-1";
		try {
			if (str.equals(new String(str.getBytes(encode), encode))) {
				String s1 = encode;
				return s1;
			}
		} catch (Exception exception1) {
		}
		encode = "UTF-8";
		try {
			if (str.equals(new String(str.getBytes(encode), encode))) {
				String s2 = encode;
				return s2;
			}
		} catch (Exception exception2) {
		}
		encode = "GBK";
		try {
			if (str.equals(new String(str.getBytes(encode), encode))) {
				String s3 = encode;
				return s3;
			}
		} catch (Exception exception3) {
		}

		return "";
	}
	/** 
	* @Title: Encode 
	* @Description: TODO 消息加密
	* @param @param code
	* @param @param message
	* @param @return 
	* @return String 
	* @throws 
	*/ 
	public static String encode(String code,String message){  
	    MessageDigest md;  
	    String encode = null;  
	    try {  
	        md = MessageDigest.getInstance(code);
	        
	        encode = getDigestStr(md.digest(message  
	                .getBytes()));  
	    } catch (NoSuchAlgorithmException e) {  
	        e.printStackTrace();  
	    }  
	    return encode;  
	}  
	private static String getDigestStr(byte[] origBytes) { 
        String tempStr = null; 
        StringBuilder stb = new StringBuilder(); 
        for (int i = 0; i < origBytes.length; i++) { 
            // 这里按位与是为了把字节转整时候取其正确的整数，java中一个int是4个字节 
            // 如果origBytes[i]最高位为1，则转为int时，int的前三个字节都被1填充了 
            tempStr = Integer.toHexString(origBytes[i] & 0xff); 
            if (tempStr.length() == 1) { 
                stb.append("0"); 
            } 
            stb.append(tempStr);

        } 
        return stb.toString(); 
    }
}
