<?php
//defined('PATH_LIB') or die("Restricted Access");

#############################################################################################################################
#												Simple Database Class to access MySql										#
#	@file	:	class.database.php																							#
#	@author	:	Sankalp Shekhar																								#
#	@email	:	sankalp@omsoftware.net																						#
#############################################################################################################################
class MySqlDb
{
	//private variables
	private $dbCon; //connection
	private $db_host; //database host
	private $db_user; //database user
	private $db_pswd; //database password
	private $db_name; //database name

	private $recSet; //recordset
	private $last_query; //last query
	private $msgEr; // error message
	private $magic_quotes_active; //boolean variable
	private $real_escape_string; //boolean variable
	private $aryErMsg=array(
							'1451'=>'The record is in use somewhere else'
							);

	//construtor, needs 4 essential parameters to connect to DB
	function __construct($dbHost,$dbUser,$dbPswd,$dbName)
	{
		$this->setDbHost($dbHost);
		$this->setDbUser($dbUser,$dbPswd);
		$this->setDbName($dbName);

		$this->connect();

		$this->magic_quotes_active=get_magic_quotes_gpc();
		$this->real_escape_string=function_exists("mysql_real_escape_string");
	}

	//destructor
	function __destruct()
	{
		$this->disconnect();
	}

	public function setErAry($aryEr)
	{
		$this->aryErMsg=$aryEr;
	}

	public function setDbHost($host)
	{
		$this->db_host=$host;
	}

	public function setDbUser($dbUser,$dbPswd)
	{
		$this->db_user=$dbUser;
		$this->db_pswd=$dbPswd;
	}

	public function setDbName($dbName)
	{
		$this->db_name=$dbName;
	}	public function getDbName()	{		return $this->db_name;	}

	//funciton to close connection
	public function disconnect()
	{
		if(isset($this->dbCon) && $this->dbCon)
		{
			mysql_close($this->dbCon);
			unset($this->dbCon);
		}
	}

	//database connection establish
	public function connect()
	{
		 //check if any connection already exists, close that connection
		$this->disconnect();

		$this->dbCon=mysql_connect($this->db_host,$this->db_user,$this->db_pswd);		mysql_query("SET character_set_results = 'utf8', character_set_client = 'utf8', character_set_connection = 'utf8', character_set_database = 'utf8', character_set_server = 'utf8'", $this->dbCon);

//		$re = mysql_query('SHOW VARIABLES LIKE "%character_set%";')or die(mysql_error());
//		while ($r = mysql_fetch_assoc($re)) {var_dump ($r); echo "<br />";} exit;
//die();

		if(!$this->dbCon)
		{
			die("Database Connection Failed : ".mysql_error());
		}
		else
		{
			$db_select=mysql_select_db($this->db_name,$this->dbCon);
			if(!$db_select) { die("Database Select Failed : ".mysql_error()); }
		}
	}

	//function to set Error Msg
	private function setErMsg($myErr,$myErrNo=0)
	{
		if(isset($this->aryErMsg[$myErrNo])) $myErr=$this->aryErMsg[$myErrNo];

		$this->msgEr="Query Exceution Failed :".$myErr;
		$this->msgEr.="<br />Last Query : ".$this->last_query;
	}

	//public funtion to send error to user
	public function getErMsg()
	{
		return $this->msgEr;
	}

	public function getLastQuery()
	{
		return $this->last_query;
	}
	//method to prepare string for various sql operation
	public function prepStr($sqlStr)
	{
		if($this->real_escape_string)
		{
			if($this->magic_quotes_active) { $sqlStr=stripslashes($sqlStr); }
			$sqlStr=mysql_real_escape_string($sqlStr,$this->dbCon);
		}
		else
		{
			if(!$this->magic_quotes_active) { $sqlStr=addslashes($sqlStr); }
		}
		return $sqlStr;
	}

	//function to execute query
	public function query($sql)
	{
		$this->last_query=$sql;
		$this->recSet=mysql_query($sql,$this->dbCon);
		if($this->recSet)
		{
			return $this->recSet;
		}
		else
		{
			$this->setErMsg(mysql_error(),mysql_errno());
			return NULL;
		}
	}

	//method to get id of last inserted record
	public function getLastId()
	{
		return mysql_insert_id($this->dbCon);
	}

	//method to get number of affected rows
	public function getAffectedRows()
	{
		return mysql_affected_rows($this->dbCon);
	}

	//method to get number of affected rows
	public function getRowCount($sql=NULL)
	{
		if(!is_null($sql)) { $this->query($sql); }
		if($this->recSet)
		{
			return mysql_num_rows($this->recSet);
		}
		else
		{
			return NULL;
		}
	}

	//function to insert records
	public function insert($sql)
	{
		$rs=$this->query($sql);
		if($rs)
		{
			return $this->getLastId();
		}
		else
		{
			return NULL;
		}
	}

	//method to insert record from an associative array
	//array to contain field=>value
	public function insertAry($tblName,$aryVal)
	{
		//$aryField=array();
		if(count($aryVal)>0)
		{			$result = mysql_query("SHOW COLUMNS FROM " . $tblName);
			if (!$result) {
			    echo 'Could not run query: ' . mysql_error();
			    exit;
			}
			if (mysql_num_rows($result) > 0) {
					$i=0;
					$fields=array();
			    while ($row = mysql_fetch_assoc($result)) {
			        //error_log("xx". print_r($row,1));
							$fields[$i]=$row['Field'];
							$i++;
			    }
			}
			$strField="";
			$strVal="";
			foreach($aryVal as $field=>$val)
			{				if (in_array($field,$fields) && $field!=0){

				$strField.=$field.",";
				if(is_null($val)) { $strVal.='NULL,'; }
				else { $strVal.= "'".$this->prepStr($val)."',"; }				}
			}
			$strField=rtrim($strField,',');
			$strVal=rtrim($strVal,',');

			$sql="insert into {$tblName}  ";
			$sql.="(".$strField.") values ";
			$sql.="(".$strVal.")";
			error_log("db insert ary ". $sql .PHP_EOL );
			return $this->insert($sql);
		}
		else
		{
			$this->setErMsg("No fields present in array");
			return NULL;
		}
	}

	//method to update record
	public function update($sql)
	{
		$rs=$this->query($sql);
		if($rs)
		{
			return $this->getAffectedRows();
		}
		else
		{
			return NULL;
		}
	}

	//method to update record from an associative array
	//array to contain field=>value
	public function updateAry($tblName,$aryVal,$condition = NULL)
	{
		$strUpVal='';
		if(count($aryVal)>0)
		{			$result = mysql_query("SHOW COLUMNS FROM " . $tblName);			if (!$result) {			    echo 'Could not run query: ' . mysql_error();			    exit;			}			if (mysql_num_rows($result) > 0) {					$i=0;					$fields=array();			    while ($row = mysql_fetch_assoc($result)) {			  //      error_log(print_r($row,1));							$fields[$i]=$row['Field'];							$i++;			    }			}			error_log("tolgo colonne non presenti".print_r($fields,1). PHP_EOL. "-PAssate".print_r($aryVal,1). "-". $this->getDbName(). "-". print_r($fields,1).PHP_EOL);
			foreach($aryVal as $field=>$val)			if (in_array($field,$fields) && $field !='0'){

				{					error_log(" colonne  presenti".$field.PHP_EOL);

					if(is_null($val)) { $strUpVal.="{$field}=NULL,"; }
					else { $strUpVal.="{$field}='".$this->prepStr($val)."',"; }
				}			}
			$strUpVal=rtrim($strUpVal,',');
			$sql="update {$tblName} set {$strUpVal}";
			if(!is_null($condition)) { $sql.=" ".$condition; }
			error_log("db update ary ". $sql .PHP_EOL);

			return $this->update($sql);
		}
		else
		{
			$this->setErMsg("No fields present in array");
			return NULL;
		}
	}

	//method to delete records
	public function delete($tblName,$condition=NULL)
	{
		$sql="delete from {$tblName}";
		if(!is_null($condition)) { $sql.=" ".$condition; }
		$rs=$this->query($sql);
		if($rs)
		{
			return $this->getAffectedRows();
		}
		else
		{
			return NULL;
		}
	}

	//method to fetch all records
	public function getRows($sql)
	{
		$aryResult=array();
 	  error_log("db get_rows ". $sql .PHP_EOL);

		$result=$this->query($sql);

		if(!is_null($result))
		{
			while($row=mysql_fetch_array($result)) { $aryResult[]=$row; }
			return $aryResult;
		}
		else
		{
			return NULL;
		}
	}

	//method to fetch just a single record
	public function getRow($sql)
	{
		$aryResult=$this->getRows($sql);
		if(is_array($aryResult))
		{
			if(count($aryResult)==0)
			{
				return array();
			}
			else
			{//				error_log("get row-" .print_r($aryResult[0],1). "-". count($aryResult[0])/2 );				$num=(count($aryResult[0])/2);				for ($i=0; $i<$num & $num>1 ; $i++){
//				error_log("get scan-" .$aryResult[$i]. "-". $i );
						unset($aryResult[0][$i]);


				}

				return $aryResult[0];
			}
		}
		else
		{
			return NULL;
		}
	}

	//function to fetch just a single field
	public function getVal($sql,$erVal=NULL)
	{
		$aryResult=$this->getRow($sql);
		if(is_array($aryResult))
		{      error_log("get val - ". $sql. PHP_EOL);
			return $aryResult[0];
		}
		else
		{
			return $erVal;
		}
	}

	//function to fetch enum values
	public function getEnumVal($table, $field)
	{
		$sql = "SHOW COLUMNS FROM ".$table." LIKE '".$field."' ";
		$aryEnum=$this->getRow($sql);
		if(is_array($aryEnum) && count($aryEnum)>0)
		{
			$regex = "/'(.*?)'/";
			preg_match_all( $regex , $aryEnum['Type'], $enum_array );
			return $enum_array[1];
		}
		else
		{
			return NULL;
		}
	}
	public function getStatusImg($status)
	{
		$aryImg=array(
					  '0'=>"status_inactive.png",
					  '1'=>"status_active.png"
					  );
		return '<img src="'.URL_ADMIN_IMG.$aryImg[$status].'" title="'.getStatusStr($status).'" />';
	}

}

?>
