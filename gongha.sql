-- MySQL dump 10.13  Distrib 5.7.32, for osx10.14 (x86_64)
--
-- Host: localhost    Database: crevill_reservation
-- ------------------------------------------------------
-- Server version	5.7.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `gongha`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `gongha` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `gongha`;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `no` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  `email` varchar(320) NOT NULL DEFAULT '',
  `password` char(41) NOT NULL DEFAULT '',
  `region` enum('서울특별시','경기도','강원도','충청남도','충청북도','전라남도','전라북도','경상남도','경상북도','제주특별자치도') NOT NULL DEFAULT '서울특별시',
  `grade` enum('중1','중2','중3','고1','고2','고3','N수') NOT NULL DEFAULT '중1',
  `age` int(3) unsigned NOT NULL,
  `teacher_count` int(3) unsigned NOT NULL DEFAULT 0,
  `create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `delete_datetime` datetime DEFAULT NULL,
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

-- LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
-- UNLOCK TABLES;
DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teachers` (
  `no` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  `email` varchar(320) NOT NULL DEFAULT '',
  `password` char(41) NOT NULL DEFAULT '',
  `region` enum('서울특별시','경기도','강원도','충청남도','충청북도','전라남도','전라북도','경상남도','경상북도','제주특별자치도') NOT NULL DEFAULT '서울특별시',
  `background` enum('대학교 2(3)년제 재학','대학교 2(3)년제 졸업','대학교 4년제 재학','대학교 4년제 졸업') NOT NULL DEFAULT '대학교 4년제 재학',
  `age` int(3) unsigned NOT NULL,
  `student_count` int(3) unsigned NOT NULL DEFAULT 0,
  `create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `delete_datetime` datetime DEFAULT NULL,
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

-- LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
-- UNLOCK TABLES;


--
-- Table structure for table `links`
--

DROP TABLE IF EXISTS `links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `links` (
  `no` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `teacher_no` int(11) unsigned NOT NULL,
  `student_no` int(11) unsigned DEFAULT NULL,
  `create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `delete_datetime` datetime DEFAULT NULL,
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `links`
--

LOCK TABLES `links` WRITE;
/*!40000 ALTER TABLE `links` DISABLE KEYS */;
/*!40000 ALTER TABLE `links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedules` (
  `no` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `link_no` int(11) unsigned DEFAULT NULL,
  `title` varchar(40) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `delete_datetime` datetime DEFAULT NULL,
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `homeworks`
--

DROP TABLE IF EXISTS `homeworks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `homeworks` (
  `no` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `link_no` int(11) unsigned DEFAULT NULL,
  `title` varchar(40) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  `is_submit` tinyint(1) NOT NULL DEFAULT '0',
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `delete_datetime` datetime DEFAULT NULL,
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homeworks`
--

LOCK TABLES `homeworks` WRITE;
/*!40000 ALTER TABLE `homeworks` DISABLE KEYS */;
/*!40000 ALTER TABLE `homeworks` ENABLE KEYS */;
UNLOCK TABLES;





/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-18 16:40:53
