-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2022 at 02:58 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `database`
--
CREATE DATABASE IF NOT EXISTS `database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `database`;

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

CREATE TABLE `bill` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `provider_number` int(11) NOT NULL,
  `code` varchar(1000) NOT NULL,
  `price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bill`
--

INSERT INTO `bill` (`id`, `username`, `provider_number`, `code`, `price`, `quantity`, `date`) VALUES
(4, '3092696746', 22222, '2222262794,2222264156', 50000, 2, '2022-05-31 19:43:51'),
(5, '3092696746', 11111, '1111195151', 100000, 1, '2022-05-31 19:49:20');

-- --------------------------------------------------------

--
-- Table structure for table `credit_card`
--

CREATE TABLE `credit_card` (
  `id` int(11) NOT NULL,
  `card_number` int(11) NOT NULL,
  `expire_date` date NOT NULL,
  `cvv` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `credit_card`
--

INSERT INTO `credit_card` (`id`, `card_number`, `expire_date`, `cvv`) VALUES
(1, 111111, '2022-10-10', 411),
(2, 222222, '2022-11-11', 443),
(3, 333333, '2022-12-12', 577);

-- --------------------------------------------------------

--
-- Table structure for table `deposit`
--

CREATE TABLE `deposit` (
  `id` int(11) NOT NULL,
  `phone_sender` varchar(255) NOT NULL,
  `phone_receiver` varchar(255) NOT NULL,
  `value` int(11) NOT NULL,
  `fee` int(11) NOT NULL,
  `feeperson` varchar(255) NOT NULL,
  `note` varchar(1000) NOT NULL,
  `status` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `deposit`
--

INSERT INTO `deposit` (`id`, `phone_sender`, `phone_receiver`, `value`, `fee`, `feeperson`, `note`, `status`, `date`) VALUES
(35, '0934333333', '0908789789', 2000000, 100000, 'sender', 'Tien nuoc', 1, '2022-05-31 12:17:17'),
(36, '0934333333', '0908789789', 2000000, 100000, 'sender', 'Tien nuoc', 1, '2022-05-31 12:18:09'),
(37, '0934333333', '0908789789', 6000000, 300000, 'sender', 'tien dien', 2, '2022-05-31 12:19:49'),
(38, '0934333333', '0908789789', 5500000, 275000, 'sender', 'tien an', 0, '2022-05-31 12:45:18'),
(39, '0908789789', '0934333333', 2000000, 100000, 'sender', 'chuyen tien nha', 1, '2022-05-31 12:49:59'),
(40, '0934333333', '0908789789', 5500000, 275000, 'receiver', 'chuyen tien lan 2', 0, '2022-05-31 12:51:50');

-- --------------------------------------------------------

--
-- Table structure for table `network_provider`
--

CREATE TABLE `network_provider` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `provider_number` int(11) NOT NULL,
  `fee` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `network_provider`
--

INSERT INTO `network_provider` (`id`, `name`, `provider_number`, `fee`) VALUES
(1, 'Viettel', 11111, 0),
(2, 'Mobifone ', 22222, 0),
(3, 'Vinaphone ', 33333, 0);

-- --------------------------------------------------------

--
-- Table structure for table `otp`
--

CREATE TABLE `otp` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otpcode` varchar(255) NOT NULL,
  `expired` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `otp`
--

INSERT INTO `otp` (`id`, `email`, `otpcode`, `expired`) VALUES
(139, 'nghaing2001@gmail.com', '961720', '2022-05-31 12:17:19'),
(140, 'nghaing2001@gmail.com', '919740', '2022-05-31 12:19:12'),
(141, 'nghaing2001@gmail.com', '252989', '2022-05-31 12:20:12'),
(142, 'nghaing2001@gmail.com', '848074', '2022-05-31 12:46:06'),
(143, 'tdtnguyendang@gmail.com', '269868', '2022-05-31 12:51:01'),
(144, 'nghaing2001@gmail.com', '926274', '2022-05-31 12:52:34');

-- --------------------------------------------------------

--
-- Table structure for table `recharge`
--

CREATE TABLE `recharge` (
  `id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `card_number` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  `value` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `recharge`
--

INSERT INTO `recharge` (`id`, `username`, `card_number`, `date`, `value`) VALUES
(28, '3092696746', '111111', '0000-00-00 00:00:00', 2000000);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT -1,
  `last_modified` datetime NOT NULL DEFAULT current_timestamp(),
  `login_attempts` int(11) NOT NULL DEFAULT 0,
  `abnormal` int(11) NOT NULL DEFAULT 0,
  `login_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `status`, `last_modified`, `login_attempts`, `abnormal`, `login_date`) VALUES
(1, 'admin', '$2a$12$G0bqH0PVQmBumlSh.8N8PumaxpU0VV95isT/ZtZ.IaMea/kKnJ4Ui', 1, '2022-05-18 12:42:54', 4, 0, '2022-05-30 13:43:21'),
(13, '3092696746', '$2b$10$VuBbIJy.MhplFrKcX/xyWOQOYRij0rEI6.e3VbFsrawb/mgdECkLC', 1, '2022-05-31 19:09:06', 0, 0, '2022-05-31 19:09:06'),
(14, '7453666461', '$2b$10$5gBTw4yULsGoDY9qaA.dZ.HgdR8r1mD5sj4AzMvavdenm36epB01S', 1, '2022-05-31 19:11:29', 0, 0, '2022-05-31 19:11:29');

-- --------------------------------------------------------

--
-- Table structure for table `user_detail`
--

CREATE TABLE `user_detail` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `address` varchar(1000) NOT NULL,
  `font_cmnd` varchar(255) NOT NULL,
  `back_cmnd` varchar(255) NOT NULL,
  `total_value` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_detail`
--

INSERT INTO `user_detail` (`id`, `username`, `phone`, `email`, `name`, `date_of_birth`, `address`, `font_cmnd`, `back_cmnd`, `total_value`) VALUES
(10, '3092696746', '0934333333', 'nghaing2001@gmail.com', 'Nguyen Dang', '2022-05-05', 'Q10 TPHCM', '1653998943292--front_cmnd.png', '1653998943292--back_cmnd.png', 18750000),
(11, '7453666461', '0908789789', 'tdtnguyendang@gmail.com', 'Nguyen Hien', '2022-05-13', 'Q10 TPHCM', '1653999087442--dwayne-the-rock-.jpg', '1653999087442--MAS_6984.jpg', 25900000);

-- --------------------------------------------------------

--
-- Table structure for table `withdraw`
--

CREATE TABLE `withdraw` (
  `id` int(11) NOT NULL,
  `username` varchar(15) NOT NULL,
  `card_number` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `value` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `fee` int(11) NOT NULL,
  `note` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `withdraw`
--

INSERT INTO `withdraw` (`id`, `username`, `card_number`, `date`, `value`, `status`, `fee`, `note`) VALUES
(24, '3092696746', 111111, '2022-05-31 19:48:27', 500000, 1, 25000, 'rut tien lan mot'),
(25, '3092696746', 111111, '2022-05-31 19:49:03', 6000000, 0, 300000, 'rut tien lan hai');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `credit_card`
--
ALTER TABLE `credit_card`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deposit`
--
ALTER TABLE `deposit`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `network_provider`
--
ALTER TABLE `network_provider`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recharge`
--
ALTER TABLE `recharge`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_detail`
--
ALTER TABLE `user_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `withdraw`
--
ALTER TABLE `withdraw`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bill`
--
ALTER TABLE `bill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `credit_card`
--
ALTER TABLE `credit_card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `deposit`
--
ALTER TABLE `deposit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `network_provider`
--
ALTER TABLE `network_provider`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `otp`
--
ALTER TABLE `otp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT for table `recharge`
--
ALTER TABLE `recharge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user_detail`
--
ALTER TABLE `user_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `withdraw`
--
ALTER TABLE `withdraw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
