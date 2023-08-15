-- musicology.permissions definition

CREATE TABLE `permissions` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Unique record identifier (incremental)',
    `codename` VARCHAR(128) DEFAULT NULL COMMENT 'Permission code name (e.g. "can_read_clients")',
    `name` VARCHAR(256) DEFAULT NULL COMMENT 'Permission name (e.g. "Can read Clients")',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- musicology.account_types definition

CREATE TABLE `account_types` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Unique record identifier (incremental)',
    `name` VARCHAR(64) DEFAULT NULL COMMENT 'Account type name. Can be one of "Client", "DJ", "Admin"',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Account type''s creation date and time',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- musicology.permission_sets definition

CREATE TABLE `permission_sets` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Unique record identifier (incremental)',
    `permission_id` INT DEFAULT NULL COMMENT 'Foreign key; references permissions table',
    `account_type_id` INT DEFAULT NULL COMMENT 'Foreign key; references account_types table',
    `permission_grant` BOOLEAN DEFAULT 0 COMMENT 'Account type''s permission is/is not granted',
    PRIMARY KEY (`id`),
    KEY `permission_sets__permissions_FK` (`permission_id`),
    KEY `permission_sets__account_types_FK` (`account_type_id`),
    CONSTRAINT `permission_sets__permissions_FK` FOREIGN KEY (`permission_id`)
        REFERENCES `permissions` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `permission_sets__account_types_FK` FOREIGN KEY (`account_type_id`)
        REFERENCES `account_types` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- musicology.accounts definition

CREATE TABLE `accounts` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Unique record identifier (incremental)',
    `account_type_id` INT DEFAULT NULL COMMENT 'Foreign key; references account_types table',
    `full_name` VARCHAR(512) DEFAULT NULL COMMENT 'Account full name (includes couple''s both names)',
    `email` VARCHAR(256) DEFAULT NULL COMMENT 'Account email',
    `password` VARCHAR(2048) DEFAULT NULL COMMENT 'Account password',
    `active` BOOLEAN DEFAULT NULL COMMENT 'Account has/has not an active partnership with Musicology',
    `marketing_type` VARCHAR(512) DEFAULT NULL COMMENT 'Describes how the Client found Musicology',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Account''s creation date and time',
    `updated_at` DATETIME DEFAULT NULL COMMENT 'Account''s update date and time',
    `updated_by` INT DEFAULT NULL COMMENT 'Foreign key; references accounts table',
    PRIMARY KEY (`id`),
    KEY `accounts__account_types_FK` (`account_type_id`),
    KEY `accounts__updated_by_FK` (`updated_by`),
    CONSTRAINT `accounts__account_types_FK` FOREIGN KEY (`account_type_id`)
        REFERENCES `account_types` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `accounts__updated_by_FK` FOREIGN KEY (`updated_by`)
        REFERENCES `accounts` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- musicology.event_types definition

CREATE TABLE `event_types` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Unique record identifier (incremental)',
    `name` VARCHAR(64) DEFAULT NULL COMMENT 'Event type name. Can be one of "Wedding", "Birthday", "Corporate Event", "Other"',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Account type''s creation date and time',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- musicology.events definition

CREATE TABLE `events` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Unique record identifier (incremental)',
    `event_type_id` INT NULL COMMENT 'Foreign key; references event_types table',
    `date` DATE DEFAULT NULL COMMENT 'Event date',
    `time` TIME DEFAULT NULL COMMENT 'Event time',
    `guest_count` INT DEFAULT NULL COMMENT 'Estimated guest count',
    `location` VARCHAR(128) DEFAULT NULL COMMENT 'Event location (venue)',
    `venue_name` VARCHAR(128) DEFAULT NULL COMMENT 'Event location''s venue name',
    `venue_contact` VARCHAR(256) DEFAULT NULL COMMENT 'Event location''s venue contact (person name, phone or email)',
    `duration` VARCHAR(12) DEFAULT NULL COMMENT 'Event''s duration in hours. Can be one of (3hours, 6hours, other)',
    `preferred_dj_id` INT DEFAULT NULL COMMENT 'Foreign key; references accounts (DJ) table (this is the Client''s preference, official DJ assignment takes place in the event_accounts table)',
    `additional_artists` VARCHAR(512) DEFAULT NULL COMMENT 'Additional artists; Client''s preference',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Event''s creation date and time',
    `updated_at` DATETIME DEFAULT NULL COMMENT 'Event''s update date and time',
    `updated_by` INT DEFAULT NULL COMMENT 'Foreign key; references accounts table',
    PRIMARY KEY (`id`),
    KEY `events__event_types_FK` (`event_type_id`),
    KEY `events__preferred_dj_FK` (`preferred_dj_id`),
    KEY `events__updated_by_FK` (`updated_by`),
    CONSTRAINT `events__event_types_FK` FOREIGN KEY (`event_type_id`)
        REFERENCES `event_types` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `events__preferred_dj_FK` FOREIGN KEY (`preferred_dj_id`)
        REFERENCES `accounts` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `events__updated_by_FK` FOREIGN KEY (`updated_by`)
        REFERENCES `accounts` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- musicology.event_accounts definition

CREATE TABLE `event_accounts` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Unique record identifier (incremental)',
    `account_client_id` INT DEFAULT NULL COMMENT 'Foreign key; references accounts table (Client)',
    `account_dj_id` INT DEFAULT NULL COMMENT 'Foreign key; references accounts table (DJ)',
    `event_id` INT DEFAULT NULL COMMENT 'Foreign key; references events table',
    `budget` VARCHAR(12) NOT NULL COMMENT 'Prefferable budget defined by a Client. Can be one of (cheapest, 2-3, 3-6, 6-more)',
    `package_booked` BOOLEAN DEFAULT NULL COMMENT 'Event is/is not booked by the Client and confirmed by the DJ',
    PRIMARY KEY (`id`),
    KEY `event_accounts__accounts_client_FK` (`account_client_id`),
    KEY `event_accounts__accounts_dj_FK` (`account_dj_id`),
    KEY `event_accounts__events_FK` (`event_id`),
    CONSTRAINT `event_accounts__accounts_client_FK` FOREIGN KEY (`account_client_id`)
        REFERENCES `accounts` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `event_accounts__accounts_dj_FK` FOREIGN KEY (`account_dj_id`)
        REFERENCES `accounts` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `event_accounts__events_FK` FOREIGN KEY (`event_id`)
        REFERENCES `events` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- musicology.timelines definition

CREATE TABLE `timelines` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Unique record identifier (incremental)',
    `event_id` INT DEFAULT NULL COMMENT 'Foreign key; references events table',
    `time` TIME DEFAULT NULL COMMENT 'Time of a timeline entry',
    `description` VARCHAR(2048) DEFAULT NULL COMMENT 'Description of a timeline entry',
    `notes` VARCHAR(2048) DEFAULT NULL COMMENT 'Notes about a timeline entry (song name, requirements for the DJ…)',
    PRIMARY KEY (`id`),
    KEY `timelines__events_FK` (`event_id`),
    CONSTRAINT `timelines__events_FK` FOREIGN KEY (`event_id`)
        REFERENCES `events` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- musicology.playlists definition

CREATE TABLE `playlists` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Unique record identifier (incremental)',
    `event_id` INT DEFAULT NULL COMMENT 'Foreign key; references events table',
    `name` VARCHAR(128) DEFAULT NULL COMMENT 'Playlist name',
    `notes` VARCHAR(2048) DEFAULT NULL COMMENT 'Notes about the playlist (requirements for the DJ…)',
    `spotify_playlist_id` VARCHAR(256) NOT NULL COMMENT 'Spotify Playlist ID',
    PRIMARY KEY (`id`),
    KEY `playlists__events_FK` (`event_id`),
    CONSTRAINT `playlists__events_FK` FOREIGN KEY (`event_id`)
        REFERENCES `events` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- musicology.posts definition

CREATE TABLE `posts` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Unique record identifier (incremental)',
    `account_author_id` INT DEFAULT NULL COMMENT 'Foreign key; references accounts table',
    `title` VARCHAR(256) DEFAULT NULL COMMENT 'Post title',
    `text` TEXT DEFAULT NULL COMMENT 'Post text (WYSIWYG)',
    `in_reply_to_post_id` INT DEFAULT NULL COMMENT 'Foreign key (nullable); references posts table',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Post''s creation date and time',
    `updated_at` DATETIME DEFAULT NULL COMMENT 'Post''s update date and time',
    PRIMARY KEY (`id`),
    KEY `posts__accounts_author_FK` (`account_author_id`),
    KEY `posts__in_reply_to_post_FK` (`in_reply_to_post_id`),
    CONSTRAINT `posts__accounts_author_FK` FOREIGN KEY (`account_author_id`)
        REFERENCES `accounts` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `posts__in_reply_to_post_FK` FOREIGN KEY (`in_reply_to_post_id`)
        REFERENCES `posts` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- musicology.event_posts definition

CREATE TABLE `event_posts` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Unique record identifier (incremental)',
    `event_id` INT DEFAULT NULL COMMENT 'Foreign key; references events table',
    `post_id` INT DEFAULT NULL COMMENT 'Foreign key; references posts table',
    PRIMARY KEY (`id`),
    KEY `event_posts__events_FK` (`event_id`),
    KEY `event_posts__posts_FK` (`post_id`),
    CONSTRAINT `event_posts__events_FK` FOREIGN KEY (`event_id`)
        REFERENCES `events` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `event_posts__posts_FK` FOREIGN KEY (`post_id`)
        REFERENCES `posts` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
