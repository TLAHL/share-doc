import java.util.Calendar;
import java.util.Date;
import java.util.List;


public class Test {
	private static Calendar cal = Calendar.getInstance();
	static List<Date> list=null;
	static int week=-1;
	public static int count(int month,int userId){
		int attendance=0;
		AttendanceDao attendanceDao=new AttendanceDao();
		int days=cal.getActualMaximum(Calendar.DATE);
		for (int day = 1; day <= days; day++) {
			int firstHour=-1;
			int lastHour=-1;
			list=attendanceDao.getAttendanceByDate(userId, month, day);
			if(list!=null&&list.size()>0){
				cal.setTime(list.get(0));
				week=cal.get(Calendar.DAY_OF_WEEK);
				firstHour=cal.get(Calendar.HOUR_OF_DAY);
				if(list.size()>1){
					cal.setTime(list.get(list.size()-1));
					lastHour=cal.get(Calendar.HOUR_OF_DAY);
				}
				if(week>1&&week<7){
					if(lastHour==-1||firstHour>9||lastHour<6){
						attendance+=0.5;
					}else{
						attendance+=1;	
					}
				}
			}
		}
		return attendance;
	}
}
