CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`location` varchar(255) NOT NULL,
	`totalArea` int NOT NULL,
	`totalPrice` varchar(64) NOT NULL,
	`pricePerSqft` varchar(64) NOT NULL,
	`minShareSize` int NOT NULL DEFAULT 1,
	`totalShares` int NOT NULL,
	`soldShares` int NOT NULL DEFAULT 0,
	`imageUrl` text,
	`propertyType` varchar(64) NOT NULL,
	`status` enum('available','sold_out','pending') NOT NULL DEFAULT 'available',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`propertyId` int NOT NULL,
	`transactionType` enum('buy','sell') NOT NULL,
	`sharesAmount` int NOT NULL,
	`amountInRupees` varchar(64) NOT NULL,
	`cryptoAmount` varchar(64) NOT NULL,
	`exchangeRate` varchar(64) NOT NULL,
	`transactionHash` varchar(255),
	`status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `transactions_transactionHash_unique` UNIQUE(`transactionHash`)
);
--> statement-breakpoint
CREATE TABLE `userPropertyShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`propertyId` int NOT NULL,
	`sharesOwned` int NOT NULL,
	`investmentAmount` varchar(64) NOT NULL,
	`cryptoInvested` varchar(64) NOT NULL,
	`purchaseDate` timestamp NOT NULL DEFAULT (now()),
	`transactionHash` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPropertyShares_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userWallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`walletAddress` varchar(255) NOT NULL,
	`balance` varchar(64) NOT NULL DEFAULT '0',
	`balanceInRupees` varchar(64) NOT NULL DEFAULT '0',
	`cryptoType` varchar(32) NOT NULL DEFAULT 'ETH',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userWallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `userWallets_walletAddress_unique` UNIQUE(`walletAddress`)
);
