<?php
/*
*
* Author: Russel Gauthier(c) - GPLv3 - Arxos - v1.12
*
 */
namespace Arxos\Db;
use Exception;
use PDOException;
use PDO;

class Db {
    private $connection = null;

    function __construct($dbType, array $connectionInfo){
        if($dbType === "sqlite"){
            try {
                $this->connection = new PDO("sqlite:" . $connectionInfo["fileName"]);

                $this->connection->setAttribute(PDO::ATTR_PERSISTENT, true);
                $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch(PDOException $e){
                throw new DbException("Connection error: " . $e->getMessage(), 0x01);
            }
        } else {
            throw new DbException("No handler for dbType=" . $dbType, 0x02);
        }
    }
    function __destruct(){
        $connection = null;
    }
    function query($query){
        try {
            return $this->connection->query($query);
        } catch(PDOException $e){
            throw new DbException("Query error: " . $e->getMessage(), 0x03);
        }
    }
    function runFile($fileName){
        try {
            $fileStr = file_get_contents($fileName);
            $fileLines = array_slice(str_replace("\r", "", str_replace("\n", "", explode(";", $fileStr))), 0, -1);

            $this->connection->beginTransaction();
            foreach($fileLines as &$currRow) {
                $currLine = trim($currRow) . ";";
                $this->connection->exec($currLine);
            }

            $this->connection->commit();
        } catch(PDOException $e){
            throw new DbException("Transaction error: " . $e->getMessage(), 0x05);
        }
    }
    function runPrepared(DbPreparedIterator $iterable, $stmt, array $iterableParams){
        try {
            $preparedStmt = $this->connection->prepare($stmt);
            $bindParams = array();

            foreach($iterableParams as $key=>$value){
                $bindParams[$key] = null;
                $preparedStmt->bindParam($key, $bindParams[$key]);
            }

            while(($currVal = $iterable->iter()) !== null){
                foreach($iterableParams as $key=>$value){
                    $valStr = $value($currVal);
                    if(is_array($valStr)){
                        if(array_key_exists("query", $valStr)){
                            $valStr = intval($this->connection->query($valStr["query"])->fetch()["id"]);
                        } else {
                            $tmpStr = "";
                            foreach($valStr as $currArrayElement){
                                $tmpStr .= $currArrayElement . ",";
                            }
                            $valStr = substr($tmpStr, 0, -1);
                        }
                    }

                    $bindParams[$key] = $valStr;
                }

                $preparedStmt->execute();
            }
        } catch(Exception $e){
            throw new DbException("Prepared statement error: " . $e->getMessage(), 0x06);
        }
    }
}
class DbException extends Exception {
    public function __construct($message, $code, Exception $previous = null){
        parent::__construct($message, $code, $previous);
    }
    public function __toString(){
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}
class DbPreparedIterator {
    private $iterator = null;
    private $currIndex = null;

    function __construct(callable $startFunc){
        $this->iterator = $startFunc();
        $this->currIndex = 0;
    }
    function iter(){
        if($this->currIndex >= count($this->iterator)){
            $result = null;
        } else {
            $result = $this->iterator[$this->currIndex];
        }

        $this->currIndex++;

        return $result;
    }
    function length(){
        return count($this->iterator);
    }
}
