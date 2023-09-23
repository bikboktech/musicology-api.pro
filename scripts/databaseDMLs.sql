-- musicology.permissions data

-- INSERT INTO musicology.permissions (codename, name)
-- VALUES ('can_read_clients', 'Can read Clients');

-- musicology.permission_sets data

-- INSERT INTO musicology.permissions_sets (permission_id, account_type_id, permission_grant)
-- VALUES (1, 1, 1);

-- musicology.account_types data

INSERT INTO musicology.account_types (name, created_at)
VALUES ('Admin', CURRENT_TIMESTAMP);
INSERT INTO musicology.account_types (name, created_at)
VALUES ('DJ', CURRENT_TIMESTAMP);
INSERT INTO musicology.account_types (name, created_at)
VALUES ('Client', CURRENT_TIMESTAMP);

-- musicology.accounts data

INSERT musicology.accounts (account_type_id, full_name, email, password, active, created_at, updated_at, updated_by)
SELECT act.id, 'Administrator', 'admin@musicology.com', '$2a$12$R7FAJFvQsHSV1yksyES/jOSMA5Lxyd1zRqJY5Dvd8GO1vVRStUNii', 1, CURRENT_TIMESTAMP, NULL, NULL
FROM musicology.account_types WHERE act.name = 'Admin'; -- password = 'user'

INSERT musicology.accounts (account_type_id, full_name, email, password, active, created_at, updated_at, updated_by)
SELECT act.id, 'Martin Garrix', 'dj@musicology.com', '$2a$12$R7FAJFvQsHSV1yksyES/jOSMA5Lxyd1zRqJY5Dvd8GO1vVRStUNii', 1, CURRENT_TIMESTAMP, NULL, NULL
FROM musicology.account_types act WHERE act.name = 'DJ'; -- password = 'user'

INSERT musicology.accounts (account_type_id, full_name, email, password, active, created_at, updated_at, updated_by)
SELECT act.id, 'Pero Perić', 'pperic@email.com', '$2a$12$R7FAJFvQsHSV1yksyES/jOSMA5Lxyd1zRqJY5Dvd8GO1vVRStUNii', 1, CURRENT_TIMESTAMP, NULL, NULL
FROM musicology.account_types act WHERE act.name = 'Client'; -- password = 'user'

-- musicology.event_types data

INSERT INTO musicology.event_types (name, created_at)
VALUES ('Wedding', CURRENT_TIMESTAMP);
INSERT INTO musicology.event_types (name, created_at)
VALUES ('Birthday', CURRENT_TIMESTAMP);
INSERT INTO musicology.event_types (name, created_at)
VALUES ('Corporate Event', CURRENT_TIMESTAMP);
INSERT INTO musicology.event_types (name, created_at)
VALUES ('Other', CURRENT_TIMESTAMP);



-- musicology.events data

-- INSERT INTO musicology.events (`date`, `time`, guest_count, location, venue_name, venue_contact, duration, preferred_dj_id, additional_artists, created_at, updated_at, updated_by)
-- VALUES ('', '', 0, '', '', '', 0, 0, '', CURRENT_TIMESTAMP, '', 0);


-- musicology.event_accounts data

-- INSERT INTO musicology.event_accounts (account_client_id, account_dj_id, event_id, package_booked)
-- VALUES (0, 0, 0, 0);


-- musicology.timelines data

-- INSERT INTO musicology.timelines (event_id, `time`, description, notes)
-- VALUES (0, '', '', '');


-- musicology.playlists data

-- INSERT INTO musicology.playlists (event_id, name, notes, spotify_playlist_id)
-- VALUES (0, '', '', '');


-- musicology.posts data

-- INSERT INTO musicology.posts (account_author_id, title, `text`, in_reply_to_post_id, created_at, updated_at)
-- VALUES (0, '', '', 0, CURRENT_TIMESTAMP, '');


-- musicology.event_posts data

-- INSERT INTO musicology.event_posts (event_id, post_id)
-- VALUES (0, 0);
