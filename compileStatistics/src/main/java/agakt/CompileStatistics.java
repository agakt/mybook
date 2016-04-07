import com.mongodb.BasicDBObject;
import com.mongodb.BulkWriteOperation;
import com.mongodb.BulkWriteResult;
import com.mongodb.Cursor;
import com.mongodb.DB;
import com.mongodb.MongoClientURI;
import com.mongodb.hadoop.util.MongoConfigUtil;
import com.mongodb.hadoop.*;
import com.mongodb.hadoop.util.*;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.ParallelScanOptions;
import com.mongodb.ServerAddress;
import java.io.IOException;
import java.util.*;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.*;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.bson.BasicBSONObject;
import java.util.List;
import java.util.Set;
import org.bson.BSONObject;
public class CompileStatistics {
	public static class Map extends Mapper<Object, BSONObject, Text, IntWritable> {
		
	
		private Text word=new Text();
		public void map(Object key, BSONObject value, Context context) throws IOException, InterruptedException {
			BasicDBObject anItem=(BasicDBObject)value;
			int count=anItem.getInt("code");
			IntWritable COUNTS = new IntWritable(count);
			context.write(new Text("code"),COUNTS);
		}
	}
	
	public static class Reduce extends Reducer<Text, IntWritable, Text, IntWritable> {
		
		public void reduce(Text key, Iterator<IntWritable> values, Context context) throws IOException,InterruptedException {
			int sum=0;
			while(values.hasNext()) {
				sum+=values.next().get();
			}
			context.write(key, new IntWritable(sum));
		}
	}

	public static void main(String[] args) throws Exception {
		Configuration conf = new Configuration();
		String textUri="mongodb://agakt:agakt@52.68.212.127:27017/agaktdb10.books";
		String outUri = "mongodb://agakt:agakt@52.68.212.127:27017/agaktdb10.outputs";
		MongoClientURI uri = new MongoClientURI(textUri);
		MongoClientURI uri2=new MongoClientURI(outUri);
		
		MongoConfigUtil.setInputURI(conf, uri);
		MongoConfigUtil.setOutputURI(conf,uri2);
		Job job=new Job(conf,"analyze book");

		job.setJarByClass(CompileStatistics.class);
		job.setMapperClass(Map.class);
		job.setCombinerClass(Reduce.class);
		job.setReducerClass(Reduce.class);

		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(IntWritable.class);
		
		job.setInputFormatClass(MongoInputFormat.class);
		job.setOutputFormatClass(MongoOutputFormat.class);
		job.waitForCompletion(true);
	}
}
		
