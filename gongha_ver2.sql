DROP DATABASE IF EXISTS `gongha`;
CREATE DATABASE IF NOT EXISTS `gongha` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `gongha`;

# Dump of table students
# ------------------------------------------------------------

DROP TABLE IF EXISTS `students`;

CREATE TABLE `students`(
`no` int(11) unsigned NOT NULL AUTO_INCREMENT,
`name` varchar(20) NOT NULL DEFAULT '',
`email` varchar(50) NOT NULL DEFAULT '',
`password` char(41) NOT NULL DEFAULT '',
`region` enum('서울특별시', '경기도', '강원도', '충청남도', '충청북도', '전라남도', '전라북도', '경상남도', '경상북도', '제주특별자치도') NOT NULL DEFAULT '서울특별시',
`grade` enum('중1', '중2', '중3', '고1', '고2', '고3', 'N수') NOT NULL DEFAULT '중1',
`age` int(3) unsigned NOT NULL DEFAULT '0',
`teacher_count` int(3) unsigned NOT NULL DEFAULT '0',
`create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
`delete_datetime` datetime DEFAULT NULL,
`enabled` tinyint(1) NOT NULL DEFAULT '1',
PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table teachers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `teachers`;

CREATE TABLE `teachers`(
`no` int(11) unsigned NOT NULL AUTO_INCREMENT,
`name` varchar(20) NOT NULL DEFAULT '',
`email` varchar(50) NOT NULL DEFAULT '',
`password` char(41) NOT NULL DEFAULT '',
`region` enum('서울특별시', '경기도', '강원도', '충청남도', '충청북도', '전라남도', '전라북도', '경상남도', '경상북도', '제주특별자치도') NOT NULL DEFAULT '서울특별시',
`background` enum('대학교 2(3)년제 재학', '대학교 2(3)년제 졸업', '대학교 4년제 재학', '대학교 4년제 졸업') NOT NULL DEFAULT '대학교 2(3)년제 재학',
`age` int(3) unsigned NOT NULL DEFAULT '0',
`student_count` int(3) unsigned NOT NULL DEFAULT '0',
`create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
`delete_datetime` datetime DEFAULT NULL,
`enabled` tinyint(1) NOT NULL DEFAULT '1',
PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table links
# ------------------------------------------------------------

DROP TABLE IF EXISTS `links`;

CREATE TABLE `links`(
`no` int(11) unsigned NOT NULL AUTO_INCREMENT,
`teacher_no` int(11) unsigned NOT NULL,
`student_no` int(11) unsigned NOT NULL,
`create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
`delete_datetime` datetime DEFAULT NULL,
`enabled` tinyint(1) NOT NULL DEFAULT '1',
PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table schedules
# ------------------------------------------------------------

DROP TABLE IF EXISTS `schedules`;

CREATE TABLE `schedules`(
`no` int(11) unsigned NOT NULL AUTO_INCREMENT,
`link_no` int(11) unsigned NOT NULL,
`title` varchar(40) NOT NULL DEFAULT '',
`content` text NULL,
`start_datetime` datetime NOT NULL,
`end_datetime` datetime NOT NULL,
`create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
`delete_datetime` datetime DEFAULT NULL,
`enabled` tinyint(1) NOT NULL DEFAULT '1',
PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table homeworks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `homeworks`;

CREATE TABLE `homeworks`(
`no` int(11) unsigned NOT NULL AUTO_INCREMENT,
`link_no` int(11) unsigned NOT NULL,
`title` varchar(40) NOT NULL DEFAULT '',
`content` text NULL ,
`is_submit` tinyint(1) NOT NULL DEFAULT '0',
`start_datetime` datetime NOT NULL,
`end_datetime` datetime NOT NULL,
`create_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`update_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
`delete_datetime` datetime DEFAULT NULL,
`enabled` tinyint(1) NOT NULL DEFAULT '1',
PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;